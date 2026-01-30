import { useState, useEffect } from "react";
import { Dialog, Flex, Box, Text, Button, Select, ScrollArea, Checkbox } from "@radix-ui/themes";
import { X, Users, Settings, FileCheck, ChevronLeft, ChevronRight, Loader2, Building, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAprobarViabilidad } from "@/hooks/useViabilidades";
import { odfService, PuertosDisponiblesResponse } from "@/services/odf.service";
import { API_BASE_URL, getHeaders, handleResponse } from "@/services/api";
import { toast } from "sonner";
import { Viabilidad } from "@/types/viabilidad";
import { AprobarViabilidadData } from "@/services/viabilidades.service";

interface InformacionComplementariaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viabilidad: Viabilidad | null;
  onSuccess?: () => void;
}

interface Contacto {
  id: number;
  Nombre: string;
  correo_electronico?: string;
  Telefono_movil?: string;
}

interface ODF {
  Id: number;
  Codigo: string;
  Nombre_Empresa: string;
  Cantidad_Puertos?: number;
}

const STEPS = [
  { id: 1, title: "Contactos", icon: Users },
  { id: 2, title: "Detalles Técnicos", icon: Settings },
  { id: 3, title: "Confirmación", icon: FileCheck },
];

export function InformacionComplementariaDialog({
  open,
  onOpenChange,
  viabilidad,
  onSuccess,
}: InformacionComplementariaDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactoComercialId, setContactoComercialId] = useState<number | undefined>();
  const [contactoTecnicoId, setContactoTecnicoId] = useState<number | undefined>();
  const [odfId, setOdfId] = useState<number | undefined>();
  const [odf2Id, setOdf2Id] = useState<number | undefined>();
  const [puerto1, setPuerto1] = useState<number | undefined>();
  const [puerto2, setPuerto2] = useState<number | undefined>();
  const [usarOtroOdf, setUsarOtroOdf] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const aprobarViabilidad = useAprobarViabilidad();

  // Fetch contactos COMERCIALES de la empresa de la viabilidad
  const { data: contactosComerciales, isLoading: isLoadingComerciales } = useQuery({
    queryKey: ["contactos-comerciales", viabilidad?.ID_Empresa],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/ContactosApi?idEmpresa=${viabilidad?.ID_Empresa}&estado=true&tipoContacto=1&pageSize=100`,
        { headers: getHeaders(), credentials: "include" }
      );
      return handleResponse<Contacto[]>(response);
    },
    enabled: open && !!viabilidad?.ID_Empresa,
  });

  // Fetch contactos TÉCNICOS de la empresa de la viabilidad
  const { data: contactosTecnicos, isLoading: isLoadingTecnicos } = useQuery({
    queryKey: ["contactos-tecnicos", viabilidad?.ID_Empresa],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/ContactosApi?idEmpresa=${viabilidad?.ID_Empresa}&estado=true&tipoContacto=2&pageSize=100`,
        { headers: getHeaders(), credentials: "include" }
      );
      return handleResponse<Contacto[]>(response);
    },
    enabled: open && !!viabilidad?.ID_Empresa,
  });

  // Fetch ODFs de la empresa de la viabilidad
  const { data: odfsData, isLoading: isLoadingOdfs } = useQuery({
    queryKey: ["odfs-empresa", viabilidad?.ID_Empresa],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/ODFApi?idEmpresa=${viabilidad?.ID_Empresa}&estado=true&pageSize=100`,
        { headers: getHeaders(), credentials: "include" }
      );
      const result = await handleResponse<{ data: ODF[] }>(response);
      return result.data;
    },
    enabled: open && !!viabilidad?.ID_Empresa,
  });

  // Fetch puertos disponibles para ODF 1
  const { data: puertosOdf1, isLoading: isLoadingPuertos1 } = useQuery({
    queryKey: ["puertos-odf", odfId],
    queryFn: () => odfService.getPuertosDisponibles(odfId!),
    enabled: !!odfId,
  });

  // Fetch puertos disponibles para ODF 2
  const { data: puertosOdf2, isLoading: isLoadingPuertos2 } = useQuery({
    queryKey: ["puertos-odf", odf2Id],
    queryFn: () => odfService.getPuertosDisponibles(odf2Id!),
    enabled: !!odf2Id && usarOtroOdf,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setContactoComercialId(undefined);
      setContactoTecnicoId(undefined);
      setOdfId(undefined);
      setOdf2Id(undefined);
      setPuerto1(undefined);
      setPuerto2(undefined);
      setUsarOtroOdf(false);
      setAceptaTerminos(false);
    }
  }, [open]);

  // Reset puerto cuando cambia el ODF
  useEffect(() => {
    setPuerto1(undefined);
  }, [odfId]);

  useEffect(() => {
    setPuerto2(undefined);
  }, [odf2Id]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = contactoComercialId && contactoTecnicoId;
  const canProceedStep2 = odfId && puerto1 && (!usarOtroOdf || (odf2Id && puerto2));
  const canSubmit = aceptaTerminos;

  const handleSubmit = async () => {
    if (!viabilidad || !aceptaTerminos) return;

    const odfSeleccionado = odfsData?.find((o) => o.Id === odfId);
    const odf2Seleccionado = usarOtroOdf ? odfsData?.find((o) => o.Id === odf2Id) : undefined;

    const infoComplementaria: AprobarViabilidadData = {
      ContactoComercialId: contactoComercialId,
      ContactoTecnicoId: contactoTecnicoId,
      ODFInterno1: odfSeleccionado?.Codigo,
      PuertoODF1: puerto1,
      ODFInterno2: odf2Seleccionado?.Codigo,
      PuertoODF2: puerto2,
      IndicadorOtroODF: usarOtroOdf ? "Otro ODF" : "Sin Otro ODF",
    };

    try {
      await aprobarViabilidad.mutateAsync({
        id: viabilidad.id,
        infoComplementaria,
      });
      toast.success("Viabilidad aprobada y orden de servicio generada exitosamente");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al aprobar la viabilidad");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 700, padding: 0, overflow: 'hidden' }} className="rounded-xl shadow-xl">
        {/* Modernized Header */}
        <div className="bg-gray-50/80 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <Dialog.Title className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-500" />
              Información Complementaria
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mt-1">
              Aprobación de Viabilidad #{viabilidad?.id}
            </Dialog.Description>
          </div>
          <Dialog.Close>
            <Button variant="ghost" color="gray" className="hover:bg-gray-200/50 rounded-full h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </Dialog.Close>
        </div>

        <div className="flex flex-col h-full">
          {/* Enhanced Stepper */}
          <div className="px-6 py-6 bg-white border-b border-gray-100">
            <div className="flex items-center justify-center">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center gap-2 relative z-10 ${currentStep === step.id ? 'opacity-100' : currentStep > step.id ? 'opacity-80' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep === step.id
                        ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20"
                        : currentStep > step.id
                          ? "bg-green-100 border-green-200 text-green-700"
                          : "bg-white border-gray-200 text-gray-400"
                      }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold ${currentStep === step.id ? "text-green-700" : "text-gray-500"
                      }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-24 h-0.5 mx-2 -mt-6 transition-colors duration-300 ${currentStep > index + 1 ? 'bg-green-200' : 'bg-gray-100'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className="bg-white" style={{ height: "450px" }}>
            <div className="p-8">
              {/* Step 1: Contactos */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Info className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-600">
                      Seleccione los responsables comercial y técnico para esta orden.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Contacto Comercial <span className="text-red-500">*</span>
                      </label>
                      <Select.Root
                        value={contactoComercialId?.toString() || ""}
                        onValueChange={(value) => setContactoComercialId(parseInt(value))}
                        disabled={isLoadingComerciales}
                      >
                        <Select.Trigger className="w-full h-11" placeholder="Seleccione contacto comercial" />
                        <Select.Content>
                          {contactosComerciales?.map((contacto) => (
                            <Select.Item key={contacto.id} value={contacto.id.toString()}>
                              {contacto.Nombre} {contacto.correo_electronico ? `(${contacto.correo_electronico})` : ""}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Contacto Técnico <span className="text-red-500">*</span>
                      </label>
                      <Select.Root
                        value={contactoTecnicoId?.toString() || ""}
                        onValueChange={(value) => setContactoTecnicoId(parseInt(value))}
                        disabled={isLoadingTecnicos}
                      >
                        <Select.Trigger className="w-full h-11" placeholder="Seleccione contacto técnico" />
                        <Select.Content>
                          {contactosTecnicos?.map((contacto) => (
                            <Select.Item key={contacto.id} value={contacto.id.toString()}>
                              {contacto.Nombre} {contacto.correo_electronico ? `(${contacto.correo_electronico})` : ""}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: ODF y Puertos */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      Configure la conexión física asignando los ODFs y puertos correspondientes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        ODF Principal <span className="text-red-500">*</span>
                      </label>
                      <Select.Root
                        value={odfId?.toString() || ""}
                        onValueChange={(value) => setOdfId(parseInt(value))}
                        disabled={isLoadingOdfs}
                      >
                        <Select.Trigger className="w-full" placeholder="Seleccione ODF" />
                        <Select.Content>
                          {odfsData?.map((odf) => (
                            <Select.Item key={odf.Id} value={odf.Id.toString()}>
                              {odf.Codigo} - {odf.Nombre_Empresa}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Puerto de Conexión <span className="text-red-500">*</span>
                      </label>
                      <Select.Root
                        value={puerto1?.toString() || ""}
                        onValueChange={(value) => setPuerto1(parseInt(value))}
                        disabled={!odfId || isLoadingPuertos1}
                      >
                        <Select.Trigger className="w-full" placeholder="Seleccione puerto" />
                        <Select.Content>
                          {puertosOdf1?.puertosDisponibles.map((puerto) => (
                            <Select.Item key={puerto} value={puerto.toString()}>
                              Puerto {puerto}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                      {odfId && puertosOdf1 && (
                        <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          {puertosOdf1.puertosDisponibles.length} disponibles
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Checkbox
                        checked={usarOtroOdf}
                        onCheckedChange={(checked) => setUsarOtroOdf(checked === true)}
                        className="w-5 h-5"
                      />
                      <label className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => setUsarOtroOdf(!usarOtroOdf)}>
                        Configurar segundo punto de conexión (Redundancia)
                      </label>
                    </div>

                    {usarOtroOdf && (
                      <div className="grid grid-cols-2 gap-6 pl-8 border-l-2 border-green-100">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            ODF Secundario <span className="text-red-500">*</span>
                          </label>
                          <Select.Root
                            value={odf2Id?.toString() || ""}
                            onValueChange={(value) => setOdf2Id(parseInt(value))}
                            disabled={isLoadingOdfs}
                          >
                            <Select.Trigger className="w-full" placeholder="Seleccione ODF 2" />
                            <Select.Content>
                              {odfsData?.map((odf) => (
                                <Select.Item key={odf.Id} value={odf.Id.toString()}>
                                  {odf.Codigo} - {odf.Nombre_Empresa}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Puerto Secundario <span className="text-red-500">*</span>
                          </label>
                          <Select.Root
                            value={puerto2?.toString() || ""}
                            onValueChange={(value) => setPuerto2(parseInt(value))}
                            disabled={!odf2Id || isLoadingPuertos2}
                          >
                            <Select.Trigger className="w-full" placeholder="Seleccione puerto" />
                            <Select.Content>
                              {puertosOdf2?.puertosDisponibles.map((puerto) => (
                                <Select.Item key={puerto} value={puerto.toString()}>
                                  Puerto {puerto}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Términos y Resumen */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Resumen de Aprobación</h4>

                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Empresa</span>
                        <span className="font-medium">{viabilidad?.Nombre_Empresa}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Viabilidad ID</span>
                        <span className="font-medium">#{viabilidad?.id}</span>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-gray-500 block text-xs">Contacto Comercial</span>
                          <span className="font-medium text-gray-900">{contactosComerciales?.find(c => c.id === contactoComercialId)?.Nombre || "-"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Contacto Técnico</span>
                          <span className="font-medium text-gray-900">{contactosTecnicos?.find(c => c.id === contactoTecnicoId)?.Nombre || "-"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-gray-500 block text-xs">Punto de Conexión 1</span>
                          <span className="font-medium text-gray-900 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs inline-block mt-1">
                            {odfsData?.find(o => o.Id === odfId)?.Codigo || "-"} : Puerto {puerto1 || "-"}
                          </span>
                        </div>
                        {usarOtroOdf && (
                          <div>
                            <span className="text-gray-500 block text-xs">Punto de Conexión 2</span>
                            <span className="font-medium text-gray-900 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs inline-block mt-1">
                              {odfsData?.find(o => o.Id === odf2Id)?.Codigo || "-"} : Puerto {puerto2 || "-"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer" onClick={() => setAceptaTerminos(!aceptaTerminos)}>
                      <Checkbox
                        checked={aceptaTerminos}
                        onCheckedChange={(checked) => setAceptaTerminos(checked === true)}
                        id="terms"
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                        Confirmo que he verificado la información técnica y comercial, y autorizo la generación automática de la Orden de Servicio. Esta acción es irreversible.
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-xl">
            <Button
              variant="outline"
              color="gray"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-3">
              <Dialog.Close>
                <Button variant="ghost" color="gray" className="hover:bg-red-50 hover:text-red-600">
                  Cancelar
                </Button>
              </Dialog.Close>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || aprobarViabilidad.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 shadow-lg shadow-green-600/20"
                >
                  {aprobarViabilidad.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    "Generar Orden"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
