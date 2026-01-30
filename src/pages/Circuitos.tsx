import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { CircuitosTable } from "@/components/CircuitosTable";
import { CircuitosDetail } from "@/components/CircuitosDetail";
import { Flex } from "@radix-ui/themes";
import { Circuito } from "@/types/circuitos";

const CircuitosPage = () => {
  const [selectedCircuito, setSelectedCircuito] = useState<Circuito | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <CircuitosTable
        onCircuitoSelect={(circuito) => setSelectedCircuito(circuito)}
        selectedCircuitoId={selectedCircuito?.ID_CircuitosSLPE}
      />
      <CircuitosDetail circuito={selectedCircuito} />
    </Flex>
  );
};

export default CircuitosPage;
