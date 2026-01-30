import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Network, FileText, Calendar, MapPin, Hash, MessageSquare } from "lucide-react";
import { P2P, EstadoP2P, EstadoP2PLabels, EstadoP2PColors } from "@/types/p2p";

interface P2PDetailProps {
  p2p?: P2P;
}

export function P2PDetail({ p2p }: P2PDetailProps) {
  if (!p2p) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione una orden P2P para ver los detalles
        </Text>
      </Box>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box className="w-96 bg-white border-l overflow-auto" style={{ borderColor: "var(--gray-6)" }}>
      {/* Header */}
      <Box className="p-6 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <Flex direction="column" gap="3">
          <Flex align="center" gap="3">
            <Flex
              align="center"
              justify="center"
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: "var(--green-3)" }}
            >
              <Network className="w-6 h-6" style={{ color: "var(--green-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                P2P #{p2p.ID_P2P}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge
                  color={EstadoP2PColors[p2p.Estado as EstadoP2P] || "gray"}
                  variant="soft"
                >
                  {EstadoP2PLabels[p2p.Estado as EstadoP2P] || "Desconocido"}
                </Badge>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Details */}
      <Box className="p-6 space-y-6">
        {/* Punto 1 */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Punto 1
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow icon={FileText} label="Nombre" value={p2p.NombrePto1} />
              <Separator size="4" />
              <DetailRow icon={Hash} label="ID Punto" value={p2p.Punto1.toString()} />
              {p2p.Orden1 !== undefined && p2p.Orden1 !== 0 && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={FileText} label="Orden Servicio" value={p2p.Orden1.toString()} />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Punto 2 */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Punto 2
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow icon={FileText} label="Nombre" value={p2p.NombrePto2} />
              <Separator size="4" />
              <DetailRow icon={Hash} label="ID Punto" value={p2p.Punto2.toString()} />
              {p2p.Orden2 !== undefined && p2p.Orden2 !== 0 && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={FileText} label="Orden Servicio" value={p2p.Orden2.toString()} />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Estado y Tipo */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Estado
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Estado
                </Text>
                <Badge
                  color={EstadoP2PColors[p2p.Estado as EstadoP2P] || "gray"}
                  variant="soft"
                >
                  {EstadoP2PLabels[p2p.Estado as EstadoP2P] || "Desconocido"}
                </Badge>
              </Flex>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Tipo P2P
                </Text>
                <Badge color={p2p.TipoP2P === 0 ? "blue" : "amber"} variant="soft">
                  {p2p.TipoP2P === 0 ? "P2P" : "Postes/Cámaras"}
                </Badge>
              </Flex>
            </Flex>
          </Card>
        </Box>

        {/* Observaciones */}
        {p2p.Observaciones && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Observaciones
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                <Flex gap="3" align="start">
                  <MessageSquare className="w-4 h-4 mt-0.5" style={{ color: "var(--gray-11)" }} />
                  <Text size="2">{p2p.Observaciones}</Text>
                </Flex>
              </Flex>
            </Card>
          </Box>
        )}

        {/* Información de Auditoría */}
        <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
          <Text size="2" weight="bold" className="block mb-3">
            Información de Auditoría
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={Calendar}
                label="Fecha de creación"
                value={formatDate(p2p.create_date)}
              />
            </Flex>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <Flex gap="3" align="start">
      <Icon className="w-4 h-4 mt-0.5" style={{ color: "var(--gray-11)" }} />
      <Box className="flex-1">
        <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
          {label}
        </Text>
        <Text size="2" weight="medium">
          {value}
        </Text>
      </Box>
    </Flex>
  );
}
