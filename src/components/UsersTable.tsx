import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2, Lock, Unlock, Key } from "lucide-react";
import { Box, Button, TextField, Badge, Avatar, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Usuario } from "@/types/usuario";
import { useUsuarios, useDeleteUsuario, useToggleLockUsuario } from "@/hooks/useUsuarios";
import { UsuarioFormDialog } from "./UsuarioFormDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { toast } from "sonner";

interface UsersTableProps {
  onUserSelect?: (user: Usuario) => void;
  selectedUserId?: string;
}

export function UsersTable({ onUserSelect, selectedUserId }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  // Estado para diálogo de cambio de contraseña
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch usuarios con React Query
  const { data, isLoading, isError, error } = useUsuarios({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutations
  const deleteUsuario = useDeleteUsuario();
  const toggleLock = useToggleLockUsuario();

  const usuarios = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewUsuario = () => {
    setFormMode("create");
    setSelectedUsuario(null);
    setFormOpen(true);
  };

  const handleEdit = (usuario: Usuario, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedUsuario(usuario);
    setFormOpen(true);
  };

  const handleView = (usuario: Usuario, e: React.MouseEvent) => {
    e.stopPropagation();
    onUserSelect?.(usuario);
  };

  const handleDelete = async (usuario: Usuario, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Está seguro de eliminar al usuario "${usuario.NombreCompleto}"?`)) {
      try {
        await deleteUsuario.mutateAsync(usuario.Id);
        toast.success("Usuario eliminado exitosamente");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar usuario");
      }
    }
  };

  const handleToggleLock = async (usuario: Usuario, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = usuario.IsActive ? "bloquear" : "desbloquear";
    if (confirm(`¿Está seguro de ${action} al usuario "${usuario.NombreCompleto}"?`)) {
      try {
        await toggleLock.mutateAsync(usuario.Id);
        toast.success(`Usuario ${action === "bloquear" ? "bloqueado" : "desbloqueado"} exitosamente`);
      } catch (error: any) {
        toast.error(error.message || `Error al ${action} usuario`);
      }
    }
  };

  const handleChangePassword = (usuario: Usuario, e: React.MouseEvent) => {
    e.stopPropagation();
    setPasswordUserId(usuario.Id);
    setPasswordDialogOpen(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Usuarios</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'usuario' : 'usuarios'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewUsuario}>
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre, email o teléfono..."
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
                Error al cargar usuarios
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
                <Table.ColumnHeaderCell>Usuario</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Roles</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Organización</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : usuarios.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron usuarios que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                usuarios.map((usuario) => (
                  <Table.Row
                    key={usuario.Id}
                    onClick={() => onUserSelect?.(usuario)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedUserId === usuario.Id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Flex align="center" gap="3">
                        <Avatar
                          size="2"
                          fallback={usuario.NombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          color="cyan"
                        />
                        <Box>
                          <Text size="2" weight="medium">{usuario.NombreCompleto}</Text>
                          <Text size="1" style={{ color: "var(--gray-11)", display: "block" }}>
                            @{usuario.UserName}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Box>
                        <Text size="2">{usuario.Email}</Text>
                        {!usuario.EmailConfirmed && (
                          <Badge color="orange" variant="soft" size="1">
                            Sin confirmar
                          </Badge>
                        )}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="1" wrap="wrap">
                        {usuario.Roles.length > 0 ? (
                          usuario.Roles.map((role) => (
                            <Badge key={role} color="blue" variant="soft" size="1">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Text size="1" style={{ color: "var(--gray-11)" }}>Sin roles</Text>
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{usuario.OrganizationName || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={usuario.IsActive ? "green" : "red"}
                        variant="soft"
                      >
                        {usuario.IsActive ? "Activo" : "Bloqueado"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(usuario, e)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleChangePassword(usuario, e)}
                          title="Cambiar contraseña"
                        >
                          <Key className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color={usuario.IsActive ? "orange" : "green"}
                          onClick={(e) => handleToggleLock(usuario, e)}
                          title={usuario.IsActive ? "Bloquear" : "Desbloquear"}
                        >
                          {usuario.IsActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(usuario, e)}
                          title="Eliminar"
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
              Página {page} de {totalPages} ({totalCount} usuarios)
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
      <UsuarioFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        usuario={selectedUsuario}
        mode={formMode}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        userId={passwordUserId}
      />
    </Box>
  );
}
