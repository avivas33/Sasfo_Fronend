import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ContratistasTable } from "@/components/ContratistasTable";
import { ContratistaDetail } from "@/components/ContratistaDetail";
import { Flex } from "@radix-ui/themes";
import { Contratista } from "@/types/contratista";

const Contratistas = () => {
  const [selectedContratista, setSelectedContratista] = useState<Contratista | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <ContratistasTable
        onContratistaSelect={(contratista) => setSelectedContratista(contratista)}
        selectedContratistaId={selectedContratista?.id}
      />
      <ContratistaDetail contratista={selectedContratista} />
    </Flex>
  );
};

export default Contratistas;
