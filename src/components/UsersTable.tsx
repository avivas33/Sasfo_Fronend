import { MoreVertical, Search } from "lucide-react";
import { Box, Button, TextField, Badge, Avatar, Flex, Text, IconButton, Table } from "@radix-ui/themes";

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
    <Box className="flex-1 flex flex-col bg-white">
      <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
        <Flex align="center" justify="between">
          <Flex align="center" gap="4">
            <Text size="4" weight="medium">Users & Access List</Text>
            <Text size="2" style={{ color: "var(--gray-11)" }}>3 users selected</Text>
          </Flex>
          <Button size="2">+ New User</Button>
        </Flex>
      </Box>

      <Box className="p-4 border-b" style={{ borderColor: "var(--gray-6)" }}>
        <TextField.Root 
          placeholder="Search in list"
          size="2"
        >
          <TextField.Slot>
            <Search className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Box className="flex-1 overflow-auto">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Full Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expire Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Condition</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map((user) => (
              <Table.Row 
                key={user.id}
                onClick={() => onUserSelect(user)}
                className="cursor-pointer"
                style={{
                  backgroundColor: selectedUserId === user.id ? "var(--gray-2)" : "transparent",
                }}
              >
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Avatar
                      size="2"
                      src={user.avatar}
                      fallback={user.name.split(' ').map(n => n[0]).join('')}
                      color="cyan"
                    />
                    <Box>
                      <Text size="2" weight="medium">{user.name}</Text>
                      <Text size="1" style={{ color: "var(--gray-11)", display: "block" }}>
                        {user.role}
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{user.username}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{user.expireDate}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge 
                    color={user.status === "Active" ? "green" : "red"}
                    variant="soft"
                  >
                    {user.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Box 
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: user.condition === "Online" 
                          ? "var(--green-9)" 
                          : "var(--red-9)"
                      }}
                    />
                    <Text size="2">{user.condition}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <IconButton variant="ghost" size="1">
                    <MoreVertical className="w-4 h-4" />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
