import { useState, useEffect } from "react";
import { Search, Edit, Plus, Loader2, AlertCircle, Trash2, Settings, RefreshCw } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Rol } from "@/types/rol";
import { useRoles, useDeleteRol, useSyncOperaciones } from "@/hooks/useRoles";
import { RolFormDialog } from "./RolFormDialog";
import { RolPermisosDialog } from "./RolPermisosDialog";
import { toast } from "sonner";

interface RolesTableProps {
  onRolSelect?: (rol: Rol) => void;
  selectedRolId?: string;
}

export function RolesTable({ onRolSelect, selectedRolId }: RolesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  // Estado para diálogo de permisos
  const [permisosDialogOpen, setPermisosDialogOpen] = useState(false);
  const [permisosRolId, setPermisosRolId] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch roles con React Query
  const { data, isLoading, isError, error } = useRoles({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutations
  const deleteRol = useDeleteRol();
  const syncOperaciones = useSyncOperaciones();

  const roles = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewRol = () => {
    setFormMode("create");
    setSelectedRol(null);
    setFormOpen(true);
  };

  const handleEdit = (rol: Rol, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedRol(rol);
    setFormOpen(true);
  };

  const handleDelete = async (rol: Rol, e: React.MouseEvent) => {
    e.stopPropagation();
    if (rol.Name === "Admin") {
      toast.error("No se puede eliminar el rol Admin");
      return;
    }
    if (confirm(`¿Está seguro de eliminar el rol "${rol.Name}"?`)) {
      try {
        await deleteRol.mutateAsync(rol.Id);
        toast.success("Rol eliminado exitosamente");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar rol");
      }
    }
  };

  const handlePermisos = (rol: Rol, e: React.MouseEvent) => {
    e.stopPropagation();
    setPermisosRolId(rol.Id);
    setPermisosDialogOpen(true);
  };

  const handleSyncOperaciones = async (rol: Rol, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await syncOperaciones.mutateAsync(rol.Id);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Error al sincronizar operaciones");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Roles</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'rol' : 'roles'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewRol}>
            <Plus className="w-4 h-4" />
            Nuevo Rol
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre..."
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
                Error al cargar roles
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
                <Table.ColumnHeaderCell>Nombre del Rol</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Usuarios Asignados</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : roles.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron roles que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                roles.map((rol) => (
                  <Table.Row
                    key={rol.Id}
                    onClick={() => onRolSelect?.(rol)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedRolId === rol.Id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Text size="2" weight="medium">{rol.Name}</Text>
                        {rol.Name === "Admin" && (
                          <Badge color="purple" variant="soft" size="1">
                            Sistema
                          </Badge>
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="blue" variant="soft">
                        {rol.UserCount} {rol.UserCount === 1 ? 'usuario' : 'usuarios'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(rol, e)}
                          title="Editar"
                          disabled={rol.Name === "Admin"}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handlePermisos(rol, e)}
                          title="Gestionar permisos"
                        >
                          <Settings className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleSyncOperaciones(rol, e)}
                          title="Sincronizar operaciones"
                          disabled={syncOperaciones.isPending}
                        >
                          <RefreshCw className={`w-4 h-4 ${syncOperaciones.isPending ? 'animate-spin' : ''}`} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(rol, e)}
                          title="Eliminar"
                          disabled={rol.Name === "Admin" || rol.UserCount > 0}
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
              Página {page} de {totalPages} ({totalCount} roles)
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
      <RolFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rol={selectedRol}
        mode={formMode}
      />

      {/* Permisos Dialog */}
      <RolPermisosDialog
        open={permisosDialogOpen}
        onOpenChange={setPermisosDialogOpen}
        rolId={permisosRolId}
      />
    </Box>
  );
}
