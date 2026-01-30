import { Box, Flex, Text, Badge, Separator, Card } from "@radix-ui/themes";
import { User, Phone, Mail, Building2, CreditCard, Calendar, Shield } from "lucide-react";
import { Contacto, TipoContactoLabels } from "@/types/contacto";

interface ContactoDetailProps {
  contacto?: Contacto;
}

export function ContactoDetail({ contacto }: ContactoDetailProps) {
  if (!contacto) {
    return (
      <Box
        className="w-80 bg-white border-l flex items-center justify-center"
        style={{ borderColor: "var(--gray-6)" }}
      >
        <Text size="2" style={{ color: "var(--gray-11)" }}>
          Seleccione un contacto para ver los detalles
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
              style={{ backgroundColor: "var(--purple-3)" }}
            >
              <User className="w-6 h-6" style={{ color: "var(--purple-11)" }} />
            </Flex>
            <Box className="flex-1">
              <Text size="4" weight="bold" className="block">
                {contacto.Nombre}
              </Text>
              <Flex gap="2" className="mt-1">
                <Badge color={contacto.Estado ? "green" : "red"} variant="soft">
                  {contacto.Estado ? "Activo" : "Inactivo"}
                </Badge>
                {contacto.isDefault && (
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
              <DetailRow icon={User} label="Nombre" value={contacto.Nombre} />
              {contacto.Cedula && (
                <>
                  <Separator size="4" />
                  <DetailRow icon={CreditCard} label="Cédula" value={contacto.Cedula} />
                </>
              )}
              <Separator size="4" />
              <DetailRow
                icon={User}
                label="Tipo de Contacto"
                value={TipoContactoLabels[contacto.tipo_contacto]}
              />
            </Flex>
          </Card>
        </Box>

        {/* Información de Contacto */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Información de Contacto
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              {contacto.Telefono_Fijo && (
                <>
                  <DetailRow icon={Phone} label="Teléfono Fijo" value={contacto.Telefono_Fijo} />
                  <Separator size="4" />
                </>
              )}
              {contacto.Telefono_movil && (
                <>
                  <DetailRow icon={Phone} label="Teléfono Móvil" value={contacto.Telefono_movil} />
                  <Separator size="4" />
                </>
              )}
              {contacto.extension && (
                <>
                  <DetailRow icon={Phone} label="Extensión" value={contacto.extension.toString()} />
                  <Separator size="4" />
                </>
              )}
              {contacto.correo_electronico && (
                <DetailRow icon={Mail} label="Correo Electrónico" value={contacto.correo_electronico} />
              )}
            </Flex>
          </Card>
        </Box>

        {/* Empresa */}
        <Box>
          <Text size="2" weight="bold" className="block mb-3">
            Empresa
          </Text>
          <Card>
            <Flex direction="column" gap="3" className="p-4">
              <DetailRow
                icon={Building2}
                label="Empresa"
                value={contacto.EmpresaNombre || "Sin asignar"}
              />
            </Flex>
          </Card>
        </Box>

        {/* IDs de Carrier */}
        {(contacto.ID_Carrier_Hansa || contacto.ID_Carrier_Interface) && (
          <Box>
            <Text size="2" weight="bold" className="block mb-3">
              IDs de Carrier
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {contacto.ID_Carrier_Hansa && (
                  <>
                    <DetailRow
                      icon={Shield}
                      label="Carrier Hansa"
                      value={contacto.ID_Carrier_Hansa}
                    />
                    {contacto.ID_Carrier_Interface && <Separator size="4" />}
                  </>
                )}
                {contacto.ID_Carrier_Interface && (
                  <DetailRow
                    icon={Shield}
                    label="Carrier Interface"
                    value={contacto.ID_Carrier_Interface}
                  />
                )}
              </Flex>
            </Card>
          </Box>
        )}

        {/* Metadata */}
        {(contacto.create_uid || contacto.write_uid) && (
          <Box className="mt-6 pt-6 border-t" style={{ borderColor: "var(--gray-6)" }}>
            <Text size="2" weight="bold" className="block mb-3">
              Información de Auditoría
            </Text>
            <Card>
              <Flex direction="column" gap="3" className="p-4">
                {contacto.create_uid && contacto.create_date && (
                  <>
                    <DetailRow
                      icon={User}
                      label="Creado por"
                      value={contacto.create_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de creación"
                      value={formatDate(contacto.create_date)}
                    />
                  </>
                )}
                {contacto.write_uid && contacto.write_date && (
                  <>
                    {contacto.create_uid && <Separator size="4" />}
                    <DetailRow
                      icon={User}
                      label="Modificado por"
                      value={contacto.write_uid}
                    />
                    <Separator size="4" />
                    <DetailRow
                      icon={Calendar}
                      label="Fecha de modificación"
                      value={formatDate(contacto.write_date)}
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
