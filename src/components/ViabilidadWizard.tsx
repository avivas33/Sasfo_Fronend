import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Flex, Text, TextField, Select, TextArea, Box, Checkbox, Grid, Card } from "@radix-ui/themes";
import { Loader2 } from "lucide-react";
import { viabilidadSchema, ViabilidadFormValues } from "@/lib/validations/viabilidad";
import { useCreateViabilidad } from "@/hooks/useViabilidades";
import { useTipoEnlaces } from "@/hooks/useTipoEnlace";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useAreasDesarrollo } from "@/hooks/useAreasDesarrollo";
import { useListaUbicaciones } from "@/hooks/useListaUbicaciones";
import { useModulos } from "@/hooks/useModulos";
import { useRutasUbicacion } from "@/hooks/useRutasUbicacion";
import { useTipoConexions } from "@/hooks/useTipoConexion";
import { GoogleMapPicker } from "@/components/GoogleMapPicker";
import { toast } from "sonner";
import {
  Wizard,
  WizardSteps,
  WizardStep,
  WizardNavigation,
  WizardActions,
  useWizard,
} from "@/components/ui/Wizard";
import "@/styles/viabilidad-wizard.css";

const WIZARD_STEPS = [
  { id: 1, title: "Tipo de Enlace", subtitle: "Paso 1" },
  { id: 2, title: "Punto A", subtitle: "Paso 2" },
  { id: 3, title: "Punto Z", subtitle: "Paso 3" },
  { id: 4, title: "Ruta y Conexión", subtitle: "Paso 4" },
];

export function ViabilidadWizard() {
  return (
    <Box>
      <Wizard totalSteps={4}>
        <WizardContent />
      </Wizard>
    </Box>
  );
}

