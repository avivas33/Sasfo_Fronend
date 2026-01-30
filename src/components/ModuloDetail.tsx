import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Box as BoxIcon, MapPin, Building2, Calendar, User, Network } from "lucide-react";
import { Modulo } from "@/types/modulo";

interface ModuloDetailProps {
  modulo?: Modulo;
}

export function ModuloDetail({ modulo }: ModuloDetailProps) {
  if (!modulo) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un módulo para ver los detalles
        </Text>
      </Box>
    );
  }

  const formatDate = (date: Date) => {
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
              style={{ backgroundColor: "var(--cyan-3)" }}
            >
              <BoxIcon className="w-6 h-6" style={{ color: "var(--cyan-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {modulo.modulo}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={modulo.Estado ? "green" : "red"} variant="soft">
                  {modulo.Estado ? "Activo" : "Inactivo"}
                </Badge>
                {modulo.isDefault && (
                  <Badge color="blue" variant="soft">
                    Por Defecto
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
              <DetailRow icon={BoxIcon} label="Código" value={modulo.modulo} />
              {modulo.Inquilino && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={User} label="Inquilino" value={modulo.Inquilino} />
                </>
              )}
              {modulo.Service_Location && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={MapPin} label="Service Location" value={modulo.Service_Location} />
                </>
              )}
              {modulo.Coordenadas && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={MapPin} label="Coordenadas" value={modulo.Coordenadas} />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Ubicación y Área */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Ubicación y Área
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={MapPin}
                label="Ubicación"
                value={modulo.Nombre_Ubicacion || modulo.UbicacionNombre || "No asignada"}
              />
              <Separator size="4" />
              <DetailRow
                icon={Building2}
                label="Área de Desarrollo"
                value={modulo.AreaDesarrolloNombre || "No asignada"}
              />
              <Separator size="4" />
              <DetailRow
                icon={MapPin}
                label="Lista de Ubicaciones"
                value={modulo.ListaUbicacionesNombre || "No asignada"}
              />
            </Flex>
          </Card>
        </Box>

        {/* Compañía de Enlace */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Compañía de Enlace
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={Network}
                label="CO (Compañía de Enlace)"
                value={modulo.CONombre || "No asignada"}
              />
            </Flex>
          </Card>
        </Box>

        {/* Metadata */}
        {(modulo.create_uid || modulo.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {modulo.create_uid && modulo.create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={modulo.create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDate(modulo.create_date)}
                    />
                  </>
                )}
                {modulo.write_uid && modulo.write_date && (
                  <>
                    {modulo.create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={modulo.write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDate(modulo.write_date)}
                    />
                  </>
                )}
              </Flex>
            </Card>
          </Box>
        )}
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
