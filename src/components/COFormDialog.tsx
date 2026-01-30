import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { coSchema, type COFormValues } from "@/lib/validations/co";
import { type CO } from "@/types/co";
import { useCreateCO, useUpdateCO } from "@/hooks/useCO";
import { toast } from "sonner";

interface COFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  co?: CO | null;
  mode: "create" | "edit";
}

export function COFormDialog({ open, onOpenChange, co, mode }: COFormDialogProps) {
  const createMutation = useCreateCO();
  const updateMutation = useUpdateCO();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<COFormValues>({
    resolver: zodResolver(coSchema),
    defaultValues: {
      Codigo: "",
      Nombre: "",
      Nombre_Proyecto: "",
      Nombre_Plan: "",
      Estado: true,
      isDefault: false,
      coordenadas1: "",
      coordenadas2: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && co) {
      reset({
        Codigo: co.Codigo || "",
        Nombre: co.Nombre,
        Nombre_Proyecto: co.Nombre_Proyecto || "",
        Nombre_Plan: co.Nombre_Plan || "",
        Estado: co.Estado,
        isDefault: co.isDefault,
        coordenadas1: co.coordenadas1 || "",
        coordenadas2: co.coordenadas2 || "",
      });
    } else if (mode === "create") {
      reset({
        Codigo: "",
        Nombre: "",
        Nombre_Proyecto: "",
        Nombre_Plan: "",
        Estado: true,
        isDefault: false,
        coordenadas1: "",
        coordenadas2: "",
      });
    }
  }, [mode, co, reset]);

  const onSubmit = async (data: COFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("CO creado exitosamente");
      } else if (mode === "edit" && co) {
        await updateMutation.mutateAsync({
          id: co.id,
          data: { ...data, id: co.id },
        });
        toast.success("CO actualizado exitosamente");
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Ha ocurrido un error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Crear Compañía de Enlace" : "Editar Compañía de Enlace"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear una compañía de enlace"
            : "Actualice la información de la compañía de enlace"}
        </Dialog.Description>

        <ScrollArea style={{ maxHeight: "60vh" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4" pr="3">
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Código
                  </Text>
                  <TextField.Root
                    {...register("Codigo")}
                    placeholder="Ingrese el código"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Nombre / Razón Social <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <TextField.Root
                    {...register("Nombre")}
                    placeholder="Ingrese el nombre"
                    disabled={isSubmitting}
                  />
                  {errors.Nombre && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Nombre.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Nombre del Proyecto
                  </Text>
                  <TextField.Root
                    {...register("Nombre_Proyecto")}
                    placeholder="Ingrese el nombre del proyecto"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Nombre del Plan
                  </Text>
                  <TextField.Root
                    {...register("Nombre_Plan")}
                    placeholder="Ingrese el nombre del plan"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Latitud (Coordenada 1)
                  </Text>
                  <TextField.Root
                    {...register("coordenadas1")}
                    placeholder="Ej: 8.9824"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Longitud (Coordenada 2)
                  </Text>
                  <TextField.Root
                    {...register("coordenadas2")}
                    placeholder="Ej: -79.5199"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <Flex align="center" gap="2">
                  <input
                    type="checkbox"
                    {...register("Estado")}
                    disabled={isSubmitting}
                    id="Estado"
                  />
                  <label htmlFor="Estado">
                    <Text size="2">Activo</Text>
                  </label>
                </Flex>
              </Box>

              <Box>
                <Flex align="center" gap="2">
                  <input
                    type="checkbox"
                    {...register("isDefault")}
                    disabled={isSubmitting || (mode === "edit" && co?.isDefault)}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">
                    <Text size="2">Agregar como SL especial en Service Location</Text>
                  </label>
                </Flex>
                {mode === "edit" && co?.isDefault && (
                  <Text size="1" style={{ color: "var(--orange-9)" }} mt="1">
                    Los registros marcados como "Por Defecto" no pueden modificar este estado
                  </Text>
                )}
              </Box>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray" type="button" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
                </Button>
              </Flex>
            </Flex>
          </form>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}