function WizardContent() {
  const { currentStep, nextStep, markStepComplete, markStepIncomplete } = useWizard();
  const [searchParams] = useSearchParams();
  const [usarMapaA, setUsarMapaA] = useState(false);
  const [usarMapaZ, setUsarMapaZ] = useState(false);
  const [usarInquilino, setUsarInquilino] = useState(false);
  const [inquilino, setInquilino] = useState("");
  const navigate = useNavigate();
  const createViabilidad = useCreateViabilidad();

  // Detectar si viene desde P2P (parametro1 = "Punto1" o "Punto2")
  const parametro1 = searchParams.get("parametro1");
  const parametro2 = searchParams.get("parametro2");
  const isFromP2P = parametro1 === "Punto1" || parametro1 === "Punto2";

  // Fetch catalogs - usar pageSize grande para cargar todos los registros
  const { data: tipoEnlacesData, isLoading: loadingTipoEnlaces } = useTipoEnlaces({ pageSize: 1000 });
  const { data: empresasData, isLoading: loadingEmpresas } = useEmpresas({ pageSize: 1000 });
  const { data: areasDesarrolloData, isLoading: loadingAreasDesarrollo } = useAreasDesarrollo({ pageSize: 1000 });

  const tipoEnlaces = tipoEnlacesData?.data || [];
  const empresas = empresasData?.data || [];
  const areasDesarrollo = areasDesarrolloData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ViabilidadFormValues>({
    resolver: zodResolver(viabilidadSchema),
    mode: "onChange",
    defaultValues: {
      isEspecial: false,
      // Valores para "Convertir a Viabilidad por Aprobar"
      // ID_ProcesoViabilidad: 1 = "Por Aprobar" (aparece en tab "Viabilidades por Aprobar")
      // ClasificacionViabilidad_Id: 3 = "Viabilidad por Aprobar"
      // ID_Proceso: 2 = "En Proceso"
      ID_ProcesoViabilidad: 1,
      ID_Proceso: 2,
      ClasificacionViabilidad_Id: 3,
      ContactoComercialId: 1,
      ContactoTecnicoId: 1,
      elementoaId: 1,
      elementozId: 1,
      UbicacionaId: 1,
      UbicacionzId: 1,
      ID_RutaUbicacion: 1,
      document_number: `VIAB-${Date.now()}`,
    },
  });

  // Watch for selected areas to filter ubicaciones
  const selectedAreaA = watch("adesarrolloaid");
  const selectedAreaZ = watch("adesarrollozid");
  const selectedUbicacionA = watch("listaUbicacionesaId");
  const selectedUbicacionZ = watch("listaUbicacioneszId");
  const selectedModuloA = watch("moduloaId");
  const selectedModuloZ = watch("modulozId");

  // Fetch ubicaciones filtered by area - usar pageSize grande
  const { data: ubicacionesAData, isLoading: loadingUbicacionesA } = useListaUbicaciones({
    idAreaDesarrollo: selectedAreaA || undefined,
    pageSize: 1000,
  });
  const { data: ubicacionesZData, isLoading: loadingUbicacionesZ } = useListaUbicaciones({
    idAreaDesarrollo: selectedAreaZ || undefined,
    pageSize: 1000,
  });

  // Fetch módulos filtered by ubicación - usar pageSize grande
  const { data: modulosAData, isLoading: loadingModulosA } = useModulos({
    idListaUbicaciones: selectedUbicacionA || undefined,
    estado: true,
    pageSize: 1000,
  });
  const { data: modulosZData, isLoading: loadingModulosZ } = useModulos({
    idListaUbicaciones: selectedUbicacionZ || undefined,
    estado: true,
    pageSize: 1000,
  });

  const ubicacionesA = ubicacionesAData?.data || [];
  const ubicacionesZ = ubicacionesZData?.data || [];
  const modulosA = modulosAData?.data || [];
  const modulosZ = modulosZData?.data || [];

  // Fetch rutas filtered by Lista Ubicación Z - usar pageSize grande
  // Convertir a número y validar que sea mayor a 0 (0 es valor inicial/reset)
  const ubicacionZId = selectedUbicacionZ && Number(selectedUbicacionZ) > 0
    ? Number(selectedUbicacionZ)
    : undefined;
  const { data: rutasData, isLoading: loadingRutas } = useRutasUbicacion({
    idListaUbicacion: ubicacionZId,
    pageSize: 1000,
  });

  const rutas = rutasData?.data || [];

  // Fetch tipos de conexión - usar pageSize grande
  const { data: tipoConexionData, isLoading: loadingTipoConexion } = useTipoConexions({ pageSize: 1000 });
  const tiposConexion = tipoConexionData?.data || [];

  // Auto-seleccionar P2P cuando viene desde el wizard de P2P
  const currentTipoEnlace = watch("ID_TipoEnlace");
  useEffect(() => {
    if (isFromP2P && tipoEnlaces.length > 0 && !currentTipoEnlace) {
      // Buscar el tipo de enlace "P2P" por nombre (case-insensitive)
      const p2pTipoEnlace = tipoEnlaces.find((te: any) => {
        const nombre = (te.Nombre || "").toLowerCase();
        return (nombre === "p2p" || nombre.includes("p2p")) && te.Estado;
      });

      // Si no se encuentra por nombre, buscar por ID_TipoEnlace = 2 (común para P2P)
      const p2pById = tipoEnlaces.find((te: any) => te.ID_TipoEnlace === 2 && te.Estado);

      // Fallback: primer tipo de enlace activo
      const firstActiveTipoEnlace = tipoEnlaces.find((te: any) => te.Estado);

      const tipoEnlaceToSelect = p2pTipoEnlace || p2pById || firstActiveTipoEnlace;
      if (tipoEnlaceToSelect) {
        setValue("ID_TipoEnlace", tipoEnlaceToSelect.id, { shouldValidate: true });
      }
    }
  }, [isFromP2P, tipoEnlaces, currentTipoEnlace, setValue]);

  // Reset ubicación when área changes
  useEffect(() => {
    if (selectedAreaA) {
      setValue("listaUbicacionesaId", 0);
      setValue("moduloaId", 0);
    }
  }, [selectedAreaA, setValue]);

  useEffect(() => {
    if (selectedAreaZ) {
      setValue("listaUbicacioneszId", 0);
      setValue("modulozId", 0);
    }
  }, [selectedAreaZ, setValue]);

  // Reset módulo when ubicación changes
  useEffect(() => {
    if (selectedUbicacionA) {
      setValue("moduloaId", 0);
    }
  }, [selectedUbicacionA, setValue]);

  useEffect(() => {
    if (selectedUbicacionZ) {
      setValue("modulozId", 0);
    }
  }, [selectedUbicacionZ, setValue]);

  // Update coordinates and inquilino when módulo changes (Punto A)
  useEffect(() => {
    if (selectedModuloA && modulosA.length > 0) {
      const modulo = modulosA.find((m: any) => m.id === selectedModuloA);
      if (modulo) {
        setValue("CoordenadasA", modulo.Coordenadas || "");
        // Actualizar Inquilino
        if (modulo.Inquilino) {
          setInquilino(modulo.Inquilino);
        }
      }
    }
  }, [selectedModuloA, modulosA, setValue]);

  // Update coordinates and inquilino when módulo changes (Punto Z)
  useEffect(() => {
    if (selectedModuloZ && modulosZ.length > 0) {
      const modulo = modulosZ.find((m: any) => m.id === selectedModuloZ);
      if (modulo) {
        setValue("Coordenadas", modulo.Coordenadas || "");
        // Actualizar Inquilino (el último módulo seleccionado sobrescribe)
        if (modulo.Inquilino) {
          setInquilino(modulo.Inquilino);
        }
      }
    }
  }, [selectedModuloZ, modulosZ, setValue]);

  // Copiar Inquilino a Cliente Final cuando se marca/desmarca el checkbox
  useEffect(() => {
    if (usarInquilino) {
      // Cuando se marca: copiar el inquilino al cliente final
      setValue("Cliente_FinalA", inquilino);
    } else {
      // Cuando se desmarca: limpiar el cliente final
      setValue("Cliente_FinalA", "");
    }
  }, [usarInquilino, inquilino, setValue]);

  const onSubmit = async (data: ViabilidadFormValues) => {
    try {
      // Agregar parámetros del P2P si viene desde el wizard de P2P
      const submitData = {
        ...data,
        // Elemento_A = ID del P2P, CID_P1 = indica si es Punto1 o Punto2
        Elemento_A: parametro2 ? parseInt(parametro2) : undefined,
        CID_P1: parametro1 || undefined,
      };

      const result = await createViabilidad.mutateAsync(submitData);
      // Mostrar mensaje con MRC/NRC como en el proyecto original
      const mrc = result?.MRC ?? 0;
      const nrc = result?.NRC ?? 0;
      toast.success(
        `Viabilidad guardada exitosamente. NRC: $${nrc.toFixed(2)} / MRC: $${mrc.toFixed(2)}`,
        { duration: 5000 }
      );

      // Redirigir según el origen
      if (isFromP2P && parametro2) {
        // Volver al wizard de P2P con el ID
        navigate(`/viabilidades/p2p/nuevo?id=${parametro2}`);
      } else {
        navigate("/viabilidades");
      }
    } catch (error) {
      toast.error("Error al crear solicitud de viabilidad");
    }
  };

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof ViabilidadFormValues)[] = [];

    // Define qué campos validar en cada paso
    switch (currentStep) {
      case 0:
        fieldsToValidate = ["ID_TipoEnlace", "ID_Empresa"];
        break;
      case 1:
        fieldsToValidate = ["adesarrolloaid", "listaUbicacionesaId", "moduloaId", "CoordenadasA"];
        break;
      case 2:
        fieldsToValidate = ["adesarrollozid", "listaUbicacioneszId", "modulozId", "Coordenadas"];
        break;
      case 3:
        fieldsToValidate = ["ID_Ruta", "ID_TipoConexion"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      markStepComplete(currentStep);
    } else {
      markStepIncomplete(currentStep);
      toast.error("Por favor complete todos los campos requeridos");
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      nextStep();
    }
  };

  return (
    <>
      <WizardNavigation steps={WIZARD_STEPS} />

      <Box className="wizard-content p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <WizardSteps>
            {/* Step 1: Tipo de Enlace */}
            <WizardStep title="Información General" description="Seleccione el tipo de enlace y la empresa responsable.">
              <Grid columns={{ initial: "1", md: "2" }} gap="5">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    ¿Qué tipo de enlace requiere? *
                  </Text>
                  {loadingTipoEnlaces ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando tipos de enlace...</Text>
                    </Flex>
                  ) : (
                    <Select.Root
                      value={watch("ID_TipoEnlace")?.toString()}
                      onValueChange={(value) => setValue("ID_TipoEnlace", parseInt(value), { shouldValidate: true })}
                      disabled={isFromP2P}
                    >
                      <Select.Trigger
                        placeholder="--Seleccione--"
                        style={{
                          width: "100%",
                          backgroundColor: isFromP2P ? "var(--gray-3)" : undefined,
                          cursor: isFromP2P ? "not-allowed" : undefined
                        }}
                      />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {tipoEnlaces.filter((te: any) => te.Estado).map((tipoEnlace: any) => (
                          <Select.Item key={tipoEnlace.id} value={tipoEnlace.id.toString()}>
                            {tipoEnlace.Nombre}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {isFromP2P && (
                    <Text size="1" style={{ color: "var(--gray-11)" }}>
                      Tipo de enlace predeterminado para P2P
                    </Text>
                  )}
                  {errors.ID_TipoEnlace && (
                    <Text size="1" color="red">{errors.ID_TipoEnlace.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    ¿Carrier para el Registro? *
                  </Text>
                  {loadingEmpresas ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando empresas...</Text>
                    </Flex>
                  ) : (
                    <Select.Root
                      value={watch("ID_Empresa")?.toString()}
                      onValueChange={(value) => setValue("ID_Empresa", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {empresas.filter((emp: any) => emp.Estado).map((empresa: any) => (
                          <Select.Item key={empresa.id} value={empresa.id.toString()}>
                            {empresa.Nombre}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.ID_Empresa && (
                    <Text size="1" color="red">{errors.ID_Empresa.message}</Text>
                  )}
                </Box>
              </Grid>
            </WizardStep>

            {/* Step 2: Punto A */}
            <WizardStep title="Punto A" description="Configure la ubicación de origen del enlace.">
              <Grid columns={{ initial: "1", md: "2" }} gap="5">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Área de Desarrollo *
                  </Text>
                  {loadingAreasDesarrollo ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : (
                    <Select.Root
                      value={watch("adesarrolloaid")?.toString()}
                      onValueChange={(value) => setValue("adesarrolloaid", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {areasDesarrollo.filter((area: any) => area.Estado).map((area: any) => (
                          <Select.Item key={area.id} value={area.id.toString()}>
                            {area.Nombre}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.adesarrolloaid && (
                    <Text size="1" color="red">{errors.adesarrolloaid.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Ubicación *
                  </Text>
                  {loadingUbicacionesA ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : !selectedAreaA ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="Primero seleccione un área" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : ubicacionesA.length === 0 ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="No hay ubicaciones para esta área" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : (
                    <Select.Root
                      value={watch("listaUbicacionesaId")?.toString()}
                      onValueChange={(value) => setValue("listaUbicacionesaId", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {ubicacionesA.filter((ub: any) => ub.Estado).map((ubicacion: any) => (
                          <Select.Item key={ubicacion.id} value={ubicacion.id.toString()}>
                            {ubicacion.Nombre_Ubicacion}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.listaUbicacionesaId && (
                    <Text size="1" color="red">{errors.listaUbicacionesaId.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Módulo *
                  </Text>
                  {loadingModulosA ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : !selectedUbicacionA ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="Primero seleccione una ubicación" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : modulosA.length === 0 ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="No hay módulos para esta ubicación" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : (
                    <Select.Root
                      value={watch("moduloaId")?.toString()}
                      onValueChange={(value) => setValue("moduloaId", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {modulosA.map((modulo: any) => (
                          <Select.Item key={modulo.id} value={modulo.id.toString()}>
                            {modulo.modulo}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.moduloaId && (
                    <Text size="1" color="red">{errors.moduloaId.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Coordenadas *
                  </Text>
                  <TextField.Root
                    {...register("CoordenadasA")}
                    placeholder="Ej: 8.983333, -79.516667"
                    style={{ width: "100%" }}
                  />
                  {errors.CoordenadasA && (
                    <Text size="1" color="red">{errors.CoordenadasA.message}</Text>
                  )}
                </Box>
              </Grid>

              <Box mt="4">
                <Flex align="center" gap="2" mb="2">
                  <Checkbox
                    checked={usarMapaA}
                    onCheckedChange={(checked) => setUsarMapaA(checked === true)}
                  />
                  <Text size="2">Usar Mapa para Establecer Coordenadas</Text>
                </Flex>

                {usarMapaA && (
                  <Card style={{ height: "300px", overflow: "hidden" }}>
                    <GoogleMapPicker
                      onCoordinatesChange={(lat, lng) => {
                        setValue("CoordenadasA", `${lat} , ${lng}`);
                      }}
                      initialLat={8.9138353}
                      initialLng={-79.6087425}
                    />
                  </Card>
                )}
              </Box>
            </WizardStep>

            {/* Step 3: Punto Z */}
            <WizardStep title="Punto Z" description="Configure la ubicación de destino del enlace.">
              <Box mb="4">
                <Flex align="center" gap="2">
                  <Checkbox
                    {...register("isEspecial")}
                    checked={watch("isEspecial")}
                    onCheckedChange={(checked) => setValue("isEspecial", checked === true)}
                  />
                  <Text size="2">Marcar si no encuentra la ubicación en lista predefinida</Text>
                </Flex>
              </Box>

              <Grid columns={{ initial: "1", md: "2" }} gap="5">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Área de Desarrollo *
                  </Text>
                  {loadingAreasDesarrollo ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : (
                    <Select.Root
                      value={watch("adesarrollozid")?.toString()}
                      onValueChange={(value) => setValue("adesarrollozid", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {areasDesarrollo.filter((area: any) => area.Estado).map((area: any) => (
                          <Select.Item key={area.id} value={area.id.toString()}>
                            {area.Nombre}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.adesarrollozid && (
                    <Text size="1" color="red">{errors.adesarrollozid.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Ubicación *
                  </Text>
                  {loadingUbicacionesZ ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : !selectedAreaZ ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="Primero seleccione un área" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : ubicacionesZ.length === 0 ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="No hay ubicaciones para esta área" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : (
                    <Select.Root
                      value={watch("listaUbicacioneszId")?.toString()}
                      onValueChange={(value) => setValue("listaUbicacioneszId", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {ubicacionesZ.filter((ub: any) => ub.Estado).map((ubicacion: any) => (
                          <Select.Item key={ubicacion.id} value={ubicacion.id.toString()}>
                            {ubicacion.Nombre_Ubicacion}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.listaUbicacioneszId && (
                    <Text size="1" color="red">{errors.listaUbicacioneszId.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Módulo *
                  </Text>
                  {loadingModulosZ ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : !selectedUbicacionZ ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="Primero seleccione una ubicación" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : modulosZ.length === 0 ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="No hay módulos para esta ubicación" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : (
                    <Select.Root
                      value={watch("modulozId")?.toString()}
                      onValueChange={(value) => setValue("modulozId", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {modulosZ.map((modulo: any) => (
                          <Select.Item key={modulo.id} value={modulo.id.toString()}>
                            {modulo.modulo}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.modulozId && (
                    <Text size="1" color="red">{errors.modulozId.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Coordenadas *
                  </Text>
                  <TextField.Root
                    {...register("Coordenadas")}
                    placeholder="Ej: 8.983333, -79.516667"
                    style={{ width: "100%" }}
                  />
                  {errors.Coordenadas && (
                    <Text size="1" color="red">{errors.Coordenadas.message}</Text>
                  )}
                </Box>
              </Grid>

              <Box mt="4">
                <Flex align="center" gap="2" mb="2">
                  <Checkbox
                    checked={usarMapaZ}
                    onCheckedChange={(checked) => setUsarMapaZ(checked === true)}
                  />
                  <Text size="2">Usar Mapa para Establecer Coordenadas</Text>
                </Flex>

                {usarMapaZ && (
                  <Card style={{ height: "300px", overflow: "hidden" }}>
                    <GoogleMapPicker
                      onCoordinatesChange={(lat, lng) => {
                        setValue("Coordenadas", `${lat} , ${lng}`);
                      }}
                      initialLat={8.9138353}
                      initialLng={-79.6087425}
                    />
                  </Card>
                )}
              </Box>
            </WizardStep>

            {/* Step 4: Ruta y Conexión */}
            <WizardStep title="Ruta y Conexión" description="Detalles finales de la conexión y ruta.">
              <Grid columns={{ initial: "1", md: "2" }} gap="5">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Inquilino
                  </Text>
                  <TextField.Root
                    value={inquilino}
                    placeholder="Inquilino"
                    readOnly
                    style={{
                      backgroundColor: "var(--gray-2)",
                      textTransform: "uppercase",
                      width: "100%"
                    }}
                  />
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    ¿Quién es el Cliente Final?
                  </Text>
                  <TextField.Root
                    {...register("Cliente_FinalA")}
                    placeholder="Nombre del cliente"
                    style={{ textTransform: "uppercase", width: "100%" }}
                  />
                  <Flex align="center" gap="2" mt="2">
                    <Checkbox
                      checked={usarInquilino}
                      onCheckedChange={(checked) => setUsarInquilino(checked === true)}
                    />
                    <Text size="2">Inquilino / Cliente Final</Text>
                  </Flex>
                </Box>
              </Grid>

              <Text size="4" weight="bold" mt="5" mb="3">RUTA</Text>

              <Grid columns={{ initial: "1", md: "2" }} gap="5">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    ¿Cuál será su Ruta? *
                  </Text>
                  {loadingRutas ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : !ubicacionZId ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="Primero seleccione ubicación en Punto Z" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : rutas.length === 0 ? (
                    <Select.Root disabled>
                      <Select.Trigger placeholder="No hay rutas para esta ubicación" style={{ width: "100%" }} />
                    </Select.Root>
                  ) : (
                    <Select.Root
                      value={watch("ID_Ruta")?.toString()}
                      onValueChange={(value) => setValue("ID_Ruta", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {rutas.map((ruta: any) => (
                          <Select.Item key={ruta.id} value={ruta.id.toString()}>
                            {ruta.Nombre_Ruta} -- ({ruta.Distancia.toFixed(2)}mts aprox.)
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.ID_Ruta && (
                    <Text size="1" color="red">{errors.ID_Ruta.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    ¿Cuál será su Tipo de Conexión? *
                  </Text>
                  {loadingTipoConexion ? (
                    <Flex align="center" gap="2" style={{ padding: "0.5rem" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <Text size="2">Cargando...</Text>
                    </Flex>
                  ) : (
                    <Select.Root
                      value={watch("ID_TipoConexion")?.toString()}
                      onValueChange={(value) => setValue("ID_TipoConexion", parseInt(value), { shouldValidate: true })}
                    >
                      <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                      <Select.Content position="popper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {tiposConexion.map((tipo: any) => (
                          <Select.Item key={tipo.id} value={tipo.id.toString()}>
                            {tipo.Nombre}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                  {errors.ID_TipoConexion && (
                    <Text size="1" color="red">{errors.ID_TipoConexion.message}</Text>
                  )}
                </Box>
              </Grid>

              <Box mt="4">
                <Text as="label" size="2" weight="medium" mb="1" className="block">
                  ¿Alguna Observación?
                </Text>
                <TextArea
                  {...register("Observaciones")}
                  placeholder="Observaciones adicionales..."
                  rows={5}
                />
              </Box>
            </WizardStep>
          </WizardSteps>

          <WizardActions
            onNext={handleNext}
            isSubmitDisabled={createViabilidad.isPending}
            submitLabel={createViabilidad.isPending ? "Guardando..." : "Convertir a Viabilidad por Aprobar"}
          />
        </form>
      </Box>
    </>
  );
}
