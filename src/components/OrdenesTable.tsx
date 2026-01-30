import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Table, Badge, Button, TextField, IconButton, Select } from "@radix-ui/themes";
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Eye, XCircle, CheckCircle, FileText, Pencil } from "lucide-react";
import { useOrdenes, useCancelarOrden, useCompletarOrden } from "@/hooks/useOrdenes";
import { OrdenServicio, OrdenStatusColors } from "@/types/ordenes";
import { toast } from "sonner";

interface OrdenesTableProps {
  onOrdenSelect?: (orden: OrdenServicio) => void;
  selectedOrdenId?: number;
  filterByStatus?: number; // 2=En Proceso, 3=Completado, 4=Cancelada, undefined=todos
}

export function OrdenesTable({ onOrdenSelect, selectedOrdenId, filterByStatus }: OrdenesTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(filterByStatus?.toString() || "all");
  const pageSize = 10;

  // Fetch órdenes con React Query
  const { data, isLoading, isError, error } = useOrdenes({
    search: search || undefined,
    page,
    pageSize,
    status: statusFilter !== "all" ? parseInt(statusFilter) : undefined,
  });

  const cancelarMutation = useCancelarOrden();
  const completarMutation = useCompletarOrden();

  const ordenes = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCancelar = async (orden: OrdenServicio) => {
    if (!confirm(`¿Está seguro de cancelar la orden #${orden.ID_OrdenServicio}?`)) return;

    try {
      await cancelarMutation.mutateAsync({ id: orden.id, request: { Motivo: "Cancelada por usuario" } });
      toast.success(`Orden #${orden.ID_OrdenServicio} cancelada exitosamente`);
    } catch (error: any) {
      toast.error(error.message || "Error al cancelar la orden");
    }
  };

  const handleCompletar = async (orden: OrdenServicio) => {
    if (!confirm(`¿Está seguro de marcar como completada la orden #${orden.ID_OrdenServicio}?`)) return;

    try {
      await completarMutation.mutateAsync(orden.id);
      toast.success(`Orden #${orden.ID_OrdenServicio} completada exitosamente`);
    } catch (error: any) {
      toast.error(error.message || "Error al completar la orden");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PA", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getStatusBadge = (statusCode: number, status: string) => {
    const color = OrdenStatusColors[statusCode as keyof typeof OrdenStatusColors] || "gray";
    return (
      <Badge color={color} variant="soft">
        {status}
      </Badge>
    );
  };

  return (
    <Box className="h-full flex flex-col p-6 bg-white">
      {/* Header con búsqueda y filtros */}
      <Flex justify="between" align="center" className="mb-4">
        <Flex align="center" gap="3">
          <Text size="4" weight="medium">Órdenes de Servicio</Text>
          {totalCount > 0 && (
            <Badge variant="soft" color="gray">
              {`${totalCount} ${totalCount === 1 ? "orden" : "órdenes"}`}
            </Badge>
          )}
        </Flex>
        <Flex gap="3" align="center">
          {/* Filtro por estado */}
          {!filterByStatus && (
            <Select.Root value={statusFilter} onValueChange={handleStatusFilterChange}>
              <Select.Trigger placeholder="Filtrar por estado" />
              <Select.Content>
                <Select.Item value="all">Todos</Select.Item>
                <Select.Item value="2">En Proceso</Select.Item>
                <Select.Item value="3">Completado</Select.Item>
                <Select.Item value="4">Cancelada</Select.Item>
              </Select.Content>
            </Select.Root>
          )}
          {/* Búsqueda */}
          <TextField.Root
            placeholder="Buscar orden..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          >
            <TextField.Slot>
              <Search className="w-4 h-4" />
            </TextField.Slot>
          </TextField.Root>
        </Flex>
      </Flex>

      {/* Tabla */}
      <Box className="flex-1 overflow-auto border rounded-lg" style={{ borderColor: "var(--gray-6)" }}>
        {isError && (
          <Flex direction="column" align="center" justify="center" className="h-full p-8">
            <AlertCircle className="w-12 h-12 mb-4" style={{ color: "var(--red-9)" }} />
            <Text size="3" weight="medium" style={{ color: "var(--red-11)" }} className="mb-2">
              Error al cargar órdenes
            </Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {error?.message || "Ocurrió un error al cargar las órdenes de servicio"}
            </Text>
          </Flex>
        )}

        {!isError && (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell># Orden</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Operador</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cliente Final</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Tipo Enlace</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>NRC</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>MRC</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>F. Aprobación</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={9}>
                    <Flex align="center" justify="center" className="py-8">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--blue-9)" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : ordenes.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9}>
                    <Flex direction="column" align="center" justify="center" className="py-8">
                      <FileText className="w-10 h-10 mb-2" style={{ color: "var(--gray-9)" }} />
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron órdenes de servicio.
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : (
                ordenes.map((orden) => (
                  <Table.Row
                    key={orden.id}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedOrdenId === orden.id ? "bg-blue-50" : ""}`}
                    onClick={() => onOrdenSelect?.(orden)}
                  >
                    <Table.Cell>
                      <Text weight="medium">{orden.ID_OrdenServicio || orden.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{orden.Operador || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{orden.Cliente_FinalA || orden.Cliente_Final || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{orden.TipoEnlace || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{formatCurrency(orden.NRC)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{formatCurrency(orden.MRC)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{formatDate(orden.Fecha_Aprobacion)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(orden.StatusCode, orden.Status)}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="1">
                        <IconButton
                          variant="ghost"
                          size="1"
                          title="Ver detalle"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrdenSelect?.(orden);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        {orden.StatusCode === 2 && (
                          <>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="blue"
                              title="Editar orden"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/viabilidades/ordenes/editar?id=${orden.id}`);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="green"
                              title="Completar orden"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompletar(orden);
                              }}
                              disabled={completarMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="red"
                              title="Cancelar orden"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelar(orden);
                              }}
                              disabled={cancelarMutation.isPending}
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
        )}
      </Box>

      {/* Paginación */}
      {totalPages > 1 && (
        <Flex justify="between" align="center" className="mt-4">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Página {page} de {totalPages} ({totalCount} órdenes)
          </Text>
          <Flex gap="2">
            <Button
              variant="soft"
              size="1"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="soft"
              size="1"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
