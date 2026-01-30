import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { ODF } from "@/types/odf";
import { useODFs, useDeleteODF } from "@/hooks/useODF";
import { ODFFormDialog } from "./ODFFormDialog";
import { toast } from "sonner";

interface ODFTableProps {
  onODFSelect?: (odf: ODF) => void;
  selectedODFId?: number;
}

export function ODFTable({ onODFSelect, selectedODFId }: ODFTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedODF, setSelectedODF] = useState<ODF | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useODFs({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  const deleteODF = useDeleteODF();

  const odfs = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedODF(null);
    setFormOpen(true);
  };

  const handleEdit = (odf: ODF, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedODF(odf);
    setFormOpen(true);
  };

  const handleView = (odf: ODF, e: React.MouseEvent) => {
    e.stopPropagation();
    onODFSelect?.(odf);
  };

  const handleDelete = async (odf: ODF, e: React.MouseEvent) => {
    e.stopPropagation();
    if (odf.IsDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }
    if (confirm(`¿Está seguro de inhabilitar el ODF "${odf.Codigo || odf.Id}"?`)) {
      try {
        await deleteODF.mutateAsync(odf.Id);
        toast.success("ODF inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar ODF");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">ODFs</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'ODF' : 'ODFs'}`
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
          placeholder="Buscar por código, empresa o rack..."
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
                Error al cargar ODFs
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
                <Table.ColumnHeaderCell>CODIGO DE REGISTRO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>RAZON SOCIAL</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>RACK</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CANT. PUERTOS</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
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
              ) : odfs.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron ODFs que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                odfs.map((odf) => (
                  <Table.Row
                    key={odf.Id}
                    onClick={() => onODFSelect?.(odf)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedODFId === odf.Id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{odf.Id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{odf.Codigo || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{odf.EmpresaNombre || odf.Nombre_Empresa}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{odf.Rack || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="gray" variant="soft">{odf.Cantidad_Puertos}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={odf.Estado ? "green" : "red"} variant="soft">
                        {odf.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton variant="ghost" size="1" onClick={(e) => handleEdit(odf, e)} title="Editar" disabled={!odf.Estado}>
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" onClick={(e) => handleView(odf, e)} title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" color="red" onClick={(e) => handleDelete(odf, e)} title="Inhabilitar" disabled={odf.IsDefault}>
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
              Página {page} de {totalPages} ({totalCount} ODFs)
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

      <ODFFormDialog open={formOpen} onOpenChange={setFormOpen} odf={selectedODF} mode={formMode} />
    </Box>
  );
}
