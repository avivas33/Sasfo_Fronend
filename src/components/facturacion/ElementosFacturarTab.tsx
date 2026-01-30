import { useState } from "react";
import { Box, Button, Flex, Text, Table, TextField, Select, Checkbox, Badge, Card } from "@radix-ui/themes";
import { Search, FileText, Loader2 } from "lucide-react";
import { useElementosFacturar, useFacturar, useEmpresasFacturacion } from "@/hooks/useFacturacion";
import { ElementoFactura } from "@/types/facturacion";
import { toast } from "sonner";

export function ElementosFacturarTab() {
  const [empresa, setEmpresa] = useState<string>("Todas");
  const [fechaDesde, setFechaDesde] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-01-01`;
  });
  const [fechaHasta, setFechaHasta] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedEmpresas, setSelectedEmpresas] = useState<string[]>([]);

  const { data: empresas } = useEmpresasFacturacion();
  const { data: elementos, isLoading, refetch } = useElementosFacturar({
    empresa: empresa !== "Todas" ? empresa : undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });

  const facturar = useFacturar();

  const handleSelectEmpresa = (carrier: string, checked: boolean) => {
    if (checked) {
      setSelectedEmpresas(prev => [...prev, carrier]);
    } else {
      setSelectedEmpresas(prev => prev.filter(e => e !== carrier));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && elementos) {
      setSelectedEmpresas(elementos.map(e => e.Carrier));
    } else {
      setSelectedEmpresas([]);
    }
  };

  const handleFacturar = async () => {
    if (selectedEmpresas.length === 0) {
      toast.error("Seleccione al menos una empresa para facturar");
      return;
    }

    try {
      const result = await facturar.mutateAsync({
        Empresas: selectedEmpresas,
        FechaDesde: fechaDesde || undefined,
        FechaHasta: fechaHasta || undefined,
      });
      toast.success(result.message);
      setSelectedEmpresas([]);
      refetch();
    } catch (error) {
      toast.error("Error al facturar");
    }
  };

  const handleBuscar = () => {
    refetch();
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const totalSeleccionado = elementos
    ?.filter(e => selectedEmpresas.includes(e.Carrier))
    .reduce((sum, e) => sum + e.Total_Facturar, 0) || 0;

  const totalGeneral = elementos?.reduce((sum, e) => sum + e.Total_Facturar, 0) || 0;

  return (
    <Box className="h-full flex flex-col bg-white">
      {/* Filtros */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <Flex gap="3" wrap="wrap" align="end">
          <Box style={{ width: "200px" }}>
            <Text size="2" weight="medium" className="mb-1 block">Empresa</Text>
            <Select.Root value={empresa} onValueChange={setEmpresa}>
              <Select.Trigger placeholder="Seleccionar empresa" style={{ width: "100%" }} />
              <Select.Content>
                <Select.Item value="Todas">Todas</Select.Item>
                {empresas?.map((emp) => (
                  <Select.Item key={emp} value={emp}>{emp}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text size="2" weight="medium" className="mb-1 block">Fecha Desde</Text>
            <TextField.Root
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </Box>
          <Box>
            <Text size="2" weight="medium" className="mb-1 block">Fecha Hasta</Text>
            <TextField.Root
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </Box>
          <Button onClick={handleBuscar}>
            <Search className="w-4 h-4" />
            Buscar
          </Button>
          <Button
            color="green"
            onClick={handleFacturar}
            disabled={selectedEmpresas.length === 0 || facturar.isPending}
          >
            {facturar.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Facturar ({selectedEmpresas.length})
          </Button>
        </Flex>
      </Box>

      {/* Resumen */}
      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-2)" }}>
        <Flex gap="4">
          <Card className="p-3">
            <Text size="2">Total General: </Text>
            <Text size="3" weight="bold" style={{ color: "var(--green-11)" }}>
              {formatCurrency(totalGeneral)}
            </Text>
          </Card>
          <Card className="p-3">
            <Text size="2">Total Seleccionado: </Text>
            <Text size="3" weight="bold" style={{ color: "var(--blue-11)" }}>
              {formatCurrency(totalSeleccionado)}
            </Text>
          </Card>
        </Flex>
      </Box>

      {/* Tabla */}
      <Box className="flex-1 overflow-auto">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
              <Table.ColumnHeaderCell>
                <Checkbox
                  checked={selectedEmpresas.length === (elementos?.length || 0) && (elementos?.length || 0) > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>OPERADOR</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>CANTIDAD DE CARGOS</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>IMPORTE TOTAL</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Flex align="center" justify="center" className="p-8">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : !elementos || elementos.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Box className="p-8 text-center">
                    <Text size="2" style={{ color: "var(--gray-11)" }}>
                      No hay elementos contabilizados pendientes de facturar
                    </Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : (
              elementos.map((elemento) => (
                <Table.Row key={elemento.Carrier}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedEmpresas.includes(elemento.Carrier)}
                      onCheckedChange={(checked) => handleSelectEmpresa(elemento.Carrier, checked as boolean)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="medium">{elemento.Carrier}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="blue" variant="soft" size="2">
                      {elemento.Cantidad_Enlace}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="bold" style={{ color: "var(--green-11)" }}>
                      {formatCurrency(elemento.Total_Facturar)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
