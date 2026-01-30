import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { P2PTable } from "@/components/P2PTable";
import { P2PDetail } from "@/components/P2PDetail";
import { Flex, Tabs, Box } from "@radix-ui/themes";
import { P2P as P2PType, EstadoP2P } from "@/types/p2p";

const P2P = () => {
  const [selectedP2P, setSelectedP2P] = useState<P2PType | undefined>();
  const [activeTab, setActiveTab] = useState("todos");

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <Tabs.List>
            <Tabs.Trigger value="todos">Todos los P2P</Tabs.Trigger>
            <Tabs.Trigger value="proceso">En Proceso</Tabs.Trigger>
            <Tabs.Trigger value="aprobadas">Aprobadas</Tabs.Trigger>
            <Tabs.Trigger value="canceladas">Canceladas</Tabs.Trigger>
          </Tabs.List>

          <Box className="flex-1 overflow-hidden">
            <Tabs.Content value="todos" className="h-full">
              <P2PTable
                onP2PSelect={(p2p) => setSelectedP2P(p2p)}
                selectedP2PId={selectedP2P?.ID_P2P}
              />
            </Tabs.Content>

            <Tabs.Content value="proceso" className="h-full">
              <P2PTable
                onP2PSelect={(p2p) => setSelectedP2P(p2p)}
                selectedP2PId={selectedP2P?.ID_P2P}
                filterByEstado={EstadoP2P.Proceso}
              />
            </Tabs.Content>

            <Tabs.Content value="aprobadas" className="h-full">
              <P2PTable
                onP2PSelect={(p2p) => setSelectedP2P(p2p)}
                selectedP2PId={selectedP2P?.ID_P2P}
                filterByEstado={EstadoP2P.Aprobado}
              />
            </Tabs.Content>

            <Tabs.Content value="canceladas" className="h-full">
              <P2PTable
                onP2PSelect={(p2p) => setSelectedP2P(p2p)}
                selectedP2PId={selectedP2P?.ID_P2P}
                filterByEstado={EstadoP2P.Cancelado}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
      <P2PDetail p2p={selectedP2P} />
    </Flex>
  );
};

export default P2P;
