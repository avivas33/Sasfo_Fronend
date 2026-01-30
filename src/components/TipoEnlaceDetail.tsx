import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { Calendar, User, FileText } from "lucide-react";
import { TipoEnlace } from "@/types/tipoEnlace";

interface TipoEnlaceDetailProps {
  tipoEnlace?: TipoEnlace;
}

export function TipoEnlaceDetail({ tipoEnlace }: TipoEnlaceDetailProps) {
  if (!tipoEnlace) {
    return (
      <Box
        className="w-96 border-l"
        style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-1)" }}
      >
        <Box className="p-6 text-center">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Seleccione un tipo de conexión para ver sus detalles
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
                {tipoEnlace.Nombre}
              </Text>
              <Badge color={tipoEnlace.Estado ? "green" : "red"} variant="soft">
                {tipoEnlace.Estado ? "Activo" : "Inactivo"}
              </Badge>
            </Flex>
            {tipoEnlace.isDefault && (
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
                  {tipoEnlace.id}
                </Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" style={{ color: "var(--gray-11)" }}>
                  Nombre
                </Text>
                <Text size="2" weight="medium">
                  {tipoEnlace.Nombre}
                </Text>
              </Flex>

              {tipoEnlace.Descripción && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <FileText className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Descripción
                    </Text>
                  </Flex>
                  <Text size="2">{tipoEnlace.Descripción}</Text>
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
              {tipoEnlace.create_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Creado por
                    </Text>
                  </Flex>
                  <Text size="2">{tipoEnlace.create_uid}</Text>
                </Flex>
              )}

              {tipoEnlace.create_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de creación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(tipoEnlace.create_date).toLocaleString("es-ES")}
                  </Text>
                </Flex>
              )}

              {tipoEnlace.write_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Última modificación por
                    </Text>
                  </Flex>
                  <Text size="2">{tipoEnlace.write_uid}</Text>
                </Flex>
              )}

              {tipoEnlace.write_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de última modificación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(tipoEnlace.write_date).toLocaleString("es-ES")}
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
