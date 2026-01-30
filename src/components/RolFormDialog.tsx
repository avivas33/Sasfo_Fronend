import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { X, Shield } from "lucide-react";
import { Rol, CreateRolData, UpdateRolData } from "@/types/rol";
import { useCreateRol, useUpdateRol } from "@/hooks/useRoles";
import { toast } from "sonner";

const rolSchema = z.object({
  name: z.string().min(1, "El nombre del rol es requerido").max(50, "El nombre no puede exceder 50 caracteres"),
});

type RolFormValues = z.infer<typeof rolSchema>;

interface RolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rol?: Rol | null;
  mode: "create" | "edit";
}

export function RolFormDialog({ open, onOpenChange, rol, mode }: RolFormDialogProps) {
  const createMutation = useCreateRol();
  const updateMutation = useUpdateRol();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RolFormValues>({
    resolver: zodResolver(rolSchema),
    defaultValues: {
      name: "",
    },
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && rol) {
      reset({
        name: rol.Name,
      });
    } else if (mode === "create") {
      reset({
        name: "",
      });
    }
  }, [mode, rol, open]);

  const onSubmit = async (data: RolFormValues) => {
    try {
      if (mode === "create") {
        const createData: CreateRolData = {
          Name: data.name,
        };
        await createMutation.mutateAsync(createData);
        toast.success("Rol creado exitosamente");
      } else if (mode === "edit" && rol) {
        const updateData: UpdateRolData = {
          Name: data.name,
        };
        await updateMutation.mutateAsync({ id: rol.Id, data: updateData });
        toast.success("Rol actualizado exitosamente");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || (mode === "create" ? "Error al crear rol" : "Error al actualizar rol"));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 400 }}>
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Shield className="w-5 h-5" />
              <Dialog.Title>
                {mode === "create" ? "Nuevo Rol" : "Editar Rol"}
              </Dialog.Title>
            </Flex>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </Flex>

          <Dialog.Description size="2" color="gray">
            {mode === "create"
              ? "Ingrese el nombre del nuevo rol. Los permisos se pueden configurar después de crearlo."
              : "Modifique el nombre del rol"}
          </Dialog.Description>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} id="rol-form">
            <Flex direction="column" gap="4">
              {/* Nombre */}
              <Box>
                <Text size="2" weight="medium" as="label" htmlFor="name">
                  Nombre del Rol <Text color="red">*</Text>
                </Text>
                <TextField.Root
                  id="name"
                  {...register("name")}
                  placeholder="Ej: Administrador, Usuario, Operador..."
                  autoFocus
                />
                {errors.name && (
                  <Text size="1" color="red">
                    {errors.name.message}
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
              form="rol-form"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
                <span className="animate-spin mr-2">⏳</span>
              )}
              {mode === "create" ? "Crear Rol" : "Guardar Cambios"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
