import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Servicios } from "@/types/servicios";
import { useServicios, useDeleteServicio } from "@/hooks/useServicios";
import { ServiciosFormDialog } from "./ServiciosFormDialog";
import { toast } from "sonner";

interface ServiciosTableProps {
  onServiciosSelect?: (servicios: Servicios) => void;
  selectedServiciosId?: number;
}

export function ServiciosTable({ onServiciosSelect, selectedServiciosId }: ServiciosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedServicios, setSelectedServicios] = useState<Servicios | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useServicios({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  const deleteServicio = useDeleteServicio();

  const servicioss = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNew = () => {
    setFormMode("create");
    setSelectedServicios(null);
    setFormOpen(true);
  };

  const handleEdit = (servicios: Servicios, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedServicios(servicios);
    setFormOpen(true);
  };

  const handleView = (servicios: Servicios, e: React.MouseEvent) => {
    e.stopPropagation();
    onServiciosSelect?.(servicios);
  };

  const handleDelete = async (servicios: Servicios, e: React.MouseEvent) => {
    e.stopPropagation();
    if (servicios.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }
    if (confirm(`¿Está seguro de inhabilitar el Servicio AFO con código "${servicios.Codigo || servicios.id}"?`)) {
      try {
        await deleteServicio.mutateAsync(servicios.id);
        toast.success("Servicio AFO inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar Servicio AFO");
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Servicios AFO</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'Servicio AFO' : 'Servicios AFO'}`
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
          placeholder="Buscar por código o unidad de medida..."
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
                Error al cargar Servicios AFO
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
                <Table.ColumnHeaderCell>CÓDIGO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DESDE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>HASTA</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>PRECIO</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>UNIDAD MEDIDA</Table.ColumnHeaderCell>
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
              ) : servicioss.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron Servicios AFO que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                servicioss.map((servicios) => (
                  <Table.Row
                    key={servicios.id}
                    onClick={() => onServiciosSelect?.(servicios)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedServiciosId === servicios.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{servicios.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">{servicios.Codigo || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{servicios.Desde}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{servicios.Hasta}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="medium">${servicios.Precio.toFixed(2)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{servicios.Unidad_Medida || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={servicios.Estado ? "green" : "red"} variant="soft">
                        {servicios.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton variant="ghost" size="1" onClick={(e) => handleEdit(servicios, e)} title="Editar" disabled={!servicios.Estado}>
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" onClick={(e) => handleView(servicios, e)} title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton variant="ghost" size="1" color="red" onClick={(e) => handleDelete(servicios, e)} title="Inhabilitar" disabled={servicios.isDefault}>
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
              Página {page} de {totalPages} ({totalCount} Servicios AFO)
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

      <ServiciosFormDialog open={formOpen} onOpenChange={setFormOpen} servicios={selectedServicios} mode={formMode} />
    </Box>
  );
}
