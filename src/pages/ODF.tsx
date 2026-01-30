import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ODFTable } from "@/components/ODFTable";
import { ODFDetail } from "@/components/ODFDetail";
import { Flex } from "@radix-ui/themes";
import { ODF } from "@/types/odf";

const ODFPage = () => {
  const [selectedODF, setSelectedODF] = useState<ODF | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <ODFTable
        onODFSelect={(odf) => setSelectedODF(odf)}
        selectedODFId={selectedODF?.Id}
      />
      <ODFDetail odf={selectedODF} />
    </Flex>
  );
};

export default ODFPage;
