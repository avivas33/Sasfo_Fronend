import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, Select, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { contactoSchema, type ContactoFormValues } from "@/lib/validations/contacto";
import { TipoContacto, TipoContactoLabels, type Contacto } from "@/types/contacto";
import { useCreateContacto, useUpdateContacto } from "@/hooks/useContactos";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "sonner";

interface ContactoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacto?: Contacto | null;
  mode: "create" | "edit";
}

export function ContactoFormDialog({ open, onOpenChange, contacto, mode }: ContactoFormDialogProps) {
  const createMutation = useCreateContacto();
  const updateMutation = useUpdateContacto();

  // Cargar empresas para el selector
  const { data: empresasData } = useEmpresas({ pageSize: 100 });
  const empresas = empresasData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      Nombre: "",
      Telefono_Fijo: "",
      Telefono_movil: "",
      extension: undefined,
      correo_electronico: "",
      tipo_contacto: TipoContacto.SIN_CLASIFICAR,
      ID_Empresa: 0,
      Cedula: "",
      ID_Carrier_Hansa: "",
      ID_Carrier_Interface: "",
      isDefault: false,
    },
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && contacto) {
      reset({
        Nombre: contacto.Nombre,
        Telefono_Fijo: contacto.Telefono_Fijo || "",
        Telefono_movil: contacto.Telefono_movil || "",
        extension: contacto.extension || undefined,
        correo_electronico: contacto.correo_electronico || "",
        tipo_contacto: contacto.tipo_contacto,
        ID_Empresa: contacto.ID_Empresa,
        Cedula: contacto.Cedula || "",
        ID_Carrier_Hansa: contacto.ID_Carrier_Hansa || "",
        ID_Carrier_Interface: contacto.ID_Carrier_Interface || "",
        isDefault: contacto.isDefault,
      });
    } else if (mode === "create") {
      reset({
        Nombre: "",
        Telefono_Fijo: "",
        Telefono_movil: "",
        extension: undefined,
        correo_electronico: "",
        tipo_contacto: TipoContacto.SIN_CLASIFICAR,
        ID_Empresa: 0,
        Cedula: "",
        ID_Carrier_Hansa: "",
        ID_Carrier_Interface: "",
        isDefault: false,
      });
    }
  }, [mode, contacto, reset]);

  const onSubmit = async (data: ContactoFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Contacto creado exitosamente");
      } else if (mode === "edit" && contacto) {
        await updateMutation.mutateAsync({
          id: contacto.id,
          data: {
            ...data,
            id: contacto.id,
          },
        });
        toast.success("Contacto actualizado exitosamente");
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
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Crear Contacto" : "Editar Contacto"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear un contacto"
            : "Actualice la información del contacto"}
        </Dialog.Description>

        <ScrollArea style={{ maxHeight: "60vh" }}>
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
                    placeholder="Ingrese el nombre del contacto"
                    disabled={isSubmitting}
                  />
                  {errors.Nombre && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Nombre.message}
                    </Text>
                  )}
                </label>
              </Box>

              {/* Cédula */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Cédula
                  </Text>
                  <TextField.Root
                    {...register("Cedula")}
                    placeholder="Ingrese la cédula"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Empresa */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Empresa <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <Controller
                    name="ID_Empresa"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger placeholder="Seleccione una empresa" />
                        <Select.Content>
                          {empresas.map((empresa) => (
                            <Select.Item key={empresa.id} value={empresa.id.toString()}>
                              {empresa.Nombre}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                  {errors.ID_Empresa && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.ID_Empresa.message}
                    </Text>
                  )}
                </label>
              </Box>

              {/* Tipo de Contacto */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Tipo de Contacto <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <Controller
                    name="tipo_contacto"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger placeholder="Seleccione el tipo" />
                        <Select.Content>
                          {Object.entries(TipoContactoLabels).map(([key, label]) => (
                            <Select.Item key={key} value={key}>
                              {label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </label>
              </Box>

              {/* Teléfono Fijo */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Teléfono Fijo
                  </Text>
                  <TextField.Root
                    {...register("Telefono_Fijo")}
                    placeholder="Ej: 123-4567"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Teléfono Móvil */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Teléfono Móvil
                  </Text>
                  <TextField.Root
                    {...register("Telefono_movil")}
                    placeholder="Ej: 6000-0000"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Extensión */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Extensión
                  </Text>
                  <TextField.Root
                    {...register("extension", {
                      setValueAs: (v) => (v === "" ? undefined : parseInt(v)),
                    })}
                    type="number"
                    placeholder="Ej: 1234"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Correo Electrónico */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Correo Electrónico
                  </Text>
                  <TextField.Root
                    {...register("correo_electronico")}
                    type="email"
                    placeholder="ejemplo@correo.com"
                    disabled={isSubmitting}
                  />
                  {errors.correo_electronico && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.correo_electronico.message}
                    </Text>
                  )}
                </label>
              </Box>

              {/* Carrier Hansa */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    ID Carrier Hansa
                  </Text>
                  <TextField.Root
                    {...register("ID_Carrier_Hansa")}
                    placeholder="Ingrese el ID"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Carrier Interface */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    ID Carrier Interface
                  </Text>
                  <TextField.Root
                    {...register("ID_Carrier_Interface")}
                    placeholder="Ingrese el ID"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              {/* Por Defecto */}
              <Box>
                <Flex align="center" gap="2">
                  <input
                    type="checkbox"
                    {...register("isDefault")}
                    disabled={isSubmitting || (mode === "edit" && contacto?.isDefault)}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">
                    <Text size="2">Marcar como por defecto</Text>
                  </label>
                </Flex>
                {mode === "edit" && contacto?.isDefault && (
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
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}
