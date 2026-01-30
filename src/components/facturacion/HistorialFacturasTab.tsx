import { useState, useRef } from "react";
import { Box, Button, Flex, Text, Table, TextField, Select, Badge, IconButton, Dialog, DropdownMenu } from "@radix-ui/themes";
import { Search, Loader2, Eye, FileText, Trash2, X, Printer, RotateCcw } from "lucide-react";
import { useHistorialFacturas, useAnularFactura, useEmpresasFacturacion, useFacturaDetalle } from "@/hooks/useFacturacion";
import { facturacionService } from "@/services/facturacion.service";
import { FacturaDetalle } from "@/types/facturacion";
import { toast } from "sonner";

export function HistorialFacturasTab() {
  const [empresa, setEmpresa] = useState<string>("Todas");
  const [fechaDesde, setFechaDesde] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-01-01`;
  });
  const [fechaHasta, setFechaHasta] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [page, setPage] = useState(1);
  const [selectedFactura, setSelectedFactura] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reimpresionData, setReimpresionData] = useState<FacturaDetalle | null>(null);
  const [loadingReimpresion, setLoadingReimpresion] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: empresas } = useEmpresasFacturacion();
  const { data: facturaDetalle, isLoading: loadingDetalle } = useFacturaDetalle(selectedFactura);

  // Usar reimpresionData si está disponible, sino facturaDetalle
  const displayData = reimpresionData || facturaDetalle;
  const isLoadingDialog = loadingReimpresion || loadingDetalle;
  const { data, isLoading, refetch } = useHistorialFacturas({
    empresa: empresa !== "Todas" ? empresa : undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
    page,
    pageSize: 50,
  });

  const anularFactura = useAnularFactura();

  const facturas = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleBuscar = () => {
    setPage(1);
    refetch();
  };

  const handleAnular = async (noFactura: number) => {
    if (!confirm(`¿Está seguro de anular la factura #${noFactura}?`)) {
      return;
    }

    try {
      const result = await anularFactura.mutateAsync(noFactura);
      toast.success(result.message);
      refetch();
    } catch (error) {
      toast.error("Error al anular factura");
    }
  };

  const handleVerFactura = (noFactura: number) => {
    setReimpresionData(null); // Limpiar datos de reimpresión
    setSelectedFactura(noFactura);
    setDialogOpen(true);
  };

  const handleReimpresionAFO = async (noFactura: number) => {
    setLoadingReimpresion(true);
    setSelectedFactura(noFactura);
    setDialogOpen(true);
    try {
      const data = await facturacionService.reimpresionAFO(noFactura);
      setReimpresionData(data);
    } catch (error) {
      toast.error("Error al obtener reimpresión con AFO");
    } finally {
      setLoadingReimpresion(false);
    }
  };

  const handleReimpresionSinAFO = async (noFactura: number) => {
    setLoadingReimpresion(true);
    setSelectedFactura(noFactura);
    setDialogOpen(true);
    try {
      const data = await facturacionService.reimpresion(noFactura);
      setReimpresionData(data);
    } catch (error) {
      toast.error("Error al obtener reimpresión");
    } finally {
      setLoadingReimpresion(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Factura #${selectedFactura}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                .header h1 { margin: 0; color: #333; }
                .header p { margin: 5px 0; color: #666; }
                .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .info-box { width: 48%; }
                .info-box h3 { background: #f0f0f0; padding: 8px; margin: 0 0 10px 0; font-size: 14px; }
                .info-row { display: flex; padding: 4px 0; border-bottom: 1px solid #eee; }
                .info-label { font-weight: bold; width: 120px; font-size: 12px; }
                .info-value { flex: 1; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #333; color: white; padding: 10px; text-align: left; font-size: 12px; }
                td { padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 11px; }
                tr:nth-child(even) { background: #f9f9f9; }
                .total-section { margin-top: 20px; text-align: right; }
                .total-row { display: flex; justify-content: flex-end; padding: 5px 0; }
                .total-label { font-weight: bold; margin-right: 20px; }
                .total-value { min-width: 100px; text-align: right; }
                .grand-total { font-size: 18px; background: #4cb74a; color: white; padding: 10px; }
                @media print { body { padding: 0; } }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
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
        </Flex>
      </Box>

      {/* Tabla */}
      <Box className="flex-1 overflow-auto">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
              <Table.ColumnHeaderCell>NO. FACTURA</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>CLIENTE</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>RUC</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>FECHA</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>TOTAL</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Flex align="center" justify="center" className="p-8">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : facturas.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Box className="p-8 text-center">
                    <Text size="2" style={{ color: "var(--gray-11)" }}>
                      No se encontraron facturas
                    </Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : (
              facturas.map((factura) => (
                <Table.Row key={factura.Id}>
                  <Table.Cell>
                    <Badge color="green" variant="soft" size="2">
                      #{factura.No_Factura}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="medium">{factura.Nombre_cliente || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{factura.RUC_Cliente || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{formatDate(factura.Fecha_Factura)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="bold" style={{ color: "var(--green-11)" }}>
                      {formatCurrency(factura.Total)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="1">
                      <IconButton
                        variant="ghost"
                        size="1"
                        onClick={() => handleVerFactura(factura.No_Factura)}
                        title="Ver Factura"
                      >
                        <Eye className="w-4 h-4" />
                      </IconButton>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <IconButton variant="ghost" size="1" title="Reimprimir">
                            <RotateCcw className="w-4 h-4" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item onClick={() => handleReimpresionAFO(factura.No_Factura)}>
                            Reimpresión con AFO
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onClick={() => handleReimpresionSinAFO(factura.No_Factura)}>
                            Reimpresión sin AFO
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                      <IconButton
                        variant="ghost"
                        size="1"
                        color="red"
                        onClick={() => handleAnular(factura.No_Factura)}
                        title="Anular"
                        disabled={anularFactura.isPending}
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
      </Box>

      {/* Paginación */}
      <Box className="border-t p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            {totalCount} facturas encontradas
          </Text>
          <Flex gap="2">
            <Button variant="soft" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Anterior
            </Button>
            <Button variant="soft" disabled={facturas.length < 50} onClick={() => setPage(p => p + 1)}>
              Siguiente
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Dialog Ver Factura */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content style={{ maxWidth: 800 }}>
          <Dialog.Title>
            <Flex justify="between" align="center">
              <Text>Factura #{selectedFactura}</Text>
              <Flex gap="2">
                <Button variant="soft" size="1" onClick={handlePrint}>
                  <Printer className="w-4 h-4" />
                  Imprimir
                </Button>
                <Dialog.Close>
                  <IconButton variant="ghost" size="1">
                    <X className="w-4 h-4" />
                  </IconButton>
                </Dialog.Close>
              </Flex>
            </Flex>
          </Dialog.Title>

          {isLoadingDialog ? (
            <Flex align="center" justify="center" className="p-8">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
            </Flex>
          ) : displayData ? (
            <div ref={printRef}>
              {/* Header */}
              <div className="header" style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: "15px", marginBottom: "20px" }}>
                <h1 style={{ margin: 0, fontSize: "24px", color: "#333" }}>ANEXO DE FACTURA</h1>
                {displayData.EsReimpresion && (
                  <p style={{ margin: "5px 0", color: "#c00", fontWeight: "bold", fontSize: "16px" }}>*** REIMPRESIÓN ***</p>
                )}
                <p style={{ margin: "5px 0", color: "#666" }}>No. {displayData.No_Factura}</p>
                <p style={{ margin: "5px 0", color: "#666" }}>Fecha: {formatDate(displayData.Fecha_Factura)}</p>
              </div>

              {/* Información del Operador */}
              <div className="info-section" style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div className="info-box" style={{ flex: 1, border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
                  <h3 style={{ background: "#f0f0f0", padding: "8px 12px", margin: 0, fontSize: "14px", fontWeight: "bold" }}>
                    Información del Operador
                  </h3>
                  <div style={{ padding: "12px" }}>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>Operador:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.Nombre_cliente || "-"}</span>
                    </div>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>RUC:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.RUC_Cliente || "-"}</span>
                    </div>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>Dirección:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.Direccion || "-"}</span>
                    </div>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>Corregimiento:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.Corregimiento || "-"}</span>
                    </div>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>Distrito:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.Distrito || "-"}</span>
                    </div>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>Provincia:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.Provincia || "-"}</span>
                    </div>
                    <div className="info-row" style={{ display: "flex", padding: "4px 0" }}>
                      <span className="info-label" style={{ fontWeight: "bold", width: "100px", fontSize: "12px" }}>País:</span>
                      <span className="info-value" style={{ flex: 1, fontSize: "12px" }}>{displayData.Pais || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de Detalle */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th style={{ background: "#333", color: "white", padding: "10px", textAlign: "left", fontSize: "12px" }}>No. ORDEN</th>
                    <th style={{ background: "#333", color: "white", padding: "10px", textAlign: "left", fontSize: "12px" }}>CLIENTE</th>
                    <th style={{ background: "#333", color: "white", padding: "10px", textAlign: "left", fontSize: "12px" }}>SERVICIO</th>
                    <th style={{ background: "#333", color: "white", padding: "10px", textAlign: "left", fontSize: "12px" }}>TIPO</th>
                    <th style={{ background: "#333", color: "white", padding: "10px", textAlign: "right", fontSize: "12px" }}>MRC VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.Detalles.map((detalle, index) => (
                    <tr key={detalle.Id} style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd", fontSize: "11px" }}>
                        {detalle.No_Orden || "-"}
                      </td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd", fontSize: "11px" }}>
                        {detalle.Cliente || "-"}
                      </td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd", fontSize: "11px" }}>
                        {detalle.Servicio || "-"}
                      </td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd", fontSize: "11px" }}>
                        {detalle.Tipo_Cargo || detalle.Tipo || "-"}
                      </td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd", fontSize: "11px", textAlign: "right" }}>
                        {formatCurrency(detalle.MRC_Venta)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="total-section" style={{ marginTop: "20px", textAlign: "right" }}>
                <div className="grand-total" style={{ fontSize: "18px", background: "#4cb74a", color: "white", padding: "10px", display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ marginRight: "20px" }}>TOTAL:</span>
                  <span style={{ minWidth: "100px", textAlign: "right", fontWeight: "bold" }}>{formatCurrency(displayData.Total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <Text size="2" style={{ color: "var(--gray-11)" }}>
              No se pudo cargar la factura
            </Text>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
