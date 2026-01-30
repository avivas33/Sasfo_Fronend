import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Flex, Box, Tabs, Text, Card, Badge } from "@radix-ui/themes";
import { DollarSign, FileCheck, History, XCircle } from "lucide-react";
import { useFacturacionStats } from "@/hooks/useFacturacion";
import { ElementosAprobarTab } from "@/components/facturacion/ElementosAprobarTab";
import { ElementosFacturarTab } from "@/components/facturacion/ElementosFacturarTab";
import { HistorialFacturasTab } from "@/components/facturacion/HistorialFacturasTab";
import { AnularContabilizacionTab } from "@/components/facturacion/AnularContabilizacionTab";

const ContabilizarServicios = () => {
  const [activeTab, setActiveTab] = useState("aprobar");
  const { data: stats } = useFacturacionStats();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header con estadísticas */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex direction="column" gap="3">
            <Text size="5" weight="bold">Contabilizar Servicios</Text>
            <Flex gap="4" wrap="wrap">
              <Card className="p-3">
                <Flex align="center" gap="2">
                  <Badge color="blue" size="2">
                    {stats?.PendientesContabilizar || 0}
                  </Badge>
                  <Text size="2">Pendientes de Contabilizar</Text>
                </Flex>
              </Card>
              <Card className="p-3">
                <Flex align="center" gap="2">
                  <Badge color="amber" size="2">
                    {stats?.Contabilizados || 0}
                  </Badge>
                  <Text size="2">Contabilizados</Text>
                </Flex>
              </Card>
              <Card className="p-3">
                <Flex align="center" gap="2">
                  <Badge color="green" size="2">
                    {stats?.Facturados || 0}
                  </Badge>
                  <Text size="2">Facturados</Text>
                </Flex>
              </Card>
              <Card className="p-3">
                <Flex align="center" gap="2">
                  <DollarSign className="w-4 h-4" style={{ color: "var(--green-11)" }} />
                  <Text size="2" weight="bold">
                    ${stats?.MontoTotalPendiente?.toFixed(2) || "0.00"}
                  </Text>
                  <Text size="2">Pendiente de Facturar</Text>
                </Flex>
              </Card>
            </Flex>
          </Flex>
        </Box>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <Box className="border-b" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
            <Tabs.List className="px-4">
              <Tabs.Trigger value="aprobar" className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Elementos a Aprobar
              </Tabs.Trigger>
              <Tabs.Trigger value="facturar" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Elementos a Facturar
              </Tabs.Trigger>
              <Tabs.Trigger value="historial" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Historial Facturas
              </Tabs.Trigger>
              <Tabs.Trigger value="anular" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Anular Contabilización
              </Tabs.Trigger>
            </Tabs.List>
          </Box>

          <Box className="flex-1 overflow-hidden">
            <Tabs.Content value="aprobar" className="h-full">
              <ElementosAprobarTab />
            </Tabs.Content>

            <Tabs.Content value="facturar" className="h-full">
              <ElementosFacturarTab />
            </Tabs.Content>

            <Tabs.Content value="historial" className="h-full">
              <HistorialFacturasTab />
            </Tabs.Content>

            <Tabs.Content value="anular" className="h-full">
              <AnularContabilizacionTab />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Flex>
  );
};

export default ContabilizarServicios;
