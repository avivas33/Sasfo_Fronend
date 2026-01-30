import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ViabilidadesTable } from "@/components/ViabilidadesTable";
import { ViabilidadDetail } from "@/components/ViabilidadDetail";
import { Flex, Tabs, Box, Text, Badge } from "@radix-ui/themes";
import { Viabilidad } from "@/types/viabilidad";
import { useViabilidadesStats } from "@/hooks/useViabilidades";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Star } from "lucide-react";
import "@/styles/viabilidades-tabs.css";

// Clasificaciones según el proyecto original (ClasificacionViabilidad)
export enum ClasificacionViabilidad {
  SolicitudesPresupuesto = 1,
  SolicitudesCanceladas = 2,
  ViabilidadesPorAprobar = 3,
  ViabilidadesNoAprobadas = 4,
  ViabilidadesEspeciales = 5,
}

const Viabilidades = () => {
  const [selectedViabilidad, setSelectedViabilidad] = useState<Viabilidad | undefined>();
  const [activeTab, setActiveTab] = useState("solicitudes");
  const { data: stats } = useViabilidadesStats();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header con estadísticas */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex justify="between" align="center">
            <Flex direction="column" gap="1">
              <Text size="5" weight="bold">Gestión de Viabilidades</Text>
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Administre solicitudes, cotizaciones y aprobaciones de viabilidades
              </Text>
            </Flex>
            <Flex gap="3">
              <Badge color="blue" size="2">
                <Clock className="w-3 h-3 mr-1" />
                Pendientes: {stats?.ViabilidadesPendientes || 0}
              </Badge>
              <Badge color="green" size="2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aprobadas: {stats?.ViabilidadesAprobadas || 0}
              </Badge>
              <Badge color="red" size="2">
                <XCircle className="w-3 h-3 mr-1" />
                Rechazadas: {stats?.ViabilidadesRechazadas || 0}
              </Badge>
            </Flex>
          </Flex>
        </Box>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <Box className="border-b" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
            <Tabs.List className="px-4">
              {/* 1. Solicitudes de Presupuesto */}
              <Tabs.Trigger value="solicitudes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Solicitudes de Presupuesto
              </Tabs.Trigger>

              {/* 2. Solicitudes Canceladas */}
              <Tabs.Trigger value="canceladas" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Solicitudes Canceladas
              </Tabs.Trigger>

              {/* 3. Viabilidades por Aprobar */}
              <Tabs.Trigger value="aprobar" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Por Aprobar
              </Tabs.Trigger>

              {/* 4. Viabilidades No Aprobadas */}
              <Tabs.Trigger value="rechazadas" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                No Aprobadas
              </Tabs.Trigger>

              {/* 5. Viabilidades Especiales */}
              <Tabs.Trigger value="especiales" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Especiales
              </Tabs.Trigger>
            </Tabs.List>
          </Box>

          <Box className="flex-1 overflow-hidden">
            {/* 1. Solicitudes de Presupuesto (ClasificacionViabilidad = 1) */}
            <Tabs.Content value="solicitudes" className="h-full">
              <ViabilidadesTable
                onViabilidadSelect={(viabilidad) => setSelectedViabilidad(viabilidad)}
                selectedViabilidadId={selectedViabilidad?.id}
                filterByClasificacion={ClasificacionViabilidad.SolicitudesPresupuesto}
                showCotizacionActions={true}
              />
            </Tabs.Content>

            {/* 2. Solicitudes Canceladas (ClasificacionViabilidad = 2) */}
            <Tabs.Content value="canceladas" className="h-full">
              <ViabilidadesTable
                onViabilidadSelect={(viabilidad) => setSelectedViabilidad(viabilidad)}
                selectedViabilidadId={selectedViabilidad?.id}
                filterByClasificacion={ClasificacionViabilidad.SolicitudesCanceladas}
                showCancelacionInfo={true}
              />
            </Tabs.Content>

            {/* 3. Viabilidades por Aprobar (ClasificacionViabilidad = 3) */}
            <Tabs.Content value="aprobar" className="h-full">
              <ViabilidadesTable
                onViabilidadSelect={(viabilidad) => setSelectedViabilidad(viabilidad)}
                selectedViabilidadId={selectedViabilidad?.id}
                filterByClasificacion={ClasificacionViabilidad.ViabilidadesPorAprobar}
                showAprobacionActions={true}
              />
            </Tabs.Content>

            {/* 4. Viabilidades No Aprobadas (ClasificacionViabilidad = 4) */}
            <Tabs.Content value="rechazadas" className="h-full">
              <ViabilidadesTable
                onViabilidadSelect={(viabilidad) => setSelectedViabilidad(viabilidad)}
                selectedViabilidadId={selectedViabilidad?.id}
                filterByClasificacion={ClasificacionViabilidad.ViabilidadesNoAprobadas}
                showInvalidezColumn={true}
              />
            </Tabs.Content>

            {/* 5. Viabilidades Especiales (isEspecial = true) */}
            <Tabs.Content value="especiales" className="h-full">
              <ViabilidadesTable
                onViabilidadSelect={(viabilidad) => setSelectedViabilidad(viabilidad)}
                selectedViabilidadId={selectedViabilidad?.id}
                filterByClasificacion={ClasificacionViabilidad.ViabilidadesEspeciales}
                filterByEspecial={true}
                showEspecialActions={true}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
      <ViabilidadDetail viabilidad={selectedViabilidad} />
    </Flex>
  );
};

export default Viabilidades;
