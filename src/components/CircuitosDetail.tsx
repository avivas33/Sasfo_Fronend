import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { Calendar, User, MapPin, Hash } from "lucide-react";
import { Circuito } from "@/types/circuitos";

interface CircuitosDetailProps {
  circuito?: Circuito;
}

export function CircuitosDetail({ circuito }: CircuitosDetailProps) {
  if (!circuito) {
    return (
      <Box
        className="w-96 border-l"
        style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-1)" }}
      >
        <Box className="p-6 text-center">
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Seleccione un circuito para ver sus detalles
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
                {circuito.CircuitID || `Circuito #${circuito.ID_CircuitosSLPE}`}
              </Text>
              <Badge color={circuito.Estado ? "green" : "red"} variant="soft">
                {circuito.Estado ? "Activo" : "Inactivo"}
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
                <Flex align="center" gap="1">
                  <Hash className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    ID
                  </Text>
                </Flex>
                <Text size="2" weight="medium">
                  {circuito.ID_CircuitosSLPE}
                </Text>
              </Flex>

              {circuito.CircuitID && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Código Circuito
                  </Text>
                  <Text size="2" weight="medium">
                    {circuito.CircuitID}
                  </Text>
                </Flex>
              )}

              {circuito.ServiceLocation && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Código Poste
                  </Text>
                  <Text size="2">
                    {circuito.ServiceLocation}
                  </Text>
                </Flex>
              )}

              {circuito.Inquilino && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Inquilino
                  </Text>
                  <Text size="2">
                    {circuito.Inquilino}
                  </Text>
                </Flex>
              )}

              {circuito.VetroId && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Vetro ID
                  </Text>
                  <Text size="2">
                    {circuito.VetroId}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>

          <Separator size="4" />

          {/* Ubicación */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Ubicación
            </Text>
            <Flex direction="column" gap="3">
              {circuito.AreaDesarrollo && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Área de Desarrollo
                  </Text>
                  <Text size="2" weight="medium">
                    {circuito.AreaDesarrollo}
                  </Text>
                </Flex>
              )}

              {circuito.ListaUbicacion && (
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "var(--gray-11)" }}>
                    Ubicación
                  </Text>
                  <Text size="2" weight="medium">
                    {circuito.ListaUbicacion}
                  </Text>
                </Flex>
              )}

              {(circuito.Coordenadas1 || circuito.Coordenadas2) && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <MapPin className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Coordenadas
                    </Text>
                  </Flex>
                  <Text size="2">
                    {circuito.Coordenadas1 && `Lat: ${circuito.Coordenadas1}`}
                    {circuito.Coordenadas1 && circuito.Coordenadas2 && " | "}
                    {circuito.Coordenadas2 && `Lng: ${circuito.Coordenadas2}`}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>

          <Separator size="4" />

          {/* IDs Técnicos */}
          <Box>
            <Text size="2" weight="medium" mb="3" style={{ display: "block" }}>
              Información Técnica
            </Text>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Text size="1" style={{ color: "var(--gray-11)" }}>
                  ID Circuito Vetro
                </Text>
                <Text size="2">
                  {circuito.Circuiot_ID}
                </Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text size="1" style={{ color: "var(--gray-11)" }}>
                  ID Service Location
                </Text>
                <Text size="2">
                  {circuito.ID_ServiceLocation}
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
              {circuito.create_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Creado por
                    </Text>
                  </Flex>
                  <Text size="2">{circuito.create_uid}</Text>
                </Flex>
              )}

              {circuito.create_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de creación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(circuito.create_date).toLocaleString("es-ES")}
                  </Text>
                </Flex>
              )}

              {circuito.write_uid && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <User className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Última modificación por
                    </Text>
                  </Flex>
                  <Text size="2">{circuito.write_uid}</Text>
                </Flex>
              )}

              {circuito.write_date && (
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <Calendar className="w-3 h-3" style={{ color: "var(--gray-11)" }} />
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Fecha de última modificación
                    </Text>
                  </Flex>
                  <Text size="2">
                    {new Date(circuito.write_date).toLocaleString("es-ES")}
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
