import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Shield, Users, Info } from "lucide-react";
import { Rol } from "@/types/rol";

interface RolDetailProps {
  rol?: Rol | null;
}

export function RolDetail({ rol }: RolDetailProps) {
  if (!rol) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un rol para ver los detalles
        </Text>
      </Box>
    );
  }

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
              style={{ backgroundColor: "var(--purple-3)" }}
            >
              <Shield className="w-6 h-6" style={{ color: "var(--purple-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Flex align="center" gap="2">
                <Text size="4" weight="bold" className="block">
                  {rol.Name}
                </Text>
                {rol.Name === "Admin" && (
                  <Badge color="purple" variant="soft" size="1">
                    Sistema
                  </Badge>
                )}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Details */}
      <Box className="p-6 space-y-6">
        {/* Información General */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Información General
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <Flex gap="3" align="start">
                <Users className="w-4 h-4 mt-0.5" style={{ color: "var(--gray-11)" }} />
                <Box className="flex-1">
                  <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                    Usuarios asignados
                  </Text>
                  <Badge color="blue" variant="soft" size="2" className="mt-1">
                    {rol.UserCount} {rol.UserCount === 1 ? 'usuario' : 'usuarios'}
                  </Badge>
                </Box>
              </Flex>
            </Flex>
          </Card>
        </Box>

        {/* Notas */}
        {rol.Name === "Admin" && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Notas
            </Text>
            <Card>
              <Flex gap="3" className="p-4">
                <Info className="w-4 h-4 mt-0.5" style={{ color: "var(--purple-11)" }} />
                <Text size="2" style={{ color: "var(--purple-11)" }}>
                  Este es un rol de sistema con acceso completo a todas las funcionalidades.
                </Text>
              </Flex>
            </Card>
          </Box>
        )}

        {rol.UserCount > 0 && rol.Name !== "Admin" && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Advertencia
            </Text>
            <Card>
              <Flex gap="3" className="p-4">
                <Info className="w-4 h-4 mt-0.5" style={{ color: "var(--orange-11)" }} />
                <Text size="2" style={{ color: "var(--orange-11)" }}>
                  No se puede eliminar este rol mientras tenga usuarios asignados.
                </Text>
              </Flex>
            </Card>
          </Box>
        )}

        {/* Configuración */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Configuración
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Editable
                </Text>
                <Badge color={rol.Name !== "Admin" ? "green" : "gray"} variant="soft">
                  {rol.Name !== "Admin" ? "Sí" : "No"}
                </Badge>
              </Flex>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Eliminable
                </Text>
                <Badge color={rol.Name !== "Admin" && rol.UserCount === 0 ? "green" : "gray"} variant="soft">
                  {rol.Name !== "Admin" && rol.UserCount === 0 ? "Sí" : "No"}
                </Badge>
              </Flex>
            </Flex>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
