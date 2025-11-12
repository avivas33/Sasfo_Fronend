import { Home, Users, FileText, TrendingUp, Package, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Box, Flex, Text } from "@radix-ui/themes";

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
    <Box 
      className="w-52 bg-white border-r h-screen flex flex-col"
      style={{ borderColor: "var(--gray-6)" }}
    >
      <Box className="p-6 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" gap="2">
          <Flex 
            align="center" 
            justify="center"
            className="w-8 h-8 rounded"
            style={{ backgroundColor: "var(--gray-12)" }}
          >
            <Text size="2" weight="bold" style={{ color: "white" }}>S</Text>
          </Flex>
          <Text size="3" weight="medium">Sasfo</Text>
        </Flex>
      </Box>
      
      <Box className="flex-1 py-4">
        <Box className="px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ 
                color: "var(--gray-11)",
              }}
              activeClassName="font-medium"
            >
              {({ isActive }) => (
                <Flex 
                  align="center" 
                  gap="3" 
                  className="w-full"
                  style={{
                    backgroundColor: isActive ? "var(--gray-3)" : "transparent",
                    color: isActive ? "var(--gray-12)" : "var(--gray-11)",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-3)",
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <Text size="2">{item.title}</Text>
                </Flex>
              )}
            </NavLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
