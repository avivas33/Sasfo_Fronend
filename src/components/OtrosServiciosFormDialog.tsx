import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea, TextArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { otroServicioSchema, type OtroServicioFormValues } from "@/lib/validations/otrosServicios";
import { type OtroServicio } from "@/types/otrosServicios";
import { useCreateOtroServicio, useUpdateOtroServicio } from "@/hooks/useOtrosServicios";
import { toast } from "sonner";

interface OtrosServiciosFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otroServicio?: OtroServicio | null;
  mode: "create" | "edit";
}

export function OtrosServiciosFormDialog({ open, onOpenChange, otroServicio, mode }: OtrosServiciosFormDialogProps) {
  const createMutation = useCreateOtroServicio();
  const updateMutation = useUpdateOtroServicio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OtroServicioFormValues>({
    resolver: zodResolver(otroServicioSchema),
    defaultValues: {
      Nombre: "",
      Observaciones: "",
      MRC: 0,
      NRC: 0,
      Estado: true,
    },
  });

  useEffect(() => {
    if (mode === "edit" && otroServicio) {
      reset({
        Nombre: otroServicio.Nombre,
        Observaciones: otroServicio.Observaciones || "",
        MRC: otroServicio.MRC,
        NRC: otroServicio.NRC,
        Estado: otroServicio.Estado,
      });
    } else if (mode === "create") {
      reset({
        Nombre: "",
        Observaciones: "",
        MRC: 0,
        NRC: 0,
        Estado: true,
      });
    }
  }, [mode, otroServicio, reset]);

  const onSubmit = async (data: OtroServicioFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Otro Servicio creado exitosamente");
      } else if (mode === "edit" && otroServicio) {
        await updateMutation.mutateAsync({
          id: otroServicio.id,
          data: { ...data, id: otroServicio.id },
        });
        toast.success("Otro Servicio actualizado exitosamente");
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
            {mode === "create" ? "Nuevo Otro Servicio" : "Editar Otro Servicio"}
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
                    Nombre <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <TextField.Root
                    {...register("Nombre")}
                    placeholder="Nombre del servicio"
                    disabled={isSubmitting}
                  />
                  {errors.Nombre && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Nombre.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      MRC <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("MRC", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                    {errors.MRC && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.MRC.message}
                      </Text>
                    )}
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      NRC <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("NRC", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                    {errors.NRC && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.NRC.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Observaciones
                  </Text>
                  <TextArea
                    {...register("Observaciones")}
                    placeholder="Observaciones adicionales"
                    disabled={isSubmitting}
                    rows={4}
                  />
                  {errors.Observaciones && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Observaciones.message}
                    </Text>
                  )}
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
