import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { servicioSchema, type ServicioFormValues } from "@/lib/validations/servicios";
import { type Servicio } from "@/types/servicios";
import { useCreateServicio, useUpdateServicio } from "@/hooks/useServicios";
import { toast } from "sonner";

interface ServiciosFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicios?: Servicio | null;
  mode: "create" | "edit";
}

export function ServiciosFormDialog({ open, onOpenChange, servicios, mode }: ServiciosFormDialogProps) {
  const createMutation = useCreateServicio();
  const updateMutation = useUpdateServicio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      ID_Servicio: 0,
      Desde: 0,
      Hasta: 0,
      Codigo: "",
      Precio: 0,
      Unidad_Medida: "",
      Estado: true,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && servicios) {
      reset({
        ID_Servicio: servicios.ID_Servicio,
        Desde: servicios.Desde,
        Hasta: servicios.Hasta,
        Codigo: servicios.Codigo || "",
        Precio: servicios.Precio,
        Unidad_Medida: servicios.Unidad_Medida || "",
        Estado: servicios.Estado,
        isDefault: servicios.isDefault,
      });
    } else if (mode === "create") {
      reset({
        ID_Servicio: 0,
        Desde: 0,
        Hasta: 0,
        Codigo: "",
        Precio: 0,
        Unidad_Medida: "",
        Estado: true,
        isDefault: false,
      });
    }
  }, [mode, servicios, reset]);

  const onSubmit = async (data: ServicioFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Servicio AFO creado exitosamente");
      } else if (mode === "edit" && servicios) {
        await updateMutation.mutateAsync({
          id: servicios.id,
          data: { ...data, id: servicios.id },
        });
        toast.success("Servicio AFO actualizado exitosamente");
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
            {mode === "create" ? "Nuevo Servicio AFO" : "Editar Servicio AFO"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

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
                    placeholder="Código del servicio"
                    disabled={isSubmitting}
                  />
                  {errors.Codigo && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Codigo.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Desde <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("Desde", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                    {errors.Desde && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Desde.message}
                      </Text>
                    )}
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Hasta <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("Hasta", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                    {errors.Hasta && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Hasta.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>

              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Precio <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("Precio", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                    {errors.Precio && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Precio.message}
                      </Text>
                    )}
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Unidad de Medida
                    </Text>
                    <TextField.Root
                      {...register("Unidad_Medida")}
                      placeholder="ej: Metro, Kilómetro"
                      disabled={isSubmitting}
                    />
                    {errors.Unidad_Medida && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Unidad_Medida.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>

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
                    disabled={isSubmitting || (mode === "edit" && servicios?.isDefault)}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">
                    <Text size="2">Por Defecto</Text>
                  </label>
                </Flex>
                {mode === "edit" && servicios?.isDefault && (
                  <Text size="1" style={{ color: "var(--orange-9)" }} mt="1">
                    Los registros marcados como "Por Defecto" no pueden modificar este estado
                  </Text>
                )}
              </Box>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray" type="button" disabled={isSubmitting}>
                    Cerrar
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </Flex>
            </Flex>
          </form>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}
