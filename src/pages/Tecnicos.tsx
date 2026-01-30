import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Flex,
  Box,
  Text,
  Table,
  Button,
  Badge,
  IconButton,
  Dialog,
  TextField,
  Select,
  Card,
} from "@radix-ui/themes";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  UserX,
  UserCheck,
} from "lucide-react";
import {
  useTecnicosList,
  useTecnicosStats,
  useTiposUsuario,
  useCreateTecnico,
  useUpdateTecnico,
  useDeleteTecnico,
  useInhabilitarTecnico,
  useHabilitarTecnico,
} from "@/hooks/useTecnicos";
import { Tecnico, TecnicoCreateRequest } from "@/types/tecnicos";
import { toast } from "sonner";

const Tecnicos = () => {
  const [search, setSearch] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tecnico | null>(null);
  const [formData, setFormData] = useState<TecnicoCreateRequest>({
    Nombre: "",
    Cedula: "",
    Telefono: 0,
    Extension: 0,
    Celular: 0,
    Email: "",
    Usuario: "",
    TipoUsuarioId: 1,
  });

  const { data: response, isLoading } = useTecnicosList({
    search: search || undefined,
    tipoUsuario: selectedTipo ? parseInt(selectedTipo) : undefined,
    estado: selectedEstado ? selectedEstado === "true" : undefined,
    page,
    pageSize,
  });

  const { data: stats } = useTecnicosStats();
  const { data: tiposUsuario } = useTiposUsuario();

  const createMutation = useCreateTecnico();
  const updateMutation = useUpdateTecnico();
  const deleteMutation = useDeleteTecnico();
  const inhabilitarMutation = useInhabilitarTecnico();
  const habilitarMutation = useHabilitarTecnico();

  const items = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const totalCount = response?.totalCount || 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTipo("");
    setSelectedEstado("");
    setPage(1);
  };

  const hasFilters = search || selectedTipo || selectedEstado;

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      Nombre: "",
      Cedula: "",
      Telefono: 0,
      Extension: 0,
      Celular: 0,
      Email: "",
      Usuario: "",
      TipoUsuarioId: 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Tecnico) => {
    setEditingItem(item);
    setFormData({
      Nombre: item.Nombre,
      Cedula: item.Cedula || "",
      Telefono: item.Telefono,
      Extension: item.Extension,
      Celular: item.Celular,
      Email: item.Email || "",
      Usuario: item.Usuario || "",
      TipoUsuarioId: item.TipoUsuarioId,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.Nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
        toast.success("Técnico actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Técnico creado exitosamente");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error("Error al guardar el técnico");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este técnico permanentemente?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Técnico eliminado exitosamente");
    } catch {
      toast.error("Error al eliminar el técnico");
    }
  };

  const handleInhabilitar = async (id: number) => {
    if (!confirm("¿Está seguro de inhabilitar este técnico?")) return;
    try {
      await inhabilitarMutation.mutateAsync(id);
      toast.success("Técnico inhabilitado exitosamente");
    } catch {
      toast.error("Error al inhabilitar el técnico");
    }
  };

  const handleHabilitar = async (id: number) => {
    try {
      await habilitarMutation.mutateAsync(id);
      toast.success("Técnico habilitado exitosamente");
    } catch {
      toast.error("Error al habilitar el técnico");
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
              <Text size="5" weight="bold">Técnicos</Text>
              <Text size="2" style={{ color: "var(--gray-11)" }} className="block mt-1">
                Gestión de técnicos del sistema
              </Text>
            </Box>
            <Flex gap="4" align="center">
              {stats && (
                <>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">Total</Text>
                      <Text size="3" weight="bold">{stats.total}</Text>
                    </Flex>
                  </Card>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">Activos</Text>
                      <Text size="3" weight="bold" color="green">{stats.activos}</Text>
                    </Flex>
                  </Card>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">Técnicos</Text>
                      <Text size="3" weight="bold" color="blue">{stats.tecnicos}</Text>
                    </Flex>
                  </Card>
                </>
              )}
              <Button onClick={handleOpenCreate}>
                <Plus className="w-4 h-4" />
                Nuevo Técnico
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Filtros */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex gap="3" align="center" wrap="wrap">
            <Box style={{ width: 280 }}>
              <TextField.Root
                placeholder="Buscar por nombre, cédula o email..."
                value={search}
                onChange={handleSearch}
              >
                <TextField.Slot>
                  <Search className="w-4 h-4" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Box style={{ width: 160 }}>
              <Select.Root value={selectedTipo || "all"} onValueChange={(v) => { setSelectedTipo(v === "all" ? "" : v); setPage(1); }}>
                <Select.Trigger placeholder="Tipo Usuario" />
                <Select.Content>
                  <Select.Item value="all">Todos los tipos</Select.Item>
                  {tiposUsuario?.map((tipo) => (
                    <Select.Item key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box style={{ width: 140 }}>
              <Select.Root value={selectedEstado || "all"} onValueChange={(v) => { setSelectedEstado(v === "all" ? "" : v); setPage(1); }}>
                <Select.Trigger placeholder="Estado" />
                <Select.Content>
                  <Select.Item value="all">Todos</Select.Item>
                  <Select.Item value="true">Activos</Select.Item>
                  <Select.Item value="false">Inactivos</Select.Item>
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
              {totalCount} registros
            </Text>
          </Flex>
        </Box>

        {/* Tabla */}
        <Box className="flex-1 overflow-auto p-4">
          <Box className="bg-white rounded-lg border" style={{ borderColor: "var(--gray-6)" }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                  <Table.ColumnHeaderCell>NOMBRE</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CÉDULA</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>TELÉFONO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CELULAR</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>TIPO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
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
                ) : !items || items.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={8}>
                      <Box className="p-8 text-center">
                        <Text size="2" style={{ color: "var(--gray-11)" }}>
                          No hay técnicos registrados
                        </Text>
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <Text size="2" weight="medium">{item.Nombre}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.Cedula || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">
                          {item.Telefono > 0 ? item.Telefono : "-"}
                          {item.Extension > 0 && ` ext. ${item.Extension}`}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.Celular > 0 ? item.Celular : "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.Email || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={item.TipoUsuarioId === 3 ? "purple" : item.TipoUsuarioId === 2 ? "blue" : "gray"}
                          variant="soft"
                        >
                          {item.TipoUsuarioNombre}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={item.Estado ? "green" : "red"} variant="soft">
                          {item.Estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="1">
                          <IconButton
                            variant="ghost"
                            size="1"
                            onClick={() => handleOpenEdit(item)}
                            title="Editar"
                            disabled={!item.Estado}
                          >
                            <Pencil className="w-4 h-4" />
                          </IconButton>
                          {item.Estado ? (
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="orange"
                              onClick={() => handleInhabilitar(item.id)}
                              title="Inhabilitar"
                              disabled={inhabilitarMutation.isPending}
                            >
                              <UserX className="w-4 h-4" />
                            </IconButton>
                          ) : (
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="green"
                              onClick={() => handleHabilitar(item.id)}
                              title="Habilitar"
                              disabled={habilitarMutation.isPending}
                            >
                              <UserCheck className="w-4 h-4" />
                            </IconButton>
                          )}
                          <IconButton
                            variant="ghost"
                            size="1"
                            color="red"
                            onClick={() => handleDelete(item.id)}
                            title="Eliminar"
                            disabled={deleteMutation.isPending}
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

      {/* Dialog para Crear/Editar */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{editingItem ? "Editar Técnico" : "Nuevo Técnico"}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Complete los campos para {editingItem ? "actualizar" : "crear"} el técnico.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Nombre Completo *</Text>
              <TextField.Root
                placeholder="Nombres y Apellidos"
                value={formData.Nombre}
                onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
              />
            </Box>

            <Flex gap="3">
              <Box className="flex-1">
                <Text size="2" weight="medium" className="mb-1 block">Cédula</Text>
                <TextField.Root
                  placeholder="# Cédula"
                  value={formData.Cedula}
                  onChange={(e) => setFormData({ ...formData, Cedula: e.target.value })}
                />
              </Box>
              <Box className="flex-1">
                <Text size="2" weight="medium" className="mb-1 block">Tipo Usuario</Text>
                <Select.Root
                  value={formData.TipoUsuarioId.toString()}
                  onValueChange={(v) => setFormData({ ...formData, TipoUsuarioId: parseInt(v) })}
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    {tiposUsuario?.map((tipo) => (
                      <Select.Item key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombre}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>

            <Flex gap="3">
              <Box className="flex-1">
                <Text size="2" weight="medium" className="mb-1 block">Teléfono</Text>
                <TextField.Root
                  type="number"
                  placeholder="# Teléfono"
                  value={formData.Telefono.toString()}
                  onChange={(e) => setFormData({ ...formData, Telefono: parseInt(e.target.value) || 0 })}
                />
              </Box>
              <Box style={{ width: 100 }}>
                <Text size="2" weight="medium" className="mb-1 block">Extensión</Text>
                <TextField.Root
                  type="number"
                  placeholder="Ext."
                  value={formData.Extension.toString()}
                  onChange={(e) => setFormData({ ...formData, Extension: parseInt(e.target.value) || 0 })}
                />
              </Box>
            </Flex>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Celular</Text>
              <TextField.Root
                type="number"
                placeholder="# Celular"
                value={formData.Celular.toString()}
                onChange={(e) => setFormData({ ...formData, Celular: parseInt(e.target.value) || 0 })}
              />
            </Box>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Email</Text>
              <TextField.Root
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              />
            </Box>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Usuario</Text>
              <TextField.Root
                placeholder="Usuario para acceso"
                value={formData.Usuario}
                onChange={(e) => setFormData({ ...formData, Usuario: e.target.value })}
              />
            </Box>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancelar</Button>
            </Dialog.Close>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {editingItem ? "Actualizar" : "Guardar"}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default Tecnicos;
