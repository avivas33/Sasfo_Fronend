import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Flex,
  Box,
  Text,
  Table,
  Badge,
  TextField,
  Select,
  IconButton,
  Card,
  Button,
  Dialog,
} from "@radix-ui/themes";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useViabilidadesEspeciales,
  useViabilidad,
  useAprobarViabilidad,
  useRechazarViabilidad,
} from "@/hooks/useViabilidades";
import { EstadoViabilidad } from "@/types/viabilidad";
import { toast } from "sonner";

const CotizacionEspecial = () => {
  const [search, setSearch] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectMotivo, setRejectMotivo] = useState("");

  const { data: response, isLoading } = useViabilidadesEspeciales({
    search: search || undefined,
    idProcesoViabilidad: selectedEstado ? parseInt(selectedEstado) : undefined,
    page,
    pageSize,
  });

  const { data: selectedViabilidad, isLoading: isLoadingDetail } = useViabilidad(
    selectedId || undefined
  );

  const aprobarMutation = useAprobarViabilidad();
  const rechazarMutation = useRechazarViabilidad();

  const items = response?.data || [];
  const totalCount = response?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleEstadoChange = (value: string) => {
    setSelectedEstado(value === "all" ? "" : value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedEstado("");
    setPage(1);
  };

  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setIsDetailOpen(true);
  };

  const handleAprobar = async (id: number) => {
    if (!confirm("¿Está seguro de aprobar esta cotización especial?")) return;
    try {
      await aprobarMutation.mutateAsync(id);
      toast.success("Cotización aprobada exitosamente");
    } catch {
      toast.error("Error al aprobar la cotización");
    }
  };

  const handleOpenReject = (id: number) => {
    setSelectedId(id);
    setRejectMotivo("");
    setIsRejectOpen(true);
  };

  const handleRechazar = async () => {
    if (!selectedId) return;
    if (!rejectMotivo.trim()) {
      toast.error("Debe ingresar un motivo de rechazo");
      return;
    }
    try {
      await rechazarMutation.mutateAsync({ id: selectedId, motivo: rejectMotivo });
      toast.success("Cotización rechazada");
      setIsRejectOpen(false);
    } catch {
      toast.error("Error al rechazar la cotización");
    }
  };

  const hasFilters = search || selectedEstado;

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${value.toFixed(2)}`;
  };

  const getEstadoBadge = (estado: number) => {
    switch (estado) {
      case EstadoViabilidad.Pendiente:
        return <Badge color="orange" variant="soft">Pendiente</Badge>;
      case EstadoViabilidad.Aprobada:
        return <Badge color="green" variant="soft">Aprobada</Badge>;
      case EstadoViabilidad.Rechazada:
        return <Badge color="red" variant="soft">Rechazada</Badge>;
      case EstadoViabilidad.EnProceso:
        return <Badge color="blue" variant="soft">En Proceso</Badge>;
      case EstadoViabilidad.Completada:
        return <Badge color="purple" variant="soft">Completada</Badge>;
      default:
        return <Badge color="gray" variant="soft">Desconocido</Badge>;
    }
  };

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="5" weight="bold">Cotización de Viabilidad Especial</Text>
              <Text size="2" style={{ color: "var(--gray-11)" }} className="block mt-1">
                Gestión de cotizaciones especiales de fibra óptica
              </Text>
            </Box>
            <Flex gap="4" align="center">
              <Card size="1">
                <Flex direction="column" align="center" gap="1">
                  <Text size="1" color="gray">Total</Text>
                  <Text size="3" weight="bold">{totalCount}</Text>
                </Flex>
              </Card>
            </Flex>
          </Flex>
        </Box>

        {/* Filtros */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex gap="3" align="center" wrap="wrap">
            <Box style={{ width: 300 }}>
              <TextField.Root
                placeholder="Buscar por documento, cliente..."
                value={search}
                onChange={handleSearch}
              >
                <TextField.Slot>
                  <Search className="w-4 h-4" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Box style={{ width: 180 }}>
              <Select.Root value={selectedEstado || "all"} onValueChange={handleEstadoChange}>
                <Select.Trigger placeholder="Estado" />
                <Select.Content>
                  <Select.Item value="all">Todos los estados</Select.Item>
                  <Select.Item value="1">Pendiente</Select.Item>
                  <Select.Item value="2">Aprobada</Select.Item>
                  <Select.Item value="3">Rechazada</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {hasFilters && (
              <IconButton variant="soft" color="gray" onClick={clearFilters} title="Limpiar filtros">
                <X className="w-4 h-4" />
              </IconButton>
            )}

            <Box className="flex-1" />

            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {totalCount} registros encontrados
            </Text>
          </Flex>
        </Box>

        {/* Tabla */}
        <Box className="flex-1 overflow-auto p-4">
          <Box className="bg-white rounded-lg border" style={{ borderColor: "var(--gray-6)" }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                  <Table.ColumnHeaderCell>DOCUMENTO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>OPERADOR</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CLIENTE</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>TIPO ENLACE</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>MRC</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>NRC</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CREACIÓN</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>VENCIMIENTO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={10}>
                      <Flex align="center" justify="center" className="p-8">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ) : !items || items.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={10}>
                      <Box className="p-8 text-center">
                        <Text size="2" style={{ color: "var(--gray-11)" }}>
                          No hay cotizaciones especiales
                        </Text>
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <Text size="2" weight="medium" style={{ color: "var(--blue-11)" }}>
                          {item.document_number || "-"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.EmpresaNombre || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.Cliente_FinalA || item.Cliente_Final || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color="gray">
                          {item.TipoEnlaceNombre || "-"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" weight="bold" style={{ color: "var(--green-11)" }}>
                          {formatCurrency(item.MRC)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatCurrency(item.NRC)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatDate(item.Fecha_Creacion)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatDate(item.Fecha_Vencimiento)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        {getEstadoBadge(item.ID_ProcesoViabilidad)}
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="1">
                          <IconButton
                            variant="ghost"
                            size="1"
                            onClick={() => handleViewDetail(item.id)}
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </IconButton>
                          {item.ID_ProcesoViabilidad === EstadoViabilidad.Pendiente && (
                            <>
                              <IconButton
                                variant="ghost"
                                size="1"
                                color="green"
                                onClick={() => handleAprobar(item.id)}
                                title="Aprobar"
                                disabled={aprobarMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="1"
                                color="red"
                                onClick={() => handleOpenReject(item.id)}
                                title="Rechazar"
                                disabled={rechazarMutation.isPending}
                              >
                                <XCircle className="w-4 h-4" />
                              </IconButton>
                            </>
                          )}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>

        {/* Paginación */}
        {totalPages > 1 && (
          <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
            <Flex justify="between" align="center">
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Página {page} de {totalPages}
              </Text>
              <Flex gap="2">
                <IconButton
                  variant="soft"
                  size="1"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </IconButton>
                <IconButton
                  variant="soft"
                  size="1"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </IconButton>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Dialog de Detalle */}
      <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Detalle de Cotización Especial</Dialog.Title>
          {isLoadingDetail ? (
            <Flex align="center" justify="center" className="p-8">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
            </Flex>
          ) : selectedViabilidad ? (
            <Box className="space-y-4 mt-4">
              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">Documento</Text>
                  <Text size="2" weight="medium">{selectedViabilidad.document_number}</Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">Estado</Text>
                  {getEstadoBadge(selectedViabilidad.ID_ProcesoViabilidad)}
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">Operador</Text>
                  <Text size="2">{selectedViabilidad.EmpresaNombre || "-"}</Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">Cliente Final</Text>
                  <Text size="2">{selectedViabilidad.Cliente_FinalA || selectedViabilidad.Cliente_Final || "-"}</Text>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">Tipo de Enlace</Text>
                  <Text size="2">{selectedViabilidad.TipoEnlaceNombre || "-"}</Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">Tipo de Conexión</Text>
                  <Text size="2">{selectedViabilidad.TipoConexionNombre || "-"}</Text>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">Área Desarrollo A</Text>
                  <Text size="2">{selectedViabilidad.AreaDesarrolloANombre || "-"}</Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">Ubicación A</Text>
                  <Text size="2">{selectedViabilidad.UbicacionANombre || "-"}</Text>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">Área Desarrollo Z</Text>
                  <Text size="2">{selectedViabilidad.AreaDesarrolloZNombre || "-"}</Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">Ubicación Z</Text>
                  <Text size="2">{selectedViabilidad.UbicacionZNombre || "-"}</Text>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">MRC (Mensual)</Text>
                  <Text size="3" weight="bold" style={{ color: "var(--green-11)" }}>
                    {formatCurrency(selectedViabilidad.MRC)}
                  </Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">NRC (Único)</Text>
                  <Text size="3" weight="bold">
                    {formatCurrency(selectedViabilidad.NRC)}
                  </Text>
                </Box>
              </Flex>

              {selectedViabilidad.Observaciones && (
                <Box>
                  <Text size="1" color="gray">Observaciones</Text>
                  <Text size="2">{selectedViabilidad.Observaciones}</Text>
                </Box>
              )}

              <Flex gap="4">
                <Box className="flex-1">
                  <Text size="1" color="gray">Fecha Creación</Text>
                  <Text size="2">{formatDate(selectedViabilidad.Fecha_Creacion)}</Text>
                </Box>
                <Box className="flex-1">
                  <Text size="1" color="gray">Fecha Vencimiento</Text>
                  <Text size="2">{formatDate(selectedViabilidad.Fecha_Vencimiento)}</Text>
                </Box>
              </Flex>
            </Box>
          ) : null}

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cerrar</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Dialog de Rechazo */}
      <Dialog.Root open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Rechazar Cotización</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Ingrese el motivo del rechazo de la cotización.
          </Dialog.Description>

          <Box>
            <TextField.Root
              placeholder="Motivo del rechazo..."
              value={rejectMotivo}
              onChange={(e) => setRejectMotivo(e.target.value)}
            />
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancelar</Button>
            </Dialog.Close>
            <Button
              color="red"
              onClick={handleRechazar}
              disabled={rechazarMutation.isPending}
            >
              {rechazarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Rechazar
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default CotizacionEspecial;
