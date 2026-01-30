import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea, TextArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { tipoConexionSchema, type TipoConexionFormValues } from "@/lib/validations/tipoConexion";
import { type TipoConexion } from "@/types/tipoConexion";
import { useCreateTipoConexion, useUpdateTipoConexion } from "@/hooks/useTipoConexion";
import { toast } from "sonner";

interface TipoConexionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipoConexion?: TipoConexion | null;
  mode: "create" | "edit";
}

export function TipoConexionFormDialog({ open, onOpenChange, tipoConexion, mode }: TipoConexionFormDialogProps) {
  const createMutation = useCreateTipoConexion();
  const updateMutation = useUpdateTipoConexion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TipoConexionFormValues>({
    resolver: zodResolver(tipoConexionSchema),
    defaultValues: {
      ID_TipoConexion: 0,
      Nombre: "",
      Descripcion: "",
      Estado: true,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && tipoConexion) {
      reset({
        ID_TipoConexion: tipoConexion.ID_TipoConexion,
        Nombre: tipoConexion.Nombre,
        Descripcion: tipoConexion.Descripcion || "",
        Estado: tipoConexion.Estado,
        isDefault: tipoConexion.isDefault,
      });
    } else if (mode === "create") {
      reset({
        ID_TipoConexion: 0,
        Nombre: "",
        Descripcion: "",
        Estado: true,
        isDefault: false,
      });
    }
  }, [mode, tipoConexion, reset]);

  const onSubmit = async (data: TipoConexionFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Tipo de Conexión creado exitosamente");
      } else if (mode === "edit" && tipoConexion) {
        await updateMutation.mutateAsync({
          id: tipoConexion.id,
          data: { ...data, id: tipoConexion.id },
        });
        toast.success("Tipo de Conexión actualizado exitosamente");
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
            {mode === "create" ? "Nuevo Tipo de Conexión" : "Editar Tipo de Conexión"}
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
                    placeholder="Nombre del tipo de conexión"
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
                    Descripción
                  </Text>
                  <TextArea
                    {...register("Descripcion")}
                    placeholder="Descripción del tipo de conexión..."
                    disabled={isSubmitting}
                    rows={4}
                  />
                  {errors.Descripcion && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Descripcion.message}
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

              <Box>
                <Flex align="center" gap="2">
                  <input
                    type="checkbox"
                    {...register("isDefault")}
                    disabled={isSubmitting || (mode === "edit" && tipoConexion?.isDefault)}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">
                    <Text size="2">Por Defecto</Text>
                  </label>
                </Flex>
                {mode === "edit" && tipoConexion?.isDefault && (
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
