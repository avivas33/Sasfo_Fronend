import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { AreaDesarrollo } from "@/types/areaDesarrollo";
import { useAreasDesarrollo, useDeleteAreaDesarrollo } from "@/hooks/useAreasDesarrollo";
import { AreaDesarrolloFormDialog } from "./AreaDesarrolloFormDialog";
import { toast } from "sonner";

interface AreasDesarrolloTableProps {
  onAreaSelect?: (area: AreaDesarrollo) => void;
  selectedAreaId?: number;
}

export function AreasDesarrolloTable({ onAreaSelect, selectedAreaId }: AreasDesarrolloTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedArea, setSelectedArea] = useState<AreaDesarrollo | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch áreas de desarrollo con React Query
  const { data, isLoading, isError, error } = useAreasDesarrollo({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteArea = useDeleteAreaDesarrollo();

  const areas = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewArea = () => {
    setFormMode("create");
    setSelectedArea(null);
    setFormOpen(true);
  };

  const handleEdit = (area: AreaDesarrollo, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedArea(area);
    setFormOpen(true);
  };

  const handleView = (area: AreaDesarrollo, e: React.MouseEvent) => {
    e.stopPropagation();
    onAreaSelect?.(area);
  };

  const handleDelete = async (area: AreaDesarrollo, e: React.MouseEvent) => {
    e.stopPropagation();

    if (area.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }

    const action = area.Estado ? "inhabilitar" : "habilitar";
    if (confirm(`¿Está seguro de ${action} el área "${area.Nombre}"?`)) {
      try {
        await deleteArea.mutateAsync(area.id);
        toast.success(`Área ${action === "inhabilitar" ? "inhabilitada" : "habilitada"} exitosamente`);
      } catch (error) {
        toast.error(`Error al ${action} área`);
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
            <Text size="4" weight="medium">Áreas de Desarrollo</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'área' : 'áreas'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewArea}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
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
                Error al cargar áreas de desarrollo
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
                <Table.ColumnHeaderCell>Área de Desarrollo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Por Defecto</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
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
              ) : areas.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron áreas de desarrollo que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                areas.map((area) => (
                  <Table.Row
                    key={area.id}
                    onClick={() => onAreaSelect?.(area)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedAreaId === area.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{area.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{area.Nombre}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={area.Estado ? "green" : "red"}
                        variant="soft"
                      >
                        {area.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={area.isDefault ? "blue" : "gray"}
                        variant="soft"
                      >
                        {area.isDefault ? "Sí" : "No"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(area, e)}
                          title="Editar"
                          disabled={!area.Estado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(area, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color={area.Estado ? "red" : "green"}
                          onClick={(e) => handleDelete(area, e)}
                          title={area.Estado ? "Inhabilitar" : "Habilitar"}
                          disabled={area.isDefault}
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
              Página {page} de {totalPages} ({totalCount} áreas)
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
      <AreaDesarrolloFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        area={selectedArea}
        mode={formMode}
      />
    </Box>
  );
}
