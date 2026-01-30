import { AppSidebar } from "@/components/AppSidebar";
import { Flex, Box, Text, Card, Badge, Table } from "@radix-ui/themes";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FacturacionHansa = () => {
  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex justify="between" align="center">
            <Flex direction="column" gap="1">
              <Flex align="center" gap="2">
                <FileText className="w-6 h-6" style={{ color: "var(--green-11)" }} />
                <Text size="5" weight="bold">Facturación Hansa</Text>
              </Flex>
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Gestión de facturación integrada con Hansa
              </Text>
            </Flex>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Factura
            </Button>
          </Flex>
        </Box>

        {/* Filtros */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex gap="4" align="center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar facturas..."
                className="pl-10"
              />
            </div>
            <Flex gap="2">
              <Badge color="blue" size="2">Total: 0</Badge>
              <Badge color="green" size="2">Pagadas: 0</Badge>
              <Badge color="amber" size="2">Pendientes: 0</Badge>
            </Flex>
          </Flex>
        </Box>

        {/* Contenido */}
        <Box className="flex-1 overflow-auto p-4">
          <Card className="p-0">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Número Factura</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Monto</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Flex direction="column" align="center" justify="center" className="py-12">
                      <FileText className="w-12 h-12 mb-4" style={{ color: "var(--gray-8)" }} />
                      <Text size="3" style={{ color: "var(--gray-11)" }}>
                        No hay registros de facturación disponibles
                      </Text>
                      <Text size="2" style={{ color: "var(--gray-9)" }}>
                        Esta funcionalidad está en desarrollo
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Card>
        </Box>
      </Box>
    </Flex>
  );
};

export default FacturacionHansa;
