import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, Select, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { listaUbicacionSchema, type ListaUbicacionFormValues } from "@/lib/validations/listaUbicaciones";
import { type ListaUbicacion, TipoUbicacion, TipoUbicacionLabels } from "@/types/listaUbicaciones";
import { useCreateListaUbicacion, useUpdateListaUbicacion } from "@/hooks/useListaUbicaciones";
import { useAreasDesarrollo } from "@/hooks/useAreasDesarrollo";
import { toast } from "sonner";

interface ListaUbicacionesFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ubicacion?: ListaUbicacion | null;
  mode: "create" | "edit";
}

export function ListaUbicacionesFormDialog({ open, onOpenChange, ubicacion, mode }: ListaUbicacionesFormDialogProps) {
  const createMutation = useCreateListaUbicacion();
  const updateMutation = useUpdateListaUbicacion();

  // Cargar áreas de desarrollo
  const { data: areasData } = useAreasDesarrollo({ pageSize: 100 });
  const areas = areasData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ListaUbicacionFormValues>({
    resolver: zodResolver(listaUbicacionSchema),
    defaultValues: {
      ID_Ubicaciones: 0,
      Nombre_Ubicacion: "",
      ID_AreaDesarrollo: 0,
      Estado: true,
      Nombre_Area: "",
      Tipo_UbicacionID: TipoUbicacion.No_Clasificado,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && ubicacion) {
      reset({
        ID_Ubicaciones: ubicacion.ID_Ubicaciones,
        Nombre_Ubicacion: ubicacion.Nombre_Ubicacion,
        ID_AreaDesarrollo: ubicacion.ID_AreaDesarrollo,
        Estado: ubicacion.Estado,
        Nombre_Area: ubicacion.Nombre_Area || "",
        Tipo_UbicacionID: ubicacion.Tipo_UbicacionID,
        isDefault: ubicacion.isDefault,
      });
    } else if (mode === "create") {
      reset({
        ID_Ubicaciones: 0,
        Nombre_Ubicacion: "",
        ID_AreaDesarrollo: 0,
        Estado: true,
        Nombre_Area: "",
        Tipo_UbicacionID: TipoUbicacion.No_Clasificado,
        isDefault: false,
      });
    }
  }, [mode, ubicacion, reset]);

  const onSubmit = async (data: ListaUbicacionFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Ubicación creada exitosamente");
      } else if (mode === "edit" && ubicacion) {
        await updateMutation.mutateAsync({
          id: ubicacion.id,
          data: { ...data, id: ubicacion.id },
        });
        toast.success("Ubicación actualizada exitosamente");
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
            {mode === "create" ? "Crear Ubicación" : "Editar Ubicación"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear una ubicación"
            : "Actualice la información de la ubicación"}
        </Dialog.Description>

        <ScrollArea style={{ maxHeight: "60vh" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4" pr="3">
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    ID Ubicaciones
                  </Text>
                  <TextField.Root
                    {...register("ID_Ubicaciones", { valueAsNumber: true })}
                    type="number"
                    placeholder="Ingrese el ID de ubicaciones"
                    disabled={isSubmitting}
                  />
                  {errors.ID_Ubicaciones && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.ID_Ubicaciones.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Nombre de la Ubicación <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <TextField.Root
                    {...register("Nombre_Ubicacion")}
                    placeholder="Ingrese el nombre de la ubicación"
                    disabled={isSubmitting}
                  />
                  {errors.Nombre_Ubicacion && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Nombre_Ubicacion.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Área de Desarrollo <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <Controller
                    name="ID_AreaDesarrollo"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger style={{ width: "100%" }} placeholder="Seleccione un área de desarrollo" />
                        <Select.Content>
                          <Select.Item value="0">Seleccione un área</Select.Item>
                          {areas.map((area) => (
                            <Select.Item key={area.id} value={area.id.toString()}>
                              {area.Nombre_AreaDesarrollo}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                  {errors.ID_AreaDesarrollo && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.ID_AreaDesarrollo.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Tipo de Ubicación <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <Controller
                    name="Tipo_UbicacionID"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || "1"}
                        onValueChange={(value) => field.onChange(parseInt(value) as TipoUbicacion)}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger style={{ width: "100%" }} placeholder="Seleccione un tipo" />
                        <Select.Content>
                          {Object.entries(TipoUbicacionLabels).map(([key, label]) => (
                            <Select.Item key={key} value={key}>
                              {label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                  {errors.Tipo_UbicacionID && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Tipo_UbicacionID.message}
                    </Text>
                  )}
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Nombre del Área (Opcional)
                  </Text>
                  <TextField.Root
                    {...register("Nombre_Area")}
                    placeholder="Ingrese el nombre del área"
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
                    disabled={isSubmitting || (mode === "edit" && ubicacion?.isDefault)}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">
                    <Text size="2">Marcar como ubicación por defecto</Text>
                  </label>
                </Flex>
                {mode === "edit" && ubicacion?.isDefault && (
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
