import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UsersTable } from "@/components/UsersTable";
import { UserDetail } from "@/components/UserDetail";
import { Flex } from "@radix-ui/themes";

const Index = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("5");

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <UsersTable 
        onUserSelect={(user) => setSelectedUserId(user.id)} 
        selectedUserId={selectedUserId}
      />
      <UserDetail />
    </Flex>
  );
};

export default Index;
