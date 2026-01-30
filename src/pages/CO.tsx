import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { COTable } from "@/components/COTable";
import { CODetail } from "@/components/CODetail";
import { Flex } from "@radix-ui/themes";
import { CO } from "@/types/co";

const COPage = () => {
  const [selectedCO, setSelectedCO] = useState<CO | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <COTable
        onCOSelect={(co) => setSelectedCO(co)}
        selectedCOId={selectedCO?.id}
      />
      <CODetail co={selectedCO} />
    </Flex>
  );
};

export default COPage;
