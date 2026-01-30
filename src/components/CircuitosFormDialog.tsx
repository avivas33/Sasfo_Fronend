import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { circuitoSchema, type CircuitoFormValues } from "@/lib/validations/circuitos";
import { type Circuito } from "@/types/circuitos";
import { useCreateCircuito, useUpdateCircuito } from "@/hooks/useCircuitos";
import { toast } from "sonner";

interface CircuitosFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuito?: Circuito | null;
  mode: "create" | "edit";
}

export function CircuitosFormDialog({ open, onOpenChange, circuito, mode }: CircuitosFormDialogProps) {
  const createMutation = useCreateCircuito();
  const updateMutation = useUpdateCircuito();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CircuitoFormValues>({
    resolver: zodResolver(circuitoSchema),
    defaultValues: {
      CircuitID: "",
      Circuiot_ID: 0,
      ID_ServiceLocation: 0,
      ServiceLocation: "",
      Coordenadas1: "",
      Coordenadas2: "",
      Estado: true,
      Inquilino: "",
      ID_AreaDesarrollo: 0,
      ID_ListaUbicaciones: 0,
      VetroId: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && circuito) {
      reset({
        CircuitID: circuito.CircuitID || "",
        Circuiot_ID: circuito.Circuiot_ID,
        ID_ServiceLocation: circuito.ID_ServiceLocation,
        ServiceLocation: circuito.ServiceLocation || "",
        Coordenadas1: circuito.Coordenadas1 || "",
        Coordenadas2: circuito.Coordenadas2 || "",
        Estado: circuito.Estado,
        Inquilino: circuito.Inquilino || "",
        ID_AreaDesarrollo: circuito.ID_AreaDesarrollo,
        ID_ListaUbicaciones: circuito.ID_ListaUbicaciones,
        VetroId: circuito.VetroId || "",
      });
    } else if (mode === "create") {
      reset({
        CircuitID: "",
        Circuiot_ID: 0,
        ID_ServiceLocation: 0,
        ServiceLocation: "",
        Coordenadas1: "",
        Coordenadas2: "",
        Estado: true,
        Inquilino: "",
        ID_AreaDesarrollo: 0,
        ID_ListaUbicaciones: 0,
        VetroId: "",
      });
    }
  }, [mode, circuito, reset]);

  const onSubmit = async (data: CircuitoFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Circuito creado exitosamente");
      } else if (mode === "edit" && circuito) {
        await updateMutation.mutateAsync({
          id: circuito.ID_CircuitosSLPE,
          data: { ...data, ID_CircuitosSLPE: circuito.ID_CircuitosSLPE },
        });
        toast.success("Circuito actualizado exitosamente");
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Ha ocurrido un error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 700 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Nuevo Circuito" : "Editar Circuito"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <ScrollArea style={{ maxHeight: "70vh" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4" pr="3">
              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Código Circuito <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("CircuitID")}
                      placeholder="Código del circuito"
                      disabled={isSubmitting}
                    />
                    {errors.CircuitID && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.CircuitID.message}
                      </Text>
                    )}
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Código Poste
                    </Text>
                    <TextField.Root
                      {...register("ServiceLocation")}
                      placeholder="Código del poste"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
              </Flex>

              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      ID Circuito Vetro
                    </Text>
                    <TextField.Root
                      {...register("Circuiot_ID", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      ID Service Location
                    </Text>
                    <TextField.Root
                      {...register("ID_ServiceLocation", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
              </Flex>

              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Latitud
                    </Text>
                    <TextField.Root
                      {...register("Coordenadas1")}
                      placeholder="Latitud"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Longitud
                    </Text>
                    <TextField.Root
                      {...register("Coordenadas2")}
                      placeholder="Longitud"
                      disabled={isSubmitting}
                    />
                  </label>
                </Box>
              </Flex>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Inquilino
                  </Text>
                  <TextField.Root
                    {...register("Inquilino")}
                    placeholder="Nombre del inquilino"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Flex gap="3">
                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      ID Área Desarrollo <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("ID_AreaDesarrollo", { valueAsNumber: true })}
                      type="number"
                      placeholder="ID del área"
                      disabled={isSubmitting}
                    />
                    {errors.ID_AreaDesarrollo && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.ID_AreaDesarrollo.message}
                      </Text>
                    )}
                  </label>
                </Box>

                <Box style={{ flex: 1 }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      ID Ubicación <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("ID_ListaUbicaciones", { valueAsNumber: true })}
                      type="number"
                      placeholder="ID de ubicación"
                      disabled={isSubmitting}
                    />
                    {errors.ID_ListaUbicaciones && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.ID_ListaUbicaciones.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Vetro ID
                  </Text>
                  <TextField.Root
                    {...register("VetroId")}
                    placeholder="ID de Vetro"
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
