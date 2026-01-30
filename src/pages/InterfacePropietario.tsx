import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Flex, Box, Text, Tabs } from "@radix-ui/themes";
import { Server, Settings } from "lucide-react";
import { FtpFilesManager } from "@/components/FtpFilesManager";
import { FtpConfigForm } from "@/components/FtpConfigForm";

const InterfacePropietario = () => {
  const [activeTab, setActiveTab] = useState("files");

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <Box className="border-b p-6" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" gap="3">
            <Flex
              align="center"
              justify="center"
              className="w-10 h-10 rounded-lg"
              style={{ backgroundColor: "var(--blue-3)" }}
            >
              <Server className="w-5 h-5" style={{ color: "var(--blue-11)" }} />
            </Flex>
            <Box>
              <Text size="5" weight="bold">Interface de Propietario</Text>
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Gestión de archivos y configuración del sitio FTP
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <Box className="border-b px-6" style={{ borderColor: "var(--gray-6)" }}>
            <Tabs.List>
              <Tabs.Trigger value="files" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                Gestionar Archivos
              </Tabs.Trigger>
              <Tabs.Trigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </Tabs.Trigger>
            </Tabs.List>
          </Box>

          <Box className="flex-1 overflow-auto">
            <Tabs.Content value="files" className="h-full">
              <FtpFilesManager />
            </Tabs.Content>

            <Tabs.Content value="config" className="h-full">
              <FtpConfigForm />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Flex>
  );
};

export default InterfacePropietario;
