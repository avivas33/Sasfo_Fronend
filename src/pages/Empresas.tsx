import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { EmpresasTable } from "@/components/EmpresasTable";
import { EmpresaDetail } from "@/components/EmpresaDetail";
import { Flex } from "@radix-ui/themes";
import { Empresa } from "@/types/empresa";

const Empresas = () => {
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <EmpresasTable
        onEmpresaSelect={(empresa) => setSelectedEmpresa(empresa)}
        selectedEmpresaId={selectedEmpresa?.id}
      />
      <EmpresaDetail empresa={selectedEmpresa} />
    </Flex>
  );
};

export default Empresas;
