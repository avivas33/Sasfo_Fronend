import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { X } from "lucide-react";
import { areaDesarrolloSchema, type AreaDesarrolloFormValues } from "@/lib/validations/areaDesarrollo";
import { type AreaDesarrollo } from "@/types/areaDesarrollo";
import { useCreateAreaDesarrollo, useUpdateAreaDesarrollo } from "@/hooks/useAreasDesarrollo";
import { toast } from "sonner";

interface AreaDesarrolloFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area?: AreaDesarrollo | null;
  mode: "create" | "edit";
}

export function AreaDesarrolloFormDialog({ open, onOpenChange, area, mode }: AreaDesarrolloFormDialogProps) {
  const createMutation = useCreateAreaDesarrollo();
  const updateMutation = useUpdateAreaDesarrollo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AreaDesarrolloFormValues>({
    resolver: zodResolver(areaDesarrolloSchema),
    defaultValues: {
      Nombre: "",
      ID_Area: 0,
      isDefault: false,
    },
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && area) {
      reset({
        Nombre: area.Nombre,
        ID_Area: area.ID_Area,
        isDefault: area.isDefault,
      });
    } else if (mode === "create") {
      reset({
        Nombre: "",
        ID_Area: 0,
        isDefault: false,
      });
    }
  }, [mode, area, reset]);

  const onSubmit = async (data: AreaDesarrolloFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Área de desarrollo creada exitosamente");
      } else if (mode === "edit" && area) {
        await updateMutation.mutateAsync({
          id: area.id,
          data: {
            ...data,
            id: area.id,
          },
        });
        toast.success("Área de desarrollo actualizada exitosamente");
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      const errorMessage = error?.message || "Ha ocurrido un error";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Crear Área de Desarrollo" : "Editar Área de Desarrollo"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear un área de desarrollo"
            : "Actualice la información del área de desarrollo"}
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            {/* Nombre */}
            <Box>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  Nombre <span style={{ color: "var(--red-9)" }}>*</span>
                </Text>
                <TextField.Root
                  {...register("Nombre")}
                  placeholder="Ingrese el nombre del área"
                  disabled={isSubmitting}
                />
                {errors.Nombre && (
                  <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                    {errors.Nombre.message}
                  </Text>
                )}
              </label>
            </Box>

            {/* ID Area (opcional - informativo en edit) */}
            {mode === "edit" && area && (
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    ID Área
                  </Text>
                  <TextField.Root
                    value={area.ID_Area.toString()}
                    disabled
                  />
                </label>
              </Box>
            )}

            {/* Por Defecto (checkbox) */}
            <Box>
              <Flex align="center" gap="2">
                <input
                  type="checkbox"
                  {...register("isDefault")}
                  disabled={isSubmitting || (mode === "edit" && area?.isDefault)}
                  id="isDefault"
                />
                <label htmlFor="isDefault">
                  <Text size="2">Marcar como por defecto</Text>
                </label>
              </Flex>
              {mode === "edit" && area?.isDefault && (
                <Text size="1" style={{ color: "var(--orange-9)" }} mt="1">
                  Los registros marcados como "Por Defecto" no pueden modificar este estado
                </Text>
              )}
            </Box>

            {/* Botones */}
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : mode === "create"
                  ? "Crear"
                  : "Actualizar"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
