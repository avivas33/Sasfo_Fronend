import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Flex,
  Box,
  Text,
  Table,
  Badge,
  TextField,
  Select,
  IconButton,
  Card,
} from "@radix-ui/themes";
import { Search, Loader2, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import {
  useODFInternosList,
  useODFInternosStats,
  useODFList,
  useServiceLocationList,
} from "@/hooks/useODFInternos";

const ODFInternos = () => {
  const [search, setSearch] = useState("");
  const [selectedODF, setSelectedODF] = useState<string>("");
  const [selectedSL, setSelectedSL] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { data: response, isLoading } = useODFInternosList({
    search: search || undefined,
    odf: selectedODF || undefined,
    serviceLocation: selectedSL || undefined,
    page,
    pageSize,
  });
  const { data: stats } = useODFInternosStats();
  const { data: odfList } = useODFList();
  const { data: slList } = useServiceLocationList();

  const items = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const totalCount = response?.totalCount || 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleODFChange = (value: string) => {
    setSelectedODF(value === "all" ? "" : value);
    setPage(1);
  };

  const handleSLChange = (value: string) => {
    setSelectedSL(value === "all" ? "" : value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedODF("");
    setSelectedSL("");
    setPage(1);
  };

  const hasFilters = search || selectedODF || selectedSL;

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="5" weight="bold">Consulta ODF Internos</Text>
              <Text size="2" style={{ color: "var(--gray-11)" }} className="block mt-1">
                Circuitos con ODF asignados desde Vetro
              </Text>
            </Box>
            <Flex gap="4" align="center">
              {/* Stats Cards */}
              {stats && (
                <>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">Total</Text>
                      <Text size="3" weight="bold">{stats.total}</Text>
                    </Flex>
                  </Card>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">Utilizados</Text>
                      <Text size="3" weight="bold" color="green">{stats.utilizados}</Text>
                    </Flex>
                  </Card>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">Disponibles</Text>
                      <Text size="3" weight="bold" color="blue">{stats.disponibles}</Text>
                    </Flex>
                  </Card>
                  <Card size="1">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="1" color="gray">ODFs</Text>
                      <Text size="3" weight="bold" color="orange">{stats.odfsUnicos}</Text>
                    </Flex>
                  </Card>
                </>
              )}
            </Flex>
          </Flex>
        </Box>

        {/* Filtros */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex gap="3" align="center" wrap="wrap">
            <Box style={{ width: 300 }}>
              <TextField.Root
                placeholder="Buscar por circuito, cliente, ODF, FTP..."
                value={search}
                onChange={handleSearch}
              >
                <TextField.Slot>
                  <Search className="w-4 h-4" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Box style={{ width: 200 }}>
              <Select.Root value={selectedODF || "all"} onValueChange={handleODFChange}>
                <Select.Trigger placeholder="Filtrar por ODF" />
                <Select.Content>
                  <Select.Item value="all">Todos los ODF</Select.Item>
                  {odfList?.map((odf) => (
                    <Select.Item key={odf} value={odf}>
                      {odf}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box style={{ width: 250 }}>
              <Select.Root value={selectedSL || "all"} onValueChange={handleSLChange}>
                <Select.Trigger placeholder="Filtrar por Service Location" />
                <Select.Content>
                  <Select.Item value="all">Todas las ubicaciones</Select.Item>
                  {slList?.map((sl) => (
                    <Select.Item key={sl} value={sl}>
                      {sl}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            {hasFilters && (
              <IconButton variant="soft" color="gray" onClick={clearFilters} title="Limpiar filtros">
                <X className="w-4 h-4" />
              </IconButton>
            )}

            <Box className="flex-1" />

            <Text size="2" style={{ color: "var(--gray-11)" }}>
              {totalCount} registros encontrados
            </Text>
          </Flex>
        </Box>

        {/* Tabla */}
        <Box className="flex-1 overflow-auto p-4">
          <Box className="bg-white rounded-lg border" style={{ borderColor: "var(--gray-6)" }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                  <Table.ColumnHeaderCell>ODF</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>PUERTO A</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>PUERTO Z</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CIRCUITO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CLIENTE</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>TIPO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>SERVICE LOCATION</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>FTP</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>OTDR</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
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
                ) : !items || items.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={10}>
                      <Box className="p-8 text-center">
                        <Text size="2" style={{ color: "var(--gray-11)" }}>
                          No hay registros
                        </Text>
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  items.map((item) => (
                    <Table.Row key={item.ID_CircuitoVetro}>
                      <Table.Cell>
                        <Text size="2" weight="bold" style={{ color: "var(--orange-11)" }}>
                          {item.ODF || "-"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color="blue">
                          {item.NodeSubIdA || "-"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color="purple">
                          {item.NodeSubIdZ || "-"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" weight="medium" style={{ color: "var(--blue-11)" }}>
                          {item.Circuit_ID || "-"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.CustomerName || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color="gray">
                          {item.Type || "-"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.ServiceLocation || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.FTP || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.OTDR.toFixed(2)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={item.Utilizado ? "green" : "blue"} variant="soft">
                          {item.Utilizado ? "Utilizado" : "Disponible"}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>

        {/* Paginacion */}
        {totalPages > 1 && (
          <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
            <Flex justify="between" align="center">
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Pagina {page} de {totalPages}
              </Text>
              <Flex gap="2">
                <IconButton
                  variant="soft"
                  size="1"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </IconButton>
                <IconButton
                  variant="soft"
                  size="1"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </IconButton>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default ODFInternos;
