import { useState } from "react";
import { Box, Button, Flex, Text, Table, TextField, Select, Checkbox, Badge } from "@radix-ui/themes";
import { Search, Check, Loader2 } from "lucide-react";
import { useEnlacesPendientes, useContabilizar, useEmpresasFacturacion } from "@/hooks/useFacturacion";
import { toast } from "sonner";

export function ElementosAprobarTab() {
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
  const [searchParams, setSearchParams] = useState<{
    empresa?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  } | null>(null);

  const { data: empresas, isLoading: loadingEmpresas } = useEmpresasFacturacion();

  // Solo hacer la llamada al API si hay parámetros de búsqueda (fechas obligatorias)
  const { data, isLoading, refetch } = useEnlacesPendientes(
    searchParams ? {
      empresa: searchParams.empresa,
      fechaDesde: searchParams.fechaDesde,
      fechaHasta: searchParams.fechaHasta,
      page,
      pageSize: 50,
    } : undefined
  );

  const contabilizar = useContabilizar();

  const enlaces = searchParams ? (data?.data || []) : [];
  const totalCount = searchParams ? (data?.totalCount || 0) : 0;

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

  const handleContabilizar = async () => {
    if (selectedIds.length === 0) {
      toast.error("Seleccione al menos un elemento para contabilizar");
      return;
    }

    try {
      const result = await contabilizar.mutateAsync(selectedIds);
      toast.success(result.message);
      setSelectedIds([]);
      refetch();
    } catch (error: any) {
      const errorMsg = error?.details || error?.message || "Error al contabilizar";
      toast.error(errorMsg);
      console.error("Error completo:", error);
    }
  };

  const handleBuscar = () => {
    // Validar fechas obligatorias
    if (!fechaDesde || !fechaHasta) {
      toast.error("Por favor, complete las Fechas Desde y Hasta para buscar");
      return;
    }

    // Validar que fecha desde no sea mayor que fecha hasta
    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      toast.error("La Fecha Desde no puede ser mayor que la Fecha Hasta");
      return;
    }

    setPage(1);
    setSelectedIds([]);
    setSearchParams({
      empresa: empresa !== "Todas" ? empresa : undefined,
      fechaDesde,
      fechaHasta,
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Mostrar mensaje inicial si no se ha buscado
  const showInitialMessage = !searchParams;

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
                {loadingEmpresas ? (
                  <Select.Item value="_loading" disabled>Cargando...</Select.Item>
                ) : (
                  empresas?.map((emp) => (
                    <Select.Item key={emp} value={emp}>{emp}</Select.Item>
                  ))
                )}
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text size="2" weight="medium" className="mb-1 block">
              Fecha Desde <Text color="red">*</Text>
            </Text>
            <TextField.Root
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              style={{ borderColor: !fechaDesde && searchParams === null ? undefined : undefined }}
            />
          </Box>
          <Box>
            <Text size="2" weight="medium" className="mb-1 block">
              Fecha Hasta <Text color="red">*</Text>
            </Text>
            <TextField.Root
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </Box>
          <Button onClick={handleBuscar} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </Button>
          <Button
            color="green"
            onClick={handleContabilizar}
            disabled={selectedIds.length === 0 || contabilizar.isPending}
          >
            {contabilizar.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Contabilizar ({selectedIds.length})
          </Button>
        </Flex>
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
                  disabled={enlaces.length === 0}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>FECHA CARGO</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ORDEN</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>OPERADOR</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>CLIENTE</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>SERVICIO</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>TIPO</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>COSTO</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>VENTA</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {showInitialMessage ? (
              <Table.Row>
                <Table.Cell colSpan={10}>
                  <Box className="p-8 text-center">
                    <Text size="2" style={{ color: "var(--gray-11)" }}>
                      Seleccione las fechas y haga clic en "Buscar" para ver los elementos pendientes de contabilizar
                    </Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : isLoading ? (
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
                      No se encontraron elementos pendientes de contabilizar
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
                    <Badge color="blue" variant="soft">EFO-{String(enlace.No_Enlace).padStart(4, '0')}</Badge>
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
                    <Text size="2">{enlace.Tipo_Cargo || enlace.Tipo || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" style={{ color: "var(--red-11)" }}>
                      {formatCurrency(enlace.Costo_Importe)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="bold" style={{ color: "var(--green-11)" }}>
                      {formatCurrency(enlace.Venta_Importe)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Paginacion */}
      <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            {totalCount} registros encontrados
          </Text>
          <Flex gap="2">
            <Button variant="soft" disabled={page === 1 || !searchParams} onClick={() => setPage(p => p - 1)}>
              Anterior
            </Button>
            <Button variant="soft" disabled={enlaces.length < 50 || !searchParams} onClick={() => setPage(p => p + 1)}>
              Siguiente
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
