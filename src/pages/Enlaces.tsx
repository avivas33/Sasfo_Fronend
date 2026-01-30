import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { EnlacesTable } from "@/components/EnlacesTable";
import { EnlacesDetail } from "@/components/EnlacesDetail";
import { Flex } from "@radix-ui/themes";
import { Enlace } from "@/types/enlaces";

const EnlacesPage = () => {
  const [selectedEnlace, setSelectedEnlace] = useState<Enlace | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <EnlacesTable
        onEnlaceSelect={(enlace) => setSelectedEnlace(enlace)}
        selectedEnlaceId={selectedEnlace?.ID_Enlace}
      />
      <EnlacesDetail enlace={selectedEnlace} />
    </Flex>
  );
};

export default EnlacesPage;
