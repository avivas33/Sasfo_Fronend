import { useState, useEffect } from "react";
import { Dialog, Flex, Button, Text, TextField, Table, Heading, Box, Separator } from "@radix-ui/themes";
import { Server, Loader2, Save, X } from "lucide-react";
import { ordenesService, InfoEnlaceResponse, CrearEnlaceRequest } from "@/services/ordenes.service";
import { toast } from "sonner";

interface EnlaceDialogProps {
  ordenId: number;
  empresaNombre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EnlaceDialog = ({
  ordenId,
  empresaNombre,
  open,
  onOpenChange,
  onSuccess,
}: EnlaceDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [infoEnlace, setInfoEnlace] = useState<InfoEnlaceResponse | null>(null);
  const [fechaActivacion, setFechaActivacion] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && ordenId) {
      loadEnlaceData();
    } else {
      // Reset state when dialog closes
      setInfoEnlace(null);
      setFechaActivacion("");
      setError(null);
      setLoading(true);
    }
  }, [open, ordenId]);

  const loadEnlaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await ordenesService.getInfoEnlace(ordenId);
      setInfoEnlace(info);
    } catch (err: any) {
      console.error("Error cargando datos del enlace:", err);
      setError(err?.message || "Error al cargar datos del enlace");
      toast.error("Error al cargar datos del enlace");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!infoEnlace) return;

    if (!fechaActivacion) {
      toast.error("Seleccione la fecha de activación");
      return;
    }

    // Validar MRC para tipos que no sean 3
    if (infoEnlace.ID_TipoEnlace !== 3 && infoEnlace.MRC === 0) {
      toast.error("Por favor indique un valor MRC");
      return;
    }

    setSaving(true);
    try {
      // Validar archivos OTDR
      const archivosValidos = await ordenesService.validarArchivosEnlace(ordenId);
      if (!archivosValidos) {
        toast.error("Adjunte los archivos OTDR necesarios");
        setSaving(false);
        return;
      }

      const fechaParts = fechaActivacion.split("-");
      const year = parseInt(fechaParts[0]);
      const month = parseInt(fechaParts[1]);

      const request: CrearEnlaceRequest = {
        Fecha_Aprobacion: fechaActivacion,
        AreaDesarrolloA: infoEnlace.areaA,
        AreaDesarrolloZ: infoEnlace.areaZ,
        UbicacionA: infoEnlace.ubiA,
        UbicacionZ: infoEnlace.ubiZ,
        CoordenadasA: infoEnlace.CoordenadasA,
        Coordenadas: infoEnlace.Coordenadas,
        Modulo: infoEnlace.Nombre_Modulo,
        ServicesLocation: infoEnlace.Nombre_ElementoZ,
        CID_P1: infoEnlace.CID_P1 || "",
        CID_P2: infoEnlace.CID_P2 || "",
        Cliente_Final: infoEnlace.Cliente_Final,
        ODF: infoEnlace.No_odf,
        Puerto1_Enlace: infoEnlace.Puerto1,
        Puerto2_Enlace: infoEnlace.Puerto2,
        No_FTP: infoEnlace.No_FTP || "",
        FTP_P1: infoEnlace.FTP_P1 || "",
        FTP_P2: infoEnlace.FTP_P2 || "",
        Distancia_Enlace: infoEnlace.Distancia,
        Servicio: "FIBRA ÓPTICA OSCURA",
        Tipo_Conexion: infoEnlace.tip_Cone,
        Ruta: infoEnlace.Nombre_Ruta,
        MRC: infoEnlace.MRC,
        NRC: infoEnlace.NRC,
        Nombre_Empresa: empresaNombre,
        Costo_Servicio: infoEnlace.Precio_AFO,
        Servicio_Factura: infoEnlace.Nombre_serv,
        Mes: month,
        Año: year,
      };

      const result = await ordenesService.crearEnlace(ordenId, request);

      if (result.success) {
        toast.success("Enlace creado exitosamente", {
          description: `Enlace #${result.ID_Enlace} creado`
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("Error al crear el enlace");
      }
    } catch (err: any) {
      console.error("Error creando enlace:", err);
      toast.error("Error al crear el enlace", {
        description: err?.message || "Error desconocido"
      });
    } finally {
      setSaving(false);
    }
  };

  // Si no está abierto, no renderizar nada
  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            <Server className="w-5 h-5" />
            Agregar Nuevo Enlace
          </Flex>
        </Dialog.Title>

        {loading && (
          <Flex align="center" justify="center" p="6">
            <Loader2 className="w-8 h-8 animate-spin" />
            <Text ml="2">Cargando información del enlace...</Text>
          </Flex>
        )}

        {error && !loading && (
          <Flex align="center" justify="center" p="6" direction="column" gap="2">
            <Text color="red" size="3">{error}</Text>
            <Button variant="soft" onClick={() => loadEnlaceData()}>
              Reintentar
            </Button>
          </Flex>
        )}

        {!loading && !error && infoEnlace && (
          <Box>
            {/* Generales del Enlace */}
            <Heading size="3" mb="2" mt="4">Generales del Enlace</Heading>
            <Separator size="4" mb="3" />
            <Flex gap="4" wrap="wrap">
              <Box style={{ flex: 1, minWidth: 200 }}>
                <Text size="2" weight="bold">Fecha de Activación</Text>
                <TextField.Root
                  type="date"
                  value={fechaActivacion}
                  onChange={(e) => setFechaActivacion(e.target.value)}
                />
              </Box>
              <Box style={{ flex: 1, minWidth: 200 }}>
                <Text size="2" weight="bold">Código AFO</Text>
                <TextField.Root value={infoEnlace.Nombre_serv || "-"} readOnly />
              </Box>
              <Box style={{ flex: 1, minWidth: 200 }}>
                <Text size="2" weight="bold">Costo del Enlace</Text>
                <TextField.Root value={`$${(infoEnlace.Precio_AFO || 0).toFixed(2)}`} readOnly />
              </Box>
            </Flex>

            {/* Detalle de Ubicación */}
            <Heading size="3" mb="2" mt="4">Detalle de Ubicación</Heading>
            <Separator size="4" mb="3" />
            <Table.Root variant="surface" size="1">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>PUNTO A</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>PUNTO Z</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><Text weight="bold">Área de Desarrollo</Text></Table.Cell>
                  <Table.Cell>{infoEnlace.areaA || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.areaZ || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">Ubicación</Text></Table.Cell>
                  <Table.Cell>{infoEnlace.ubiA || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.ubiZ || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">Coordenadas</Text></Table.Cell>
                  <Table.Cell>{infoEnlace.CoordenadasA || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.Coordenadas || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">Cliente</Text></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>{infoEnlace.Cliente_Final || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">Módulo/SL</Text></Table.Cell>
                  <Table.Cell>{infoEnlace.Nombre_ModuloA || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.Nombre_Modulo || "-"} {infoEnlace.Nombre_ElementoZ || ""}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            {/* Detalle de Interconexión */}
            <Heading size="3" mb="2" mt="4">Detalle de Interconexión</Heading>
            <Separator size="4" mb="3" />
            <Table.Root variant="surface" size="1">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>P1</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>P2</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><Text weight="bold">CID</Text></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>{infoEnlace.CID_P1 || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.CID_P2 || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">ODF</Text></Table.Cell>
                  <Table.Cell>{infoEnlace.No_odf || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.Puerto1 || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.Puerto2 || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">FTP</Text></Table.Cell>
                  <Table.Cell>{infoEnlace.No_FTP || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.FTP_P1 || "-"}</Table.Cell>
                  <Table.Cell>{infoEnlace.FTP_P2 || "-"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Text weight="bold">Distancia</Text></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>{(infoEnlace.Distancia || 0).toFixed(2)} km</Table.Cell>
                  <Table.Cell>{(infoEnlace.Distancia || 0).toFixed(2)} km</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            {/* Detalle de Servicio */}
            <Heading size="3" mb="2" mt="4">Detalle de Servicio</Heading>
            <Separator size="4" mb="3" />
            <Flex gap="4" wrap="wrap">
              <Box style={{ flex: 1, minWidth: 150 }}>
                <Text size="2" weight="bold">Servicio</Text>
                <TextField.Root value="FIBRA ÓPTICA OSCURA" readOnly />
              </Box>
              <Box style={{ flex: 1, minWidth: 100 }}>
                <Text size="2" weight="bold">Tipo</Text>
                <TextField.Root value={infoEnlace.tip_Cone || "-"} readOnly />
              </Box>
              <Box style={{ flex: 1, minWidth: 100 }}>
                <Text size="2" weight="bold">Ruta</Text>
                <TextField.Root value={infoEnlace.Nombre_Ruta || "-"} readOnly />
              </Box>
              <Box style={{ flex: 1, minWidth: 100 }}>
                <Text size="2" weight="bold">Precio ($)</Text>
                <TextField.Root value={`$${(infoEnlace.MRC || 0).toFixed(2)}`} readOnly />
              </Box>
            </Flex>
          </Box>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              <X className="w-4 h-4 mr-1" />
              Cerrar
            </Button>
          </Dialog.Close>
          {!loading && !error && infoEnlace && (
            <Button onClick={handleSave} disabled={saving || !fechaActivacion}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Guardar
            </Button>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
