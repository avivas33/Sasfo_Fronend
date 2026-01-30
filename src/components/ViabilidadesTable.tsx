import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2, FileText, CheckCircle, XCircle, DollarSign, FileCheck, Star, RotateCcw } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Viabilidad } from "@/types/viabilidad";
import { useViabilidades, useDeleteViabilidad, useRechazarViabilidad } from "@/hooks/useViabilidades";
import { InformacionComplementariaDialog } from "./InformacionComplementariaDialog";
import { toast } from "sonner";
import { ClasificacionViabilidad } from "@/pages/Viabilidades";

interface ViabilidadesTableProps {
  onViabilidadSelect?: (viabilidad: Viabilidad) => void;
  selectedViabilidadId?: number;
  // Filtros según clasificación del proyecto original
  filterByClasificacion?: ClasificacionViabilidad;
  filterByEstado?: number; // Legacy - mantener compatibilidad
  filterByEspecial?: boolean;
  // Mostrar columnas específicas
  showInvalidezColumn?: boolean;
  showCancelacionInfo?: boolean;
  // Mostrar acciones específicas según el tab
  showCotizacionActions?: boolean;
  showAprobacionActions?: boolean;
  showEspecialActions?: boolean;
}

export function ViabilidadesTable({
  onViabilidadSelect,
  selectedViabilidadId,
  filterByClasificacion,
  filterByEstado,
  filterByEspecial = false,
  showInvalidezColumn = false,
  showCancelacionInfo = false,
  showCotizacionActions = false,
  showAprobacionActions = false,
  showEspecialActions = false,
}: ViabilidadesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [aprobarDialogOpen, setAprobarDialogOpen] = useState(false);
  const [viabilidadAprobar, setViabilidadAprobar] = useState<Viabilidad | null>(null);
  const navigate = useNavigate();
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filterByClasificacion, filterByEstado, filterByEspecial]);

  // Fetch viabilidades con React Query
  // Usar filterByClasificacion si está presente, sino filterByEstado (legacy)
  const { data, isLoading, isError, error } = useViabilidades({
    search: debouncedSearch || undefined,
    page,
    pageSize,
    idProcesoViabilidad: filterByClasificacion || filterByEstado,
    isEspecial: filterByEspecial || undefined,
  });

  // Mutations
  const deleteViabilidad = useDeleteViabilidad();
  const rechazarViabilidad = useRechazarViabilidad();

  const viabilidades = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleView = (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();
    onViabilidadSelect?.(viabilidad);
  };

  const handleDelete = async (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm(`¿Está seguro de eliminar la viabilidad "${viabilidad.document_number}"?`)) {
      try {
        await deleteViabilidad.mutateAsync(viabilidad.id);
        toast.success("Viabilidad eliminada exitosamente");
      } catch (error) {
        toast.error("Error al eliminar viabilidad");
      }
    }
  };

  const handleAprobar = (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();
    setViabilidadAprobar(viabilidad);
    setAprobarDialogOpen(true);
  };

  const handleRechazar = async (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();

    const motivo = prompt("Indique el motivo del rechazo:");
    if (motivo) {
      try {
        await rechazarViabilidad.mutateAsync({ id: viabilidad.id, motivo });
        toast.success("Viabilidad rechazada exitosamente");
      } catch (error) {
        toast.error("Error al rechazar viabilidad");
      }
    }
  };

  const handleCotizar = (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();
    // Navegar a la página de cotización
    navigate(`/viabilidades/cotizacion/${viabilidad.id}`);
  };

  const handleCancelarSolicitud = async (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Está seguro de cancelar la solicitud "${viabilidad.document_number}"?`)) {
      try {
        await rechazarViabilidad.mutateAsync({ id: viabilidad.id, motivo: "Cancelada por el usuario" });
        toast.success("Solicitud cancelada exitosamente");
      } catch (error) {
        toast.error("Error al cancelar solicitud");
      }
    }
  };

  const handleReactivar = async (viabilidad: Viabilidad, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Funcionalidad de reactivación en desarrollo");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Badge de clasificación según el proyecto original
  const getClasificacionBadge = (clasificacionId: number, isEspecial: boolean) => {
    if (isEspecial) {
      return <Badge color="purple" variant="soft"><Star className="w-3 h-3 mr-1" />Especial</Badge>;
    }
    switch (clasificacionId) {
      case 1: return <Badge color="blue" variant="soft">Solicitud</Badge>;
      case 2: return <Badge color="red" variant="soft">Cancelada</Badge>;
      case 3: return <Badge color="amber" variant="soft">Por Aprobar</Badge>;
      case 4: return <Badge color="red" variant="soft">No Aprobada</Badge>;
      case 5: return <Badge color="purple" variant="soft">Especial</Badge>;
      default: return <Badge color="gray" variant="soft">Desconocido</Badge>;
    }
  };

  // Título del header según el filtro
  const getHeaderTitle = () => {
    if (filterByEspecial) return "Viabilidades Especiales";
    switch (filterByClasificacion) {
      case ClasificacionViabilidad.SolicitudesPresupuesto: return "Solicitudes de Presupuesto";
      case ClasificacionViabilidad.SolicitudesCanceladas: return "Solicitudes Canceladas";
      case ClasificacionViabilidad.ViabilidadesPorAprobar: return "Viabilidades por Aprobar";
      case ClasificacionViabilidad.ViabilidadesNoAprobadas: return "Viabilidades No Aprobadas";
      case ClasificacionViabilidad.ViabilidadesEspeciales: return "Viabilidades Especiales";
      default: return "Viabilidades";
    }
  };

  return (
    <Box className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Flex align="center" gap="2">
              <FileText className="w-5 h-5" style={{ color: "#4cb74a" }} />
              <Text size="4" weight="medium">{getHeaderTitle()}</Text>
            </Flex>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'registro' : 'registros'}`
              )}
            </Text>
          </Flex>
          {/* Mostrar botón de nueva solicitud solo en Solicitudes de Presupuesto */}
          {filterByClasificacion === ClasificacionViabilidad.SolicitudesPresupuesto && (
            <Button size="2" onClick={() => navigate("/viabilidades/nueva-solicitud")}>
              <Plus className="w-4 h-4" />
              Nueva Solicitud
            </Button>
          )}
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por número de documento, cliente, empresa..."
          size="2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <TextField.Slot>
            <Search className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      {/* Table */}
      <Box className="flex-1 overflow-auto">
        {isError && (
          <Box className="p-8 text-center">
            <Flex direction="column" align="center" gap="3">
              <AlertCircle className="w-12 h-12" style={{ color: "var(--red-9)" }} />
              <Text size="3" weight="medium" style={{ color: "var(--red-11)" }}>
                Error al cargar viabilidades
              </Text>
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                {error?.message || "Ha ocurrido un error inesperado"}
              </Text>
            </Flex>
          </Box>
        )}

        {!isError && (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DOCUMENTO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CLIENTE FINAL</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>EMPRESA</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>TIPO ENLACE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>NRC ($)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>MRC ($)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>FECHA</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={9}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : viabilidades.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9}>
                    <Box className="p-8 text-center">
                      <Flex direction="column" align="center" gap="2">
                        <FileText className="w-12 h-12" style={{ color: "var(--gray-8)" }} />
                        <Text size="2" style={{ color: "var(--gray-11)" }}>
                          No se encontraron registros
                        </Text>
                      </Flex>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                viabilidades.map((viabilidad: any) => (
                  <Table.Row
                    key={viabilidad.id}
                    onClick={() => onViabilidadSelect?.(viabilidad)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedViabilidadId === viabilidad.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{viabilidad.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium" style={{ color: "var(--blue-11)" }}>
                        {viabilidad.document_number || "-"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{viabilidad.Cliente_FinalA || viabilidad.Cliente_Final || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{viabilidad.EmpresaNombre || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{viabilidad.TipoEnlaceNombre || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="text-right font-mono">
                        {viabilidad.NRC ? `$${viabilidad.NRC.toFixed(2)}` : "--.--"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="text-right font-mono">
                        {viabilidad.MRC ? `$${viabilidad.MRC.toFixed(2)}` : "--.--"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {new Date(viabilidad.Fecha_Creacion).toLocaleDateString('es-PA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        {/* Ver detalles - siempre visible */}
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(viabilidad, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>

                        {/* Acciones de Cotización (Solicitudes de Presupuesto) */}
                        {showCotizacionActions && (
                          <>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="blue"
                              onClick={(e) => handleCotizar(viabilidad, e)}
                              title="Generar Cotización"
                            >
                              <DollarSign className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="red"
                              onClick={(e) => handleCancelarSolicitud(viabilidad, e)}
                              title="Cancelar Solicitud"
                            >
                              <XCircle className="w-4 h-4" />
                            </IconButton>
                          </>
                        )}

                        {/* Acciones de Aprobación */}
                        {showAprobacionActions && (
                          <>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="green"
                              onClick={(e) => handleAprobar(viabilidad, e)}
                              title="Aprobar Viabilidad"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="red"
                              onClick={(e) => handleRechazar(viabilidad, e)}
                              title="Rechazar Viabilidad"
                            >
                              <XCircle className="w-4 h-4" />
                            </IconButton>
                          </>
                        )}

                        {/* Acciones de Viabilidades Canceladas */}
                        {showCancelacionInfo && (
                          <IconButton
                            variant="ghost"
                            size="1"
                            color="blue"
                            onClick={(e) => handleReactivar(viabilidad, e)}
                            title="Reactivar Solicitud"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </IconButton>
                        )}

                        {/* Acciones de Viabilidades Especiales */}
                        {showEspecialActions && (
                          <>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="amber"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/servicios/cotizacion-especial?id=${viabilidad.id}`);
                              }}
                              title="Cotización Especial"
                            >
                              <Star className="w-4 h-4" />
                            </IconButton>
                          </>
                        )}

                        {/* Eliminar - solo en ciertas vistas */}
                        {(showCotizacionActions || showAprobacionActions) && (
                          <IconButton
                            variant="ghost"
                            size="1"
                            color="red"
                            onClick={(e) => handleDelete(viabilidad, e)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </IconButton>
                        )}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      {/* Pagination */}
      {!isError && !isLoading && totalPages > 1 && (
        <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" justify="between">
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              Página {page} de {totalPages} ({totalCount} registros)
            </Text>
            <Flex gap="2">
              <Button
                size="2"
                variant="soft"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <Button
                size="2"
                variant="soft"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}

      {/* Dialog de Información Complementaria para Aprobar */}
      <InformacionComplementariaDialog
        open={aprobarDialogOpen}
        onOpenChange={setAprobarDialogOpen}
        viabilidad={viabilidadAprobar}
        onSuccess={() => setViabilidadAprobar(null)}
      />
    </Box>
  );
}
