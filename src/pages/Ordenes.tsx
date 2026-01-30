import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { OrdenesTable } from "@/components/OrdenesTable";
import { OrdenDetail } from "@/components/OrdenDetail";
import { Flex, Tabs, Box, Text, Badge } from "@radix-ui/themes";
import { OrdenServicio } from "@/types/ordenes";
import { useOrdenesStats } from "@/hooks/useOrdenes";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const Ordenes = () => {
  const [selectedOrden, setSelectedOrden] = useState<OrdenServicio | undefined>();
  const [activeTab, setActiveTab] = useState("todos");
  const { data: stats } = useOrdenesStats();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Box className="p-4 border-b bg-white" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" gap="3">
            <FileText className="w-6 h-6" style={{ color: "var(--blue-9)" }} />
            <Text size="5" weight="bold">Órdenes de Servicio</Text>
          </Flex>
        </Box>

        {/* Tabs and Content */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <Box className="px-4 bg-white border-b" style={{ borderColor: "var(--gray-6)" }}>
            <Tabs.List>
              <Tabs.Trigger value="todos" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Todas las Órdenes
              </Tabs.Trigger>
              <Tabs.Trigger value="proceso" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                En Proceso
                {stats?.EnProceso ? (
                  <Badge color="yellow" variant="soft" size="1">{stats.EnProceso}</Badge>
                ) : null}
              </Tabs.Trigger>
              <Tabs.Trigger value="completadas" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completadas
              </Tabs.Trigger>
              <Tabs.Trigger value="canceladas" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Canceladas
              </Tabs.Trigger>
            </Tabs.List>
          </Box>

          <Flex className="flex-1 overflow-hidden">
            <Box className="flex-1 overflow-hidden">
              <Tabs.Content value="todos" className="h-full">
                <OrdenesTable
                  onOrdenSelect={(orden) => setSelectedOrden(orden)}
                  selectedOrdenId={selectedOrden?.id}
                />
              </Tabs.Content>

              <Tabs.Content value="proceso" className="h-full">
                <OrdenesTable
                  onOrdenSelect={(orden) => setSelectedOrden(orden)}
                  selectedOrdenId={selectedOrden?.id}
                  filterByStatus={2}
                />
              </Tabs.Content>

              <Tabs.Content value="completadas" className="h-full">
                <OrdenesTable
                  onOrdenSelect={(orden) => setSelectedOrden(orden)}
                  selectedOrdenId={selectedOrden?.id}
                  filterByStatus={3}
                />
              </Tabs.Content>

              <Tabs.Content value="canceladas" className="h-full">
                <OrdenesTable
                  onOrdenSelect={(orden) => setSelectedOrden(orden)}
                  selectedOrdenId={selectedOrden?.id}
                  filterByStatus={4}
                />
              </Tabs.Content>
            </Box>

            {/* Detail Panel */}
            <OrdenDetail
              orden={selectedOrden}
              onClose={() => setSelectedOrden(undefined)}
            />
          </Flex>
        </Tabs.Root>
      </Box>
    </Flex>
  );
};

export default Ordenes;
