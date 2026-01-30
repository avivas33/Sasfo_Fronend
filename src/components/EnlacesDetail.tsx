import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { Enlace } from "@/types/enlaces";

interface EnlacesDetailProps {
  enlace?: Enlace;
}

export function EnlacesDetail({ enlace }: EnlacesDetailProps) {
  if (!enlace) {
    return (
      <Box
        className="w-96 border-l"
        style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-1)" }}
      >
        <Box className="p-6 text-center">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Seleccione un enlace para ver sus detalles
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
                {enlace.Cliente || `Enlace #${enlace.ID_Enlace}`}
              </Text>
              <Badge color={enlace.Estado ? "green" : "red"} variant="soft">
                {enlace.Estado ? "Activo" : "Inactivo"}
              </Badge>
            </Flex>
            {enlace.Codigo_AFO && (
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Código AFO: {enlace.Codigo_AFO}
              </Text>
            )}
          </Box>

          <Separator size="4" />

          {/* Información del Enlace */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Información del Enlace
            </Text>
            <Flex direction="column" gap="3">
              {enlace.Carrier && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Carrier
                  </Text>
                  <Text size="2" weight="medium">
                    {enlace.Carrier}
                  </Text>
                </Flex>
              )}

              {enlace.Fecha_Activacion && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de Activación
                    </Text>
                  </Flex>
                  <Text size="2">{enlace.Fecha_Activacion}</Text>
                </Flex>
              )}

              {enlace.Tipo && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Tipo
                  </Text>
                  <Text size="2">{enlace.Tipo}</Text>
                </Flex>
              )}
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Sitios */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Sitios
            </Text>
            <Flex direction="column" gap="3">
              {enlace.SitioA && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <MapPin className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Sitio A
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">{enlace.SitioA}</Text>
                  {enlace.Area_DesarrolloA && (
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      {enlace.Area_DesarrolloA}
                    </Text>
                  )}
                </Flex>
              )}

              {enlace.SitioZ && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <MapPin className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Sitio Z
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">{enlace.SitioZ}</Text>
                  {enlace.Area_DesarrolloZ && (
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      {enlace.Area_DesarrolloZ}
                    </Text>
                  )}
                </Flex>
              )}
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Costos */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Costos
            </Text>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <DollarSign className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    MRC Venta
                  </Text>
                </Flex>
                <Text size="2" weight="medium">
                  ${enlace.MRC_Venta.toFixed(2)}
                </Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <DollarSign className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    MRC Costo
                  </Text>
                </Flex>
                <Text size="2" weight="medium">
                  ${enlace.MRC_Costo.toFixed(2)}
                </Text>
              </Flex>
            </Flex>
          </Box>

          {enlace.Ruta && (
            <>
              <Separator size="4" />
              <Box>
                <Text size="2" weight="medium" mb="2" style={{ display: "block" }}>
                  Ruta
                </Text>
                <Text size="2">{enlace.Ruta}</Text>
              </Box>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
