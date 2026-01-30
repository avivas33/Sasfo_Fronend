import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { ListaUbicacion, TipoUbicacionLabels } from "@/types/listaUbicaciones";
import { useListaUbicaciones, useDeleteListaUbicacion } from "@/hooks/useListaUbicaciones";
import { ListaUbicacionesFormDialog } from "./ListaUbicacionesFormDialog";
import { toast } from "sonner";

interface ListaUbicacionesTableProps {
  onUbicacionSelect?: (ubicacion: ListaUbicacion) => void;
  selectedUbicacionId?: number;
}

export function ListaUbicacionesTable({ onUbicacionSelect, selectedUbicacionId }: ListaUbicacionesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUbicacion, setSelectedUbicacion] = useState<ListaUbicacion | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch ubicaciones con React Query
  const { data, isLoading, isError, error } = useListaUbicaciones({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteUbicacion = useDeleteListaUbicacion();

  const ubicaciones = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedUbicacion(null);
    setFormOpen(true);
  };

  const handleEdit = (ubicacion: ListaUbicacion, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedUbicacion(ubicacion);
    setFormOpen(true);
  };

  const handleView = (ubicacion: ListaUbicacion, e: React.MouseEvent) => {
    e.stopPropagation();
    onUbicacionSelect?.(ubicacion);
  };

  const handleDelete = async (ubicacion: ListaUbicacion, e: React.MouseEvent) => {
    e.stopPropagation();

    if (ubicacion.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }

    if (confirm(`¿Está seguro de inhabilitar la ubicación "${ubicacion.Nombre_Ubicacion}"?`)) {
      try {
        await deleteUbicacion.mutateAsync(ubicacion.id);
        toast.success("Ubicación inhabilitada exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar ubicación");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Lista de Ubicaciones</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'ubicación' : 'ubicaciones'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNew}>
            <Plus className="w-4 h-4" />
            Crear Nueva
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre o área de desarrollo..."
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
                Error al cargar ubicaciones
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
                <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Área de Desarrollo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Por Defecto</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
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
              ) : ubicaciones.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron ubicaciones que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                ubicaciones.map((ubicacion) => (
                  <Table.Row
                    key={ubicacion.id}
                    onClick={() => onUbicacionSelect?.(ubicacion)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedUbicacionId === ubicacion.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{ubicacion.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{ubicacion.Nombre_Ubicacion}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{ubicacion.AreaDesarrolloNombre || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="gray" variant="soft">
                        {TipoUbicacionLabels[ubicacion.Tipo_UbicacionID]}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={ubicacion.Estado ? "green" : "red"}
                        variant="soft"
                      >
                        {ubicacion.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {ubicacion.isDefault && <Badge color="blue" variant="soft">Sí</Badge>}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(ubicacion, e)}
                          title="Editar"
                          disabled={!ubicacion.Estado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(ubicacion, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(ubicacion, e)}
                          title="Inhabilitar"
                          disabled={ubicacion.isDefault}
                        >
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

      {/* Pagination */}
      {!isError && !isLoading && totalPages > 1 && (
        <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" justify="between">
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              Página {page} de {totalPages} ({totalCount} ubicaciones)
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

      {/* Formulario Dialog */}
      <ListaUbicacionesFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        ubicacion={selectedUbicacion}
        mode={formMode}
      />
    </Box>
  );
}
