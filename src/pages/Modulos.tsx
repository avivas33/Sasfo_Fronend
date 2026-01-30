import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ModulosTable } from "@/components/ModulosTable";
import { ModuloDetail } from "@/components/ModuloDetail";
import { Flex } from "@radix-ui/themes";
import { Modulo } from "@/types/modulo";

const Modulos = () => {
  const [selectedModulo, setSelectedModulo] = useState<Modulo | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <ModulosTable
        onModuloSelect={(modulo) => setSelectedModulo(modulo)}
        selectedModuloId={selectedModulo?.id}
      />
      <ModuloDetail modulo={selectedModulo} />
    </Flex>
  );
};

export default Modulos;
