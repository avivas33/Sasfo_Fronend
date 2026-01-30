import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ServiciosTable } from "@/components/ServiciosTable";
import { ServiciosDetail } from "@/components/ServiciosDetail";
import { Flex } from "@radix-ui/themes";
import { Servicios } from "@/types/servicios";

const ServiciosPage = () => {
  const [selectedServicios, setSelectedServicios] = useState<Servicios | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <ServiciosTable
        onServiciosSelect={(servicios) => setSelectedServicios(servicios)}
        selectedServiciosId={selectedServicios?.id}
      />
      <ServiciosDetail servicios={selectedServicios} />
    </Flex>
  );
};

export default ServiciosPage;
