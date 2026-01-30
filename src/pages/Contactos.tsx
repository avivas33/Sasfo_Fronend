import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ContactosTable } from "@/components/ContactosTable";
import { ContactoDetail } from "@/components/ContactoDetail";
import { Flex } from "@radix-ui/themes";
import { Contacto } from "@/types/contacto";

const Contactos = () => {
  const [selectedContacto, setSelectedContacto] = useState<Contacto | undefined>();

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <ContactosTable
        onContactoSelect={(contacto) => setSelectedContacto(contacto)}
        selectedContactoId={selectedContacto?.id}
      />
      <ContactoDetail contacto={selectedContacto} />
    </Flex>
  );
};

export default Contactos;
