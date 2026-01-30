import { useState, useEffect } from "react";
import { MoreVertical, Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Empresa } from "@/types/empresa";
import { useEmpresas, useDeleteEmpresa } from "@/hooks/useEmpresas";
import { EmpresaFormDialog } from "./EmpresaFormDialog";
import { toast } from "sonner";

interface EmpresasTableProps {
  onEmpresaSelect?: (empresa: Empresa) => void;
  selectedEmpresaId?: number;
}

export function EmpresasTable({ onEmpresaSelect, selectedEmpresaId }: EmpresasTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch empresas con React Query
  const { data, isLoading, isError, error } = useEmpresas({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteEmpresa = useDeleteEmpresa();

  const empresas = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewEmpresa = () => {
    setFormMode("create");
    setSelectedEmpresa(null);
    setFormOpen(true);
  };

  const handleEdit = (empresa: Empresa, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedEmpresa(empresa);
    setFormOpen(true);
  };

  const handleView = (empresa: Empresa, e: React.MouseEvent) => {
    e.stopPropagation();
    onEmpresaSelect?.(empresa);
  };

  const handleDelete = async (empresa: Empresa, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Está seguro de eliminar la empresa "${empresa.Nombre}"?`)) {
      try {
        await deleteEmpresa.mutateAsync(empresa.id);
        toast.success("Empresa eliminada exitosamente");
      } catch (error) {
        toast.error("Error al eliminar empresa");
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
            <Text size="4" weight="medium">Empresas</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'empresa' : 'empresas'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewEmpresa}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre, RUC o tipo de empresa..."
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
                Error al cargar empresas
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
                <Table.ColumnHeaderCell>Tipo de Empresa</Table.ColumnHeaderCell>
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
              ) : empresas.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron empresas que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                empresas.map((empresa) => (
              <Table.Row
                key={empresa.id}
                onClick={() => onEmpresaSelect?.(empresa)}
                className="cursor-pointer hover:bg-gray-50"
                style={{
                  backgroundColor: selectedEmpresaId === empresa.id ? "var(--gray-2)" : "transparent",
                }}
              >
                <Table.Cell>
                  <Text size="2" weight="medium">{empresa.id}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Box>
                    <Text size="2" weight="medium" className="block">
                      {empresa.Nombre}
                    </Text>
                    {empresa.Direccion && (
                      <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                        {empresa.Direccion}
                      </Text>
                    )}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{empresa.RUC}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="blue" variant="soft">
                    {empresa.Tipo_empresa}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={empresa.Estado ? "green" : "red"}
                    variant="soft"
                  >
                    {empresa.Estado ? "Activo" : "Inactivo"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <IconButton
                      variant="ghost"
                      size="1"
                      onClick={(e) => handleEdit(empresa, e)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      size="1"
                      onClick={(e) => handleView(empresa, e)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      size="1"
                      color="red"
                      onClick={(e) => handleDelete(empresa, e)}
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
              Página {page} de {totalPages} ({totalCount} empresas)
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
      <EmpresaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        empresa={selectedEmpresa}
        mode={formMode}
      />
    </Box>
  );
}
