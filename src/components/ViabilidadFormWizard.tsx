import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Button, Flex, Text, TextField, Select, TextArea, Box } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { viabilidadSchema, ViabilidadFormValues } from "@/lib/validations/viabilidad";
import { useCreateViabilidad } from "@/hooks/useViabilidades";
import { toast } from "sonner";

interface ViabilidadFormWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViabilidadFormWizard({ open, onOpenChange }: ViabilidadFormWizardProps) {
  const [step, setStep] = useState(1);
  const createViabilidad = useCreateViabilidad();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ViabilidadFormValues>({
    resolver: zodResolver(viabilidadSchema),
    defaultValues: {
      isEspecial: false,
      ID_ProcesoViabilidad: 1,
      ID_Proceso: 1,
      ClasificacionViabilidad_Id: 1,
      ContactoComercialId: 1,
      ContactoTecnicoId: 1,
      elementoaId: 1,
      elementozId: 1,
      UbicacionaId: 1,
      UbicacionzId: 1,
      ID_RutaUbicacion: 1,
    },
  });

  const onSubmit = async (data: ViabilidadFormValues) => {
    try {
      await createViabilidad.mutateAsync(data);
      toast.success("Solicitud de viabilidad creada exitosamente");
      reset();
      setStep(1);
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al crear solicitud de viabilidad");
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    reset();
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>
          Nueva Solicitud de Viabilidad
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Paso {step} de 4
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Tipo de Enlace */}
          {step === 1 && (
            <Flex direction="column" gap="4">
              <Text weight="bold" size="3">Información General</Text>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Número de Documento *
                </Text>
                <TextField.Root
                  {...register("document_number")}
                  placeholder="Ej: VIAB-2024-001"
                />
                {errors.document_number && (
                  <Text size="1" color="red">{errors.document_number.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Tipo de Enlace *
                </Text>
                <Select.Root
                  value={watch("ID_TipoEnlace")?.toString()}
                  onValueChange={(value) => setValue("ID_TipoEnlace", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Fibra Óptica</Select.Item>
                    <Select.Item value="2">Cobre</Select.Item>
                    <Select.Item value="3">Inalámbrico</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.ID_TipoEnlace && (
                  <Text size="1" color="red">{errors.ID_TipoEnlace.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Empresa/Carrier *
                </Text>
                <Select.Root
                  value={watch("ID_Empresa")?.toString()}
                  onValueChange={(value) => setValue("ID_Empresa", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Empresa 1</Select.Item>
                    <Select.Item value="2">Empresa 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.ID_Empresa && (
                  <Text size="1" color="red">{errors.ID_Empresa.message}</Text>
                )}
              </Box>
            </Flex>
          )}

          {/* Step 2: Punto A */}
          {step === 2 && (
            <Flex direction="column" gap="4">
              <Text weight="bold" size="3">Punto A (Origen)</Text>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Área de Desarrollo A *
                </Text>
                <Select.Root
                  value={watch("adesarrolloaid")?.toString()}
                  onValueChange={(value) => setValue("adesarrolloaid", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Área 1</Select.Item>
                    <Select.Item value="2">Área 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.adesarrolloaid && (
                  <Text size="1" color="red">{errors.adesarrolloaid.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Ubicación A *
                </Text>
                <Select.Root
                  value={watch("listaUbicacionesaId")?.toString()}
                  onValueChange={(value) => setValue("listaUbicacionesaId", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Ubicación 1</Select.Item>
                    <Select.Item value="2">Ubicación 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.listaUbicacionesaId && (
                  <Text size="1" color="red">{errors.listaUbicacionesaId.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Módulo A *
                </Text>
                <Select.Root
                  value={watch("moduloaId")?.toString()}
                  onValueChange={(value) => setValue("moduloaId", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Módulo 1</Select.Item>
                    <Select.Item value="2">Módulo 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.moduloaId && (
                  <Text size="1" color="red">{errors.moduloaId.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Coordenadas A *
                </Text>
                <TextField.Root
                  {...register("CoordenadasA")}
                  placeholder="Ej: 8.983333, -79.516667"
                />
                {errors.CoordenadasA && (
                  <Text size="1" color="red">{errors.CoordenadasA.message}</Text>
                )}
              </Box>
            </Flex>
          )}

          {/* Step 3: Punto Z */}
          {step === 3 && (
            <Flex direction="column" gap="4">
              <Text weight="bold" size="3">Punto Z (Destino)</Text>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Área de Desarrollo Z *
                </Text>
                <Select.Root
                  value={watch("adesarrollozid")?.toString()}
                  onValueChange={(value) => setValue("adesarrollozid", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Área 1</Select.Item>
                    <Select.Item value="2">Área 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.adesarrollozid && (
                  <Text size="1" color="red">{errors.adesarrollozid.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Ubicación Z *
                </Text>
                <Select.Root
                  value={watch("listaUbicacioneszId")?.toString()}
                  onValueChange={(value) => setValue("listaUbicacioneszId", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Ubicación 1</Select.Item>
                    <Select.Item value="2">Ubicación 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.listaUbicacioneszId && (
                  <Text size="1" color="red">{errors.listaUbicacioneszId.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Módulo Z *
                </Text>
                <Select.Root
                  value={watch("modulozId")?.toString()}
                  onValueChange={(value) => setValue("modulozId", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Módulo 1</Select.Item>
                    <Select.Item value="2">Módulo 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.modulozId && (
                  <Text size="1" color="red">{errors.modulozId.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Coordenadas Z *
                </Text>
                <TextField.Root
                  {...register("Coordenadas")}
                  placeholder="Ej: 8.983333, -79.516667"
                />
                {errors.Coordenadas && (
                  <Text size="1" color="red">{errors.Coordenadas.message}</Text>
                )}
              </Box>
            </Flex>
          )}

          {/* Step 4: Ruta y Conexión */}
          {step === 4 && (
            <Flex direction="column" gap="4">
              <Text weight="bold" size="3">Ruta y Conexión</Text>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Cliente Final
                </Text>
                <TextField.Root
                  {...register("Cliente_FinalA")}
                  placeholder="Nombre del cliente"
                />
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Ruta *
                </Text>
                <Select.Root
                  value={watch("ID_Ruta")?.toString()}
                  onValueChange={(value) => setValue("ID_Ruta", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Ruta 1</Select.Item>
                    <Select.Item value="2">Ruta 2</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.ID_Ruta && (
                  <Text size="1" color="red">{errors.ID_Ruta.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Tipo de Conexión *
                </Text>
                <Select.Root
                  value={watch("ID_TipoConexion")?.toString()}
                  onValueChange={(value) => setValue("ID_TipoConexion", parseInt(value))}
                >
                  <Select.Trigger placeholder="Seleccione..." />
                  <Select.Content>
                    <Select.Item value="1">Punto a Punto</Select.Item>
                    <Select.Item value="2">Multipunto</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.ID_TipoConexion && (
                  <Text size="1" color="red">{errors.ID_TipoConexion.message}</Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="medium" mb="1">
                  Observaciones
                </Text>
                <TextArea
                  {...register("Observaciones")}
                  placeholder="Observaciones adicionales..."
                  rows={4}
                />
              </Box>
            </Flex>
          )}

          {/* Navigation Buttons */}
          <Flex gap="3" mt="5" justify="end">
            {step > 1 && (
              <Button type="button" variant="soft" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
            )}

            <Button type="button" variant="soft" color="gray" onClick={handleClose}>
              <X className="w-4 h-4" />
              Cancelar
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={handleNext}>
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={createViabilidad.isPending}>
                {createViabilidad.isPending ? "Guardando..." : (
                  <>
                    <Check className="w-4 h-4" />
                    Crear Solicitud
                  </>
                )}
              </Button>
            )}
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
