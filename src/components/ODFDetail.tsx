import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Network, Building2, Calendar, User, Tag, Server } from "lucide-react";
import { ODF } from "@/types/odf";

interface ODFDetailProps {
  odf?: ODF;
}

export function ODFDetail({ odf }: ODFDetailProps) {
  if (!odf) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un ODF para ver los detalles
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
                {odf.Codigo || `ODF #${odf.Id}`}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={odf.Estado ? "green" : "red"} variant="soft">
                  {odf.Estado ? "Activo" : "Inactivo"}
                </Badge>
                {odf.IsDefault && (
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
              <DetailRow icon={Tag} label="ID ODF" value={odf.ID_ODF.toString()} />
              <Separator size="4" />
              <DetailRow icon={Tag} label="Código Registro" value={odf.Codigo || "-"} />
              <Separator size="4" />
              <DetailRow icon={Building2} label="Empresa" value={odf.EmpresaNombre || odf.Nombre_Empresa} />
            </Flex>
          </Card>
        </Box>

        {/* Configuración de Puertos */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Configuración de Puertos
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow icon={Server} label="Cantidad de Puertos" value={odf.Cantidad_Puertos.toString()} />
              <Separator size="4" />
              <DetailRow icon={Network} label="Puerto Asignado A" value={odf.NodeSubIdA.toString()} />
              <Separator size="4" />
              <DetailRow icon={Network} label="Puerto Asignado Z" value={odf.NodeSubIdZ.toString()} />
            </Flex>
          </Card>
        </Box>

        {/* Información del Rack */}
        {odf.Rack && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Ubicación
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                <DetailRow icon={Server} label="Rack" value={odf.Rack} />
              </Flex>
            </Card>
          </Box>
        )}

        {/* Circuito */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Circuito
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow icon={Network} label="ID Circuito" value={odf.CircuitoId.toString()} />
            </Flex>
          </Card>
        </Box>

        {/* Observaciones */}
        {odf.Comments && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Observaciones Técnicas
            </Text>
            <Card>
              <Box className="p-4">
                <Text size="2" style={{ color: "var(--gray-11)", whiteSpace: "pre-wrap" }}>
                  {odf.Comments}
                </Text>
              </Box>
            </Card>
          </Box>
        )}

        {/* Metadata */}
        {(odf.Create_uid || odf.Write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {odf.Create_uid && odf.Create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={odf.Create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDate(odf.Create_date)}
                    />
                  </>
                )}
                {odf.Write_uid && odf.Write_date && (
                  <>
                    {odf.Create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={odf.Write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDate(odf.Write_date)}
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
