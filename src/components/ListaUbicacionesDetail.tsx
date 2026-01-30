import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { MapPin, Building2, Calendar, User, Tag } from "lucide-react";
import { ListaUbicacion, TipoUbicacionLabels } from "@/types/listaUbicaciones";

interface ListaUbicacionesDetailProps {
  ubicacion?: ListaUbicacion;
}

export function ListaUbicacionesDetail({ ubicacion }: ListaUbicacionesDetailProps) {
  if (!ubicacion) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione una ubicación para ver los detalles
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
              <MapPin className="w-6 h-6" style={{ color: "var(--cyan-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {ubicacion.Nombre_Ubicacion}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={ubicacion.Estado ? "green" : "red"} variant="soft">
                  {ubicacion.Estado ? "Activo" : "Inactivo"}
                </Badge>
                {ubicacion.isDefault && (
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
              <DetailRow icon={Tag} label="ID Ubicaciones" value={ubicacion.ID_Ubicaciones.toString()} />
              <Separator size="4" />
              <DetailRow icon={MapPin} label="Nombre de la Ubicación" value={ubicacion.Nombre_Ubicacion} />
              <Separator size="4" />
              <DetailRow
                icon={Tag}
                label="Tipo de Ubicación"
                value={TipoUbicacionLabels[ubicacion.Tipo_UbicacionID]}
              />
            </Flex>
          </Card>
        </Box>

        {/* Área de Desarrollo */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Área de Desarrollo
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={Building2}
                label="Área de Desarrollo"
                value={ubicacion.AreaDesarrolloNombre || ubicacion.Nombre_Area || "-"}
              />
            </Flex>
          </Card>
        </Box>

        {/* Metadata */}
        {(ubicacion.create_uid || ubicacion.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {ubicacion.create_uid && ubicacion.create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={ubicacion.create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDate(ubicacion.create_date)}
                    />
                  </>
                )}
                {ubicacion.write_uid && ubicacion.write_date && (
                  <>
                    {ubicacion.create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={ubicacion.write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDate(ubicacion.write_date)}
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
