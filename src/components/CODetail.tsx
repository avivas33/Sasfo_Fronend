import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Network, Building2, MapPin, Calendar, User } from "lucide-react";
import { CO } from "@/types/co";

interface CODetailProps {
  co?: CO;
}

export function CODetail({ co }: CODetailProps) {
  if (!co) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione una compañía de enlace para ver los detalles
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
              <Network className="w-6 h-6" style={{ color: "var(--cyan-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {co.Nombre}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={co.Estado ? "green" : "red"} variant="soft">
                  {co.Estado ? "Activo" : "Inactivo"}
                </Badge>
                {co.isDefault && (
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
              <DetailRow icon={Network} label="Código" value={co.Codigo || "-"} />
              <Separator size="4" />
              <DetailRow icon={Building2} label="Nombre / Razón Social" value={co.Nombre} />
            </Flex>
          </Card>
        </Box>

        {/* Proyecto y Plan */}
        {(co.Nombre_Proyecto || co.Nombre_Plan) && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Proyecto y Plan
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {co.Nombre_Proyecto && (
                  <>
                    <DetailRow
                      icon={Building2}
                      label="Nombre del Proyecto"
                      value={co.Nombre_Proyecto}
                    />
                    {co.Nombre_Plan && <Separator size="4" />}
                  </>
                )}
                {co.Nombre_Plan && (
                  <DetailRow
                    icon={Building2}
                    label="Nombre del Plan"
                    value={co.Nombre_Plan}
                  />
                )}
              </Flex>
            </Card>
          </Box>
        )}

        {/* Ubicación */}
        {(co.coordenadas1 || co.coordenadas2) && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Ubicación
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                <DetailRow
                  icon={MapPin}
                  label="Coordenadas"
                  value={
                    co.coordenadas1 && co.coordenadas2
                      ? `${co.coordenadas1}, ${co.coordenadas2}`
                      : co.coordenadas1 || co.coordenadas2 || "-"
                  }
                />
              </Flex>
            </Card>
          </Box>
        )}

        {/* Metadata */}
        {(co.create_uid || co.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {co.create_uid && co.create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={co.create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDate(co.create_date)}
                    />
                  </>
                )}
                {co.write_uid && co.write_date && (
                  <>
                    {co.create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={co.write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDate(co.write_date)}
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
