import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, Select, ScrollArea, TextArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { odfSchema, type ODFFormValues } from "@/lib/validations/odf";
import { type ODF } from "@/types/odf";
import { useCreateODF, useUpdateODF } from "@/hooks/useODF";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "sonner";

interface ODFFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  odf?: ODF | null;
  mode: "create" | "edit";
}

export function ODFFormDialog({ open, onOpenChange, odf, mode }: ODFFormDialogProps) {
  const createMutation = useCreateODF();
  const updateMutation = useUpdateODF();

  // Cargar empresas
  const { data: empresasData } = useEmpresas({ pageSize: 100 });
  const empresas = empresasData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ODFFormValues>({
    resolver: zodResolver(odfSchema),
    defaultValues: {
      ID_ODF: 0,
      Codigo: "",
      ID_Empresa: 0,
      Estado: true,
      Cantidad_Puertos: 0,
      NodeSubIdA: 0,
      NodeSubIdZ: 0,
      Nombre_Empresa: "Inhabilitado",
      Rack: "",
      IsDefault: false,
      Comments: "",
      CircuitoId: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && odf) {
      reset({
        ID_ODF: odf.ID_ODF,
        Codigo: odf.Codigo || "",
        ID_Empresa: odf.ID_Empresa,
        Estado: odf.Estado,
        Cantidad_Puertos: odf.Cantidad_Puertos,
        NodeSubIdA: odf.NodeSubIdA,
        NodeSubIdZ: odf.NodeSubIdZ,
        Nombre_Empresa: odf.Nombre_Empresa,
        Rack: odf.Rack || "",
        IsDefault: odf.IsDefault,
        Comments: odf.Comments || "",
        CircuitoId: odf.CircuitoId,
      });
    } else if (mode === "create") {
      reset({
        ID_ODF: 0,
        Codigo: "",
        ID_Empresa: 0,
        Estado: true,
        Cantidad_Puertos: 0,
        NodeSubIdA: 0,
        NodeSubIdZ: 0,
        Nombre_Empresa: "Inhabilitado",
        Rack: "",
        IsDefault: false,
        Comments: "",
        CircuitoId: 0,
      });
    }
  }, [mode, odf, reset]);

  const onSubmit = async (data: ODFFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("ODF creado exitosamente");
      } else if (mode === "edit" && odf) {
        await updateMutation.mutateAsync({
          id: odf.Id,
          data: { ...data, Id: odf.Id },
        });
        toast.success("ODF actualizado exitosamente");
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
            {mode === "create" ? "Nueva ODF" : "Editar ODF Existente"}
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
                    ODF
                  </Text>
                  <TextField.Root
                    {...register("Codigo")}
                    placeholder="ODF"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Empresa
                  </Text>
                  <Controller
                    name="ID_Empresa"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger style={{ width: "100%" }} placeholder="--Seleccione--" />
                        <Select.Content>
                          <Select.Item value="0">--Seleccione--</Select.Item>
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

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Rack
                  </Text>
                  <TextField.Root
                    {...register("Rack")}
                    placeholder="RACK"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Cantidad de Puertos
                  </Text>
                  <TextField.Root
                    {...register("Cantidad_Puertos", { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </label>
              </Box>

              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Observaciones Técnicas (max 800 caracteres)
                  </Text>
                  <TextArea
                    {...register("Comments")}
                    placeholder="Comentarios adicionales..."
                    disabled={isSubmitting}
                    rows={4}
                  />
                  {errors.Comments && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.Comments.message}
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
                    {...register("IsDefault")}
                    disabled={isSubmitting || (mode === "edit" && odf?.IsDefault)}
                    id="IsDefault"
                  />
                  <label htmlFor="IsDefault">
                    <Text size="2">Por Defecto</Text>
                  </label>
                </Flex>
                {mode === "edit" && odf?.IsDefault && (
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
