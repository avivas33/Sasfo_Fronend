import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { FileText, MapPin, Building2, Calendar, DollarSign, User, Navigation, ArrowRight } from "lucide-react";
import { Viabilidad } from "@/types/viabilidad";
import "@/styles/viabilidad-detail.css";

interface ViabilidadDetailProps {
  viabilidad?: Viabilidad;
}

export function ViabilidadDetail({ viabilidad }: ViabilidadDetailProps) {
  if (!viabilidad) {
    return (
      <Box className="empty-state w-96">
        <FileText size={48} strokeWidth={1} style={{ marginBottom: "1rem", opacity: 0.5 }} />
        <Text size="3" weight="medium">
          Seleccione una viabilidad
        </Text>
        <Text size="2" style={{ marginTop: "0.5rem", opacity: 0.7 }}>
          Haga clic en un elemento de la lista para ver sus detalles completos.
        </Text>
      </Box>
    );
  }

  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date | string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoConfig = (procesoId: number) => {
    switch (procesoId) {
      case 1: return { color: "orange", label: "Pendiente" };
      case 2: return { color: "green", label: "Aprobada" };
      case 3: return { color: "red", label: "Rechazada" };
      case 4: return { color: "blue", label: "En Proceso" };
      case 5: return { color: "green", label: "Completada" };
      default: return { color: "gray", label: "Desconocido" };
    }
  };

  const estado = getEstadoConfig(viabilidad.ID_ProcesoViabilidad);

  return (
    <Box className="viabilidad-detail-container w-96">
      {/* Header */}
      <Box className="detail-header">
        <Flex justify="between" align="center" mb="2">
          <Badge size="2" color={estado.color as any} variant="surface" style={{ padding: "6px 12px" }}>
            {estado.label}
          </Badge>
          <Text size="2" color="gray">
            #{viabilidad.id}
          </Text>
        </Flex>
        <Text size="3" weight="medium" style={{ color: "var(--gray-11)" }}>
          {viabilidad.TipoEnlaceNombre}
        </Text>
      </Box>

      {/* Content */}
      <Box className="detail-content">

        {/* Información General */}
        <Box className="detail-section">
          <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
            Información General
          </Text>
          <Box className="detail-card">
            <DetailRow
              icon={Building2}
              iconColor="blue"
              label="Empresa / Carrier"
              value={viabilidad.EmpresaNombre}
            />
            <Separator size="4" />
            <DetailRow
              icon={User}
              iconColor="indigo"
              label="Cliente Final"
              value={viabilidad.Cliente_FinalA}
            />
          </Box>
        </Box>

        {/* Ruta */}
        <Box className="detail-section">
          <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
            Ruta y Conexión
          </Text>
          <Box className="detail-card">
            <Box className="p-3 bg-gray-2 border-b border-gray-4">
              <Flex align="center" gap="2" justify="center">
                <Badge color="gray" variant="soft">{viabilidad.UbicacionANombre}</Badge>
                <ArrowRight size={14} color="var(--gray-9)" />
                <Badge color="gray" variant="soft">{viabilidad.UbicacionZNombre}</Badge>
              </Flex>
            </Box>
            <DetailRow
              icon={Navigation}
              iconColor="orange"
              label="Ruta"
              value={viabilidad.RutaNombre}
            />
            <Separator size="4" />
            <DetailRow
              icon={FileText}
              iconColor="cyan"
              label="Tipo Conexión"
              value={viabilidad.TipoConexionNombre}
            />
            {viabilidad.Distancia > 0 && (
              <>
                <Separator size="4" />
                <DetailRow
                  icon={Navigation}
                  iconColor="teal"
                  label="Distancia"
                  value={`${viabilidad.Distancia} km`}
                />
              </>
            )}
          </Box>
        </Box>

        {/* Puntos Detallados */}
        <Box className="detail-section">
          <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
            Detalle de Puntos
          </Text>
          <Box className="detail-card">
            <Box className="p-2 bg-gray-2 border-b border-gray-4">
              <Text size="1" weight="bold" align="center" display="block">PUNTO A (ORIGEN)</Text>
            </Box>
            <DetailRow icon={MapPin} iconColor="crimson" label="Ubicación" value={viabilidad.UbicacionANombre} />
            <DetailRow icon={MapPin} iconColor="crimson" label="Módulo" value={viabilidad.ModuloANombre} />
            <DetailRow icon={Navigation} iconColor="crimson" label="Coordenadas" value={viabilidad.CoordenadasA} />

            <Box className="p-2 bg-gray-2 border-y border-gray-4 mt-2">
              <Text size="1" weight="bold" align="center" display="block">PUNTO Z (DESTINO)</Text>
            </Box>
            <DetailRow icon={MapPin} iconColor="violet" label="Ubicación" value={viabilidad.UbicacionZNombre} />
            <DetailRow icon={MapPin} iconColor="violet" label="Módulo" value={viabilidad.ModuloZNombre} />
            <DetailRow icon={Navigation} iconColor="violet" label="Coordenadas" value={viabilidad.Coordenadas} />
          </Box>
        </Box>

        {/* Costos */}
        {(viabilidad.MRC > 0 || viabilidad.NRC > 0) && (
          <Box className="detail-section">
            <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
              Costos Estimados
            </Text>
            <Box className="detail-card">
              <Flex>
                {viabilidad.MRC > 0 && (
                  <Box className="flex-1 p-3 border-r border-gray-4 text-center">
                    <Text size="1" color="gray">MRC</Text>
                    <Text size="4" weight="bold" color="green">${viabilidad.MRC.toFixed(2)}</Text>
                  </Box>
                )}
                {viabilidad.NRC > 0 && (
                  <Box className="flex-1 p-3 text-center">
                    <Text size="1" color="gray">NRC</Text>
                    <Text size="4" weight="bold" color="blue">${viabilidad.NRC.toFixed(2)}</Text>
                  </Box>
                )}
              </Flex>
            </Box>
          </Box>
        )}

        {/* Fechas y Auditoría */}
        <Box className="detail-section">
          <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
            Auditoría
          </Text>
          <Box className="detail-card">
            <DetailRow icon={Calendar} iconColor="gray" label="Creado" value={`${formatDate(viabilidad.Fecha_Creacion)}`} />
            {viabilidad.create_uid && (
              <DetailRow icon={User} iconColor="gray" label="Por" value={viabilidad.create_uid} />
            )}
            <Separator size="4" />
            <DetailRow icon={Calendar} iconColor="gray" label="Vence" value={formatDate(viabilidad.Fecha_Vencimiento)} />
          </Box>
        </Box>

        {/* Observaciones */}
        {viabilidad.Observaciones && (
          <Box className="detail-section">
            <Text size="2" weight="bold" mb="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
              Observaciones
            </Text>
            <Box className="detail-card p-3 bg-yellow-2">
              <Text size="2" style={{ color: "var(--gray-11)", fontStyle: "italic" }}>
                "{viabilidad.Observaciones}"
              </Text>
            </Box>
          </Box>
        )}

      </Box>
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
    <div className="detail-row">
      <div className="detail-icon-box" style={{ backgroundColor: style.bg }}>
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
