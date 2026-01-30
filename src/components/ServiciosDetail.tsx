import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { Calendar, User, DollarSign, Hash } from "lucide-react";
import { Servicios } from "@/types/servicios";

interface ServiciosDetailProps {
  servicios?: Servicios;
}

export function ServiciosDetail({ servicios }: ServiciosDetailProps) {
  if (!servicios) {
    return (
      <Box
        className="w-96 border-l"
        style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-1)" }}
      >
        <Box className="p-6 text-center">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Seleccione un servicio AFO para ver sus detalles
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
                {servicios.Codigo || `Servicio #${servicios.id}`}
              </Text>
              <Badge color={servicios.Estado ? "green" : "red"} variant="soft">
                {servicios.Estado ? "Activo" : "Inactivo"}
              </Badge>
            </Flex>
            {servicios.isDefault && (
              <Badge color="blue" variant="soft" size="1">
                Por Defecto
              </Badge>
            )}
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
                  {servicios.id}
                </Text>
              </Flex>

              {servicios.Codigo && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Código
                  </Text>
                  <Text size="2" weight="medium">
                    {servicios.Codigo}
                  </Text>
                </Flex>
              )}

              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <Hash className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Rango
                  </Text>
                </Flex>
                <Text size="2">
                  Desde: <Text weight="medium">{servicios.Desde}</Text> - Hasta: <Text weight="medium">{servicios.Hasta}</Text>
                </Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Flex align="center" gap="1">
                  <DollarSign className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Precio
                  </Text>
                </Flex>
                <Text size="2" weight="medium">
                  ${servicios.Precio.toFixed(2)}
                </Text>
              </Flex>

              {servicios.Unidad_Medida && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Unidad de Medida
                  </Text>
                  <Text size="2">
                    {servicios.Unidad_Medida}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Auditoría */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Auditoría
            </Text>
            <Flex direction="column" gap="3">
              {servicios.create_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Creado por
                    </Text>
                  </Flex>
                  <Text size="2">{servicios.create_uid}</Text>
                </Flex>
              )}

              {servicios.create_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de creación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(servicios.create_date).toLocaleString("es-ES")}
                  </Text>
                </Flex>
              )}

              {servicios.write_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Última modificación por
                    </Text>
                  </Flex>
                  <Text size="2">{servicios.write_uid}</Text>
                </Flex>
              )}

              {servicios.write_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de última modificación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(servicios.write_date).toLocaleString("es-ES")}
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
