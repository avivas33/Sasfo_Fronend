import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { CO } from "@/types/co";
import { useCOs, useDeleteCO } from "@/hooks/useCO";
import { COFormDialog } from "./COFormDialog";
import { toast } from "sonner";

interface COTableProps {
  onCOSelect?: (co: CO) => void;
  selectedCOId?: number;
}

export function COTable({ onCOSelect, selectedCOId }: COTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCO, setSelectedCO] = useState<CO | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch COs con React Query
  const { data, isLoading, isError, error } = useCOs({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteCO = useDeleteCO();

  const cos = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewCO = () => {
    setFormMode("create");
    setSelectedCO(null);
    setFormOpen(true);
  };

  const handleEdit = (co: CO, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedCO(co);
    setFormOpen(true);
  };

  const handleView = (co: CO, e: React.MouseEvent) => {
    e.stopPropagation();
    onCOSelect?.(co);
  };

  const handleDelete = async (co: CO, e: React.MouseEvent) => {
    e.stopPropagation();

    if (co.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }

    if (confirm(`¿Está seguro de inhabilitar la compañía de enlace "${co.Nombre}"?`)) {
      try {
        await deleteCO.mutateAsync(co.id);
        toast.success("Compañía de enlace inhabilitada exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar compañía de enlace");
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
            <Text size="4" weight="medium">Compañías de Enlace</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'compañía' : 'compañías'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewCO}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por código, nombre, proyecto o plan..."
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
                Error al cargar compañías de enlace
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
                <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Proyecto</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Por Defecto</Table.ColumnHeaderCell>
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
              ) : cos.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron compañías de enlace que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                cos.map((co) => (
                  <Table.Row
                    key={co.id}
                    onClick={() => onCOSelect?.(co)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedCOId === co.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{co.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{co.Codigo || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{co.Nombre}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{co.Nombre_Proyecto || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{co.Nombre_Plan || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={co.Estado ? "green" : "red"}
                        variant="soft"
                      >
                        {co.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {co.isDefault && <Badge color="blue" variant="soft">Sí</Badge>}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(co, e)}
                          title="Editar"
                          disabled={!co.Estado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(co, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(co, e)}
                          title="Inhabilitar"
                          disabled={co.isDefault}
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
              Página {page} de {totalPages} ({totalCount} compañías)
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
      <COFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        co={selectedCO}
        mode={formMode}
      />
    </Box>
  );
}
