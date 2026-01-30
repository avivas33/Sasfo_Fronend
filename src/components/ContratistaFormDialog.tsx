import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea, TextArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { contratistaSchema, type ContratistaFormValues } from "@/lib/validations/contratista";
import { type Contratista } from "@/types/contratista";
import { useCreateContratista, useUpdateContratista } from "@/hooks/useContratistas";
import { toast } from "sonner";

interface ContratistaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratista?: Contratista | null;
  mode: "create" | "edit";
}

export function ContratistaFormDialog({ open, onOpenChange, contratista, mode }: ContratistaFormDialogProps) {
  const createMutation = useCreateContratista();
  const updateMutation = useUpdateContratista();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContratistaFormValues>({
    resolver: zodResolver(contratistaSchema),
    defaultValues: {
      Nombre: "",
      RUC: "",
      Direccion: "",
      Corregimiento: "",
      Distrito: "",
      Provincia: "",
      Pais: "",
      Tipo_empresa: "CONTRATISTA",
      Fecha_Firma_Contrato: new Date().toISOString().split('T')[0],
      Fecha_Vigencia_Contrato: new Date().toISOString().split('T')[0],
      note: "",
    },
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && contratista) {
      reset({
        Nombre: contratista.Nombre,
        RUC: contratista.RUC || "",
        Direccion: contratista.Direccion || "",
        Corregimiento: contratista.Corregimiento || "",
        Distrito: contratista.Distrito || "",
        Provincia: contratista.Provincia || "",
        Pais: contratista.Pais || "",
        Tipo_empresa: contratista.Tipo_empresa,
        Fecha_Firma_Contrato: contratista.Fecha_Firma_Contrato
          ? new Date(contratista.Fecha_Firma_Contrato).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        Fecha_Vigencia_Contrato: contratista.Fecha_Vigencia_Contrato
          ? new Date(contratista.Fecha_Vigencia_Contrato).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        note: contratista.note || "",
      });
    } else if (mode === "create") {
      reset({
        Nombre: "",
        RUC: "",
        Direccion: "",
        Corregimiento: "",
        Distrito: "",
        Provincia: "",
        Pais: "",
        Tipo_empresa: "CONTRATISTA",
        Fecha_Firma_Contrato: new Date().toISOString().split('T')[0],
        Fecha_Vigencia_Contrato: new Date().toISOString().split('T')[0],
        note: "",
      });
    }
  }, [mode, contratista, reset]);

  const onSubmit = async (data: ContratistaFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Contratista creado exitosamente");
      } else if (mode === "edit" && contratista) {
        await updateMutation.mutateAsync({
          id: contratista.id,
          data: {
            ...data,
            id: contratista.id,
          },
        });
        toast.success("Contratista actualizado exitosamente");
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
      <Dialog.Content style={{ maxWidth: 650 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Crear Contratista" : "Editar Contratista"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear un contratista"
            : "Actualice la información del contratista"}
        </Dialog.Description>

        <ScrollArea style={{ maxHeight: "60vh" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4">
              {/* Información Básica */}
              <Text size="3" weight="bold">Información Básica</Text>

              {/* Nombre */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Razón Social <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <TextField.Root
                    {...register("Nombre")}
                    placeholder="Ingrese la razón social"
                    disabled={isSubmitting}
                  />
                  {errors.Nombre && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Nombre.message}
                    </Text>
                  )}
                </label>
              </Box>

              {/* RUC */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    RUC
                  </Text>
                  <TextField.Root
                    {...register("RUC")}
                    placeholder="Ingrese el RUC"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Ubicación */}
              <Text size="3" weight="bold" className="mt-2">Ubicación</Text>

              {/* Dirección */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Dirección
                  </Text>
                  <TextField.Root
                    {...register("Direccion")}
                    placeholder="Ingrese la dirección"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Corregimiento / Distrito */}
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Corregimiento
                    </Text>
                    <TextField.Root
                      {...register("Corregimiento")}
                      placeholder="Corregimiento"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Distrito
                    </Text>
                    <TextField.Root
                      {...register("Distrito")}
                      placeholder="Distrito"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
              </Flex>

              {/* Provincia / País */}
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Provincia
                    </Text>
                    <TextField.Root
                      {...register("Provincia")}
                      placeholder="Provincia"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      País
                    </Text>
                    <TextField.Root
                      {...register("Pais")}
                      placeholder="País"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
              </Flex>

              {/* Información del Contrato */}
              <Text size="3" weight="bold" className="mt-2">Información del Contrato</Text>

              {/* Fechas */}
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Fecha de Firma <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("Fecha_Firma_Contrato")}
                      type="date"
                      disabled={isSubmitting}
                    />
                    {errors.Fecha_Firma_Contrato && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Fecha_Firma_Contrato.message}
                      </Text>
                    )}
                  </label>
                </Box>
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Fecha de Vigencia <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("Fecha_Vigencia_Contrato")}
                      type="date"
                      disabled={isSubmitting}
                    />
                    {errors.Fecha_Vigencia_Contrato && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Fecha_Vigencia_Contrato.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>

              {/* Notas */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Notas Adicionales
                  </Text>
                  <TextArea
                    {...register("note")}
                    placeholder="Ingrese notas adicionales (opcional)"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </label>
              </Box>

              {/* Botones */}
              <Flex gap="3" mt="4" justify="end">
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
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
