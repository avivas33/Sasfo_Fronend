import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UsersTable } from "@/components/UsersTable";
import { UserDetail } from "@/components/UserDetail";

const Index = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("5");

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      <UsersTable 
        onUserSelect={(user) => setSelectedUserId(user.id)} 
        selectedUserId={selectedUserId}
      />
      <UserDetail />
    </div>
  );
};

export default Index;
