import { MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  role: string;
  username: string;
  expireDate: string;
  status: "Active" | "Deactivated";
  condition: "Online" | "Offline";
  avatar?: string;
}

const users: User[] = [
  { id: "1", name: "Alexander Medvedev", role: "Sales Man. Accountant", username: "A.Medvedev", expireDate: "2029/12/30", status: "Deactivated", condition: "Offline" },
  { id: "2", name: "Marques Brownley", role: "Data Analyst", username: "M.Brownley", expireDate: "2029/12/30", status: "Active", condition: "Online" },
  { id: "3", name: "Anastasia Golovko", role: "Stock Accountant", username: "A.Golovko", expireDate: "2029/12/30", status: "Active", condition: "Online" },
  { id: "4", name: "Faizur Rehman", role: "HR Safe Expert", username: "F.Rehman", expireDate: "2029/12/30", status: "Active", condition: "Online" },
  { id: "5", name: "Emily Lynch", role: "Production Line Expert", username: "S.Parkinson", expireDate: "2029/12/30", status: "Deactivated", condition: "Offline" },
  { id: "6", name: "Kamila Harris", role: "R&D Expert", username: "K.Harris", expireDate: "2029/12/30", status: "Active", condition: "Online" },
];

interface UsersTableProps {
  onUserSelect: (user: User) => void;
  selectedUserId?: string;
}

export function UsersTable({ onUserSelect, selectedUserId }: UsersTableProps) {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">Users & Access List</h2>
          <span className="text-sm text-muted-foreground">3 users selected</span>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          + New User
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search in list" 
            className="pl-10 bg-card"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border sticky top-0">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Full Name</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Username</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Expire Date</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Condition</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user.id}
                onClick={() => onUserSelect(user)}
                className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-colors ${
                  selectedUserId === user.id ? 'bg-muted/50' : ''
                }`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm text-foreground">{user.username}</td>
                <td className="p-3 text-sm text-foreground">{user.expireDate}</td>
                <td className="p-3">
                  <Badge 
                    variant={user.status === "Active" ? "default" : "secondary"}
                    className={user.status === "Active" 
                      ? "bg-success/10 text-success hover:bg-success/20 border-0" 
                      : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.condition === "Online" ? "bg-success" : "bg-destructive"}`} />
                    <span className="text-sm text-foreground">{user.condition}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
