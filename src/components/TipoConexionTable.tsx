import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { TipoConexion } from "@/types/tipoConexion";
import { useTipoConexions, useDeleteTipoConexion } from "@/hooks/useTipoConexion";
import { TipoConexionFormDialog } from "./TipoConexionFormDialog";
import { toast } from "sonner";

interface TipoConexionTableProps {
  onTipoConexionSelect?: (tipoConexion: TipoConexion) => void;
  selectedTipoConexionId?: number;
}

export function TipoConexionTable({ onTipoConexionSelect, selectedTipoConexionId }: TipoConexionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTipoConexion, setSelectedTipoConexion] = useState<TipoConexion | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useTipoConexions({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  const deleteTipoConexion = useDeleteTipoConexion();

  const tipoConexions = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedTipoConexion(null);
    setFormOpen(true);
  };

  const handleEdit = (tipoConexion: TipoConexion, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedTipoConexion(tipoConexion);
    setFormOpen(true);
  };

  const handleView = (tipoConexion: TipoConexion, e: React.MouseEvent) => {
    e.stopPropagation();
    onTipoConexionSelect?.(tipoConexion);
  };

  const handleDelete = async (tipoConexion: TipoConexion, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tipoConexion.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }
    if (confirm(`¿Está seguro de inhabilitar el Tipo de Conexión "${tipoConexion.Nombre}"?`)) {
      try {
        await deleteTipoConexion.mutateAsync(tipoConexion.id);
        toast.success("Tipo de Conexión inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar Tipo de Conexión");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Tipos de Conexión</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'Tipo de Conexión' : 'Tipos de Conexión'}`
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
          placeholder="Buscar por nombre o descripción..."
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
                Error al cargar Tipos de Conexión
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
                <Table.ColumnHeaderCell>DESCRIPCIÓN</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : tipoConexions.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron Tipos de Conexión que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                tipoConexions.map((tipoConexion) => (
                  <Table.Row
                    key={tipoConexion.id}
                    onClick={() => onTipoConexionSelect?.(tipoConexion)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedTipoConexionId === tipoConexion.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{tipoConexion.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{tipoConexion.Nombre}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{tipoConexion.Descripcion || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={tipoConexion.Estado ? "green" : "red"} variant="soft">
                        {tipoConexion.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton variant="ghost" size="1" onClick={(e) => handleEdit(tipoConexion, e)} title="Editar" disabled={!tipoConexion.Estado}>
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" onClick={(e) => handleView(tipoConexion, e)} title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" color="red" onClick={(e) => handleDelete(tipoConexion, e)} title="Inhabilitar" disabled={tipoConexion.isDefault}>
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
              Página {page} de {totalPages} ({totalCount} Tipos de Conexión)
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

      <TipoConexionFormDialog open={formOpen} onOpenChange={setFormOpen} tipoConexion={selectedTipoConexion} mode={formMode} />
    </Box>
  );
}
