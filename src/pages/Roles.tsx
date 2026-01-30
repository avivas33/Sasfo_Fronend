import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { RolesTable } from "@/components/RolesTable";
import { RolDetail } from "@/components/RolDetail";
import { Flex } from "@radix-ui/themes";
import { Rol } from "@/types/rol";

const Roles = () => {
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <RolesTable
        onRolSelect={(rol) => setSelectedRol(rol)}
        selectedRolId={selectedRol?.Id}
      />
      <RolDetail rol={selectedRol} />
    </Flex>
  );
};

export default Roles;
