import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { Calendar, User, DollarSign, FileText } from "lucide-react";
import { OtroServicio } from "@/types/otrosServicios";

interface OtrosServiciosDetailProps {
  otroServicio?: OtroServicio;
}

export function OtrosServiciosDetail({ otroServicio }: OtrosServiciosDetailProps) {
  if (!otroServicio) {
    return (
      <Box
        className="w-96 border-l"
        style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-1)" }}
      >
        <Box className="p-6 text-center">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Seleccione un servicio para ver sus detalles
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="w-96 border-l overflow-auto"
      style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-1)" }}
    >
      <Box className="p-6">
        <Flex direction="column" gap="4">
          {/* Header */}
          <Box>
            <Flex align="center" justify="between" mb="2">
              <Text size="5" weight="bold">
                {otroServicio.Nombre}
              </Text>
              <Badge color={otroServicio.Estado ? "green" : "red"} variant="soft">
                {otroServicio.Estado ? "Activo" : "Inactivo"}
              </Badge>
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Información General */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Información General
            </Text>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Text size="1" style={{ color: "var(--gray-11)" }}>
                  ID
                </Text>
                <Text size="2" weight="medium">
                  {otroServicio.id}
                </Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" style={{ color: "var(--gray-11)" }}>
                  Nombre
                </Text>
                <Text size="2" weight="medium">
                  {otroServicio.Nombre}
                </Text>
              </Flex>

              {otroServicio.Observaciones && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <FileText className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Observaciones
                    </Text>
                  </Flex>
                  <Text size="2">{otroServicio.Observaciones}</Text>
                </Flex>
              )}
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Tarifas */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Tarifas
            </Text>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <DollarSign className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    MRC (Monthly Recurring Charge)
                  </Text>
                </Flex>
                <Text size="2" weight="medium">
                  ${otroServicio.MRC.toFixed(2)}
                </Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <DollarSign className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    NRC (Non-Recurring Charge)
                  </Text>
                </Flex>
                <Text size="2" weight="medium">
                  ${otroServicio.NRC.toFixed(2)}
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Auditoría */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Auditoría
            </Text>
            <Flex direction="column" gap="3">
              {otroServicio.create_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Creado por
                    </Text>
                  </Flex>
                  <Text size="2">{otroServicio.create_uid}</Text>
                </Flex>
              )}

              {otroServicio.create_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de creación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(otroServicio.create_date).toLocaleString("es-ES")}
                  </Text>
                </Flex>
              )}

              {otroServicio.write_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Última modificación por
                    </Text>
                  </Flex>
                  <Text size="2">{otroServicio.write_uid}</Text>
                </Flex>
              )}

              {otroServicio.write_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de última modificación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(otroServicio.write_date).toLocaleString("es-ES")}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
