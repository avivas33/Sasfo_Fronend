import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UsersTable } from "@/components/UsersTable";
import { UsuarioDetail } from "@/components/UsuarioDetail";
import { Flex } from "@radix-ui/themes";
import { Usuario } from "@/types/usuario";

const Usuarios = () => {
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <UsersTable
        onUserSelect={(user) => setSelectedUser(user)}
        selectedUserId={selectedUser?.Id}
      />
      <UsuarioDetail usuario={selectedUser} />
    </Flex>
  );
};

export default Usuarios;
