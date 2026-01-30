import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ListaUbicacionesTable } from "@/components/ListaUbicacionesTable";
import { ListaUbicacionesDetail } from "@/components/ListaUbicacionesDetail";
import { Flex } from "@radix-ui/themes";
import { ListaUbicacion } from "@/types/listaUbicaciones";

const ListaUbicaciones = () => {
  const [selectedUbicacion, setSelectedUbicacion] = useState<ListaUbicacion | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <ListaUbicacionesTable
        onUbicacionSelect={(ubicacion) => setSelectedUbicacion(ubicacion)}
        selectedUbicacionId={selectedUbicacion?.id}
      />
      <ListaUbicacionesDetail ubicacion={selectedUbicacion} />
    </Flex>
  );
};

export default ListaUbicaciones;
