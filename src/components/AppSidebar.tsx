import { Home, Users, FileText, TrendingUp, Package, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const menuItems = [
  { title: "Accounting", icon: FileText, url: "/" },
  { title: "Basic Information", icon: Home, url: "/basic-info" },
  { title: "Users & Access", icon: Users, url: "/users", active: true },
  { title: "Liquidity", icon: TrendingUp, url: "/liquidity" },
  { title: "Stocks", icon: Package, url: "/stocks" },
  { title: "Sales", icon: BarChart3, url: "/sales" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  return (
    <aside className="w-52 bg-sidebar border-r border-border flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center">
            <span className="text-background font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-foreground">Sasfo</span>
        </div>
      </div>
      
      <div className="flex-1 py-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-foreground font-medium"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
