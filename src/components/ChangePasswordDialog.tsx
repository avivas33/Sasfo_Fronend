import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { X, Key } from "lucide-react";
import { useChangePassword } from "@/hooks/useUsuarios";
import { toast } from "sonner";

const changePasswordSchema = z.object({
  newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirme la contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

export function ChangePasswordDialog({ open, onOpenChange, userId }: ChangePasswordDialogProps) {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!userId) return;

    try {
      await changePasswordMutation.mutateAsync({
        id: userId,
        data: { NewPassword: data.newPassword },
      });
      toast.success("Contraseña cambiada exitosamente");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar contraseña");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content style={{ maxWidth: 400 }}>
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Key className="w-5 h-5" />
              <Dialog.Title>Cambiar Contraseña</Dialog.Title>
            </Flex>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </Flex>

          <Dialog.Description size="2" color="gray">
            Ingrese la nueva contraseña para el usuario
          </Dialog.Description>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} id="change-password-form">
            <Flex direction="column" gap="4">
              {/* Nueva Contraseña */}
              <Box>
                <Text size="2" weight="medium" as="label" htmlFor="newPassword">
                  Nueva Contraseña <Text color="red">*</Text>
                </Text>
                <TextField.Root
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  placeholder="Mínimo 6 caracteres"
                  autoFocus
                />
                {errors.newPassword && (
                  <Text size="1" color="red">
                    {errors.newPassword.message}
                  </Text>
                )}
              </Box>

              {/* Confirmar Contraseña */}
              <Box>
                <Text size="2" weight="medium" as="label" htmlFor="confirmPassword">
                  Confirmar Contraseña <Text color="red">*</Text>
                </Text>
                <TextField.Root
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Repita la contraseña"
                />
                {errors.confirmPassword && (
                  <Text size="1" color="red">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </Box>
            </Flex>
          </form>

          {/* Footer */}
          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              form="change-password-form"
              disabled={isSubmitting || changePasswordMutation.isPending}
            >
              {(isSubmitting || changePasswordMutation.isPending) && (
                <span className="animate-spin mr-2">⏳</span>
              )}
              Cambiar Contraseña
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
