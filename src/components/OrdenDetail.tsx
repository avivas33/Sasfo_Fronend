import { Box, Flex, Text, Badge, Separator, Button, Table } from "@radix-ui/themes";
import { X, MapPin, Building2, User, Network, DollarSign, Calendar, CheckCircle, XCircle, Loader2, Server, ArrowRight, FileText, Radio, Ruler } from "lucide-react";
import { OrdenServicio, OrdenStatusColors } from "@/types/ordenes";
import { useOrdenDetalle, useCancelarOrden, useCompletarOrden } from "@/hooks/useOrdenes";
import { toast } from "sonner";
import "@/styles/orden-detail.css";

interface OrdenDetailProps {
  orden?: OrdenServicio;
  onClose?: () => void;
}

export function OrdenDetail({ orden, onClose }: OrdenDetailProps) {
  const { data: detalle, isLoading } = useOrdenDetalle(orden?.id || null);
  const cancelarMutation = useCancelarOrden();
  const completarMutation = useCompletarOrden();

  if (!orden) {
    return (
      <Box className="orden-empty-state w-96">
        <Server size={48} strokeWidth={1} style={{ marginBottom: "1rem", opacity: 0.5 }} />
        <Text size="3" weight="medium">
          Seleccione una orden
        </Text>
        <Text size="2" style={{ marginTop: "0.5rem", opacity: 0.7 }}>
          Haga clic en una orden de la lista para ver sus detalles completos.
        </Text>
      </Box>
    );
  }

  const data = detalle || orden;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-PA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("es-PA", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getStatusBadge = (statusCode: number, status: string) => {
    const color = OrdenStatusColors[statusCode as keyof typeof OrdenStatusColors] || "gray";
    return (
      <Badge color={color} variant="surface" size="2" style={{ padding: "4px 8px" }}>
        {status}
      </Badge>
    );
  };

  const handleCancelar = async () => {
    if (!confirm(`¿Está seguro de cancelar la orden #${data.ID_OrdenServicio || data.id}?`)) return;

    try {
      await cancelarMutation.mutateAsync({ id: data.id, request: { Motivo: "Cancelada por usuario" } });
      toast.success("Orden cancelada exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al cancelar la orden");
    }
  };

  const handleCompletar = async () => {
    if (!confirm(`¿Está seguro de marcar como completada la orden #${data.ID_OrdenServicio || data.id}?`)) return;

    try {
      await completarMutation.mutateAsync(data.id);
      toast.success("Orden completada exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al completar la orden");
    }
  };

  return (
    <Box className="orden-detail-container">
      {/* Header */}
      <Box className="orden-detail-header">
        <Flex justify="between" align="center" mb="3">
          {getStatusBadge(data.StatusCode, data.Status)}
          <Flex align="center" gap="2">
            <Text size="4" weight="bold" style={{ color: "var(--gray-12)" }}>
              Orden #{data.id}
            </Text>
            {onClose && (
              <Button variant="ghost" size="1" onClick={onClose} style={{ color: "var(--gray-10)" }}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </Flex>
        </Flex>
        <Text size="3" weight="medium" style={{ color: "var(--gray-11)" }}>
          {data.TipoEnlace}
        </Text>
      </Box>

      {/* Content */}
      <Box className="orden-detail-content">
        {isLoading ? (
          <Flex align="center" justify="center" className="py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--blue-9)" }} />
          </Flex>
        ) : (
          <>
            {/* Información General */}
            <Box className="orden-detail-section">
              <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                Información General
              </Text>
              <Box className="orden-detail-card">
                <DetailRow
                  icon={Building2}
                  iconColor="blue"
                  label="Operador"
                  value={data.Operador}
                />
                <Separator size="4" />
                <DetailRow
                  icon={User}
                  iconColor="indigo"
                  label="Cliente Final"
                  value={data.Cliente_FinalA || data.Cliente_Final}
                />
                <Separator size="4" />
                <DetailRow
                  icon={FileText}
                  iconColor="cyan"
                  label="Tipo Enlace"
                  value={data.TipoEnlace}
                />
                {"TipoConexion" in data && (
                  <>
                    <Separator size="4" />
                    <DetailRow
                      icon={Network}
                      iconColor="teal"
                      label="Tipo Conexión"
                      value={data.TipoConexion}
                    />
                  </>
                )}
              </Box>
            </Box>

            {/* Ubicaciones */}
            {"AreaDesarrolloA" in data && (
              <Box className="orden-detail-section">
                <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                  Ubicaciones
                </Text>
                <Box className="orden-detail-card">
                  <Box className="p-2 bg-gray-2 border-b border-gray-4">
                    <Text size="1" weight="bold" align="center" display="block">PUNTO A (ORIGEN)</Text>
                  </Box>
                  <DetailRow icon={MapPin} iconColor="crimson" label="Área" value={data.AreaDesarrolloA} />
                  <DetailRow icon={MapPin} iconColor="crimson" label="Ubicación" value={data.UbicacionA} />
                  {data.ModuloA && <DetailRow icon={MapPin} iconColor="crimson" label="Módulo" value={data.ModuloA} />}

                  <Box className="p-2 bg-gray-2 border-y border-gray-4 mt-2">
                    <Text size="1" weight="bold" align="center" display="block">PUNTO Z (DESTINO)</Text>
                  </Box>
                  <DetailRow icon={MapPin} iconColor="violet" label="Área" value={data.AreaDesarrolloZ} />
                  <DetailRow icon={MapPin} iconColor="violet" label="Ubicación" value={data.UbicacionZ} />
                  {data.ModuloZ && <DetailRow icon={MapPin} iconColor="violet" label="Módulo" value={data.ModuloZ} />}
                </Box>
              </Box>
            )}

            {/* Tarifas */}
            <Box className="orden-detail-section">
              <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                Tarifas
              </Text>
              <Box className="orden-detail-card">
                <Flex>
                  <Box className="flex-1 p-3 border-r border-gray-4 text-center">
                    <Text size="1" color="gray">MRC</Text>
                    <Text size="4" weight="bold" color="green">{formatCurrency(data.MRC)}</Text>
                  </Box>
                  <Box className="flex-1 p-3 text-center">
                    <Text size="1" color="gray">NRC</Text>
                    <Text size="4" weight="bold" color="blue">{formatCurrency(data.NRC)}</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* Detalle de Interconexión */}
            {"ODFInterno1" in data && (
              <Box className="orden-detail-section">
                <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                  Detalle de Interconexión
                </Text>
                <Box className="orden-detail-card" style={{ padding: 0, overflow: "hidden" }}>
                  <table className="interconexion-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--gray-2)", color: "var(--gray-11)" }}>
                        <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--gray-4)", width: "30%" }}></th>
                        <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--gray-4)", width: "35%" }}>Primero</th>
                        <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--gray-4)", width: "35%" }}>Segundo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* CID */}
                      <tr>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", fontWeight: 500, color: "var(--gray-11)" }}>
                          <Flex align="center" gap="2">
                            <Server size={14} style={{ color: "var(--orange-9)" }} />
                            CID
                          </Flex>
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.CID_P1?.trim() || "-"}
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.CID_P2?.trim() || "-"}
                        </td>
                      </tr>
                      {/* ODF Crossconnect */}
                      <tr>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", fontWeight: 500, color: "var(--gray-11)" }}>
                          <Flex align="center" gap="2">
                            <Radio size={14} style={{ color: "var(--purple-9)" }} />
                            ODF Crossconnect
                          </Flex>
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.ODFInterno1?.trim()
                            ? `${data.ODFInterno1.trim()} ==> ${data.PuertoODF1 || 0}`
                            : "-"}
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.ODFInterno2?.trim()
                            ? `${data.ODFInterno2.trim()} ==> ${data.PuertoODF2 || 0}`
                            : "-"}
                        </td>
                      </tr>
                      {/* ODF */}
                      <tr>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", fontWeight: 500, color: "var(--gray-11)" }}>
                          <Flex align="center" gap="2">
                            <Network size={14} style={{ color: "var(--blue-9)" }} />
                            ODF
                          </Flex>
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.No_ODF?.trim()
                            ? `${data.No_ODF.trim()} ==> ${data.Puerto1 || 0}`
                            : "-"}
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.No_ODF2?.trim()
                            ? `${data.No_ODF2.trim()} ==> ${data.Puerto2 || 0}`
                            : "-"}
                        </td>
                      </tr>
                      {/* FTP */}
                      <tr>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", fontWeight: 500, color: "var(--gray-11)" }}>
                          <Flex align="center" gap="2">
                            <Server size={14} style={{ color: "var(--teal-9)" }} />
                            FTP
                          </Flex>
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.No_FTP?.trim()
                            ? `${data.No_FTP.trim()} ==> ${data.FTP_P1?.trim() || 0}`
                            : "-"}
                        </td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--gray-3)", color: "var(--gray-12)" }}>
                          {data.No_FTP2?.trim()
                            ? `${data.No_FTP2.trim()} ==> ${data.FTP_P2?.trim() || 0}`
                            : "-"}
                        </td>
                      </tr>
                      {/* Distancia */}
                      {"Distancia" in data && (
                        <tr>
                          <td style={{ padding: "8px 12px", fontWeight: 500, color: "var(--gray-11)" }}>
                            <Flex align="center" gap="2">
                              <Ruler size={14} style={{ color: "var(--gray-9)" }} />
                              Distancia (Mts)
                            </Flex>
                          </td>
                          <td style={{ padding: "8px 12px", color: "var(--gray-12)" }}>
                            {data.Distancia ? data.Distancia.toFixed(2) : "-"}
                          </td>
                          <td style={{ padding: "8px 12px", color: "var(--gray-12)" }}>
                            {data.Distancia ? data.Distancia.toFixed(2) : "-"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Box>
              </Box>
            )}

            {/* Fechas */}
            <Box className="orden-detail-section">
              <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                Fechas Importantes
              </Text>
              <Box className="orden-detail-card">
                <DetailRow icon={Calendar} iconColor="gray" label="Creación" value={formatDate(data.Fecha_Creacion)} />
                <Separator size="4" />
                <DetailRow icon={Calendar} iconColor="gray" label="Aprobación" value={formatDate(data.Fecha_Aprobacion)} />
                {data.StatusCode === 3 && (
                  <>
                    <Separator size="4" />
                    <DetailRow icon={CheckCircle} iconColor="green" label="Activación" value={formatDate(data.FechaActivacionEnlace)} />
                  </>
                )}
                {data.StatusCode === 4 && (
                  <>
                    <Separator size="4" />
                    <DetailRow icon={XCircle} iconColor="red" label="Cancelación" value={formatDate(data.FechaCancelacionEnlace)} />
                  </>
                )}
              </Box>
            </Box>

            {/* Observaciones */}
            {data.Observaciones && data.Observaciones.trim() !== " " && (
              <Box className="orden-detail-section">
                <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                  Observaciones
                </Text>
                <Box className="orden-detail-card p-3 bg-yellow-2">
                  <Text size="2" style={{ color: "var(--gray-11)", fontStyle: "italic" }}>
                    "{data.Observaciones}"
                  </Text>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Actions Footer */}
      {data.StatusCode === 2 && (
        <Flex className="orden-actions-footer" gap="3">
          <Button
            variant="solid"
            color="green"
            className="flex-1"
            onClick={handleCompletar}
            disabled={completarMutation.isPending}
            style={{ cursor: "pointer" }}
          >
            {completarMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Completar
          </Button>
          <Button
            variant="soft"
            color="red"
            className="flex-1"
            onClick={handleCancelar}
            disabled={cancelarMutation.isPending}
            style={{ cursor: "pointer" }}
          >
            {cancelarMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Cancelar
          </Button>
        </Flex>
      )}
    </Box>
  );
}

interface DetailRowProps {
  icon: React.ElementType;
  iconColor?: string;
  label: string;
  value: string | number | undefined | null;
}

function DetailRow({ icon: Icon, iconColor = "gray", label, value }: DetailRowProps) {
  const getColorStyle = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#e3f2fd",
      green: "#e8f5e9",
      red: "#ffebee",
      orange: "#fff3e0",
      purple: "#f3e5f5",
      indigo: "#e8eaf6",
      cyan: "#e0f7fa",
      teal: "#e0f2f1",
      gray: "#f5f5f5",
      crimson: "#fce4ec",
      violet: "#f3e5f5",
    };
    const textColors: Record<string, string> = {
      blue: "#1976d2",
      green: "#2e7d32",
      red: "#c62828",
      orange: "#ef6c00",
      purple: "#7b1fa2",
      indigo: "#283593",
      cyan: "#00838f",
      teal: "#00695c",
      gray: "#616161",
      crimson: "#c2185b",
      violet: "#7b1fa2",
    };
    return { bg: colors[color] || colors.gray, text: textColors[color] || textColors.gray };
  };

  const style = getColorStyle(iconColor);

  return (
    <div className="orden-detail-row">
      <div className="orden-detail-icon-box" style={{ backgroundColor: style.bg }}>
        <Icon size={16} color={style.text} />
      </div>
      <Box className="flex-1">
        <Text size="1" color="gray" className="block" style={{ marginBottom: "2px" }}>
          {label}
        </Text>
        <Text size="2" weight="medium" style={{ color: "var(--gray-12)", wordBreak: "break-word" }}>
          {value || "-"}
        </Text>
      </Box>
    </div>
  );
}
