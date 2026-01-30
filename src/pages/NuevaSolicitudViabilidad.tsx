import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Box, Flex, Button, Card, Heading } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { ViabilidadWizard } from "@/components/ViabilidadWizard";

const NuevaSolicitudViabilidad = () => {
  const navigate = useNavigate();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <Box className="bg-white border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" justify="between" mb="2">
            <Heading size="6">Solicitud de Viabilidad</Heading>
            <Button
              variant="soft"
              color="gray"
              onClick={() => navigate("/viabilidades")}
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar al Índice
            </Button>
          </Flex>
          <hr style={{ borderColor: "var(--gray-6)", margin: "1rem 0" }} />
          <p style={{ color: "var(--gray-11)", fontSize: "0.875rem" }}>
            Generar una nueva Viabilidad.
          </p>
        </Box>

        {/* Wizard Content */}
        <Box className="flex-1 p-6">
          <Card>
            <ViabilidadWizard />
          </Card>
        </Box>
      </Box>
    </Flex>
  );
};

export default NuevaSolicitudViabilidad;
