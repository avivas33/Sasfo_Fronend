import { Box, Flex, Text, Badge, Separator, Card, Avatar } from "@radix-ui/themes";
import { User, Mail, Phone, Building, Shield, Calendar, AlertTriangle } from "lucide-react";
import { Usuario } from "@/types/usuario";

interface UsuarioDetailProps {
  usuario?: Usuario | null;
}

export function UsuarioDetail({ usuario }: UsuarioDetailProps) {
  if (!usuario) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un usuario para ver los detalles
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
            <Box className="relative">
              <Avatar
                size="5"
                fallback={usuario.NombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                color="cyan"
              />
              <Box
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: usuario.IsActive ? "var(--green-9)" : "var(--red-9)",
                  borderColor: "white"
                }}
              />
            </Box>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {usuario.NombreCompleto}
              </Text>
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                @{usuario.UserName}
              </Text>
            </Box>
          </Flex>
          <Badge color={usuario.IsActive ? "green" : "red"} variant="soft" size="2">
            {usuario.IsActive ? "Activo" : "Bloqueado"}
          </Badge>
        </Flex>
      </Box>

      {/* Details */}
      <Box className="p-6 space-y-6">
        {/* Información de Contacto */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Información de Contacto
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow icon={Mail} label="Correo electrónico" value={usuario.Email} />
              {!usuario.EmailConfirmed && (
                <Badge color="orange" variant="soft" size="1">
                  Sin confirmar
                </Badge>
              )}
              {usuario.PhoneNumber && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={Phone} label="Teléfono" value={usuario.PhoneNumber} />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Organización */}
        {usuario.OrganizationName && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Organización
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                <DetailRow icon={Building} label="Empresa" value={usuario.OrganizationName} />
              </Flex>
            </Card>
          </Box>
        )}

        {/* Roles */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Roles Asignados
          </Text>
          <Card>
            <Box className="p-4">
              {usuario.Roles.length > 0 ? (
                <Flex gap="2" wrap="wrap">
                  {usuario.Roles.map((role) => (
                    <Badge key={role} color="blue" variant="soft">
                      {role}
                    </Badge>
                  ))}
                </Flex>
              ) : (
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Sin roles asignados
                </Text>
              )}
            </Box>
          </Card>
        </Box>

        {/* Estado de Seguridad */}
        {(usuario.LockoutEnd || usuario.AccessFailedCount > 0) && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Estado de Seguridad
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {usuario.LockoutEnd && (
                  <Flex gap="3" align="start">
                    <Calendar className="w-4 h-4 mt-0.5" style={{ color: "var(--red-11)" }} />
                    <Box className="flex-1">
                      <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                        Bloqueado hasta
                      </Text>
                      <Text size="2" weight="medium" style={{ color: "var(--red-11)" }}>
                        {new Date(usuario.LockoutEnd).toLocaleString()}
                      </Text>
                    </Box>
                  </Flex>
                )}
                {usuario.LockoutEnd && usuario.AccessFailedCount > 0 && <Separator size="4" />}
                {usuario.AccessFailedCount > 0 && (
                  <Flex gap="3" align="start">
                    <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: "var(--orange-11)" }} />
                    <Box className="flex-1">
                      <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                        Intentos fallidos
                      </Text>
                      <Text size="2" weight="medium" style={{ color: "var(--orange-11)" }}>
                        {usuario.AccessFailedCount} intento(s)
                      </Text>
                    </Box>
                  </Flex>
                )}
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
                  Bloqueo habilitado
                </Text>
                <Badge color={usuario.LockoutEnabled ? "orange" : "gray"} variant="soft">
                  {usuario.LockoutEnabled ? "Sí" : "No"}
                </Badge>
              </Flex>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Email confirmado
                </Text>
                <Badge color={usuario.EmailConfirmed ? "green" : "orange"} variant="soft">
                  {usuario.EmailConfirmed ? "Sí" : "No"}
                </Badge>
              </Flex>
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
