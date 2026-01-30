import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table, Tabs } from "@radix-ui/themes";
import { Enlace } from "@/types/enlaces";
import { useEnlaces, useDeleteEnlace } from "@/hooks/useEnlaces";
import { EnlacesFormDialog } from "./EnlacesFormDialog";
import { toast } from "sonner";

interface EnlacesTableProps {
  onEnlaceSelect?: (enlace: Enlace) => void;
  selectedEnlaceId?: number;
}

export function EnlacesTable({ onEnlaceSelect, selectedEnlaceId }: EnlacesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<boolean | undefined>(true);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEnlace, setSelectedEnlace] = useState<Enlace | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useEnlaces({
    search: debouncedSearch || undefined,
    estado: estadoFilter,
    page,
    pageSize,
  });

  const deleteEnlace = useDeleteEnlace();

  const enlaces = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedEnlace(null);
    setFormOpen(true);
  };

  const handleEdit = (enlace: Enlace, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedEnlace(enlace);
    setFormOpen(true);
  };

  const handleView = (enlace: Enlace, e: React.MouseEvent) => {
    e.stopPropagation();
    onEnlaceSelect?.(enlace);
  };

  const handleDelete = async (enlace: Enlace, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Está seguro de desactivar el enlace del cliente "${enlace.Cliente}"?`)) {
      try {
        await deleteEnlace.mutateAsync(enlace.ID_Enlace);
        toast.success("Enlace desactivado exitosamente");
      } catch (error) {
        toast.error("Error al desactivar Enlace");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Servicio de Fibra Óptica Oscura</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'Enlace' : 'Enlaces'}`
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
        <Flex direction="column" gap="3">
          <TextField.Root
            placeholder="Buscar por cliente, carrier, código AFO o sitios..."
            size="2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <Search className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
            </TextField.Slot>
          </TextField.Root>

          <Tabs.Root value={estadoFilter === true ? "activos" : estadoFilter === false ? "inactivos" : "todos"}
                      onValueChange={(value) => {
                        setEstadoFilter(value === "activos" ? true : value === "inactivos" ? false : undefined);
                        setPage(1);
                      }}>
            <Tabs.List>
              <Tabs.Trigger value="activos">Enlaces Activos</Tabs.Trigger>
              <Tabs.Trigger value="inactivos">Enlaces Inactivos</Tabs.Trigger>
              <Tabs.Trigger value="todos">Todos</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </Flex>
      </Box>

      <Box className="flex-1 overflow-auto">
        {isError && (
          <Box className="p-8 text-center">
            <Flex direction="column" align="center" gap="3">
              <AlertCircle className="w-12 h-12" style={{ color: "var(--red-9)" }} />
              <Text size="3" weight="medium" style={{ color: "var(--red-11)" }}>
                Error al cargar Enlaces
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
                <Table.ColumnHeaderCell>CÓDIGO AFO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CLIENTE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CARRIER</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>SITIO A</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>SITIO Z</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ACTIVACIÓN</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>MRC VENTA</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={10}>
                    <Flex align="center" justify="center" className="p-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : enlaces.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={10}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron enlaces que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                enlaces.map((enlace) => (
                  <Table.Row
                    key={enlace.ID_Enlace}
                    onClick={() => onEnlaceSelect?.(enlace)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedEnlaceId === enlace.ID_Enlace ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{enlace.ID_Enlace}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{enlace.Codigo_AFO || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{enlace.Cliente || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{enlace.Carrier || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{enlace.SitioA || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{enlace.SitioZ || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{enlace.Fecha_Activacion || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">${enlace.MRC_Venta.toFixed(2)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={enlace.Estado ? "green" : "red"} variant="soft">
                        {enlace.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton variant="ghost" size="1" onClick={(e) => handleEdit(enlace, e)} title="Editar" disabled={!enlace.Estado}>
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" onClick={(e) => handleView(enlace, e)} title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" color="red" onClick={(e) => handleDelete(enlace, e)} title="Desactivar">
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
              Página {page} de {totalPages} ({totalCount} Enlaces)
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

      <EnlacesFormDialog open={formOpen} onOpenChange={setFormOpen} enlace={selectedEnlace} mode={formMode} />
    </Box>
  );
}
