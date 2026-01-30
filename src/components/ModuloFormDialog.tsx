import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, Select, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { moduloSchema, type ModuloFormValues } from "@/lib/validations/modulo";
import { type Modulo } from "@/types/modulo";
import { type ListaUbicacion } from "@/types/listaUbicaciones";
import { type ServicesLocation } from "@/types/servicesLocation";
import { type CO } from "@/types/co";
import { useCreateModulo, useUpdateModulo } from "@/hooks/useModulos";
import { useAreasDesarrollo } from "@/hooks/useAreasDesarrollo";
import { useExecuteAllVetroProcesses } from "@/hooks/useVetro";
import { VetroProcessMessages } from "@/components/VetroProcessMessages";
import { type VetroProcessMessage } from "@/services/vetro.service";
import { modulosService } from "@/services/modulos.service";
import { toast } from "sonner";

interface ModuloFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modulo?: Modulo | null;
  mode: "create" | "edit";
}

export function ModuloFormDialog({ open, onOpenChange, modulo, mode }: ModuloFormDialogProps) {
  const createMutation = useCreateModulo();
  const updateMutation = useUpdateModulo();

  // Estado para mensajes de procesos Vetro
  const [vetroMessages, setVetroMessages] = useState<VetroProcessMessage[]>([]);

  // Estados para las listas desplegables
  const [ubicaciones, setUbicaciones] = useState<ListaUbicacion[]>([]);
  const [serviceLocations, setServiceLocations] = useState<ServicesLocation[]>([]);
  const [cos, setCos] = useState<CO[]>([]);

  // Hook para ejecutar procesos de Vetro
  const executeVetroProcesses = useExecuteAllVetroProcesses();

  // Cargar áreas de desarrollo para el selector
  const { data: areasData } = useAreasDesarrollo({ pageSize: 100 });
  const areas = areasData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ModuloFormValues>({
    resolver: zodResolver(moduloSchema),
    defaultValues: {
      modulo: "",
      Inquilino: "",
      Coordenadas: "",
      ID_Ubicacion: 0,
      ID_AreaDesarrollo: 0,
      Service_Location: "",
      ID_CO: 0,
      ID_ListaUbicaciones: 0,
      ID_ServiceLocation: 0,
      Estado: true,
      isDefault: false,
    },
  });

  // Observar cambios en Área de Desarrollo para actualizar Ubicaciones
  const selectedAreaId = watch("ID_AreaDesarrollo");

  // Observar cambios en Service Location para actualizar Coordenadas
  const selectedServiceLocation = watch("Service_Location");

  // Cargar ubicaciones cuando cambia el área de desarrollo
  useEffect(() => {
    if (selectedAreaId && selectedAreaId > 0) {
      modulosService.getUbicacionesByArea(selectedAreaId)
        .then((data) => {
          setUbicaciones(data);
          // Si no es modo edición o si el área cambió, resetear la ubicación seleccionada
          if (mode === "create") {
            setValue("ID_Ubicacion", 0);
          }
        })
        .catch((error) => {
          console.error("Error al cargar ubicaciones:", error);
          toast.error("Error al cargar ubicaciones");
          setUbicaciones([]);
        });
    } else {
      setUbicaciones([]);
      setValue("ID_Ubicacion", 0);
    }
  }, [selectedAreaId, mode, setValue]);

  // Cargar coordenadas cuando cambia el service location
  useEffect(() => {
    if (selectedServiceLocation && selectedServiceLocation !== "") {
      // Buscar el service location seleccionado para obtener su ID
      const sl = serviceLocations.find(s => s.ServiceLocation === selectedServiceLocation);
      if (sl && sl.ID_ServiceLocation) {
        modulosService.getServiceLocationCoordinates(sl.ID_ServiceLocation)
          .then((coords) => {
            if (coords.Coordenada1 && coords.Coordenada2) {
              const coordenadas = `${coords.Coordenada1}, ${coords.Coordenada2}`;
              setValue("Coordenadas", coordenadas);
            }
          })
          .catch((error) => {
            console.error("Error al cargar coordenadas:", error);
          });
      }
    }
  }, [selectedServiceLocation, serviceLocations, setValue]);

  // Cargar Service Locations y COs cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      // Cargar Service Locations
      modulosService.getServiceLocations()
        .then((data) => setServiceLocations(data))
        .catch((error) => {
          console.error("Error al cargar service locations:", error);
          toast.error("Error al cargar service locations");
        });

      // Cargar COs
      modulosService.getCOs()
        .then((data) => setCos(data))
        .catch((error) => {
          console.error("Error al cargar compañías de enlace:", error);
          toast.error("Error al cargar compañías de enlace");
        });
    }
  }, [open]);

  // Ejecutar procesos de Vetro cuando se abre el dialog en modo "create"
  useEffect(() => {
    if (open && mode === "create") {
      // Limpiar mensajes anteriores
      setVetroMessages([]);

      // Ejecutar procesos de Vetro API v2
      executeVetroProcesses.mutate(undefined, {
        onSuccess: (messages) => {
          setVetroMessages(messages);
          // Mostrar toast de éxito o advertencia dependiendo de los resultados
          const hasErrors = messages.some(m => m.msgTipo === "2");
          if (hasErrors) {
            toast.warning("Procesos de Vetro ejecutados con algunos errores");
          } else {
            toast.success("Procesos de Vetro ejecutados correctamente");
          }
        },
        onError: (error) => {
          toast.error(`Error al ejecutar procesos de Vetro: ${error.message}`);
        }
      });
    }
  }, [open, mode]);

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && modulo) {
      reset({
        modulo: modulo.modulo,
        Inquilino: modulo.Inquilino || "",
        Coordenadas: modulo.Coordenadas || "",
        ID_Ubicacion: modulo.ID_Ubicacion,
        ID_AreaDesarrollo: modulo.ID_AreaDesarrollo,
        Service_Location: modulo.Service_Location || "",
        ID_CO: modulo.ID_CO,
        ID_ListaUbicaciones: modulo.ID_ListaUbicaciones,
        ID_ServiceLocation: modulo.ID_ServiceLocation,
        Estado: modulo.Estado,
        isDefault: modulo.isDefault,
      });
    } else if (mode === "create") {
      reset({
        modulo: "",
        Inquilino: "",
        Coordenadas: "",
        ID_Ubicacion: 0,
        ID_AreaDesarrollo: 0,
        Service_Location: "",
        ID_CO: 0,
        ID_ListaUbicaciones: 0,
        ID_ServiceLocation: 0,
        Estado: true,
        isDefault: false,
      });
    }
  }, [mode, modulo, reset]);

  const onSubmit = async (data: ModuloFormValues) => {
    try {
      // Convertir Inquilino a mayúsculas
      const dataToSubmit = {
        ...data,
        Inquilino: data.Inquilino?.toUpperCase() || "",
      };

      if (mode === "create") {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success("Módulo creado exitosamente");
      } else if (mode === "edit" && modulo) {
        await updateMutation.mutateAsync({
          id: modulo.id,
          data: {
            ...dataToSubmit,
            id: modulo.id,
          },
        });
        toast.success("Módulo actualizado exitosamente");
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
      <Dialog.Content style={{ maxWidth: 750 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>
            {mode === "create" ? "Crear Módulo" : "Editar Módulo"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </Flex>

        <Dialog.Description size="2" mb="4">
          {mode === "create"
            ? "Complete el formulario para crear un módulo"
            : "Actualice la información del módulo"}
        </Dialog.Description>

        {/* Mostrar mensajes de procesos Vetro */}
        {mode === "create" && (
          <VetroProcessMessages
            messages={vetroMessages}
            isLoading={executeVetroProcesses.isPending}
            title="Actualización de Datos desde Vetro API v2"
          />
        )}

        <ScrollArea style={{ maxHeight: "60vh" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4" pr="3">
              {/* Código del Módulo */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Código del Módulo <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <TextField.Root
                    {...register("modulo")}
                    placeholder="Ingrese el código"
                    disabled={isSubmitting}
                  />
                  {errors.modulo && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.modulo.message}
                    </Text>
                  )}
                </label>
              </Box>

              {/* Área de Desarrollo */}
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
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger placeholder="Seleccione un área" style={{ width: "100%" }} />
                        <Select.Content>
                          {areas.map((area) => (
                            <Select.Item key={area.id} value={area.id.toString()}>
                              {area.Nombre}
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

              {/* Ubicación (depende de Área de Desarrollo) */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Ubicación <span style={{ color: "var(--red-9)" }}>*</span>
                  </Text>
                  <Controller
                    name="ID_Ubicacion"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting || !selectedAreaId || selectedAreaId === 0}
                      >
                        <Select.Trigger
                          placeholder={
                            !selectedAreaId || selectedAreaId === 0
                              ? "Seleccione primero un área"
                              : "Seleccione una ubicación"
                          }
                          style={{ width: "100%" }}
                        />
                        <Select.Content>
                          {ubicaciones.map((ubicacion) => (
                            <Select.Item key={ubicacion.id} value={ubicacion.id.toString()}>
                              {ubicacion.Nombre_Ubicacion}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                  {errors.ID_Ubicacion && (
                    <Text size="1" style={{ color: "var(--red-9)" }} mt="1">
                      {errors.ID_Ubicacion.message}
                    </Text>
                  )}
                </label>
              </Box>

              {/* Inquilino */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Inquilino
                  </Text>
                  <TextField.Root
                    {...register("Inquilino")}
                    placeholder="Ingrese el inquilino"
                    disabled={isSubmitting}
                    onBlur={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      setValue("Inquilino", e.target.value);
                    }}
                  />
                </label>
              </Box>

              {/* Service Location */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Service Location
                  </Text>
                  <Controller
                    name="Service_Location"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value || ""}
                        onValueChange={(value) => {
                          // Guardar el nombre del Service Location
                          field.onChange(value);
                          // También guardar el ID en ID_ServiceLocation
                          const sl = serviceLocations.find(s => s.ServiceLocation === value);
                          if (sl) {
                            setValue("ID_ServiceLocation", sl.ID_ServiceLocation);
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger placeholder="Seleccione un service location" style={{ width: "100%" }} />
                        <Select.Content>
                          {serviceLocations
                            .filter((sl, index, self) =>
                              index === self.findIndex((s) => s.ServiceLocation === sl.ServiceLocation)
                            )
                            .map((sl) => (
                              <Select.Item key={sl.ID_ServiceLocation} value={sl.ServiceLocation || ""}>
                                {sl.ServiceLocation}
                              </Select.Item>
                            ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </label>
              </Box>

              {/* Compañía de Enlace (CO) */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Compañía de Enlace
                  </Text>
                  <Controller
                    name="ID_CO"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={isSubmitting}
                      >
                        <Select.Trigger placeholder="Seleccione una compañía" style={{ width: "100%" }} />
                        <Select.Content>
                          <Select.Item value="0">Ninguna</Select.Item>
                          {cos.map((co) => (
                            <Select.Item key={co.id} value={co.id.toString()}>
                              {co.Codigo || co.Nombre}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </label>
              </Box>

              {/* Coordenadas */}
              <Box>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Coordenadas
                  </Text>
                  <TextField.Root
                    {...register("Coordenadas")}
                    placeholder="Ej: 8.9824, -79.5199"
                    disabled={isSubmitting}
                  />
                  <Text size="1" style={{ color: "var(--gray-9)" }} mt="1">
                    Se auto-completará al seleccionar un Service Location
                  </Text>
                </label>
              </Box>

              {/* Estado */}
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

              {/* Por Defecto */}
              <Box>
                <Flex align="center" gap="2">
                  <input
                    type="checkbox"
                    {...register("isDefault")}
                    disabled={isSubmitting || (mode === "edit" && modulo?.isDefault)}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">
                    <Text size="2">Marcar como por defecto</Text>
                  </label>
                </Flex>
                {mode === "edit" && modulo?.isDefault && (
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
