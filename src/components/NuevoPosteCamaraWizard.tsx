import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Flex, Text, Badge, Card, Table, Tabs, Progress } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Check, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { P2P, EstadoP2P, EstadoP2PLabels, EstadoP2PColors } from "@/types/p2p";
import { useP2P, useCreateP2P, useAprobarP2P } from "@/hooks/useP2P";
import { useViabilidades } from "@/hooks/useViabilidades";
import { Viabilidad } from "@/types/viabilidad";
import { toast } from "sonner";

interface NuevoPosteCamaraWizardProps {
  p2pId?: number;
}

export function NuevoPosteCamaraWizard({ p2pId }: NuevoPosteCamaraWizardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = p2pId || parseInt(searchParams.get("id") || "0");

  const [currentStep, setCurrentStep] = useState(0);
  const [p2pData, setP2pData] = useState<Partial<P2P>>({
    NombrePto1: "",
    NombrePto2: "",
    Punto1: 0,
    Punto2: 0,
    Estado: EstadoP2P.Proceso,
    TipoP2P: 1, // Postes y Camaras
  });

  // Hooks
  const createP2P = useCreateP2P();
  const aprobarP2P = useAprobarP2P();
  const { data: existingP2P, isLoading: loadingP2P } = useP2P(editId || undefined);

  // Cargar datos existentes si estamos editando
  useEffect(() => {
    if (existingP2P) {
      setP2pData({
        ID_P2P: existingP2P.ID_P2P,
        NombrePto1: existingP2P.NombrePto1,
        NombrePto2: existingP2P.NombrePto2,
        Punto1: existingP2P.Punto1,
        Punto2: existingP2P.Punto2,
        Estado: existingP2P.Estado,
        TipoP2P: 1, // Postes y Camaras
        Orden1: existingP2P.Orden1,
        Orden2: existingP2P.Orden2,
      });
    }
  }, [existingP2P]);

  // Queries para viabilidades
  const { data: viabilidadesProceso } = useViabilidades({ idProcesoViabilidad: 2, pageSize: 100 });
  const { data: viabilidadesPorAprobar } = useViabilidades({ idProcesoViabilidad: 1, pageSize: 100 });
  const { data: viabilidadesNoAprobadas } = useViabilidades({ idProcesoViabilidad: 4, pageSize: 100 });
  const { data: viabilidadesAprobadas } = useViabilidades({ idProcesoViabilidad: 3, pageSize: 100 });

  const steps = [
    { id: 0, title: "Viabilidad", description: "Seleccionar viabilidades para los puntos" },
    { id: 1, title: "Orden Servicio", description: "Revisar órdenes de servicio" },
    { id: 2, title: "Finalizado", description: "Resumen y aprobación" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNuevaViabilidad = (punto: "Punto1" | "Punto2") => {
    // Navegar a crear nueva viabilidad con parámetros para Postes y Camaras
    navigate(`/viabilidades/nueva-solicitud?parametro1=Postes y Camaras&parametro2=${p2pData.ID_P2P || 0}`);
  };

  const handleSelectViabilidad = (viabilidad: Viabilidad, punto: "Punto1" | "Punto2") => {
    if (punto === "Punto1") {
      setP2pData(prev => ({
        ...prev,
        Punto1: viabilidad.id,
        NombrePto1: viabilidad.Cliente_FinalA || viabilidad.Cliente_Final || `Viabilidad ${viabilidad.id}`,
        Orden1: viabilidad.ID_OrdenServicio,
      }));
      toast.success("Punto 1 (Interconexión A) asignado correctamente");
    } else {
      setP2pData(prev => ({
        ...prev,
        Punto2: viabilidad.id,
        NombrePto2: viabilidad.Cliente_Final || `Viabilidad ${viabilidad.id}`,
        Orden2: viabilidad.ID_OrdenServicio,
      }));
      toast.success("Punto 2 (Interconexión Z) asignado correctamente");
    }
  };

  const handleAprobar = async () => {
    if (!p2pData.ID_P2P) {
      toast.error("No hay Poste/Cámara para aprobar");
      return;
    }

    try {
      await aprobarP2P.mutateAsync(p2pData.ID_P2P);
      toast.success("Poste/Cámara aprobado exitosamente");
      navigate("/viabilidades/p2p-postes");
    } catch (error) {
      toast.error("Error al aprobar Poste/Cámara");
    }
  };

  const handleSave = async () => {
    try {
      if (!p2pData.ID_P2P) {
        // Crear nuevo Poste/Camara
        const result = await createP2P.mutateAsync({
          NombrePto1: p2pData.NombrePto1 || "",
          NombrePto2: p2pData.NombrePto2 || "",
          Punto1: p2pData.Punto1 || 0,
          Punto2: p2pData.Punto2 || 0,
          TipoP2P: 1, // Postes y Camaras
        });
        setP2pData(prev => ({ ...prev, ID_P2P: result.ID_P2P }));
        toast.success("Poste/Cámara creado exitosamente");
      }
    } catch (error) {
      toast.error("Error al guardar Poste/Cámara");
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const punto1Asignado = (p2pData.Punto1 || 0) > 0;
  const punto2Asignado = (p2pData.Punto2 || 0) > 0;

  if (loadingP2P && editId) {
    return (
      <Flex align="center" justify="center" className="h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </Flex>
    );
  }

  return (
    <Box className="flex-1 flex flex-col bg-white">
      {/* Breadcrumb y Header */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex direction="column" gap="3">
          {/* Breadcrumb */}
          <Flex align="center" gap="2">
            <Text size="2" style={{ color: "var(--gray-11)" }}>Inicio</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>/</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>Postes y Cámaras</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>/</Text>
            <Text size="2" weight="medium">Agregar</Text>
          </Flex>

          {/* Documento Badge */}
          <Flex align="center" justify="between">
            <Flex align="center" gap="3">
              <Text size="4" weight="bold">Documento:</Text>
              <Badge size="2" color="gray">
                {p2pData.ID_P2P || "Nuevo"}
              </Badge>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Toolbar */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-2)" }}>
        <Flex align="center" gap="3">
          <Button variant="soft" color="gray" onClick={() => navigate("/viabilidades/p2p-postes")}>
            <ArrowLeft className="w-4 h-4" />
            Regresar al Índice
          </Button>
          <Button
            variant="outline"
            color="green"
            onClick={() => handleNuevaViabilidad("Punto1")}
            disabled={punto1Asignado}
          >
            <Plus className="w-4 h-4" />
            Agregar Viabilidad
          </Button>
        </Flex>
      </Box>

      {/* Wizard Steps Indicator */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" gap="4" className="mb-4">
          {steps.map((step, index) => (
            <Flex key={step.id} align="center" gap="2">
              <Flex
                align="center"
                justify="center"
                className="w-8 h-8 rounded-full"
                style={{
                  backgroundColor: currentStep >= index ? "var(--green-9)" : "var(--gray-4)",
                  color: currentStep >= index ? "white" : "var(--gray-11)",
                }}
              >
                {currentStep > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Text size="2" weight="bold">{index + 1}</Text>
                )}
              </Flex>
              <Text
                size="2"
                weight={currentStep === index ? "bold" : "regular"}
                style={{ color: currentStep >= index ? "var(--gray-12)" : "var(--gray-11)" }}
              >
                {step.title}
              </Text>
              {index < steps.length - 1 && (
                <Box className="w-16 h-0.5" style={{ backgroundColor: currentStep > index ? "var(--green-9)" : "var(--gray-4)" }} />
              )}
            </Flex>
          ))}
        </Flex>
        <Progress value={progress} className="h-2" />
      </Box>

      {/* Step Content */}
      <Box className="flex-1 overflow-auto p-4">
        {/* Step 1: Viabilidad */}
        {currentStep === 0 && (
          <Box>
            <Card className="mb-4">
              <Flex direction="column" gap="3" className="p-4">
                <Text size="3" weight="bold">Solicitud de Viabilidad para Poste/Cámara</Text>
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Seleccione o cree las viabilidades para los puntos de interconexión del Poste/Cámara
                </Text>
              </Flex>
            </Card>

            <Tabs.Root defaultValue="proceso">
              <Tabs.List>
                <Tabs.Trigger value="proceso">Viabilidades en Proceso</Tabs.Trigger>
                <Tabs.Trigger value="aprobar">Viabilidades por Aprobar</Tabs.Trigger>
                <Tabs.Trigger value="noAprobadas">Viabilidades No Aprobadas</Tabs.Trigger>
              </Tabs.List>

              <Box className="mt-4">
                <Tabs.Content value="proceso">
                  <ViabilidadesTable
                    viabilidades={viabilidadesProceso?.data || []}
                    onSelectPunto1={(v) => handleSelectViabilidad(v, "Punto1")}
                    onSelectPunto2={(v) => handleSelectViabilidad(v, "Punto2")}
                    punto1Asignado={punto1Asignado}
                    punto2Asignado={punto2Asignado}
                  />
                </Tabs.Content>
                <Tabs.Content value="aprobar">
                  <ViabilidadesTable
                    viabilidades={viabilidadesPorAprobar?.data || []}
                    onSelectPunto1={(v) => handleSelectViabilidad(v, "Punto1")}
                    onSelectPunto2={(v) => handleSelectViabilidad(v, "Punto2")}
                    punto1Asignado={punto1Asignado}
                    punto2Asignado={punto2Asignado}
                  />
                </Tabs.Content>
                <Tabs.Content value="noAprobadas">
                  <ViabilidadesTable
                    viabilidades={viabilidadesNoAprobadas?.data || []}
                    onSelectPunto1={(v) => handleSelectViabilidad(v, "Punto1")}
                    onSelectPunto2={(v) => handleSelectViabilidad(v, "Punto2")}
                    punto1Asignado={punto1Asignado}
                    punto2Asignado={punto2Asignado}
                    showInvalidezColumn
                  />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </Box>
        )}

        {/* Step 2: Orden Servicio */}
        {currentStep === 1 && (
          <Box>
            <Card className="mb-4">
              <Flex direction="column" gap="3" className="p-4">
                <Text size="3" weight="bold">Lista de Órdenes de Servicios</Text>
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Viabilidades completadas con órdenes de servicio disponibles para Postes/Cámaras
                </Text>
              </Flex>
            </Card>

            <ViabilidadesTable
              viabilidades={viabilidadesAprobadas?.data || []}
              onSelectPunto1={(v) => handleSelectViabilidad(v, "Punto1")}
              onSelectPunto2={(v) => handleSelectViabilidad(v, "Punto2")}
              punto1Asignado={punto1Asignado}
              punto2Asignado={punto2Asignado}
              showOrdenColumn
              showStatusColumn
            />
          </Box>
        )}

        {/* Step 3: Finalizado */}
        {currentStep === 2 && (
          <Box>
            <Card className="mb-4">
              <Flex direction="column" gap="3" className="p-4">
                <Text size="3" weight="bold">Resumen del Poste/Cámara</Text>
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Revise la información y apruebe el registro
                </Text>
              </Flex>
            </Card>

            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Interconexión A</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Punto 1</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Interconexión Z</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Punto 2</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Fecha Creación</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Text weight="bold">{p2pData.ID_P2P || "Nuevo"}</Text>
                  </Table.Cell>
                  <Table.Cell>{p2pData.NombrePto1 || "-"}</Table.Cell>
                  <Table.Cell>{p2pData.Punto1 || "-"}</Table.Cell>
                  <Table.Cell>{p2pData.NombrePto2 || "-"}</Table.Cell>
                  <Table.Cell>{p2pData.Punto2 || "-"}</Table.Cell>
                  <Table.Cell>{formatDate(new Date())}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={EstadoP2PColors[p2pData.Estado as EstadoP2P] || "gray"}
                      variant="soft"
                    >
                      {EstadoP2PLabels[p2pData.Estado as EstadoP2P] || "Proceso"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Box className="mt-4">
              <Button
                size="3"
                onClick={handleAprobar}
                disabled={!punto1Asignado || !punto2Asignado || !p2pData.ID_P2P}
              >
                <Check className="w-4 h-4" />
                Aprobar
              </Button>
              {(!punto1Asignado || !punto2Asignado) && (
                <Text size="2" style={{ color: "var(--amber-11)" }} className="ml-3">
                  Debe asignar ambos puntos antes de aprobar
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Button variant="soft" color="gray" onClick={handlePrev} disabled={currentStep === 0}>
            <ChevronLeft className="w-4 h-4" />
            Previo
          </Button>
          <Flex gap="2">
            {!p2pData.ID_P2P && (
              <Button variant="soft" onClick={handleSave} disabled={createP2P.isPending}>
                {createP2P.isPending ? "Guardando..." : "Guardar Borrador"}
              </Button>
            )}
            <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

// Componente auxiliar para la tabla de viabilidades
interface ViabilidadesTableProps {
  viabilidades: Viabilidad[];
  onSelectPunto1: (v: Viabilidad) => void;
  onSelectPunto2: (v: Viabilidad) => void;
  punto1Asignado: boolean;
  punto2Asignado: boolean;
  showOrdenColumn?: boolean;
  showInvalidezColumn?: boolean;
  showStatusColumn?: boolean;
}

// Mapeo de estados de proceso de viabilidad
const ProcesoViabilidadLabels: Record<number, string> = {
  1: "Por Aprobar",
  2: "En Proceso",
  3: "Completada",
  4: "Cancelada",
};

const ProcesoViabilidadColors: Record<number, "blue" | "amber" | "green" | "red"> = {
  1: "blue",
  2: "amber",
  3: "green",
  4: "red",
};

function ViabilidadesTable({
  viabilidades,
  onSelectPunto1,
  onSelectPunto2,
  punto1Asignado,
  punto2Asignado,
  showOrdenColumn,
  showInvalidezColumn,
  showStatusColumn,
}: ViabilidadesTableProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (viabilidades.length === 0) {
    return (
      <Box className="p-8 text-center">
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          No hay viabilidades disponibles
        </Text>
      </Box>
    );
  }

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Cliente Final</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Tipo de Enlace</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>NRC ($)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>MRC ($)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Creación</Table.ColumnHeaderCell>
          {showInvalidezColumn ? (
            <Table.ColumnHeaderCell>Invalidez</Table.ColumnHeaderCell>
          ) : (
            <Table.ColumnHeaderCell>Vencimiento</Table.ColumnHeaderCell>
          )}
          {showOrdenColumn && <Table.ColumnHeaderCell>Orden</Table.ColumnHeaderCell>}
          {showStatusColumn && <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>}
          <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {viabilidades.map((v) => (
          <Table.Row key={v.id}>
            <Table.Cell>{v.id}</Table.Cell>
            <Table.Cell>{v.Cliente_Final || v.Cliente_FinalA || "-"}</Table.Cell>
            <Table.Cell>{v.TipoEnlaceNombre || "-"}</Table.Cell>
            <Table.Cell>{v.NRC?.toFixed(2) || "0.00"}</Table.Cell>
            <Table.Cell>{v.MRC?.toFixed(2) || "0.00"}</Table.Cell>
            <Table.Cell>{formatDate(v.Fecha_Creacion)}</Table.Cell>
            {showInvalidezColumn ? (
              <Table.Cell>{v.Fecha_Vencimiento ? formatDate(v.Fecha_Vencimiento) : "-"}</Table.Cell>
            ) : (
              <Table.Cell>{formatDate(v.Fecha_Vencimiento)}</Table.Cell>
            )}
            {showOrdenColumn && <Table.Cell>{v.ID_OrdenServicio || "-"}</Table.Cell>}
            {showStatusColumn && (
              <Table.Cell>
                <Badge
                  color={ProcesoViabilidadColors[v.proceso_viabilidad || 2] || "gray"}
                  variant="soft"
                >
                  {ProcesoViabilidadLabels[v.proceso_viabilidad || 2] || "Desconocido"}
                </Badge>
              </Table.Cell>
            )}
            <Table.Cell>
              <Flex gap="1">
                <Button
                  variant="soft"
                  color="green"
                  size="1"
                  onClick={() => onSelectPunto1(v)}
                  disabled={punto1Asignado}
                >
                  Pto A
                </Button>
                <Button
                  variant="soft"
                  color="amber"
                  size="1"
                  onClick={() => onSelectPunto2(v)}
                  disabled={punto2Asignado}
                >
                  Pto Z
                </Button>
              </Flex>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
