import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Modulo } from "@/types/modulo";
import { useModulos, useDeleteModulo } from "@/hooks/useModulos";
import { ModuloFormDialog } from "./ModuloFormDialog";
import { toast } from "sonner";

interface ModulosTableProps {
  onModuloSelect?: (modulo: Modulo) => void;
  selectedModuloId?: number;
}

export function ModulosTable({ onModuloSelect, selectedModuloId }: ModulosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch módulos con React Query
  const { data, isLoading, isError, error } = useModulos({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteModulo = useDeleteModulo();

  const modulos = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewModulo = () => {
    setFormMode("create");
    setSelectedModulo(null);
    setFormOpen(true);
  };

  const handleEdit = (modulo: Modulo, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedModulo(modulo);
    setFormOpen(true);
  };

  const handleView = (modulo: Modulo, e: React.MouseEvent) => {
    e.stopPropagation();
    onModuloSelect?.(modulo);
  };

  const handleDelete = async (modulo: Modulo, e: React.MouseEvent) => {
    e.stopPropagation();

    if (modulo.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }

    if (confirm(`¿Está seguro de inhabilitar el módulo "${modulo.modulo}"?`)) {
      try {
        await deleteModulo.mutateAsync(modulo.id);
        toast.success("Módulo inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar módulo");
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
            <Text size="4" weight="medium">Módulos</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'módulo' : 'módulos'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewModulo}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por código, inquilino o service location..."
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
                Error al cargar módulos
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
                <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Inquilino</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Nombre Ubicación</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Área Desarrollo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Service Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : modulos.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron módulos que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                modulos.map((modulo) => (
                  <Table.Row
                    key={modulo.id}
                    onClick={() => onModuloSelect?.(modulo)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedModuloId === modulo.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{modulo.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{modulo.modulo}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{modulo.Inquilino || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{modulo.Nombre_Ubicacion || modulo.UbicacionNombre || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{modulo.AreaDesarrolloNombre || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{modulo.Service_Location || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={modulo.Estado ? "green" : "red"}
                        variant="soft"
                      >
                        {modulo.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(modulo, e)}
                          title="Editar"
                          disabled={!modulo.Estado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(modulo, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(modulo, e)}
                          title="Inhabilitar"
                          disabled={modulo.isDefault}
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
              Página {page} de {totalPages} ({totalCount} módulos)
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
      <ModuloFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        modulo={selectedModulo}
        mode={formMode}
      />
    </Box>
  );
}
