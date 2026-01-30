import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TipoEnlaceTable } from "@/components/TipoEnlaceTable";
import { TipoEnlaceDetail } from "@/components/TipoEnlaceDetail";
import { Flex } from "@radix-ui/themes";
import { TipoEnlace } from "@/types/tipoEnlace";

const TipoEnlacePage = () => {
  const [selectedTipoEnlace, setSelectedTipoEnlace] = useState<TipoEnlace | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <TipoEnlaceTable
        onTipoEnlaceSelect={(tipoEnlace) => setSelectedTipoEnlace(tipoEnlace)}
        selectedTipoEnlaceId={selectedTipoEnlace?.id}
      />
      <TipoEnlaceDetail tipoEnlace={selectedTipoEnlace} />
    </Flex>
  );
};

export default TipoEnlacePage;
