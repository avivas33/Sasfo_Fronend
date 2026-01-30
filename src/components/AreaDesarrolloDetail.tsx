import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Layers, FileText, Calendar, User } from "lucide-react";
import { AreaDesarrollo } from "@/types/areaDesarrollo";

interface AreaDesarrolloDetailProps {
  area?: AreaDesarrollo;
}

export function AreaDesarrolloDetail({ area }: AreaDesarrolloDetailProps) {
  if (!area) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un área de desarrollo para ver los detalles
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
              style={{ backgroundColor: "var(--green-3)" }}
            >
              <Layers className="w-6 h-6" style={{ color: "var(--green-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {area.Nombre}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={area.Estado ? "green" : "red"} variant="soft">
                  {area.Estado ? "Activo" : "Inactivo"}
                </Badge>
                {area.isDefault && (
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
              <DetailRow icon={FileText} label="ID" value={area.id.toString()} />
              <Separator size="4" />
              <DetailRow icon={FileText} label="ID Área" value={area.ID_Area.toString()} />
              <Separator size="4" />
              <DetailRow icon={Layers} label="Nombre" value={area.Nombre} />
            </Flex>
          </Card>
        </Box>

        {/* Estado */}
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
                <Badge color={area.Estado ? "green" : "red"} variant="soft">
                  {area.Estado ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Por Defecto
                </Text>
                <Badge color={area.isDefault ? "blue" : "gray"} variant="soft">
                  {area.isDefault ? "Sí" : "No"}
                </Badge>
              </Flex>
            </Flex>
          </Card>
        </Box>

        {/* Metadata */}
        {(area.create_uid || area.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {area.create_uid && area.create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={area.create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDate(area.create_date)}
                    />
                  </>
                )}
                {area.write_uid && area.write_date && (
                  <>
                    {area.create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={area.write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDate(area.write_date)}
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
