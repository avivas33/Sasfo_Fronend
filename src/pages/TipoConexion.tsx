import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TipoConexionTable } from "@/components/TipoConexionTable";
import { TipoConexionDetail } from "@/components/TipoConexionDetail";
import { Flex } from "@radix-ui/themes";
import { TipoConexion } from "@/types/tipoConexion";

const TipoConexionPage = () => {
  const [selectedTipoConexion, setSelectedTipoConexion] = useState<TipoConexion | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <TipoConexionTable
        onTipoConexionSelect={(tipoConexion) => setSelectedTipoConexion(tipoConexion)}
        selectedTipoConexionId={selectedTipoConexion?.id}
      />
      <TipoConexionDetail tipoConexion={selectedTipoConexion} />
    </Flex>
  );
};

export default TipoConexionPage;
