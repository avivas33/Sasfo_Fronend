import { AppSidebar } from "@/components/AppSidebar";
import { NuevoPosteCamaraWizard } from "@/components/NuevoPosteCamaraWizard";
import { Flex } from "@radix-ui/themes";

const NuevoPosteCamara = () => {
  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <NuevoPosteCamaraWizard />
    </Flex>
  );
};

export default NuevoPosteCamara;
