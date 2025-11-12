import { Mail, Phone, MapPin, MessageSquare, MoreVertical } from "lucide-react";
import { Box, Button, Avatar, Badge, Flex, Text, IconButton } from "@radix-ui/themes";

interface Task {
  title: string;
  dueDate: string;
  color: string;
}

const tasks: Task[] = [
  { title: "Sign the upcoming contract", dueDate: "Tue, Feb 13, 2023", color: "#8b5cf6" },
  { title: "Confirm the personnel payments", dueDate: "Thu, Feb 15, 2023", color: "#ef4444" },
  { title: "Check the cargo's arrival", dueDate: "Tue, Feb 13, 2023", color: "#3b82f6" },
];

export function UserDetail() {
  return (
    <Box className="w-96 h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fce7f3 0%, #e9d5ff 100%)" }}>
      <Box className="p-6 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.5)" }}>
        <Flex align="center" justify="between">
          <Text size="4" weight="medium">User Detail</Text>
          <IconButton variant="ghost" size="1">
            <MoreVertical className="w-4 h-4" />
          </IconButton>
        </Flex>
      </Box>

      <Box className="p-6 flex flex-col items-center">
        <Box className="relative mb-4">
          <Avatar
            size="7"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
            fallback="EL"
          />
          <Box 
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
            style={{ 
              backgroundColor: "var(--green-9)",
              borderColor: "white"
            }}
          />
        </Box>

        <Box className="text-center mb-6">
          <Flex align="center" justify="center" gap="2" className="mb-1">
            <Text size="5" weight="medium">Emily Lynch</Text>
            <Badge color="cyan">✓</Badge>
          </Flex>
          <Text size="2" style={{ color: "var(--gray-11)" }}>Production Line Expert</Text>
        </Box>

        <Flex gap="2" className="mb-6 w-full">
          <Button variant="outline" className="flex-1" size="2">
            <MessageSquare className="w-4 h-4" />
            Assign Task
          </Button>
          <Button className="flex-1" size="2">
            <Mail className="w-4 h-4" />
            Message
          </Button>
        </Flex>
      </Box>

      <Box className="px-6 pb-6 space-y-4 overflow-auto">
        <Box>
          <Text size="3" weight="medium" className="mb-3 block">Contact information</Text>
          <Box className="space-y-3">
            <Flex gap="3" align="start">
              <Mail className="w-4 h-4 mt-0.5" style={{ color: "var(--gray-11)" }} />
              <Box>
                <Text size="1" style={{ color: "var(--gray-11)", display: "block" }}>E-mail</Text>
                <Text size="2">e.lynch@gmail.com</Text>
              </Box>
            </Flex>
            <Flex gap="3" align="start">
              <Phone className="w-4 h-4 mt-0.5" style={{ color: "var(--gray-11)" }} />
              <Box>
                <Text size="1" style={{ color: "var(--gray-11)", display: "block" }}>Phone</Text>
                <Text size="2">(616) 396-8484</Text>
              </Box>
            </Flex>
            <Flex gap="3" align="start">
              <MapPin className="w-4 h-4 mt-0.5" style={{ color: "var(--gray-11)" }} />
              <Box>
                <Text size="1" style={{ color: "var(--gray-11)", display: "block" }}>Address</Text>
                <Text size="2">84 E 8th St - Town Holland - Michigan - 49423 - United States</Text>
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box>
          <Text size="3" weight="medium" className="mb-3 block">Emily's upcoming tasks</Text>
          <Box className="space-y-2">
            {tasks.map((task, index) => (
              <Box 
                key={index} 
                className="rounded-lg p-3"
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderLeft: `4px solid ${task.color}`
                }}
              >
                <Text size="2" weight="medium" className="block mb-1">{task.title}</Text>
                <Text size="1" style={{ color: "var(--gray-11)" }}>Due date: {task.dueDate}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
