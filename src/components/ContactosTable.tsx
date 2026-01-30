import { useState, useEffect } from "react";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table } from "@radix-ui/themes";
import { Contacto, TipoContactoLabels } from "@/types/contacto";
import { useContactos, useDeleteContacto } from "@/hooks/useContactos";
import { ContactoFormDialog } from "./ContactoFormDialog";
import { toast } from "sonner";

interface ContactosTableProps {
  onContactoSelect?: (contacto: Contacto) => void;
  selectedContactoId?: number;
}

export function ContactosTable({ onContactoSelect, selectedContactoId }: ContactosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para el formulario
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch contactos con React Query
  const { data, isLoading, isError, error } = useContactos({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  });

  // Mutation para eliminar
  const deleteContacto = useDeleteContacto();

  const contactos = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewContacto = () => {
    setFormMode("create");
    setSelectedContacto(null);
    setFormOpen(true);
  };

  const handleEdit = (contacto: Contacto, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setSelectedContacto(contacto);
    setFormOpen(true);
  };

  const handleView = (contacto: Contacto, e: React.MouseEvent) => {
    e.stopPropagation();
    onContactoSelect?.(contacto);
  };

  const handleDelete = async (contacto: Contacto, e: React.MouseEvent) => {
    e.stopPropagation();

    if (contacto.isDefault) {
      toast.error("No se puede inhabilitar un registro marcado como 'Por Defecto'");
      return;
    }

    if (confirm(`¿Está seguro de inhabilitar el contacto "${contacto.Nombre}"?`)) {
      try {
        await deleteContacto.mutateAsync(contacto.id);
        toast.success("Contacto inhabilitado exitosamente");
      } catch (error) {
        toast.error("Error al inhabilitar contacto");
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
            <Text size="4" weight="medium">Contactos</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'contacto' : 'contactos'}`
              )}
            </Text>
          </Flex>
          <Button size="2" onClick={handleNewContacto}>
            <Plus className="w-4 h-4" />
            Crear Nuevo
          </Button>
        </Flex>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre, cédula o correo..."
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
                Error al cargar contactos
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
                <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Teléfono</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Correo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Empresa</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
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
              ) : contactos.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron contactos que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                contactos.map((contacto) => (
                  <Table.Row
                    key={contacto.id}
                    onClick={() => onContactoSelect?.(contacto)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedContactoId === contacto.id ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell>
                      <Text size="2" weight="medium">{contacto.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Box>
                        <Text size="2" weight="medium" className="block">
                          {contacto.Nombre}
                        </Text>
                        {contacto.Cedula && (
                          <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                            Cédula: {contacto.Cedula}
                          </Text>
                        )}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Box>
                        {contacto.Telefono_Fijo && (
                          <Text size="2" className="block">{contacto.Telefono_Fijo}</Text>
                        )}
                        {contacto.Telefono_movil && (
                          <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                            Móvil: {contacto.Telefono_movil}
                          </Text>
                        )}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{contacto.correo_electronico || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="purple" variant="soft">
                        {TipoContactoLabels[contacto.tipo_contacto]}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{contacto.EmpresaNombre || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={contacto.Estado ? "green" : "red"}
                        variant="soft"
                      >
                        {contacto.Estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(contacto, e)}
                          title="Editar"
                          disabled={!contacto.Estado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(contacto, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(contacto, e)}
                          title="Inhabilitar"
                          disabled={contacto.isDefault}
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
              Página {page} de {totalPages} ({totalCount} contactos)
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
      <ContactoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        contacto={selectedContacto}
        mode={formMode}
      />
    </Box>
  );
}
