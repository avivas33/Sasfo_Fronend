import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { Building2, MapPin, Calendar, FileText, Shield } from "lucide-react";
import { Empresa } from "@/types/empresa";

interface EmpresaDetailProps {
  empresa?: Empresa;
}

export function EmpresaDetail({ empresa }: EmpresaDetailProps) {
  if (!empresa) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione una empresa para ver los detalles
        </Text>
      </Box>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
              <Building2 className="w-6 h-6" style={{ color: "var(--green-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {empresa.Nombre}
              </Text>
              <Badge color={empresa.Estado ? "green" : "red"} variant="soft" className="mt-1">
                {empresa.Estado ? "Activo" : "Inactivo"}
              </Badge>
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
              <DetailRow icon={FileText} label="RUC" value={empresa.RUC} />
              <Separator size="4" />
              <DetailRow icon={Building2} label="Tipo de Empresa" value={empresa.Tipo_empresa} />
              {empresa.ID_Carrier_Interface && (
                <>
                  <Separator size="4" />
                  <DetailRow
                    icon={Shield}
                    label="ID Carrier Interface"
                    value={empresa.ID_Carrier_Interface}
                  />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Ubicación */}
        {(empresa.Direccion || empresa.Provincia || empresa.Pais) && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Ubicación
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {empresa.Direccion && (
                  <>
                    <DetailRow icon={MapPin} label="Dirección" value={empresa.Direccion} />
                    <Separator size="4" />
                  </>
                )}
                {empresa.Corregimiento && (
                  <>
                    <DetailRow icon={MapPin} label="Corregimiento" value={empresa.Corregimiento} />
                    <Separator size="4" />
                  </>
                )}
                {empresa.Distrito && (
                  <>
                    <DetailRow icon={MapPin} label="Distrito" value={empresa.Distrito} />
                    <Separator size="4" />
                  </>
                )}
                {empresa.Provincia && (
                  <>
                    <DetailRow icon={MapPin} label="Provincia" value={empresa.Provincia} />
                    {empresa.Pais && <Separator size="4" />}
                  </>
                )}
                {empresa.Pais && (
                  <DetailRow icon={MapPin} label="País" value={empresa.Pais} />
                )}
              </Flex>
            </Card>
          </Box>
        )}

        {/* Fechas del Contrato */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Información del Contrato
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={Calendar}
                label="Fecha de Firma"
                value={formatDate(empresa.Fecha_Firma_Contrato)}
              />
              <Separator size="4" />
              <DetailRow
                icon={Calendar}
                label="Vigencia del Contrato"
                value={formatDate(empresa.Fecha_Vigencia_Contrato)}
              />
              {empresa.Fecha_Cancelacion_Contrato && (
                <>
                  <Separator size="4" />
                  <DetailRow
                    icon={Calendar}
                    label="Fecha de Cancelación"
                    value={formatDate(empresa.Fecha_Cancelacion_Contrato)}
                  />
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Configuración */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Configuración
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Subir Orden
                </Text>
                <Badge color={empresa.Subir_Orden ? "green" : "gray"} variant="soft">
                  {empresa.Subir_Orden ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </Flex>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  Por Defecto
                </Text>
                <Badge color={empresa.isDefault ? "green" : "gray"} variant="soft">
                  {empresa.isDefault ? "Sí" : "No"}
                </Badge>
              </Flex>
              {empresa.Interface_No_Importar !== undefined && (
                <>
                  <Separator size="4" />
                  <Flex justify="between" align="center">
                    <Text size="2" style={{ color: "var(--gray-11)" }}>
                      No Importar (Interface)
                    </Text>
                    <Badge color={empresa.Interface_No_Importar ? "orange" : "gray"} variant="soft">
                      {empresa.Interface_No_Importar ? "Sí" : "No"}
                    </Badge>
                  </Flex>
                </>
              )}
            </Flex>
          </Card>
        </Box>

        {/* Notas */}
        {empresa.note && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              Notas
            </Text>
            <Card>
              <Box className="p-4">
                <Text size="2" style={{ color: "var(--gray-11)" }}>
                  {empresa.note}
                </Text>
              </Box>
            </Card>
          </Box>
        )}

        {/* Metadata */}
        {(empresa.create_uid || empresa.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="1" style={{ color: "var(--gray-9)" }} className="block mb-2">
              Información de Auditoría
            </Text>
            {empresa.create_uid && empresa.create_date && (
              <Text size="1" style={{ color: "var(--gray-11)" }} className="block">
                Creado por {empresa.create_uid} el {formatDate(empresa.create_date)}
              </Text>
            )}
            {empresa.write_uid && empresa.write_date && (
              <Text size="1" style={{ color: "var(--gray-11)" }} className="block mt-1">
                Modificado por {empresa.write_uid} el {formatDate(empresa.write_date)}
              </Text>
            )}
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
