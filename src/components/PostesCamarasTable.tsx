import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Eye, Plus, Loader2, AlertCircle, Trash2, CheckCircle, XCircle, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Box, Button, TextField, Badge, Flex, Text, IconButton, Table, DropdownMenu } from "@radix-ui/themes";
import { P2P, EstadoP2P, EstadoP2PLabels, EstadoP2PColors } from "@/types/p2p";
import { useP2PList, useDeleteP2P, useAprobarP2P, useCancelarP2P, useCompletarP2P } from "@/hooks/useP2P";
import { toast } from "sonner";

interface PostesCamarasTableProps {
  onP2PSelect?: (p2p: P2P) => void;
  selectedP2PId?: number;
  filterByEstado?: number;
}

export function PostesCamarasTable({ onP2PSelect, selectedP2PId, filterByEstado }: PostesCamarasTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch P2P con React Query - tipoP2P: 1 para Postes/Camaras
  const { data, isLoading, isError, error } = useP2PList({
    search: debouncedSearch || undefined,
    page,
    pageSize,
    tipoP2P: 1, // Postes y Camaras
    estado: filterByEstado,
    sortBy: 'ID_P2P',
    sortOrder: 'asc',
  });

  // Mutations
  const deleteP2P = useDeleteP2P();
  const aprobarP2P = useAprobarP2P();
  const cancelarP2P = useCancelarP2P();
  const completarP2P = useCompletarP2P();

  const p2pList = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleNewPoste = () => {
    navigate("/viabilidades/p2p-postes/nuevo");
  };

  const handleEdit = (p2p: P2P, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/viabilidades/p2p-postes/nuevo?id=${p2p.ID_P2P}`);
  };

  const handleView = (p2p: P2P, e: React.MouseEvent) => {
    e.stopPropagation();
    onP2PSelect?.(p2p);
  };

  const handleDelete = async (p2p: P2P, e: React.MouseEvent) => {
    e.stopPropagation();

    if (p2p.Estado === EstadoP2P.Cancelado) {
      toast.error("Este registro ya fue cancelado");
      return;
    }

    if (p2p.Estado === EstadoP2P.Completado) {
      toast.error("No se puede cancelar un registro completado");
      return;
    }

    if (confirm(`¿Está seguro de cancelar el Poste/Cámara #${p2p.ID_P2P}?`)) {
      try {
        await cancelarP2P.mutateAsync(p2p.ID_P2P);
        toast.success("Poste/Cámara cancelado exitosamente");
      } catch (error) {
        toast.error("Error al cancelar Poste/Cámara");
      }
    }
  };

  const handleAprobar = async (p2p: P2P, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await aprobarP2P.mutateAsync(p2p.ID_P2P);
      toast.success("Poste/Cámara aprobado exitosamente");
    } catch (error) {
      toast.error("Error al aprobar Poste/Cámara");
    }
  };

  const handleCompletar = async (p2p: P2P, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await completarP2P.mutateAsync(p2p.ID_P2P);
      toast.success("Poste/Cámara completado exitosamente");
    } catch (error) {
      toast.error("Error al completar Poste/Cámara");
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Listado de Postes y Cámaras</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </Flex>
              ) : (
                `${totalCount} ${totalCount === 1 ? 'registro' : 'registros'}`
              )}
            </Text>
          </Flex>
          <Flex gap="2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft" size="2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportar
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  <FileSpreadsheet className="w-4 h-4 mr-2" style={{ color: "var(--green-9)" }} />
                  Excel
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <FileText className="w-4 h-4 mr-2" style={{ color: "var(--red-9)" }} />
                  PDF
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Printer className="w-4 h-4 mr-2" style={{ color: "var(--blue-9)" }} />
                  Imprimir
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Button size="2" onClick={handleNewPoste}>
              <Plus className="w-4 h-4" />
              Agregar
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Subtitle */}
      <Box className="px-4 py-2 border-b" style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-2)" }}>
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Gestión de Postes y Cámaras para Viabilidades
        </Text>
      </Box>

      {/* Search */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root
          placeholder="Buscar por nombre de punto o ubicación..."
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
                Error al cargar Postes/Cámaras
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
              <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>INTERCONEXIÓN A</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>PUNTO 1</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ORDEN 1</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>INTERCONEXIÓN Z</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>PUNTO 2</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ORDEN 2</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CREACIÓN</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
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
              ) : p2pList.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={10}>
                    <Box className="p-8 text-center">
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        No se encontraron Postes/Cámaras que coincidan con tu búsqueda.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ) : (
                p2pList.map((p2p) => (
                  <Table.Row
                    key={p2p.ID_P2P}
                    onClick={() => onP2PSelect?.(p2p)}
                    className="cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: selectedP2PId === p2p.ID_P2P ? "var(--gray-2)" : "transparent",
                    }}
                  >
                    <Table.Cell style={{ backgroundColor: "var(--blue-2)" }}>
                      <Text size="2" weight="medium">{p2p.ID_P2P}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{p2p.NombrePto1}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{p2p.Punto1}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="bold">{p2p.Orden1 || '-'}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{p2p.NombrePto2}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{p2p.Punto2}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="bold">{p2p.Orden2 || '-'}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{formatDate(p2p.create_date)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={EstadoP2PColors[p2p.Estado as EstadoP2P] || "gray"}
                        variant="soft"
                      >
                        {EstadoP2PLabels[p2p.Estado as EstadoP2P] || "Desconocido"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleEdit(p2p, e)}
                          title="Editar"
                          disabled={p2p.Estado === EstadoP2P.Cancelado || p2p.Estado === EstadoP2P.Completado}
                        >
                          <Edit className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="1"
                          onClick={(e) => handleView(p2p, e)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        {p2p.Estado === EstadoP2P.Proceso && (
                          <IconButton
                            variant="ghost"
                            size="1"
                            color="green"
                            onClick={(e) => handleAprobar(p2p, e)}
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </IconButton>
                        )}
                        {p2p.Estado === EstadoP2P.Aprobado && (
                          <IconButton
                            variant="ghost"
                            size="1"
                            color="blue"
                            onClick={(e) => handleCompletar(p2p, e)}
                            title="Completar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </IconButton>
                        )}
                        <IconButton
                          variant="ghost"
                          size="1"
                          color="red"
                          onClick={(e) => handleDelete(p2p, e)}
                          title="Cancelar"
                          disabled={p2p.Estado === EstadoP2P.Cancelado || p2p.Estado === EstadoP2P.Completado}
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
              Página {page} de {totalPages} ({totalCount} registros)
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

      {/* Footer with exit button */}
      <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Button variant="soft" color="gray" asChild>
          <a href="/">Salir de la Ventana</a>
        </Button>
      </Box>
    </Box>
  );
}
