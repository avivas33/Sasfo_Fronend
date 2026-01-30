import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Circuito } from "@/types/circuitos";
import { useCircuitos, useDeleteCircuito } from "@/hooks/useCircuitos";
import { CircuitosFormDialog } from "./CircuitosFormDialog";
import { toast } from "sonner";

interface CircuitosTableProps {
  onCircuitoSelect?: (circuito: Circuito) => void;
  selectedCircuitoId?: number;
}

export function CircuitosTable({ onCircuitoSelect, selectedCircuitoId }: CircuitosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCircuito, setSelectedCircuito] = useState<Circuito | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useCircuitos({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  const deleteCircuito = useDeleteCircuito();

  const circuitos = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedCircuito(null);
    setFormOpen(true);
  };

  const handleEdit = (circuito: Circuito, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedCircuito(circuito);
    setFormOpen(true);
  };

  const handleView = (circuito: Circuito, e: React.MouseEvent) => {
    e.stopPropagation();
    onCircuitoSelect?.(circuito);
  };

  const handleDelete = async (circuito: Circuito, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Está seguro de inhabilitar el circuito "${circuito.CircuitID}"?`)) {
      try {
        await deleteCircuito.mutateAsync(circuito.ID_CircuitosSLPE);
        toast.success("Circuito inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar Circuito");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Circuitos</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'Circuito' : 'Circuitos'}`
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
          placeholder="Buscar por código de circuito, poste o inquilino..."
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
                Error al cargar Circuitos
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
                <Table.ColumnHeaderCell>CÓDIGO CIRCUITO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CÓDIGO POSTE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>INQUILINO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ÁREA DESARROLLO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>UBICACIÓN</Table.ColumnHeaderCell>
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
              ) : circuitos.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron circuitos que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                circuitos.map((circuito) => (
                  <Table.Row
                    key={circuito.ID_CircuitosSLPE}
                    onClick={() => onCircuitoSelect?.(circuito)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedCircuitoId === circuito.ID_CircuitosSLPE ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{circuito.ID_CircuitosSLPE}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{circuito.CircuitID || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{circuito.ServiceLocation || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{circuito.Inquilino || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{circuito.AreaDesarrollo || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{circuito.ListaUbicacion || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={circuito.Estado ? "green" : "red"} variant="soft">
                        {circuito.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton variant="ghost" size="1" onClick={(e) => handleEdit(circuito, e)} title="Editar" disabled={!circuito.Estado}>
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" onClick={(e) => handleView(circuito, e)} title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" color="red" onClick={(e) => handleDelete(circuito, e)} title="Inhabilitar">
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
              Página {page} de {totalPages} ({totalCount} Circuitos)
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

      <CircuitosFormDialog open={formOpen} onOpenChange={setFormOpen} circuito={selectedCircuito} mode={formMode} />
    </Box>
  );
}
