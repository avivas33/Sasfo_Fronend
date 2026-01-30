import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { OtrosServiciosTable } from "@/components/OtrosServiciosTable";
import { OtrosServiciosDetail } from "@/components/OtrosServiciosDetail";
import { Flex } from "@radix-ui/themes";
import { OtroServicio } from "@/types/otrosServicios";

const OtrosServiciosPage = () => {
  const [selectedOtroServicio, setSelectedOtroServicio] = useState<OtroServicio | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <OtrosServiciosTable
        onOtroServicioSelect={(otroServicio) => setSelectedOtroServicio(otroServicio)}
        selectedOtroServicioId={selectedOtroServicio?.id}
      />
      <OtrosServiciosDetail otroServicio={selectedOtroServicio} />
    </Flex>
  );
};

export default OtrosServiciosPage;
