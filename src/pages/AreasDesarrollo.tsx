import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AreasDesarrolloTable } from "@/components/AreasDesarrolloTable";
import { AreaDesarrolloDetail } from "@/components/AreaDesarrolloDetail";
import { Flex } from "@radix-ui/themes";
import { AreaDesarrollo } from "@/types/areaDesarrollo";

const AreasDesarrollo = () => {
  const [selectedArea, setSelectedArea] = useState<AreaDesarrollo | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <AreasDesarrolloTable
        onAreaSelect={(area) => setSelectedArea(area)}
        selectedAreaId={selectedArea?.id}
      />
      <AreaDesarrolloDetail area={selectedArea} />
    </Flex>
  );
};

export default AreasDesarrollo;
