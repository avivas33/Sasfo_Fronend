import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, ScrollArea, Tabs } from "@radix-ui/themes";
import { X } from "lucide-react";
import { enlaceSchema, type EnlaceFormValues } from "@/lib/validations/enlaces";
import { type Enlace } from "@/types/enlaces";
import { useCreateEnlace, useUpdateEnlace } from "@/hooks/useEnlaces";
import { toast } from "sonner";

interface EnlacesFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enlace?: Enlace | null;
  mode: "create" | "edit";
}

export function EnlacesFormDialog({ open, onOpenChange, enlace, mode }: EnlacesFormDialogProps) {
  const createMutation = useCreateEnlace();
  const updateMutation = useUpdateEnlace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnlaceFormValues>({
    resolver: zodResolver(enlaceSchema),
    defaultValues: {
      Cliente: "",
      Fecha_Activacion: "",
      Area_DesarrolloA: "",
      Area_DesarrolloZ: "",
      SitioA: "",
      SitioZ: "",
      Carrier: "",
      Codigo_AFO: "",
      MRC_Venta: 0,
      MRC_Costo: 0,
      Estado: true,
      ODFP1: 0,
      ODFP2: 0,
      DistanciaP1: 0,
      DistanciaP2: 0,
      ID_Viabilidad: 0,
      ID_EstadoEnlace: 0,
      ID_OrdenServicio: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && enlace) {
      reset({
        Cliente: enlace.Cliente || "",
        Fecha_Activacion: enlace.Fecha_Activacion || "",
        Area_DesarrolloA: enlace.Area_DesarrolloA || "",
        Area_DesarrolloZ: enlace.Area_DesarrolloZ || "",
        SitioA: enlace.SitioA || "",
        SitioZ: enlace.SitioZ || "",
        Carrier: enlace.Carrier || "",
        Codigo_AFO: enlace.Codigo_AFO || "",
        MRC_Venta: enlace.MRC_Venta,
        MRC_Costo: enlace.MRC_Costo,
        Estado: enlace.Estado,
        ODFP1: enlace.ODFP1,
        ODFP2: enlace.ODFP2,
        DistanciaP1: enlace.DistanciaP1,
        DistanciaP2: enlace.DistanciaP2,
        ID_Viabilidad: enlace.ID_Viabilidad,
        ID_EstadoEnlace: enlace.ID_EstadoEnlace,
        ID_OrdenServicio: enlace.ID_OrdenServicio,
      });
    } else if (mode === "create") {
      reset({
        Cliente: "",
        Estado: true,
        MRC_Venta: 0,
        MRC_Costo: 0,
        ODFP1: 0,
        ODFP2: 0,
        DistanciaP1: 0,
        DistanciaP2: 0,
        ID_Viabilidad: 0,
        ID_EstadoEnlace: 0,
        ID_OrdenServicio: 0,
      });
    }
  }, [mode, enlace, reset]);

  const onSubmit = async (data: EnlaceFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Enlace creado exitosamente");
      } else if (mode === "edit" && enlace) {
        await updateMutation.mutateAsync({
          id: enlace.ID_Enlace,
          data: { ...data, ID_Enlace: enlace.ID_Enlace },
        });
        toast.success("Enlace actualizado exitosamente");
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Ha ocurrido un error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Nuevo Enlace" : "Editar Enlace"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <ScrollArea style={{ maxHeight: "70vh" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs.Root defaultValue="general">
              <Tabs.List>
                <Tabs.Trigger value="general">General</Tabs.Trigger>
                <Tabs.Trigger value="sitios">Sitios</Tabs.Trigger>
                <Tabs.Trigger value="costos">Costos</Tabs.Trigger>
              </Tabs.List>

              <Box pt="3" pr="3">
                <Tabs.Content value="general">
                  <Flex direction="column" gap="4">
                    <Box>
                      <label>
                        <Text as="div" size="2" mb="1" weight="medium">
                          Cliente <span style={{ color: "var(--red-9)" }}>*</span>
                        </Text>
                        <TextField.Root
                          {...register("Cliente")}
                          placeholder="Nombre del cliente"
                          disabled={isSubmitting}
                        />
                        {errors.Cliente && (
                          <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                            {errors.Cliente.message}
                          </Text>
                        )}
                      </label>
                    </Box>

                    <Flex gap="3">
                      <Box style={{ flex: 1 }}>
                        <label>
                          <Text as="div" size="2" mb="1" weight="medium">
                            Código AFO
                          </Text>
                          <TextField.Root
                            {...register("Codigo_AFO")}
                            placeholder="Código AFO"
                            disabled={isSubmitting}
                          />
                        </label>
                      </Box>

                      <Box style={{ flex: 1 }}>
                        <label>
                          <Text as="div" size="2" mb="1" weight="medium">
                            Carrier
                          </Text>
                          <TextField.Root
                            {...register("Carrier")}
                            placeholder="Carrier"
                            disabled={isSubmitting}
                          />
                        </label>
                      </Box>
                    </Flex>

                    <Box>
                      <label>
                        <Text as="div" size="2" mb="1" weight="medium">
                          Fecha de Activación
                        </Text>
                        <TextField.Root
                          {...register("Fecha_Activacion")}
                          type="date"
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
                  </Flex>
                </Tabs.Content>

                <Tabs.Content value="sitios">
                  <Flex direction="column" gap="4">
                    <Box>
                      <Text size="3" weight="bold" mb="3">Sitio A</Text>
                      <Flex direction="column" gap="3">
                        <TextField.Root
                          {...register("SitioA")}
                          placeholder="Sitio A"
                          disabled={isSubmitting}
                        />
                        <TextField.Root
                          {...register("Area_DesarrolloA")}
                          placeholder="Área de Desarrollo A"
                          disabled={isSubmitting}
                        />
                      </Flex>
                    </Box>

                    <Box>
                      <Text size="3" weight="bold" mb="3">Sitio Z</Text>
                      <Flex direction="column" gap="3">
                        <TextField.Root
                          {...register("SitioZ")}
                          placeholder="Sitio Z"
                          disabled={isSubmitting}
                        />
                        <TextField.Root
                          {...register("Area_DesarrolloZ")}
                          placeholder="Área de Desarrollo Z"
                          disabled={isSubmitting}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Tabs.Content>

                <Tabs.Content value="costos">
                  <Flex direction="column" gap="4">
                    <Flex gap="3">
                      <Box style={{ flex: 1 }}>
                        <label>
                          <Text as="div" size="2" mb="1" weight="medium">
                            MRC Venta ($)
                          </Text>
                          <TextField.Root
                            {...register("MRC_Venta", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled={isSubmitting}
                          />
                          {errors.MRC_Venta && (
                            <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                              {errors.MRC_Venta.message}
                            </Text>
                          )}
                        </label>
                      </Box>

                      <Box style={{ flex: 1 }}>
                        <label>
                          <Text as="div" size="2" mb="1" weight="medium">
                            MRC Costo ($)
                          </Text>
                          <TextField.Root
                            {...register("MRC_Costo", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled={isSubmitting}
                          />
                        </label>
                      </Box>
                    </Flex>
                  </Flex>
                </Tabs.Content>
              </Box>
            </Tabs.Root>

            <Flex gap="3" mt="4" justify="end" pr="3">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button" disabled={isSubmitting}>
                  Cerrar
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </Flex>
          </form>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}
