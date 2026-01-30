import { useState } from "react";
import { Box, Button, Flex, Text, Table, TextField, Select, Checkbox, Badge } from "@radix-ui/themes";
import { Search, XCircle, Loader2 } from "lucide-react";
import { useHistorialContabilizacion, useAnularContabilizacion, useEmpresasFacturacion } from "@/hooks/useFacturacion";
import { toast } from "sonner";

export function AnularContabilizacionTab() {
  const [empresa, setEmpresa] = useState<string>("Todas");
  const [fechaDesde, setFechaDesde] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-01-01`;
  });
  const [fechaHasta, setFechaHasta] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: empresas } = useEmpresasFacturacion();
  const { data, isLoading, refetch } = useHistorialContabilizacion({
    empresa: empresa !== "Todas" ? empresa : undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
    page,
    pageSize: 50,
  });

  const anularContabilizacion = useAnularContabilizacion();

  const enlaces = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(enlaces.map(e => e.ID_Enlace));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleAnular = async () => {
    if (selectedIds.length === 0) {
      toast.error("Seleccione al menos un elemento para anular");
      return;
    }

    if (!confirm(`¿Está seguro de anular la contabilización de ${selectedIds.length} elementos?`)) {
      return;
    }

    try {
      const result = await anularContabilizacion.mutateAsync(selectedIds);
      toast.success(result.message);
      setSelectedIds([]);
      refetch();
    } catch (error) {
      toast.error("Error al anular contabilización");
    }
  };

  const handleBuscar = () => {
    setPage(1);
    refetch();
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

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
            <Text size="2" weight="medium" className="mb-1 block">Fecha Contabilización Desde</Text>
            <TextField.Root
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </Box>
          <Box>
            <Text size="2" weight="medium" className="mb-1 block">Fecha Contabilización Hasta</Text>
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
            color="red"
            onClick={handleAnular}
            disabled={selectedIds.length === 0 || anularContabilizacion.isPending}
          >
            {anularContabilizacion.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Anular Contabilización ({selectedIds.length})
          </Button>
        </Flex>
      </Box>

      {/* Nota informativa */}
      <Box className="p-3 border-b" style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--amber-2)" }}>
        <Text size="2" style={{ color: "var(--amber-11)" }}>
          Solo se muestran elementos contabilizados que aún no han sido facturados. Los elementos ya facturados no pueden ser anulados.
        </Text>
      </Box>

      {/* Tabla */}
      <Box className="flex-1 overflow-auto">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
              <Table.ColumnHeaderCell>
                <Checkbox
                  checked={selectedIds.length === enlaces.length && enlaces.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>FECHA CARGO</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>FECHA CONTAB.</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ORDEN</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>OPERADOR</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>CLIENTE</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>SERVICIO</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>VENTA</Table.ColumnHeaderCell>
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
            ) : enlaces.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={10}>
                  <Box className="p-8 text-center">
                    <Text size="2" style={{ color: "var(--gray-11)" }}>
                      No se encontraron elementos contabilizados pendientes de facturar
                    </Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : (
              enlaces.map((enlace) => (
                <Table.Row key={enlace.ID_Enlace}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedIds.includes(enlace.ID_Enlace)}
                      onCheckedChange={(checked) => handleSelectOne(enlace.ID_Enlace, checked as boolean)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="medium">{enlace.ID_Enlace}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{formatDate(enlace.Fecha_Cargo)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{formatDate(enlace.Fecha_Contabilizado)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="blue" variant="soft">{enlace.No_Enlace}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{enlace.Carrier || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{enlace.Cliente || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{enlace.Servicio || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="bold" style={{ color: "var(--green-11)" }}>
                      {formatCurrency(enlace.Venta_Importe)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="amber" variant="soft">Contabilizado</Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Paginación */}
      <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            {totalCount} registros encontrados
          </Text>
          <Flex gap="2">
            <Button variant="soft" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Anterior
            </Button>
            <Button variant="soft" disabled={enlaces.length < 50} onClick={() => setPage(p => p + 1)}>
              Siguiente
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
