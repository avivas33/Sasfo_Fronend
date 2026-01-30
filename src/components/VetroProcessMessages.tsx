import { Box, Flex, Text, Card } from "@radix-ui/themes";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { type VetroProcessMessage } from "@/services/vetro.service";

interface VetroProcessMessagesProps {
  messages: VetroProcessMessage[];
  isLoading?: boolean;
  title?: string;
}

/**
 * Componente para mostrar los mensajes de progreso de los procesos de Vetro API v2
 */
export function VetroProcessMessages({
  messages,
  isLoading = false,
  title = "Procesos de Actualización Vetro API v2"
}: VetroProcessMessagesProps) {
  if (!isLoading && messages.length === 0) {
    return null;
  }

  return (
    <Box mb="4">
      <Text size="2" weight="bold" className="block mb-2">
        {title}
      </Text>
      <Card>
        <Flex direction="column" gap="2" className="p-3">
          {isLoading && (
            <Flex align="center" gap="2">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--blue-9)" }} />
              <Text size="2" style={{ color: "var(--gray-11)" }}>
                Ejecutando procesos de actualización...
              </Text>
            </Flex>
          )}

          {messages.map((message, index) => {
            const isSuccess = message.msgTipo === "1";
            const Icon = isSuccess ? CheckCircle2 : XCircle;
            const iconColor = isSuccess ? "var(--green-9)" : "var(--red-9)";

            return (
              <Flex key={`vetro-msg-${message.msgId}-${index}`} align="start" gap="2">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: iconColor }} />
                <Text size="2" style={{ color: isSuccess ? "var(--gray-12)" : "var(--red-11)" }}>
                  {message.msgInfo}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Card>
    </Box>
  );
}
