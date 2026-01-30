import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2, Briefcase } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Contratista } from "@/types/contratista";
import { useContratistas, useDeleteContratista } from "@/hooks/useContratistas";
import { ContratistaFormDialog } from "./ContratistaFormDialog";
import { toast } from "sonner";

interface ContratistasTableProps {
  onContratistaSelect?: (contratista: Contratista) => void;
  selectedContratistaId?: number;
}

export function ContratistasTable({ onContratistaSelect, selectedContratistaId }: ContratistasTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedContratista, setSelectedContratista] = useState<Contratista | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch contratistas con React Query
  const { data, isLoading, isError, error } = useContratistas({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteContratista = useDeleteContratista();

  const contratistas = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewContratista = () => {
    setFormMode("create");
    setSelectedContratista(null);
    setFormOpen(true);
  };

  const handleEdit = (contratista: Contratista, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedContratista(contratista);
    setFormOpen(true);
  };

  const handleView = (contratista: Contratista, e: React.MouseEvent) => {
    e.stopPropagation();
    onContratistaSelect?.(contratista);
  };

  const handleDelete = async (contratista: Contratista, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm(`¿Está seguro de cambiar el estado del contratista "${contratista.Nombre}"?`)) {
      try {
        await deleteContratista.mutateAsync(contratista.id);
        toast.success("Estado del contratista actualizado exitosamente");
      } catch (error) {
        toast.error("Error al actualizar estado del contratista");
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
            <Flex align="center" gap="2">
              <Briefcase className="w-5 h-5" style={{ color: "#4cb74a" }} />
              <Text size="4" weight="medium">Contratistas</Text>
            </Flex>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'contratista' : 'contratistas'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewContratista}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por razón social, RUC..."
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
                Error al cargar contratistas
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
                <Table.ColumnHeaderCell>Razón Social</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>RUC</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Tipo Empresa</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Vigencia Contrato</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
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
              ) : contratistas.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron contratistas que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                contratistas.map((contratista) => (
                  <Table.Row
                    key={contratista.id}
                    onClick={() => onContratistaSelect?.(contratista)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedContratistaId === contratista.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{contratista.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Box>
                        <Text size="2" weight="medium" className="block">
                          {contratista.Nombre}
                        </Text>
                        {contratista.Direccion && (
                          <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                            {contratista.Direccion}
                          </Text>
                        )}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{contratista.RUC || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="blue" variant="soft">
                        {contratista.Tipo_empresa}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {contratista.Fecha_Vigencia_Contrato
                          ? new Date(contratista.Fecha_Vigencia_Contrato).toLocaleDateString('es-PA')
                          : "-"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={contratista.Estado ? "green" : "red"}
                        variant="soft"
                      >
                        {contratista.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(contratista, e)}
                          title="Editar"
                          disabled={!contratista.Estado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(contratista, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(contratista, e)}
                          title="Cambiar estado"
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
              Página {page} de {totalPages} ({totalCount} contratistas)
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
      <ContratistaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        contratista={selectedContratista}
        mode={formMode}
      />
    </Box>
  );
}
