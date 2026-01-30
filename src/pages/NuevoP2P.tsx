import { AppSidebar } from "@/components/AppSidebar";
import { NuevoP2PWizard } from "@/components/NuevoP2PWizard";
import { Flex, Box } from "@radix-ui/themes";

const NuevoP2P = () => {
  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <NuevoP2PWizard />
      </Box>
    </Flex>
  );
};

export default NuevoP2P;
