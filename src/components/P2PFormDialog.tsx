import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, TextArea, Select } from "@radix-ui/themes";
import { X } from "lucide-react";
import { p2pSchema, type P2PFormValues } from "@/lib/validations/p2p";
import { type P2P, EstadoP2P, EstadoP2PLabels } from "@/types/p2p";
import { useCreateP2P, useUpdateP2P } from "@/hooks/useP2P";
import { toast } from "sonner";

interface P2PFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  p2p?: P2P | null;
  mode: "create" | "edit";
}

export function P2PFormDialog({ open, onOpenChange, p2p, mode }: P2PFormDialogProps) {
  const createMutation = useCreateP2P();
  const updateMutation = useUpdateP2P();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<P2PFormValues>({
    resolver: zodResolver(p2pSchema),
    defaultValues: {
      NombrePto1: "",
      NombrePto2: "",
      Punto1: 0,
      Punto2: 0,
      Observaciones: "",
      Estado: EstadoP2P.Proceso,
      TipoP2P: 0,
    },
  });

  const currentEstado = watch("Estado");

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && p2p) {
      reset({
        NombrePto1: p2p.NombrePto1,
        NombrePto2: p2p.NombrePto2,
        Punto1: p2p.Punto1,
        Punto2: p2p.Punto2,
        Observaciones: p2p.Observaciones || "",
        Estado: p2p.Estado,
        TipoP2P: p2p.TipoP2P,
      });
    } else if (mode === "create") {
      reset({
        NombrePto1: "",
        NombrePto2: "",
        Punto1: 0,
        Punto2: 0,
        Observaciones: "",
        Estado: EstadoP2P.Proceso,
        TipoP2P: 0,
      });
    }
  }, [mode, p2p, reset]);

  const onSubmit = async (data: P2PFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          NombrePto1: data.NombrePto1,
          NombrePto2: data.NombrePto2,
          Punto1: data.Punto1,
          Punto2: data.Punto2,
          Observaciones: data.Observaciones,
          Estado: data.Estado as EstadoP2P,
          TipoP2P: data.TipoP2P,
        });
        toast.success("Orden P2P creada exitosamente");
      } else if (mode === "edit" && p2p) {
        await updateMutation.mutateAsync({
          id: p2p.ID_P2P,
          data: {
            NombrePto1: data.NombrePto1,
            NombrePto2: data.NombrePto2,
            Punto1: data.Punto1,
            Punto2: data.Punto2,
            Observaciones: data.Observaciones,
            Estado: data.Estado as EstadoP2P,
            TipoP2P: data.TipoP2P,
          },
        });
        toast.success("Orden P2P actualizada exitosamente");
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
            {mode === "create" ? "Nueva Orden P2P" : "Editar Orden P2P"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear una nueva orden P2P"
            : "Actualice la información de la orden P2P"}
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            {/* ID P2P (solo en edición) */}
            {mode === "edit" && p2p && (
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    ID P2P
                  </Text>
                  <TextField.Root
                    value={p2p.ID_P2P.toString()}
                    disabled
                  />
                </label>
              </Box>
            )}

            {/* Punto 1 */}
            <Box className="p-4 rounded-lg" style={{ backgroundColor: "var(--gray-2)" }}>
              <Text size="2" weight="bold" className="block mb-3">
                Punto 1
              </Text>
              <Flex gap="4">
                <Box className="flex-1">
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Nombre Punto 1 <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("NombrePto1")}
                      placeholder="Ingrese el nombre del punto 1"
                      disabled={isSubmitting}
                    />
                    {errors.NombrePto1 && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.NombrePto1.message}
                      </Text>
                    )}
                  </label>
                </Box>
                <Box style={{ width: "120px" }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      ID Punto 1 <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      type="number"
                      {...register("Punto1", { valueAsNumber: true })}
                      placeholder="ID"
                      disabled={isSubmitting}
                    />
                    {errors.Punto1 && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Punto1.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>
            </Box>

            {/* Punto 2 */}
            <Box className="p-4 rounded-lg" style={{ backgroundColor: "var(--gray-2)" }}>
              <Text size="2" weight="bold" className="block mb-3">
                Punto 2
              </Text>
              <Flex gap="4">
                <Box className="flex-1">
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Nombre Punto 2 <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      {...register("NombrePto2")}
                      placeholder="Ingrese el nombre del punto 2"
                      disabled={isSubmitting}
                    />
                    {errors.NombrePto2 && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.NombrePto2.message}
                      </Text>
                    )}
                  </label>
                </Box>
                <Box style={{ width: "120px" }}>
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      ID Punto 2 <span style={{ color: "var(--red-9)" }}>*</span>
                    </Text>
                    <TextField.Root
                      type="number"
                      {...register("Punto2", { valueAsNumber: true })}
                      placeholder="ID"
                      disabled={isSubmitting}
                    />
                    {errors.Punto2 && (
                      <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                        {errors.Punto2.message}
                      </Text>
                    )}
                  </label>
                </Box>
              </Flex>
            </Box>

            {/* Estado (solo en edición) */}
            {mode === "edit" && (
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Estado
                  </Text>
                  <Select.Root
                    value={currentEstado?.toString()}
                    onValueChange={(value) => setValue("Estado", parseInt(value))}
                    disabled={isSubmitting}
                  >
                    <Select.Trigger placeholder="Seleccione estado" />
                    <Select.Content>
                      {Object.entries(EstadoP2PLabels).map(([key, label]) => (
                        <Select.Item key={key} value={key}>
                          {label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </label>
              </Box>
            )}

            {/* Observaciones */}
            <Box>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  Observaciones
                </Text>
                <TextArea
                  {...register("Observaciones")}
                  placeholder="Ingrese observaciones adicionales..."
                  disabled={isSubmitting}
                  rows={3}
                />
              </label>
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
      </Dialog.Content>
    </Dialog.Root>
  );
}
