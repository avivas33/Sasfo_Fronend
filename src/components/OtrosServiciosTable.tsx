import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { OtroServicio } from "@/types/otrosServicios";
import { useOtrosServicios, useDeleteOtroServicio } from "@/hooks/useOtrosServicios";
import { OtrosServiciosFormDialog } from "./OtrosServiciosFormDialog";
import { toast } from "sonner";

interface OtrosServiciosTableProps {
  onOtroServicioSelect?: (otroServicio: OtroServicio) => void;
  selectedOtroServicioId?: number;
}

export function OtrosServiciosTable({ onOtroServicioSelect, selectedOtroServicioId }: OtrosServiciosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedOtroServicio, setSelectedOtroServicio] = useState<OtroServicio | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useOtrosServicios({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  const deleteOtroServicio = useDeleteOtroServicio();

  const otrosServicios = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedOtroServicio(null);
    setFormOpen(true);
  };

  const handleEdit = (otroServicio: OtroServicio, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedOtroServicio(otroServicio);
    setFormOpen(true);
  };

  const handleView = (otroServicio: OtroServicio, e: React.MouseEvent) => {
    e.stopPropagation();
    onOtroServicioSelect?.(otroServicio);
  };

  const handleDelete = async (otroServicio: OtroServicio, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Está seguro de inhabilitar el servicio "${otroServicio.Nombre}"?`)) {
      try {
        await deleteOtroServicio.mutateAsync(otroServicio.id);
        toast.success("Otro Servicio inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar Otro Servicio");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Otros Servicios</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'Servicio' : 'Servicios'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNew}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
          </Button>
        </Flex>
      </Box>

      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre u observaciones..."
          size="2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <TextField.Slot>
            <Search className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Box className="flex-1 overflow-auto">
        {isError && (
          <Box className="p-8 text-center">
            <Flex direction="column" align="center" gap="3">
              <AlertCircle className="w-12 h-12" style={{ color: "var(--red-9)" }} />
              <Text size="3" weight="medium" style={{ color: "var(--red-11)" }}>
                Error al cargar Otros Servicios
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
                <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>NOMBRE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>MRC</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>NRC</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>OBSERVACIONES</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : otrosServicios.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron servicios que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                otrosServicios.map((otroServicio) => (
                  <Table.Row
                    key={otroServicio.id}
                    onClick={() => onOtroServicioSelect?.(otroServicio)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedOtroServicioId === otroServicio.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{otroServicio.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{otroServicio.Nombre}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">${otroServicio.MRC.toFixed(2)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">${otroServicio.NRC.toFixed(2)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="truncate max-w-xs">
                        {otroServicio.Observaciones || "-"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={otroServicio.Estado ? "green" : "red"} variant="soft">
                        {otroServicio.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton variant="ghost" size="1" onClick={(e) => handleEdit(otroServicio, e)} title="Editar" disabled={!otroServicio.Estado}>
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" onClick={(e) => handleView(otroServicio, e)} title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" color="red" onClick={(e) => handleDelete(otroServicio, e)} title="Inhabilitar">
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      {!isError && !isLoading && totalPages > 1 && (
        <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" justify="between">
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              Página {page} de {totalPages} ({totalCount} Servicios)
            </Text>
            <Flex gap="2">
              <Button size="2" variant="soft" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <Button size="2" variant="soft" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Siguiente
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}

      <OtrosServiciosFormDialog open={formOpen} onOpenChange={setFormOpen} otroServicio={selectedOtroServicio} mode={formMode} />
    </Box>
  );
}
