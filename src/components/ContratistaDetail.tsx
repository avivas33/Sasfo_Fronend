import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Briefcase, MapPin, FileText, Calendar, User, Building2, Hash } from "lucide-react";
import { Contratista } from "@/types/contratista";

interface ContratistaDetailProps {
  contratista?: Contratista;
}

export function ContratistaDetail({ contratista }: ContratistaDetailProps) {
  if (!contratista) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un contratista para ver los detalles
        </Text>
      </Box>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-PA', {
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
              style={{ backgroundColor: "#e8f5e9" }}
            >
              <Briefcase className="w-6 h-6" style={{ color: "#4cb74a" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {contratista.Nombre}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={contratista.Estado ? "green" : "red"} variant="soft">
                  {contratista.Estado ? "Activo" : "Inactivo"}
                </Badge>
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
              <DetailRow icon={Building2} label="Razón Social" value={contratista.Nombre} />
              {contratista.RUC && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={Hash} label="RUC" value={contratista.RUC} />
                </>
              )}
              <Separator size="4" />
              <DetailRow icon={FileText} label="Tipo de Empresa" value={contratista.Tipo_empresa} />
            </Flex>
          </Card>
        </Box>

        {/* Ubicación */}
        {(contratista.Direccion || contratista.Corregimiento || contratista.Distrito || contratista.Provincia || contratista.Pais) && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Ubicación
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {contratista.Direccion && (
                  <>
                    <DetailRow icon={MapPin} label="Dirección" value={contratista.Direccion} />
                    <Separator size="4" />
                  </>
                )}
                {contratista.Corregimiento && (
                  <>
                    <DetailRow icon={MapPin} label="Corregimiento" value={contratista.Corregimiento} />
                    <Separator size="4" />
                  </>
                )}
                {contratista.Distrito && (
                  <>
                    <DetailRow icon={MapPin} label="Distrito" value={contratista.Distrito} />
                    <Separator size="4" />
                  </>
                )}
                {contratista.Provincia && (
                  <>
                    <DetailRow icon={MapPin} label="Provincia" value={contratista.Provincia} />
                    {contratista.Pais && <Separator size="4" />}
                  </>
                )}
                {contratista.Pais && (
                  <DetailRow icon={MapPin} label="País" value={contratista.Pais} />
                )}
              </Flex>
            </Card>
          </Box>
        )}

        {/* Información del Contrato */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Información del Contrato
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={Calendar}
                label="Fecha de Firma"
                value={formatDate(contratista.Fecha_Firma_Contrato)}
              />
              <Separator size="4" />
              <DetailRow
                icon={Calendar}
                label="Fecha de Vigencia"
                value={formatDate(contratista.Fecha_Vigencia_Contrato)}
              />
              {contratista.Fecha_Cancelacion_Contrato && (
                <>
                  <Separator size="4" />
                  <DetailRow
                    icon={Calendar}
                    label="Fecha de Cancelación"
                    value={formatDate(contratista.Fecha_Cancelacion_Contrato)}
                  />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Notas */}
        {contratista.note && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Notas
            </Text>
            <Card>
              <Box className="p-4">
                <Text size="2" style={{ color: "var(--gray-12)" }}>
                  {contratista.note}
                </Text>
              </Box>
            </Card>
          </Box>
        )}

        {/* Metadata */}
        {(contratista.create_uid || contratista.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {contratista.create_uid && contratista.create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={contratista.create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDateTime(contratista.create_date)}
                    />
                  </>
                )}
                {contratista.write_uid && contratista.write_date && (
                  <>
                    {contratista.create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={contratista.write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDateTime(contratista.write_date)}
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
