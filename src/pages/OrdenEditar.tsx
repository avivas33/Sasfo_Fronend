import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Box, Flex, Button, Card, Heading, Text, TextField, TextArea, Table, Tabs, Badge, ScrollArea, Select, Dialog, Checkbox } from "@radix-ui/themes";
import { ArrowLeft, Save, Loader2, ClipboardList, MapPin, Radio, Calendar, DollarSign, Paperclip, FileText, Building2, Server, Settings, Upload, Download, Trash2, FileIcon, BookOpen, Plus, Pencil } from "lucide-react";
import { useOrdenDetalle, useUpdateOrden } from "@/hooks/useOrdenes";
import { UpdateOrdenRequest, OrdenStatusColors, TipoConexion, RutaUbicacion, TipoServicioFactura } from "@/types/ordenes";
import { ordenesService, ArchivoAdjunto, OrdenTrabajo, Contratista, ContactoContratista, CreateOrdenTrabajoRequest, ListaComprobacionItem } from "@/services/ordenes.service";
import { toast } from "sonner";
import "@/styles/orden-editar-tabs.css";
import { EnlaceDialog } from "@/components/EnlaceDialog";

const OrdenEditar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ordenId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("general");
  const [modalGeneralOpen, setModalGeneralOpen] = useState(false);
  const [modalUbicacionOpen, setModalUbicacionOpen] = useState(false);
  const [modalInterconexionOpen, setModalInterconexionOpen] = useState(false);
  const [modalServicioOpen, setModalServicioOpen] = useState(false);
  const [modalCostoServicioOpen, setModalCostoServicioOpen] = useState(false);
  const [modalEnlaceOpen, setModalEnlaceOpen] = useState(false);

  const { data: orden, isLoading, isError } = useOrdenDetalle(ordenId ? parseInt(ordenId) : null);
  const updateMutation = useUpdateOrden();

  // Estado del formulario
  const [formData, setFormData] = useState<UpdateOrdenRequest>({});

  // Estado para modal de Información General
  const [noOrdenTemp, setNoOrdenTemp] = useState("");

  // Estado para modal de Detalles Ubicación
  const [ubicacionForm, setUbicacionForm] = useState({
    adesarrolloaid: 0,
    listaUbicacionesaId: 0,
    moduloaId: 0,
    elementoaId: 0,
    Cliente_FinalA: "",
    CoordenadasA: "",
    InquilinoA: "",
    adesarrollozid: 0,
    listaUbicacioneszId: 0,
    modulozId: 0,
    elementozId: 0,
    Cliente_Final: "",
    Coordenadas: "",
    InquilinoZ: "",
  });

  // Catálogos para dropdowns
  const [areasDesarrollo, setAreasDesarrollo] = useState<{ id: number; Nombre: string }[]>([]);
  const [ubicacionesA, setUbicacionesA] = useState<{ id: number; Nombre_Ubicacion: string }[]>([]);
  const [ubicacionesZ, setUbicacionesZ] = useState<{ id: number; Nombre_Ubicacion: string }[]>([]);
  const [modulosA, setModulosA] = useState<{ id: number; modulo: string; Coordenadas: string; Inquilino: string }[]>([]);
  const [modulosZ, setModulosZ] = useState<{ id: number; modulo: string; Coordenadas: string; Inquilino: string }[]>([]);
  const [elementosA, setElementosA] = useState<{ id: number; Elemento: string }[]>([]);
  const [elementosZ, setElementosZ] = useState<{ id: number; Elemento: string }[]>([]);

  // Checkboxes para usar Inquilino como Cliente Final
  const [usarInquilinoA, setUsarInquilinoA] = useState(false);
  const [usarInquilinoZ, setUsarInquilinoZ] = useState(false);

  // Estado para modal de Interconexión
  const [interconexionForm, setInterconexionForm] = useState({
    CID_P1: "",
    CID_P2: "",
    ODFInterno1: "",
    ODFInterno2: "",
    PuertoODF1: 0,
    PuertoODF2: 0,
    No_ODF: "",
    No_ODF2: "",
    Puerto1: 0,
    Puerto2: 0,
    No_FTP: "",
    No_FTP2: "",
    FTP_P1: "",
    FTP_P2: "",
  });
  const [editarCircuito, setEditarCircuito] = useState(false);
  const [editarODFInterno, setEditarODFInterno] = useState(false);
  const [circuitosP1, setCircuitosP1] = useState<{ ID_CircuitosSL: number; CircuitID: string }[]>([]);
  const [circuitosP2, setCircuitosP2] = useState<{ ID_CircuitosSL: number; CircuitID: string }[]>([]);
  const [selectedCircuitoP1, setSelectedCircuitoP1] = useState<number | null>(null);
  const [selectedCircuitoP2, setSelectedCircuitoP2] = useState<number | null>(null);
  const [odfList, setOdfList] = useState<{ Id: number; Codigo: string; Cantidad_Puertos: number }[]>([]);
  const [puertosODF1, setPuertosODF1] = useState<{ Puerto: number; Nombre: string }[]>([]);
  const [puertosODF2, setPuertosODF2] = useState<{ Puerto: number; Nombre: string }[]>([]);
  const [selectedODF1, setSelectedODF1] = useState<number | null>(null);
  const [selectedODF2, setSelectedODF2] = useState<number | null>(null);

  // Estado para modal de Detalle de Servicios
  const [servicioForm, setServicioForm] = useState({
    ID_TipoConexion: 0,
    ID_RutaUbicacion: 0,
    Distancia: 0,
    NRC: 0,
    MRC: 0,
    Item_Interface: "",
    Centro_Costo: "",
  });
  const [tiposConexion, setTiposConexion] = useState<TipoConexion[]>([]);
  const [rutasUbicacion, setRutasUbicacion] = useState<RutaUbicacion[]>([]);

  // Estado para modal de Costo del Servicio
  const [costoServicioForm, setCostoServicioForm] = useState({
    Servicio_Factura: "",
    Costo_Servicio: 0,
  });
  const [tiposServicioFactura, setTiposServicioFactura] = useState<TipoServicioFactura[]>([]);

  // Estado para Archivos Adjuntos
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<ArchivoAdjunto[]>([]);
  const [archivosOTDR, setArchivosOTDR] = useState<ArchivoAdjunto[]>([]);
  const [uploadingAdjunto, setUploadingAdjunto] = useState(false);
  const [uploadingOTDR, setUploadingOTDR] = useState(false);

  // Estado para Orden de Trabajo
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<OrdenTrabajo[]>([]);
  const [modalOrdenTrabajoOpen, setModalOrdenTrabajoOpen] = useState(false);
  const [editingOrdenTrabajo, setEditingOrdenTrabajo] = useState<OrdenTrabajo | null>(null);
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [contactosContratista, setContactosContratista] = useState<ContactoContratista[]>([]);
  const [ordenTrabajoForm, setOrdenTrabajoForm] = useState<CreateOrdenTrabajoRequest>({
    ID_Contratista: 0,
    ID_Contratista_Contacto: 0,
    fecha_vencimiento: "",
    DescripcionTrabajo: "",
  });
  const [savingOrdenTrabajo, setSavingOrdenTrabajo] = useState(false);

  // Estado para Lista de Comprobación
  const [listaComprobacion, setListaComprobacion] = useState<ListaComprobacionItem[]>([]);
  const [nuevoItemComprobacion, setNuevoItemComprobacion] = useState({
    Estado: false,
    Descripcion: "",
    Importante: false,
  });

  // Cargar datos cuando se obtiene la orden
  useEffect(() => {
    if (orden) {
      setFormData({
        Cliente_FinalA: orden.Cliente_FinalA || "",
        CoordenadasA: orden.CoordenadasA || "",
        Cliente_Final: orden.Cliente_Final || "",
        Coordenadas: orden.Coordenadas || "",
        CID_P1: orden.CID_P1 || "",
        CID_P2: orden.CID_P2 || "",
        Puerto1: orden.Puerto1 || 0,
        Puerto2: orden.Puerto2 || 0,
        No_ODF: orden.No_ODF || "",
        No_ODF2: orden.No_ODF2 || "",
        Observaciones: orden.Observaciones || "",
        Comentarios: orden.Comentarios || "",
        Centro_Costo: orden.Centro_Costo || "",
        Item_Interface: orden.Item_Interface || "",
      });

      // Cargar archivos y órdenes de trabajo
      loadArchivos();
      loadOrdenesTrabajo();
    }
  }, [orden]);

  // Cargar órdenes de trabajo
  const loadOrdenesTrabajo = async () => {
    if (!orden?.ID_OrdenServicio) return;

    try {
      const ordenes = await ordenesService.getOrdenesTrabajo(orden.ID_OrdenServicio);
      setOrdenesTrabajo(ordenes);
    } catch (error) {
      console.error("Error al cargar órdenes de trabajo:", error);
    }
  };

  // Cargar archivos adjuntos y OTDR
  const loadArchivos = async () => {
    if (!orden?.ID_OrdenServicio) return;

    try {
      const [adjuntos, otdr] = await Promise.all([
        ordenesService.getArchivosOrden(orden.ID_OrdenServicio),
        ordenesService.getArchivosOTDR(orden.ID_OrdenServicio),
      ]);
      setArchivosAdjuntos(adjuntos);
      setArchivosOTDR(otdr);
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    }
  };

  // Subir archivo adjunto
  const handleUploadAdjunto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !orden?.ID_OrdenServicio) return;

    setUploadingAdjunto(true);
    try {
      await ordenesService.uploadArchivo(orden.ID_OrdenServicio, file, 'adjunto');
      toast.success("Archivo subido correctamente");
      loadArchivos();
    } catch (error: any) {
      toast.error(error.message || "Error al subir archivo");
    } finally {
      setUploadingAdjunto(false);
      event.target.value = ''; // Reset input
    }
  };

  // Subir archivo OTDR
  const handleUploadOTDR = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !orden?.ID_OrdenServicio) return;

    setUploadingOTDR(true);
    try {
      await ordenesService.uploadArchivo(orden.ID_OrdenServicio, file, 'otdr');
      toast.success("Archivo OTDR subido correctamente");
      loadArchivos();
    } catch (error: any) {
      toast.error(error.message || "Error al subir archivo OTDR");
    } finally {
      setUploadingOTDR(false);
      event.target.value = ''; // Reset input
    }
  };

  // Descargar archivo
  const handleDownloadFile = (fileUrl: string) => {
    const downloadUrl = ordenesService.getDownloadUrl(fileUrl);
    window.open(downloadUrl, '_blank');
  };

  // Eliminar archivo
  const handleDeleteFile = async (archivoId: number) => {
    if (!confirm("¿Está seguro de eliminar este archivo?")) return;

    try {
      await ordenesService.deleteArchivo(archivoId);
      toast.success("Archivo eliminado correctamente");
      loadArchivos();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar archivo");
    }
  };

  // ===== Funciones para Orden de Trabajo =====

  // Abrir modal para crear nueva orden de trabajo
  const handleOpenModalOrdenTrabajo = async () => {
    setEditingOrdenTrabajo(null);
    setOrdenTrabajoForm({
      ID_Contratista: 0,
      ID_Contratista_Contacto: 0,
      fecha_vencimiento: "",
      DescripcionTrabajo: "",
    });
    setContactosContratista([]);
    setListaComprobacion([]);
    setNuevoItemComprobacion({ Estado: false, Descripcion: "", Importante: false });

    try {
      const listaContratistas = await ordenesService.getContratistas();
      setContratistas(listaContratistas);
    } catch (error) {
      console.error("Error al cargar contratistas:", error);
      toast.error("Error al cargar contratistas");
    }

    setModalOrdenTrabajoOpen(true);
  };

  // Abrir modal para editar orden de trabajo existente
  const handleEditOrdenTrabajo = async (ordenTrabajo: OrdenTrabajo) => {
    setEditingOrdenTrabajo(ordenTrabajo);
    setOrdenTrabajoForm({
      ID_Contratista: ordenTrabajo.ID_Contratista,
      ID_Contratista_Contacto: ordenTrabajo.ID_Contratista_Contacto,
      fecha_vencimiento: ordenTrabajo.fecha_vencimiento || "",
      DescripcionTrabajo: ordenTrabajo.DescripcionTrabajo || "",
    });
    setNuevoItemComprobacion({ Estado: false, Descripcion: "", Importante: false });

    try {
      const [listaContratistas, listaComp] = await Promise.all([
        ordenesService.getContratistas(),
        ordenesService.getListaComprobacion(ordenTrabajo.ID_Orden),
      ]);
      setContratistas(listaContratistas);
      setListaComprobacion(listaComp);

      if (ordenTrabajo.ID_Contratista > 0) {
        const contactos = await ordenesService.getContactosContratista(ordenTrabajo.ID_Contratista);
        setContactosContratista(contactos);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }

    setModalOrdenTrabajoOpen(true);
  };

  // Manejar cambio de contratista - cargar contactos
  const handleContratistaChange = async (value: string) => {
    const contratistaId = parseInt(value);
    setOrdenTrabajoForm(prev => ({
      ...prev,
      ID_Contratista: contratistaId,
      ID_Contratista_Contacto: 0,
    }));

    if (contratistaId > 0) {
      try {
        const contactos = await ordenesService.getContactosContratista(contratistaId);
        setContactosContratista(contactos);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        setContactosContratista([]);
      }
    } else {
      setContactosContratista([]);
    }
  };

  // Guardar orden de trabajo (crear o actualizar)
  const handleSaveOrdenTrabajo = async () => {
    if (!orden?.ID_OrdenServicio) return;

    if (ordenTrabajoForm.ID_Contratista === 0) {
      toast.error("Seleccione un contratista");
      return;
    }

    setSavingOrdenTrabajo(true);
    try {
      if (editingOrdenTrabajo) {
        await ordenesService.updateOrdenTrabajo(editingOrdenTrabajo.ID_Orden, ordenTrabajoForm);
        toast.success("Orden de trabajo actualizada correctamente");
      } else {
        // Crear nueva orden de trabajo
        const result = await ordenesService.createOrdenTrabajo(orden.ID_OrdenServicio, ordenTrabajoForm);

        // Si hay items temporales en la lista de comprobación, guardarlos
        const itemsTemporales = listaComprobacion.filter(item => item.ID_Lista < 0);
        for (const item of itemsTemporales) {
          await ordenesService.addListaComprobacionItem(result.ID_Orden, {
            Estado: item.Estado === "Activo",
            Descripcion: item.Descripcion,
            Importante: item.Importante === "Importante",
          });
        }

        toast.success("Orden de trabajo creada correctamente");
      }
      setModalOrdenTrabajoOpen(false);
      loadOrdenesTrabajo();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar orden de trabajo");
    } finally {
      setSavingOrdenTrabajo(false);
    }
  };

  // Eliminar orden de trabajo
  const handleDeleteOrdenTrabajo = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta orden de trabajo?")) return;

    try {
      await ordenesService.deleteOrdenTrabajo(id);
      toast.success("Orden de trabajo eliminada correctamente");
      loadOrdenesTrabajo();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar orden de trabajo");
    }
  };

  // Agregar item a lista de comprobación (temporal, se guarda al guardar la orden)
  const handleAddItemComprobacion = async () => {
    if (!nuevoItemComprobacion.Descripcion.trim()) {
      toast.error("Ingrese una descripción");
      return;
    }

    // Si estamos editando una orden existente, guardar directamente
    if (editingOrdenTrabajo) {
      try {
        const nuevoItem = await ordenesService.addListaComprobacionItem(editingOrdenTrabajo.ID_Orden, nuevoItemComprobacion);
        setListaComprobacion(prev => [...prev, nuevoItem]);
        setNuevoItemComprobacion({ Estado: false, Descripcion: "", Importante: false });
        toast.success("Item agregado correctamente");
      } catch (error: any) {
        toast.error(error.message || "Error al agregar item");
      }
    } else {
      // Si es nueva orden, agregar a la lista temporal
      const tempItem: ListaComprobacionItem = {
        ID_Lista: -Date.now(), // ID temporal negativo
        Estado: nuevoItemComprobacion.Estado ? "Activo" : "Inactivo",
        Descripcion: nuevoItemComprobacion.Descripcion,
        Importante: nuevoItemComprobacion.Importante ? "Importante" : "Normal",
      };
      setListaComprobacion(prev => [...prev, tempItem]);
      setNuevoItemComprobacion({ Estado: false, Descripcion: "", Importante: false });
    }
  };

  // Eliminar item de lista de comprobación
  const handleDeleteItemComprobacion = async (item: ListaComprobacionItem) => {
    if (item.ID_Lista > 0) {
      // Item existente en BD
      try {
        await ordenesService.deleteListaComprobacionItem(item.ID_Lista);
        setListaComprobacion(prev => prev.filter(i => i.ID_Lista !== item.ID_Lista));
        toast.success("Item eliminado correctamente");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar item");
      }
    } else {
      // Item temporal (no guardado aún)
      setListaComprobacion(prev => prev.filter(i => i.ID_Lista !== item.ID_Lista));
    }
  };

  const handleInputChange = (field: keyof UpdateOrdenRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!ordenId) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(ordenId),
        request: formData,
      });
      toast.success("Orden actualizada exitosamente");
      navigate("/viabilidades/ordenes");
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar la orden");
    }
  };

  const handleOpenModalGeneral = () => {
    setNoOrdenTemp(orden?.IDViabilidadOLDTXT || "");
    setModalGeneralOpen(true);
  };

  const handleSaveGeneral = async () => {
    if (!ordenId) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(ordenId),
        request: {
          IDViabilidadOLDTXT: noOrdenTemp,
        },
      });
      toast.success("Datos guardados correctamente");
      setModalGeneralOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    }
  };

  // Funciones para modal de Detalles Ubicación
  const handleOpenModalUbicacion = async () => {
    // Cargar áreas de desarrollo
    try {
      const areas = await ordenesService.getAreasDesarrollo();
      setAreasDesarrollo(areas);

      // Prepoblar el formulario con los valores actuales
      const form = {
        adesarrolloaid: orden?.adesarrolloaid || 0,
        listaUbicacionesaId: orden?.listaUbicacionesaId || 0,
        moduloaId: orden?.moduloaId || 0,
        elementoaId: orden?.elementoaId || 0,
        Cliente_FinalA: orden?.Cliente_FinalA || "",
        CoordenadasA: orden?.CoordenadasA || "",
        InquilinoA: orden?.InquilinoA || "",
        adesarrollozid: orden?.adesarrollozid || 0,
        listaUbicacioneszId: orden?.listaUbicacioneszId || 0,
        modulozId: orden?.modulozId || 0,
        elementozId: orden?.elementozId || 0,
        Cliente_Final: orden?.Cliente_Final || "",
        Coordenadas: orden?.Coordenadas || "",
        InquilinoZ: orden?.InquilinoZ || "",
      };
      setUbicacionForm(form);

      // Resetear checkboxes
      setUsarInquilinoA(false);
      setUsarInquilinoZ(false);

      // Cargar los catálogos dependientes si hay valores seleccionados
      if (form.adesarrolloaid) {
        const ubicacionesA = await ordenesService.getUbicacionesPorArea(form.adesarrolloaid);
        setUbicacionesA(ubicacionesA);

        if (form.listaUbicacionesaId) {
          const modulosA = await ordenesService.getModulosPorUbicacion(form.listaUbicacionesaId);
          setModulosA(modulosA);

          if (form.moduloaId) {
            const elementosA = await ordenesService.getElementosPorModulo(form.moduloaId);
            setElementosA(elementosA);
          }
        }
      }

      if (form.adesarrollozid) {
        const ubicacionesZ = await ordenesService.getUbicacionesPorArea(form.adesarrollozid);
        setUbicacionesZ(ubicacionesZ);

        if (form.listaUbicacioneszId) {
          const modulosZ = await ordenesService.getModulosPorUbicacion(form.listaUbicacioneszId);
          setModulosZ(modulosZ);

          if (form.modulozId) {
            const elementosZ = await ordenesService.getElementosPorModulo(form.modulozId);
            setElementosZ(elementosZ);
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
      toast.error("Error al cargar catálogos");
    }

    setModalUbicacionOpen(true);
  };

  // Handlers para cascada Punto A
  const handleAreaAChange = async (value: string) => {
    const areaId = parseInt(value);
    setUbicacionForm({
      ...ubicacionForm,
      adesarrolloaid: areaId,
      listaUbicacionesaId: 0,
      moduloaId: 0,
      elementoaId: 0,
      CoordenadasA: "",
      InquilinoA: "",
    });
    setUbicacionesA([]);
    setModulosA([]);
    setElementosA([]);

    if (areaId) {
      try {
        const ubicaciones = await ordenesService.getUbicacionesPorArea(areaId);
        setUbicacionesA(ubicaciones);
      } catch (error) {
        console.error("Error al cargar ubicaciones A:", error);
      }
    }
  };

  const handleUbicacionAChange = async (value: string) => {
    const ubicacionId = parseInt(value);
    setUbicacionForm({
      ...ubicacionForm,
      listaUbicacionesaId: ubicacionId,
      moduloaId: 0,
      elementoaId: 0,
      CoordenadasA: "",
      InquilinoA: "",
    });
    setModulosA([]);
    setElementosA([]);

    if (ubicacionId) {
      try {
        const modulos = await ordenesService.getModulosPorUbicacion(ubicacionId);
        setModulosA(modulos);
      } catch (error) {
        console.error("Error al cargar módulos A:", error);
      }
    }
  };

  const handleModuloAChange = async (value: string) => {
    const moduloId = parseInt(value);
    const moduloSeleccionado = modulosA.find(m => m.id === moduloId);
    setUbicacionForm({
      ...ubicacionForm,
      moduloaId: moduloId,
      elementoaId: 0,
      CoordenadasA: moduloSeleccionado?.Coordenadas || "",
      InquilinoA: moduloSeleccionado?.Inquilino || "",
    });
    setElementosA([]);

    if (moduloId) {
      try {
        const elementos = await ordenesService.getElementosPorModulo(moduloId);
        setElementosA(elementos);
      } catch (error) {
        console.error("Error al cargar elementos A:", error);
      }
    }
  };

  const handleElementoAChange = (value: string) => {
    setUbicacionForm({
      ...ubicacionForm,
      elementoaId: parseInt(value),
    });
  };

  // Handlers para cascada Punto Z
  const handleAreaZChange = async (value: string) => {
    const areaId = parseInt(value);
    setUbicacionForm({
      ...ubicacionForm,
      adesarrollozid: areaId,
      listaUbicacioneszId: 0,
      modulozId: 0,
      elementozId: 0,
      Coordenadas: "",
      InquilinoZ: "",
    });
    setUbicacionesZ([]);
    setModulosZ([]);
    setElementosZ([]);

    if (areaId) {
      try {
        const ubicaciones = await ordenesService.getUbicacionesPorArea(areaId);
        setUbicacionesZ(ubicaciones);
      } catch (error) {
        console.error("Error al cargar ubicaciones Z:", error);
      }
    }
  };

  const handleUbicacionZChange = async (value: string) => {
    const ubicacionId = parseInt(value);
    setUbicacionForm({
      ...ubicacionForm,
      listaUbicacioneszId: ubicacionId,
      modulozId: 0,
      elementozId: 0,
      Coordenadas: "",
      InquilinoZ: "",
    });
    setModulosZ([]);
    setElementosZ([]);

    if (ubicacionId) {
      try {
        const modulos = await ordenesService.getModulosPorUbicacion(ubicacionId);
        setModulosZ(modulos);
      } catch (error) {
        console.error("Error al cargar módulos Z:", error);
      }
    }
  };

  const handleModuloZChange = async (value: string) => {
    const moduloId = parseInt(value);
    const moduloSeleccionado = modulosZ.find(m => m.id === moduloId);
    setUbicacionForm({
      ...ubicacionForm,
      modulozId: moduloId,
      elementozId: 0,
      Coordenadas: moduloSeleccionado?.Coordenadas || "",
      InquilinoZ: moduloSeleccionado?.Inquilino || "",
    });
    setElementosZ([]);

    if (moduloId) {
      try {
        const elementos = await ordenesService.getElementosPorModulo(moduloId);
        setElementosZ(elementos);
      } catch (error) {
        console.error("Error al cargar elementos Z:", error);
      }
    }
  };

  const handleElementoZChange = (value: string) => {
    setUbicacionForm({
      ...ubicacionForm,
      elementozId: parseInt(value),
    });
  };

  // Handlers para checkbox "Usar Inquilino como Cliente Final"
  const handleUsarInquilinoAChange = (checked: boolean) => {
    setUsarInquilinoA(checked);
    if (checked && ubicacionForm.InquilinoA) {
      setUbicacionForm({
        ...ubicacionForm,
        Cliente_FinalA: ubicacionForm.InquilinoA,
      });
    }
  };

  const handleUsarInquilinoZChange = (checked: boolean) => {
    setUsarInquilinoZ(checked);
    if (checked && ubicacionForm.InquilinoZ) {
      setUbicacionForm({
        ...ubicacionForm,
        Cliente_Final: ubicacionForm.InquilinoZ,
      });
    }
  };

  const handleSaveUbicacion = async () => {
    if (!ordenId) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(ordenId),
        request: {
          // Punto A
          adesarrolloaid: ubicacionForm.adesarrolloaid || undefined,
          listaUbicacionesaId: ubicacionForm.listaUbicacionesaId || undefined,
          moduloaId: ubicacionForm.moduloaId || undefined,
          elementoaId: ubicacionForm.elementoaId || undefined,
          Cliente_FinalA: ubicacionForm.Cliente_FinalA,
          CoordenadasA: ubicacionForm.CoordenadasA,
          // Punto Z
          adesarrollozid: ubicacionForm.adesarrollozid || undefined,
          listaUbicacioneszId: ubicacionForm.listaUbicacioneszId || undefined,
          modulozId: ubicacionForm.modulozId || undefined,
          elementozId: ubicacionForm.elementozId || undefined,
          Cliente_Final: ubicacionForm.Cliente_Final,
          Coordenadas: ubicacionForm.Coordenadas,
        },
      });
      toast.success("Datos de ubicación guardados correctamente");
      setModalUbicacionOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    }
  };

  // Funciones para modal de Interconexión
  const handleOpenModalInterconexion = async () => {
    setInterconexionForm({
      CID_P1: orden?.CID_P1 || "",
      CID_P2: orden?.CID_P2 || "",
      ODFInterno1: orden?.ODFInterno1 || "",
      ODFInterno2: orden?.ODFInterno2 || "",
      PuertoODF1: orden?.PuertoODF1 || 0,
      PuertoODF2: orden?.PuertoODF2 || 0,
      No_ODF: orden?.No_ODF || "",
      No_ODF2: orden?.No_ODF2 || "",
      Puerto1: orden?.Puerto1 || 0,
      Puerto2: orden?.Puerto2 || 0,
      No_FTP: orden?.No_FTP || "",
      No_FTP2: orden?.No_FTP2 || "",
      FTP_P1: orden?.FTP_P1 || "",
      FTP_P2: orden?.FTP_P2 || "",
    });
    setEditarCircuito(false);
    setEditarODFInterno(false);
    setSelectedCircuitoP1(null);
    setSelectedCircuitoP2(null);
    setSelectedODF1(null);
    setSelectedODF2(null);
    setPuertosODF1([]);
    setPuertosODF2([]);

    // Cargar circuitos y ODFs disponibles
    if (ordenId) {
      try {
        const id = parseInt(ordenId);
        const [circP1, circP2, odfs] = await Promise.all([
          ordenesService.getCircuitosP1(id),
          ordenesService.getCircuitosP2(id),
          ordenesService.getODFs(id), // Filtrado por empresa de la orden
        ]);
        console.log("Circuitos P1 cargados:", circP1);
        console.log("Circuitos P2 cargados:", circP2);
        console.log("ODFs cargados (filtrados por empresa):", odfs);
        setCircuitosP1(circP1);
        setCircuitosP2(circP2);
        setOdfList(odfs);

        // Pre-seleccionar ODFs si ya existen en la orden
        if (orden?.ODFInterno1 && odfs.length > 0) {
          const odf1 = odfs.find(o => o.Codigo === orden.ODFInterno1);
          if (odf1) {
            setSelectedODF1(odf1.Id);
            // Cargar puertos para ODF1
            const puertos1 = await ordenesService.getPuertosODF(odf1.Id);
            setPuertosODF1(puertos1);
          }
        }
        if (orden?.ODFInterno2 && odfs.length > 0) {
          const odf2 = odfs.find(o => o.Codigo === orden.ODFInterno2);
          if (odf2) {
            setSelectedODF2(odf2.Id);
            // Cargar puertos para ODF2
            const puertos2 = await ordenesService.getPuertosODF(odf2.Id);
            setPuertosODF2(puertos2);
          }
        }

        // Informar si no hay circuitos disponibles
        if (circP1.length === 0 && circP2.length === 0) {
          toast.info("No hay circuitos disponibles para esta orden. Verifique que la ubicación tenga un Service Location asignado.");
        }
        // Informar si no hay ODFs disponibles
        if (odfs.length === 0) {
          toast.info("No hay ODFs disponibles para la empresa de esta orden.");
        }
      } catch (error) {
        console.error("Error al cargar circuitos/ODFs:", error);
        toast.error("Error al cargar circuitos y ODFs");
      }
    }

    setModalInterconexionOpen(true);
  };

  // Handler para cambio de ODF Crossconnect 1
  const handleODF1Change = async (value: string) => {
    const odfId = parseInt(value);
    setSelectedODF1(odfId || null);
    const odf = odfList.find(o => o.Id === odfId);
    setInterconexionForm(prev => ({
      ...prev,
      ODFInterno1: odf?.Codigo || "",
    }));

    if (odfId) {
      try {
        const puertos = await ordenesService.getPuertosODF(odfId);
        setPuertosODF1(puertos);
      } catch (error) {
        console.error("Error al cargar puertos ODF1:", error);
      }
    } else {
      setPuertosODF1([]);
    }
  };

  // Handler para cambio de ODF Crossconnect 2
  const handleODF2Change = async (value: string) => {
    const odfId = parseInt(value);
    setSelectedODF2(odfId || null);
    const odf = odfList.find(o => o.Id === odfId);
    setInterconexionForm(prev => ({
      ...prev,
      ODFInterno2: odf?.Codigo || "",
    }));

    if (odfId) {
      try {
        const puertos = await ordenesService.getPuertosODF(odfId);
        setPuertosODF2(puertos);
      } catch (error) {
        console.error("Error al cargar puertos ODF2:", error);
      }
    } else {
      setPuertosODF2([]);
    }
  };

  const handleInterconexionInputChange = (field: string, value: string | number) => {
    setInterconexionForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Estado para indicar si se está actualizando desde Vetro
  const [actualizandoVetro, setActualizandoVetro] = useState(false);

  // Función para actualizar ODF/FTP desde Vetro API
  const handleActualizarDesdeVetro = async (circuitoId: number, tipo: 'P1' | 'P2') => {
    if (!circuitoId) {
      toast.warning("Primero seleccione un circuito");
      return;
    }

    setActualizandoVetro(true);
    try {
      console.log(`Actualizando circuito ${tipo} desde Vetro:`, circuitoId);
      const result = await ordenesService.actualizarCircuitoDesdeVetro(circuitoId);

      if (result.success && result.data) {
        console.log("Datos actualizados desde Vetro:", result.data);

        if (tipo === 'P1') {
          setInterconexionForm(prev => ({
            ...prev,
            No_ODF: result.data!.ODF || "",
            No_FTP: result.data!.FTP || "",
            Puerto1: result.data!.PuertoODF || 0,
            FTP_P1: result.data!.PuertoFTP?.toString() || "",
          }));
        } else {
          setInterconexionForm(prev => ({
            ...prev,
            No_ODF2: result.data!.ODF || "",
            No_FTP2: result.data!.FTP || "",
            Puerto2: result.data!.PuertoODF || 0,
            FTP_P2: result.data!.PuertoFTP?.toString() || "",
          }));
        }

        toast.success(result.message || "ODF/FTP actualizados desde Vetro");
      } else {
        toast.error(result.error || "Error al actualizar desde Vetro");
      }
    } catch (error) {
      console.error("Error al actualizar desde Vetro:", error);
      toast.error("Error al conectar con Vetro API");
    } finally {
      setActualizandoVetro(false);
    }
  };

  // Al seleccionar un circuito P1, auto-llenar ODF y FTP
  const handleCircuitoP1Change = async (value: string) => {
    const circuitoId = parseInt(value);
    setSelectedCircuitoP1(circuitoId || null);

    if (circuitoId) {
      try {
        console.log("Obteniendo detalle del circuito P1:", circuitoId);
        const detalle = await ordenesService.getCircuitoDetalle(circuitoId);
        console.log("Detalle del circuito P1 recibido:", detalle);
        const circuito = circuitosP1.find(c => c.ID_CircuitosSL === circuitoId);
        setInterconexionForm(prev => ({
          ...prev,
          CID_P1: circuito?.CircuitID || "",
          No_ODF: detalle.ODF || "",
          No_FTP: detalle.FTP || "",
          Puerto1: detalle.PuertoODF || 0,
          FTP_P1: detalle.PuertoFTP?.toString() || "",
        }));

        if (!detalle.ODF && !detalle.FTP) {
          toast.info("El circuito seleccionado no tiene ODF/FTP asignados en CircuitoVetro");
        }
      } catch (error) {
        console.error("Error al obtener detalle del circuito P1:", error);
        toast.error("Error al cargar detalle del circuito");
      }
    }
  };

  // Al seleccionar un circuito P2, auto-llenar ODF2 y FTP2
  const handleCircuitoP2Change = async (value: string) => {
    const circuitoId = parseInt(value);
    setSelectedCircuitoP2(circuitoId || null);

    if (circuitoId) {
      try {
        console.log("Obteniendo detalle del circuito P2:", circuitoId);
        const detalle = await ordenesService.getCircuitoDetalle(circuitoId);
        console.log("Detalle del circuito P2 recibido:", detalle);
        const circuito = circuitosP2.find(c => c.ID_CircuitosSL === circuitoId);
        setInterconexionForm(prev => ({
          ...prev,
          CID_P2: circuito?.CircuitID || "",
          No_ODF2: detalle.ODF || "",
          No_FTP2: detalle.FTP || "",
          Puerto2: detalle.PuertoODF || 0,
          FTP_P2: detalle.PuertoFTP?.toString() || "",
        }));

        if (!detalle.ODF && !detalle.FTP) {
          toast.info("El circuito seleccionado no tiene ODF/FTP asignados en CircuitoVetro");
        }
      } catch (error) {
        console.error("Error al obtener detalle del circuito P2:", error);
        toast.error("Error al cargar detalle del circuito");
      }
    }
  };

  const handleGuardarInterconexion = async () => {
    if (!ordenId) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(ordenId),
        request: {
          CID_P1: interconexionForm.CID_P1,
          CID_P2: interconexionForm.CID_P2,
          No_ODF: interconexionForm.No_ODF,
          No_ODF2: interconexionForm.No_ODF2,
          Puerto1: interconexionForm.Puerto1,
          Puerto2: interconexionForm.Puerto2,
          No_FTP: interconexionForm.No_FTP,
          No_FTP2: interconexionForm.No_FTP2,
          FTP_P1: interconexionForm.FTP_P1,
          FTP_P2: interconexionForm.FTP_P2,
          ODFInterno1: interconexionForm.ODFInterno1,
          ODFInterno2: interconexionForm.ODFInterno2,
          PuertoODF1: interconexionForm.PuertoODF1,
          PuertoODF2: interconexionForm.PuertoODF2,
        },
      });
      toast.success("Datos de interconexión guardados correctamente");
      setModalInterconexionOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    }
  };

  // Funciones para modal de Detalle de Servicios
  const handleOpenModalServicio = async () => {
    console.log("=== handleOpenModalServicio INICIADO ===");
    console.log("orden:", orden);
    const tipoConexionActual = orden?.ID_TipoConexion || 0;

    setServicioForm({
      ID_TipoConexion: tipoConexionActual,
      ID_RutaUbicacion: orden?.ID_RutaUbicacion || 0,
      Distancia: orden?.Distancia || 0,
      NRC: orden?.NRC || 0,
      MRC: orden?.MRC || 0,
      Item_Interface: orden?.Item_Interface || "",
      Centro_Costo: orden?.Centro_Costo || "",
    });

    try {
      // Cargar tipos de conexión
      const tipos = await ordenesService.getTiposConexion();
      console.log("Tipos conexión cargados:", tipos);
      setTiposConexion(tipos);

      // Cargar rutas filtradas por orden y tipo de conexión actual
      // Usar ordenId (ID de viabilidad) para buscar las rutas
      console.log("Cargando rutas - viabilidadId:", ordenId, "tipoConexion:", tipoConexionActual);
      if (ordenId) {
        const rutas = await ordenesService.getRutasUbicacionPorOrden(
          parseInt(ordenId),
          tipoConexionActual > 0 ? tipoConexionActual : undefined
        );
        console.log("Rutas cargadas:", rutas);
        setRutasUbicacion(rutas);
      } else {
        console.log("No se cargan rutas - falta ordenId");
      }
    } catch (error) {
      console.error("Error al cargar catálogos de servicio:", error);
      toast.error("Error al cargar catálogos");
    }

    setModalServicioOpen(true);
  };

  // Handler para cambio de tipo de conexión - recarga las rutas filtradas
  const handleTipoConexionChange = async (value: string) => {
    const tipoConexionId = parseInt(value);

    setServicioForm(prev => ({
      ...prev,
      ID_TipoConexion: tipoConexionId,
      ID_RutaUbicacion: 0, // Limpiar ruta seleccionada
      MRC: 0,
      NRC: 0,
    }));

    // Recargar rutas filtradas por el nuevo tipo de conexión
    // Usar ordenId (ID de viabilidad) en lugar de ID_OrdenServicio
    if (ordenId) {
      try {
        const rutas = await ordenesService.getRutasUbicacionPorOrden(
          parseInt(ordenId),
          tipoConexionId > 0 ? tipoConexionId : undefined
        );
        setRutasUbicacion(rutas);
      } catch (error) {
        console.error("Error al cargar rutas:", error);
        toast.error("Error al cargar rutas");
      }
    }
  };

  const handleRutaChange = async (value: string) => {
    const rutaId = parseInt(value);
    const rutaSeleccionada = rutasUbicacion.find(r => r.id === rutaId);

    setServicioForm(prev => ({
      ...prev,
      ID_RutaUbicacion: rutaId,
      MRC: rutaSeleccionada?.MRC || 0,
      NRC: rutaSeleccionada?.NRC || 0,
    }));
  };

  const handleGuardarServicio = async () => {
    if (!ordenId) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(ordenId),
        request: {
          ID_TipoConexion: servicioForm.ID_TipoConexion || undefined,
          ID_RutaUbicacion: servicioForm.ID_RutaUbicacion || undefined,
          Distancia: servicioForm.Distancia || undefined,
          NRC: servicioForm.NRC || undefined,
          MRC: servicioForm.MRC || undefined,
          Item_Interface: servicioForm.Item_Interface || undefined,
          Centro_Costo: servicioForm.Centro_Costo || undefined,
        },
      });
      toast.success("Detalle de servicio guardado correctamente");
      setModalServicioOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    }
  };

  // Funciones para modal de Costo del Servicio
  const handleOpenModalCostoServicio = async () => {
    setCostoServicioForm({
      Servicio_Factura: orden?.Servicio_Factura || "",
      Costo_Servicio: orden?.MRC || 0,
    });

    try {
      const tipos = await ordenesService.getTiposServicioFactura();
      setTiposServicioFactura(tipos);
    } catch (error) {
      console.error("Error al cargar tipos de servicio:", error);
    }

    setModalCostoServicioOpen(true);
  };

  const handleGuardarCostoServicio = async () => {
    if (!ordenId) return;

    try {
      await updateMutation.mutateAsync({
        id: parseInt(ordenId),
        request: {
          Servicio_Factura: costoServicioForm.Servicio_Factura || undefined,
          MRC: costoServicioForm.Costo_Servicio || undefined,
        },
      });
      toast.success("Costo del servicio guardado correctamente");
      setModalCostoServicioOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    }
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("es-PA", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formatear número de enlace como EFO-XXXX (igual que proyecto original)
  const formatEnlace = (idEnlace: number | null | undefined) => {
    if (!idEnlace || idEnlace === 0) return "-";
    if (idEnlace < 10) return `EFO-000${idEnlace}`;
    if (idEnlace < 100) return `EFO-00${idEnlace}`;
    if (idEnlace < 1000) return `EFO-0${idEnlace}`;
    return `EFO-${idEnlace}`;
  };

  if (!ordenId) {
    return (
      <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
        <AppSidebar />
        <Box className="flex-1 flex flex-col items-center justify-center">
          <Text size="4" style={{ color: "var(--red-11)" }}>
            No se especificó una orden para editar
          </Text>
          <Button variant="soft" className="mt-4" onClick={() => navigate("/viabilidades/ordenes")}>
            <ArrowLeft className="w-4 h-4" />
            Volver a Órdenes
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header Card */}
        <Box className="bg-white border-b p-4" style={{ borderColor: "var(--gray-6)" }}>
          <Flex align="center" justify="between" mb="3">
            <Flex align="center" gap="3">
              <Button
                variant="ghost"
                color="gray"
                onClick={() => navigate("/viabilidades/ordenes")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Box>
                <Heading size="5">Detalle de Orden de Servicio</Heading>
              </Box>
            </Flex>
          </Flex>

          {/* Grid de Información Principal */}
          {orden && (
            <Box className="mt-4">
              <Table.Root variant="surface" size="1">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}># Orden</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}># Viabilidad</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}># Enlace</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Asignado a:</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Creado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Vencimiento</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ textAlign: "center" }}></Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Text weight="medium">{orden.ID_OrdenServicio || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Text weight="medium">{orden.ID_Viabilidad || orden.id || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Text weight="medium" style={{ cursor: orden.ID_Enlace ? "pointer" : "default", color: orden.ID_Enlace ? "var(--blue-9)" : "inherit" }}>
                        {formatEnlace(orden.ID_Enlace)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Text>{orden.Nombre_Tecnico || "-"}</Text>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Text>{formatDate(orden.Fecha_Aprobacion)}</Text>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Text>{formatDate(orden.Fecha_Vencimiento)}</Text>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Badge
                        color={OrdenStatusColors[orden.StatusCode as keyof typeof OrdenStatusColors] || "gray"}
                        variant="surface"
                        size="1"
                      >
                        {orden.Status || "-"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Button
                        variant="soft"
                        size="1"
                        disabled={orden.Enlace_Creado === true}
                        title={orden.Enlace_Creado ? "Enlace ya creado" : "Crear nuevo Enlace"}
                        onClick={() => setModalEnlaceOpen(true)}
                      >
                        <Server className="w-3 h-3 mr-1" />
                        Enlace
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Box>

        {/* Content */}
        {isLoading ? (
          <Flex align="center" justify="center" className="flex-1">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--blue-9)" }} />
          </Flex>
        ) : isError ? (
          <Flex direction="column" align="center" justify="center" className="flex-1">
            <Text size="4" style={{ color: "var(--red-11)" }}>Error al cargar la orden</Text>
            <Button variant="soft" className="mt-4" onClick={() => navigate("/viabilidades/ordenes")}>
              <ArrowLeft className="w-4 h-4" />
              Volver a Órdenes
            </Button>
          </Flex>
        ) : orden && (
          <Box className="flex-1 p-6 overflow-hidden flex flex-col">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="orden-editar-container">
              {/* Sidebar Tabs */}
              <Box className="orden-tabs-sidebar">
                <Tabs.List className="orden-tabs-list">
                  <Tabs.Trigger value="general" className="orden-tab-trigger">
                    <ClipboardList className="w-4 h-4" />
                    Información General
                  </Tabs.Trigger>
                  <Tabs.Trigger value="ubicacion" className="orden-tab-trigger">
                    <MapPin className="w-4 h-4" />
                    Detalle de Ubicación
                  </Tabs.Trigger>
                  <Tabs.Trigger value="interconexion" className="orden-tab-trigger">
                    <Radio className="w-4 h-4" />
                    Detalle de Interconexión
                  </Tabs.Trigger>
                  <Tabs.Trigger value="servicio" className="orden-tab-trigger">
                    <Calendar className="w-4 h-4" />
                    Detalle de Servicios
                  </Tabs.Trigger>
                  <Tabs.Trigger value="costo" className="orden-tab-trigger">
                    <DollarSign className="w-4 h-4" />
                    Costo del Servicio
                  </Tabs.Trigger>
                  <Tabs.Trigger value="archivos" className="orden-tab-trigger">
                    <Paperclip className="w-4 h-4" />
                    Archivos Adjuntos
                  </Tabs.Trigger>
                  <Tabs.Trigger value="ordenTrabajo" className="orden-tab-trigger">
                    <BookOpen className="w-4 h-4" />
                    Orden de Trabajo
                  </Tabs.Trigger>
                </Tabs.List>
              </Box>

              {/* Content Area */}
              <Box className="orden-tab-content-wrapper">

                {/* Información General */}
                <Tabs.Content value="general" className="orden-tab-content">
                  <Box mb="2">
                    <Button variant="soft" size="1" onClick={handleOpenModalGeneral}>
                      <FileText className="w-4 h-4 mr-1" />
                      Modificar No. Orden
                    </Button>
                  </Box>

                  <Card>
                    <Table.Root variant="surface">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ width: "200px" }}><Text weight="bold" size="2">Empresa</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.Operador || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Dirección</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.DireccionEmpresa || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Contacto Comercial</Text></Table.Cell>
                          <Table.Cell><Text size="2" style={{ textTransform: "uppercase" }}>{orden.ContactoComercial || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Teléfono Fijo</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.TelefonoFijo || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Teléfono Móvil</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.TelefonoMovil || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Correo Electrónico</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.CorreoElectronico || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">No. Orden</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.IDViabilidadOLDTXT || "-"}</Text></Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Card>

                  {/* Modal para Información General */}
                  <Dialog.Root open={modalGeneralOpen} onOpenChange={setModalGeneralOpen}>
                    <Dialog.Content maxWidth="450px">
                      <Dialog.Title>Establecer No. Orden</Dialog.Title>
                      <Flex direction="column" gap="3" mt="4">
                        <Box>
                          <Text size="2" weight="bold" mb="1" as="label">No. Orden</Text>
                          <TextField.Root
                            value={noOrdenTemp}
                            onChange={(e) => setNoOrdenTemp(e.target.value)}
                            placeholder="No. Orden"
                          />
                        </Box>
                      </Flex>
                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">Cerrar</Button>
                        </Dialog.Close>
                        <Button onClick={handleSaveGeneral} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Guardar
                        </Button>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Tabs.Content>

                {/* Detalle de Ubicación */}
                <Tabs.Content value="ubicacion" className="orden-tab-content">
                  <Box mb="2">
                    <Button variant="soft" size="1" onClick={handleOpenModalUbicacion}>
                      <MapPin className="w-4 h-4 mr-1" />
                      Modificar Ubicaciones
                    </Button>
                  </Box>

                  <Card>
                    <Table.Root variant="surface" style={{ tableLayout: "fixed", width: "100%" }}>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={{ width: "20%" }}></Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ width: "40%", textAlign: "center", color: "var(--blue-11)" }}>PUNTO A</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ width: "40%", textAlign: "center", color: "var(--blue-11)" }}>PUNTO Z</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Área de Desarrollo</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.AreaDesarrolloA || "-"}</Text></Table.Cell>
                          <Table.Cell><Text size="2">{orden.AreaDesarrolloZ || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Ubicación</Text></Table.Cell>
                          <Table.Cell><Text size="2" style={{ textTransform: "uppercase" }}>{orden.UbicacionA || "-"}</Text></Table.Cell>
                          <Table.Cell><Text size="2" style={{ textTransform: "uppercase" }}>{orden.UbicacionZ || "-"}</Text></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Módulo / SL</Text></Table.Cell>
                          <Table.Cell>
                            <Text size="2" style={{ textTransform: "uppercase" }}>
                              {[orden.ModuloA, orden.ElementoA].filter(Boolean).join(" / ") || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text size="2" style={{ textTransform: "uppercase" }}>
                              {[orden.ModuloZ, orden.ElementoZ].filter(Boolean).join(" / ") || "-"}
                            </Text>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Cliente Final</Text></Table.Cell>
                          <Table.Cell>
                            <Text size="2" style={{ textTransform: "uppercase" }}>{orden.Cliente_FinalA || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text size="2" style={{ textTransform: "uppercase" }}>{orden.Cliente_Final || "-"}</Text>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell><Text weight="bold" size="2">Coordenadas</Text></Table.Cell>
                          <Table.Cell>
                            <Text size="2">{orden.CoordenadasA || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text size="2">{orden.Coordenadas || "-"}</Text>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Card>

                  {/* Modal Editar Ubicación */}
                  <Dialog.Root open={modalUbicacionOpen} onOpenChange={setModalUbicacionOpen}>
                    <Dialog.Content maxWidth="900px">
                      <Dialog.Title>Editar Información Punto A y Z</Dialog.Title>
                      <Box mt="4">
                        <Table.Root variant="surface" size="1" style={{ tableLayout: "fixed", width: "100%" }}>
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeaderCell style={{ width: "22%" }}></Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell style={{ width: "39%", textAlign: "center", color: "var(--blue-11)" }}>PUNTO A</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell style={{ width: "39%", textAlign: "center", color: "var(--blue-11)" }}>PUNTO Z</Table.ColumnHeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell><Text weight="bold" size="2">Área de Desarrollo</Text></Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.adesarrolloaid?.toString() || ""}
                                  onValueChange={handleAreaAChange}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%" }} />
                                  <Select.Content>
                                    {areasDesarrollo.map((area) => (
                                      <Select.Item key={area.id} value={area.id.toString()}>
                                        {area.Nombre}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.adesarrollozid?.toString() || ""}
                                  onValueChange={handleAreaZChange}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%" }} />
                                  <Select.Content>
                                    {areasDesarrollo.map((area) => (
                                      <Select.Item key={area.id} value={area.id.toString()}>
                                        {area.Nombre}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell><Text weight="bold" size="2">Ubicación</Text></Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.listaUbicacionesaId?.toString() || ""}
                                  onValueChange={handleUbicacionAChange}
                                  disabled={!ubicacionForm.adesarrolloaid}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%", textTransform: "uppercase" }} />
                                  <Select.Content>
                                    {ubicacionesA.map((ubicacion) => (
                                      <Select.Item key={ubicacion.id} value={ubicacion.id.toString()} style={{ textTransform: "uppercase" }}>
                                        {ubicacion.Nombre_Ubicacion}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.listaUbicacioneszId?.toString() || ""}
                                  onValueChange={handleUbicacionZChange}
                                  disabled={!ubicacionForm.adesarrollozid}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%", textTransform: "uppercase" }} />
                                  <Select.Content>
                                    {ubicacionesZ.map((ubicacion) => (
                                      <Select.Item key={ubicacion.id} value={ubicacion.id.toString()} style={{ textTransform: "uppercase" }}>
                                        {ubicacion.Nombre_Ubicacion}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell><Text weight="bold" size="2">Módulo</Text></Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.moduloaId?.toString() || ""}
                                  onValueChange={handleModuloAChange}
                                  disabled={!ubicacionForm.listaUbicacionesaId}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%", textTransform: "uppercase" }} />
                                  <Select.Content>
                                    {modulosA.map((modulo) => (
                                      <Select.Item key={modulo.id} value={modulo.id.toString()} style={{ textTransform: "uppercase" }}>
                                        {modulo.modulo}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.modulozId?.toString() || ""}
                                  onValueChange={handleModuloZChange}
                                  disabled={!ubicacionForm.listaUbicacioneszId}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%", textTransform: "uppercase" }} />
                                  <Select.Content>
                                    {modulosZ.map((modulo) => (
                                      <Select.Item key={modulo.id} value={modulo.id.toString()} style={{ textTransform: "uppercase" }}>
                                        {modulo.modulo}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell><Text weight="bold" size="2">Identificador del Módulo</Text></Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.elementoaId?.toString() || ""}
                                  onValueChange={handleElementoAChange}
                                  disabled={!ubicacionForm.moduloaId}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%", textTransform: "uppercase" }} />
                                  <Select.Content>
                                    {elementosA.map((elemento) => (
                                      <Select.Item key={elemento.id} value={elemento.id.toString()} style={{ textTransform: "uppercase" }}>
                                        {elemento.Elemento}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                              <Table.Cell>
                                <Select.Root
                                  size="1"
                                  value={ubicacionForm.elementozId?.toString() || ""}
                                  onValueChange={handleElementoZChange}
                                  disabled={!ubicacionForm.modulozId}
                                >
                                  <Select.Trigger placeholder="Seleccione..." style={{ width: "100%", textTransform: "uppercase" }} />
                                  <Select.Content>
                                    {elementosZ.map((elemento) => (
                                      <Select.Item key={elemento.id} value={elemento.id.toString()} style={{ textTransform: "uppercase" }}>
                                        {elemento.Elemento}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell><Text weight="bold" size="2">Cliente Final</Text></Table.Cell>
                              <Table.Cell>
                                <Flex direction="column" gap="2">
                                  <TextField.Root
                                    value={ubicacionForm.Cliente_FinalA}
                                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, Cliente_FinalA: e.target.value })}
                                    placeholder="Cliente Final"
                                    style={{ textTransform: "uppercase" }}
                                  />
                                  <Flex align="center" gap="2">
                                    <Checkbox
                                      checked={usarInquilinoA}
                                      onCheckedChange={handleUsarInquilinoAChange}
                                    />
                                    <Text size="1">Usar Inquilino como Cliente Final</Text>
                                  </Flex>
                                </Flex>
                              </Table.Cell>
                              <Table.Cell>
                                <Flex direction="column" gap="2">
                                  <TextField.Root
                                    value={ubicacionForm.Cliente_Final}
                                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, Cliente_Final: e.target.value })}
                                    placeholder="Cliente Final"
                                    style={{ textTransform: "uppercase" }}
                                  />
                                  <Flex align="center" gap="2">
                                    <Checkbox
                                      checked={usarInquilinoZ}
                                      onCheckedChange={handleUsarInquilinoZChange}
                                    />
                                    <Text size="1">Usar Inquilino como Cliente Final</Text>
                                  </Flex>
                                </Flex>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell><Text weight="bold" size="2">Coordenadas</Text></Table.Cell>
                              <Table.Cell>
                                <TextField.Root
                                  value={ubicacionForm.CoordenadasA}
                                  onChange={(e) => setUbicacionForm({ ...ubicacionForm, CoordenadasA: e.target.value })}
                                  placeholder="Coordenadas"
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <TextField.Root
                                  value={ubicacionForm.Coordenadas}
                                  onChange={(e) => setUbicacionForm({ ...ubicacionForm, Coordenadas: e.target.value })}
                                  placeholder="Coordenadas"
                                />
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table.Root>
                      </Box>
                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">Cancelar</Button>
                        </Dialog.Close>
                        <Button onClick={handleSaveUbicacion} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Guardar Cambios
                        </Button>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Tabs.Content>

                {/* Detalle de Interconexión */}
                <Tabs.Content value="interconexion" className="orden-tab-content">
                  <Box mb="2">
                    <Button variant="soft" size="1" onClick={handleOpenModalInterconexion}>
                      <Settings className="w-4 h-4 mr-1" />
                      Modificar Inter
                    </Button>
                  </Box>

                  <Table.Root variant="surface" size="1">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell style={{ width: "20%" }}></Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ width: "20%" }}>Primero</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ width: "20%" }}>Segundo</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ width: "20%" }}></Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ width: "20%" }}></Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {/* CID */}
                      <Table.Row>
                        <Table.Cell><Text weight="bold" size="2">CID</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.CID_P1 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.CID_P2 || "-"}</Text></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                      </Table.Row>
                      {/* ODF Crossconnect */}
                      <Table.Row>
                        <Table.Cell><Text weight="bold" size="2">ODF Crossconnect</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.ODFInterno1 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.ODFInterno2 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.PuertoODF1 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.PuertoODF2 || "-"}</Text></Table.Cell>
                      </Table.Row>
                      {/* ODF */}
                      <Table.Row>
                        <Table.Cell><Text weight="bold" size="2">ODF</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.No_ODF || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.No_ODF2 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.Puerto1 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.Puerto2 || "-"}</Text></Table.Cell>
                      </Table.Row>
                      {/* FTP */}
                      <Table.Row>
                        <Table.Cell><Text weight="bold" size="2">FTP</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.No_FTP || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.No_FTP2 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.FTP_P1 || "-"}</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.FTP_P2 || "-"}</Text></Table.Cell>
                      </Table.Row>
                      {/* Distancia */}
                      <Table.Row>
                        <Table.Cell><Text weight="bold" size="2">Distancia (Mts)</Text></Table.Cell>
                        <Table.Cell><Text size="2">{orden?.Distancia || "-"}</Text></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>

                  {/* Modal de Edición de Interconexión */}
                  <Dialog.Root open={modalInterconexionOpen} onOpenChange={setModalInterconexionOpen}>
                    <Dialog.Content style={{ maxWidth: 700 }}>
                      <Dialog.Title>Detalle de Interconexión</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Modificar datos de interconexión de la orden.
                      </Dialog.Description>

                      <Table.Root variant="surface" size="1">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell style={{ width: "20%" }}></Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: "25%" }}>Circ. 1</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: "25%" }}>Circ. 2</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: "15%" }}></Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: "15%" }}></Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {/* CID */}
                          <Table.Row>
                            <Table.Cell><Text weight="bold" size="2">CID</Text></Table.Cell>
                            <Table.Cell>
                              {/* Mostrar dropdown si: está editando O si CID_P1 está vacío */}
                              {(editarCircuito || !interconexionForm.CID_P1?.trim()) ? (
                                circuitosP1.length > 0 ? (
                                  <Select.Root
                                    size="1"
                                    value={selectedCircuitoP1?.toString() || ""}
                                    onValueChange={handleCircuitoP1Change}
                                  >
                                    <Select.Trigger placeholder="--Seleccione--" style={{ width: "140px" }} />
                                    <Select.Content>
                                      {circuitosP1.map((c) => (
                                        <Select.Item key={c.ID_CircuitosSL} value={c.ID_CircuitosSL.toString()}>
                                          {c.CircuitID}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Root>
                                ) : (
                                  <Text size="1" color="gray">Sin circuitos disponibles</Text>
                                )
                              ) : (
                                <TextField.Root
                                  size="1"
                                  value={interconexionForm.CID_P1}
                                  readOnly
                                  style={{ width: "140px" }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {/* Mostrar dropdown si: está editando O si CID_P2 está vacío */}
                              {(editarCircuito || !interconexionForm.CID_P2?.trim()) ? (
                                circuitosP2.length > 0 ? (
                                  <Select.Root
                                    size="1"
                                    value={selectedCircuitoP2?.toString() || ""}
                                    onValueChange={handleCircuitoP2Change}
                                  >
                                    <Select.Trigger placeholder="--Seleccione--" style={{ width: "140px" }} />
                                    <Select.Content>
                                      {circuitosP2.map((c) => (
                                        <Select.Item key={c.ID_CircuitosSL} value={c.ID_CircuitosSL.toString()}>
                                          {c.CircuitID}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Root>
                                ) : (
                                  <Text size="1" color="gray">Sin circuitos disponibles</Text>
                                )
                              ) : (
                                <TextField.Root
                                  size="1"
                                  value={interconexionForm.CID_P2}
                                  readOnly
                                  style={{ width: "140px" }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell colSpan={2}>
                              <Flex align="center" gap="3">
                                {/* Solo mostrar checkbox si al menos uno de los CID tiene valor */}
                                {(interconexionForm.CID_P1?.trim() || interconexionForm.CID_P2?.trim()) && (
                                  <Flex align="center" gap="2">
                                    <Checkbox
                                      checked={editarCircuito}
                                      onCheckedChange={(checked) => setEditarCircuito(checked === true)}
                                    />
                                    <Text size="1">Editar Circuito</Text>
                                  </Flex>
                                )}
                                <Button
                                  size="1"
                                  variant="soft"
                                  color="blue"
                                  disabled={actualizandoVetro || (!selectedCircuitoP1 && !selectedCircuitoP2)}
                                  onClick={() => {
                                    if (selectedCircuitoP1) handleActualizarDesdeVetro(selectedCircuitoP1, 'P1');
                                    if (selectedCircuitoP2) handleActualizarDesdeVetro(selectedCircuitoP2, 'P2');
                                  }}
                                >
                                  {actualizandoVetro ? "Actualizando..." : "Actualizar ODF/FTP desde Vetro"}
                                </Button>
                              </Flex>
                            </Table.Cell>
                          </Table.Row>

                          {/* ODF Crossconnect */}
                          <Table.Row>
                            <Table.Cell><Text weight="bold" size="2">ODF Crossconnect</Text></Table.Cell>
                            <Table.Cell>
                              {/* Mostrar dropdown si: está editando O si ODFInterno1 está vacío */}
                              {(editarODFInterno || !interconexionForm.ODFInterno1?.trim()) ? (
                                odfList.length > 0 ? (
                                  <Select.Root
                                    size="1"
                                    value={selectedODF1?.toString() || ""}
                                    onValueChange={handleODF1Change}
                                  >
                                    <Select.Trigger placeholder="--Sin Asignar--" style={{ width: "140px" }} />
                                    <Select.Content>
                                      {odfList.map((odf) => (
                                        <Select.Item key={odf.Id} value={odf.Id.toString()}>
                                          {odf.Codigo}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Root>
                                ) : (
                                  <Text size="1" color="gray">Sin ODFs disponibles</Text>
                                )
                              ) : (
                                <TextField.Root
                                  size="1"
                                  value={interconexionForm.ODFInterno1}
                                  readOnly
                                  style={{ width: "140px" }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {/* Mostrar dropdown si: está editando O si ODFInterno2 está vacío */}
                              {(editarODFInterno || !interconexionForm.ODFInterno2?.trim()) ? (
                                odfList.length > 0 ? (
                                  <Select.Root
                                    size="1"
                                    value={selectedODF2?.toString() || ""}
                                    onValueChange={handleODF2Change}
                                  >
                                    <Select.Trigger placeholder="--Sin Asignar--" style={{ width: "140px" }} />
                                    <Select.Content>
                                      {odfList.map((odf) => (
                                        <Select.Item key={odf.Id} value={odf.Id.toString()}>
                                          {odf.Codigo}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Root>
                                ) : (
                                  <Text size="1" color="gray">Sin ODFs disponibles</Text>
                                )
                              ) : (
                                <TextField.Root
                                  size="1"
                                  value={interconexionForm.ODFInterno2}
                                  readOnly
                                  style={{ width: "140px" }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {/* Mostrar dropdown si: está editando O si ODFInterno1 está vacío */}
                              {(editarODFInterno || !interconexionForm.ODFInterno1?.trim()) ? (
                                <Select.Root
                                  size="1"
                                  value={interconexionForm.PuertoODF1?.toString() || ""}
                                  onValueChange={(v) => handleInterconexionInputChange("PuertoODF1", parseInt(v) || 0)}
                                >
                                  <Select.Trigger placeholder="-Puerto1-" style={{ width: "100px" }} />
                                  <Select.Content>
                                    {puertosODF1.map((p) => (
                                      <Select.Item key={p.Puerto} value={p.Puerto.toString()}>
                                        {p.Nombre}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              ) : (
                                <TextField.Root
                                  size="1"
                                  value={interconexionForm.PuertoODF1?.toString() || ""}
                                  readOnly
                                  style={{ width: "100px" }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {/* Mostrar dropdown si: está editando O si ODFInterno2 está vacío */}
                              {(editarODFInterno || !interconexionForm.ODFInterno2?.trim()) ? (
                                <Select.Root
                                  size="1"
                                  value={interconexionForm.PuertoODF2?.toString() || ""}
                                  onValueChange={(v) => handleInterconexionInputChange("PuertoODF2", parseInt(v) || 0)}
                                >
                                  <Select.Trigger placeholder="-Puerto2-" style={{ width: "100px" }} />
                                  <Select.Content>
                                    {puertosODF2.map((p) => (
                                      <Select.Item key={p.Puerto} value={p.Puerto.toString()}>
                                        {p.Nombre}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Root>
                              ) : (
                                <TextField.Root
                                  size="1"
                                  value={interconexionForm.PuertoODF2?.toString() || ""}
                                  readOnly
                                  style={{ width: "100px" }}
                                />
                              )}
                            </Table.Cell>
                          </Table.Row>

                          {/* Checkbox para ODF Interno - solo si hay al menos uno asignado */}
                          {(interconexionForm.ODFInterno1?.trim() || interconexionForm.ODFInterno2?.trim()) && (
                            <Table.Row>
                              <Table.Cell colSpan={5}>
                                <Flex align="center" gap="2">
                                  <Checkbox
                                    checked={editarODFInterno}
                                    onCheckedChange={(checked) => setEditarODFInterno(checked === true)}
                                  />
                                  <Text size="1">Editar ODF Interno</Text>
                                </Flex>
                              </Table.Cell>
                            </Table.Row>
                          )}

                          {/* ODF */}
                          <Table.Row>
                            <Table.Cell><Text weight="bold" size="2">ODF</Text></Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                value={interconexionForm.No_ODF}
                                onChange={(e) => handleInterconexionInputChange("No_ODF", e.target.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                value={interconexionForm.No_ODF2}
                                onChange={(e) => handleInterconexionInputChange("No_ODF2", e.target.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                type="number"
                                value={interconexionForm.Puerto1?.toString() || ""}
                                onChange={(e) => handleInterconexionInputChange("Puerto1", parseInt(e.target.value) || 0)}
                                placeholder="Puerto 1"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                type="number"
                                value={interconexionForm.Puerto2?.toString() || ""}
                                onChange={(e) => handleInterconexionInputChange("Puerto2", parseInt(e.target.value) || 0)}
                                placeholder="Puerto 2"
                              />
                            </Table.Cell>
                          </Table.Row>

                          {/* FTP */}
                          <Table.Row>
                            <Table.Cell><Text weight="bold" size="2">FTP</Text></Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                value={interconexionForm.No_FTP}
                                onChange={(e) => handleInterconexionInputChange("No_FTP", e.target.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                value={interconexionForm.No_FTP2}
                                onChange={(e) => handleInterconexionInputChange("No_FTP2", e.target.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                value={interconexionForm.FTP_P1}
                                onChange={(e) => handleInterconexionInputChange("FTP_P1", e.target.value)}
                                placeholder="Puerto 1"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <TextField.Root
                                size="1"
                                value={interconexionForm.FTP_P2}
                                onChange={(e) => handleInterconexionInputChange("FTP_P2", e.target.value)}
                                placeholder="Puerto 2"
                              />
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>

                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">Cancelar</Button>
                        </Dialog.Close>
                        <Button onClick={handleGuardarInterconexion} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Guardar Cambios
                        </Button>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Tabs.Content>

                {/* Detalle de Servicios */}
                <Tabs.Content value="servicio" className="orden-tab-content">
                  <Box mb="2">
                    <Button variant="soft" size="1" onClick={handleOpenModalServicio}>
                      <Settings className="w-4 h-4 mr-1" />
                      Modificar Servicio
                    </Button>
                  </Box>

                  <Card>
                    {/* Tabla de Detalle de Servicio - Fila 1: Servicio, Tipo, Ruta */}
                    <Table.Root variant="surface" size="1">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Servicio</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Tipo</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Ruta</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2">FIBRA ÓPTICA OSCURA</Text>
                          </Table.Cell>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2" style={{ textTransform: "uppercase" }}>{orden?.TipoConexion || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2" style={{ textTransform: "uppercase" }}>{orden?.Ruta || "-"}</Text>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>

                    {/* Tabla de Detalle de Servicio - Fila 2: Distancia, NRC, MRC */}
                    <Table.Root variant="surface" size="1" className="mt-2">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Distancia</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>NRC ($)</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>MRC ($)</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2">{orden?.Distancia != null ? orden.Distancia.toFixed(2) : "-"}</Text>
                          </Table.Cell>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2" weight="bold" color="blue">{orden?.NRC != null ? orden.NRC.toFixed(2) : "-"}</Text>
                          </Table.Cell>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2" weight="bold" color="green">{orden?.MRC != null ? orden.MRC.toFixed(2) : "-"}</Text>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>

                    {/* Tabla de Detalle de Servicio - Fila 3: Interface Item Id, Interface Centro de Costo Id */}
                    <Table.Root variant="surface" size="1" className="mt-2">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Interface Item Id</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Interface Centro de Costo Id</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2">{orden?.Item_Interface || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2">{orden?.Centro_Costo || "-"}</Text>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>

                    {/* Sección de Observaciones */}
                    <Box mt="4">
                      <Heading size="3" mb="2">Observaciones y Comentarios</Heading>
                      <Flex direction="column" gap="3">
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="div">Observaciones</Text>
                          <TextArea
                            rows={4}
                            value={formData.Observaciones || ""}
                            onChange={(e) => handleInputChange("Observaciones", e.target.value)}
                            placeholder="Ingrese observaciones..."
                          />
                        </Box>

                        <Box>
                          <Text size="2" weight="bold" mb="2" as="div">Comentarios</Text>
                          <TextArea
                            rows={4}
                            value={formData.Comentarios || ""}
                            onChange={(e) => handleInputChange("Comentarios", e.target.value)}
                            placeholder="Ingrese comentarios..."
                          />
                        </Box>

                        <Flex justify="end" mt="2">
                          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar Observaciones
                          </Button>
                        </Flex>
                      </Flex>
                    </Box>
                  </Card>

                  {/* Modal de Edición de Servicio */}
                  <Dialog.Root open={modalServicioOpen} onOpenChange={setModalServicioOpen}>
                    <Dialog.Content maxWidth="600px">
                      <Dialog.Title>Editar Detalle de Servicio</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Modificar tipo de conexión, ruta y costos del servicio.
                      </Dialog.Description>

                      <Flex direction="column" gap="4" mt="4">
                        {/* Tipo de Conexión */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Tipo de Conexión</Text>
                          <Select.Root
                            size="2"
                            value={servicioForm.ID_TipoConexion?.toString() || ""}
                            onValueChange={handleTipoConexionChange}
                          >
                            <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                            <Select.Content>
                              {tiposConexion.map((tipo) => (
                                <Select.Item key={tipo.ID_TipoConexion} value={tipo.ID_TipoConexion.toString()}>
                                  {tipo.Nombre}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Ruta */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Ruta</Text>
                          <Select.Root
                            size="2"
                            value={servicioForm.ID_RutaUbicacion?.toString() || ""}
                            onValueChange={handleRutaChange}
                          >
                            <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                            <Select.Content>
                              {rutasUbicacion.map((ruta) => (
                                <Select.Item key={ruta.id} value={ruta.id.toString()}>
                                  {ruta.Nombre_Ruta}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Distancia */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Distancia (Mts)</Text>
                          <TextField.Root
                            type="number"
                            value={servicioForm.Distancia?.toString() || ""}
                            onChange={(e) => setServicioForm(prev => ({ ...prev, Distancia: parseFloat(e.target.value) || 0 }))}
                            placeholder="Distancia en metros"
                          />
                        </Box>

                        {/* NRC y MRC */}
                        <Flex gap="4">
                          <Box style={{ flex: 1 }}>
                            <Text size="2" weight="bold" mb="2" as="label">NRC ($)</Text>
                            <TextField.Root
                              type="number"
                              step="0.01"
                              value={servicioForm.NRC?.toString() || ""}
                              onChange={(e) => setServicioForm(prev => ({ ...prev, NRC: parseFloat(e.target.value) || 0 }))}
                              placeholder="0.00"
                            />
                          </Box>
                          <Box style={{ flex: 1 }}>
                            <Text size="2" weight="bold" mb="2" as="label">MRC ($)</Text>
                            <TextField.Root
                              type="number"
                              step="0.01"
                              value={servicioForm.MRC?.toString() || ""}
                              onChange={(e) => setServicioForm(prev => ({ ...prev, MRC: parseFloat(e.target.value) || 0 }))}
                              placeholder="0.00"
                            />
                          </Box>
                        </Flex>

                        {/* Interface Item Id y Centro de Costo Id */}
                        <Flex gap="4">
                          <Box style={{ flex: 1 }}>
                            <Text size="2" weight="bold" mb="2" as="label">Interface Item Id</Text>
                            <TextField.Root
                              value={servicioForm.Item_Interface || ""}
                              onChange={(e) => setServicioForm(prev => ({ ...prev, Item_Interface: e.target.value }))}
                              placeholder="Interface Item Id"
                            />
                          </Box>
                          <Box style={{ flex: 1 }}>
                            <Text size="2" weight="bold" mb="2" as="label">Interface Centro de Costo Id</Text>
                            <TextField.Root
                              value={servicioForm.Centro_Costo || ""}
                              onChange={(e) => setServicioForm(prev => ({ ...prev, Centro_Costo: e.target.value }))}
                              placeholder="Centro de Costo Id"
                            />
                          </Box>
                        </Flex>
                      </Flex>

                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">Cancelar</Button>
                        </Dialog.Close>
                        <Button onClick={handleGuardarServicio} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Guardar Cambios
                        </Button>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Tabs.Content>

                {/* Costo del Servicio */}
                <Tabs.Content value="costo" className="orden-tab-content">
                  <Box mb="2">
                    <Button variant="soft" size="1" onClick={handleOpenModalCostoServicio}>
                      <DollarSign className="w-4 h-4 mr-1" />
                      Modificar
                    </Button>
                  </Box>

                  <Card>
                    {/* Tabla de Costo del Servicio - Similar al original */}
                    <Table.Root variant="surface" size="1">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>Servicio</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={{ textAlign: "center" }}>MRC ($)</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2">FIBRA ÓPTICA OSCURA</Text>
                          </Table.Cell>
                          <Table.Cell style={{ textAlign: "center" }}>
                            <Text size="2" weight="bold" color="green">{formatCurrency(orden?.MRC)}</Text>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>

                    {/* Resumen de Costos */}
                    <Box className="p-4 mt-4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)" }}>
                      <Heading size="3" mb="3">Resumen de Costos</Heading>
                      <Flex gap="6">
                        <Box>
                          <Text size="2" color="gray" mb="1" as="div">MRC (Renta Mensual)</Text>
                          <Text size="5" weight="bold" color="green">{formatCurrency(orden?.MRC)}</Text>
                        </Box>
                        <Box>
                          <Text size="2" color="gray" mb="1" as="div">NRC (Costo Único)</Text>
                          <Text size="5" weight="bold" color="blue">{formatCurrency(orden?.NRC)}</Text>
                        </Box>
                        <Box>
                          <Text size="2" color="gray" mb="1" as="div">Precio AFO</Text>
                          <Text size="5" weight="bold" color="orange">{formatCurrency(orden?.Precio_AFO)}</Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Card>

                  {/* Modal de Edición de Costo del Servicio */}
                  <Dialog.Root open={modalCostoServicioOpen} onOpenChange={setModalCostoServicioOpen}>
                    <Dialog.Content maxWidth="500px">
                      <Dialog.Title>Editar Costo del Servicio</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Modificar información de facturación y costos.
                      </Dialog.Description>

                      <Flex direction="column" gap="4" mt="4">
                        {/* Servicio Factura */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Servicio</Text>
                          <Select.Root
                            size="2"
                            value={costoServicioForm.Servicio_Factura || ""}
                            onValueChange={(v) => setCostoServicioForm(prev => ({ ...prev, Servicio_Factura: v }))}
                          >
                            <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                            <Select.Content>
                              {tiposServicioFactura.map((tipo) => (
                                <Select.Item key={tipo.ID_Servicio} value={tipo.Nombre}>
                                  {tipo.Nombre}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* MRC */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">MRC ($)</Text>
                          <TextField.Root
                            type="number"
                            step="0.01"
                            value={costoServicioForm.Costo_Servicio?.toString() || ""}
                            onChange={(e) => setCostoServicioForm(prev => ({ ...prev, Costo_Servicio: parseFloat(e.target.value) || 0 }))}
                            placeholder="0.00"
                          />
                        </Box>
                      </Flex>

                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">Cancelar</Button>
                        </Dialog.Close>
                        <Button onClick={handleGuardarCostoServicio} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Guardar Cambios
                        </Button>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Tabs.Content>

                {/* Archivos Adjuntos */}
                <Tabs.Content value="archivos" className="orden-tab-content">
                  <Flex direction="column" gap="4">
                    {/* Sección: Archivos OTDR */}
                    <Card>
                      <Flex justify="between" align="center" mb="3">
                        <Heading size="3">
                          <FileIcon className="w-4 h-4 inline mr-2" />
                          Archivos OTDR
                        </Heading>
                        <label>
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleUploadOTDR}
                            disabled={uploadingOTDR}
                          />
                          <Button variant="soft" size="1" asChild disabled={uploadingOTDR}>
                            <span style={{ cursor: 'pointer' }}>
                              {uploadingOTDR ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-1" />
                              )}
                              Subir Archivo OTDR
                            </span>
                          </Button>
                        </label>
                      </Flex>

                      {archivosOTDR.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" p="4" style={{ border: "1px dashed var(--gray-6)", borderRadius: "var(--radius-2)" }}>
                          <Text size="2" color="gray">No hay archivos OTDR adjuntos.</Text>
                        </Flex>
                      ) : (
                        <Table.Root size="1">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeaderCell>Nombre Archivo</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell style={{ width: 120, textAlign: 'center' }}>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {archivosOTDR.map((archivo) => (
                              <Table.Row key={archivo.ID_ArchivoSolicitud}>
                                <Table.Cell>
                                  <Text size="2">{archivo.FileName}</Text>
                                </Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}>
                                  <Flex gap="2" justify="center">
                                    <Button
                                      variant="ghost"
                                      size="1"
                                      onClick={() => handleDownloadFile(archivo.FileUrl)}
                                      title="Descargar"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="1"
                                      color="red"
                                      onClick={() => handleDeleteFile(archivo.ID_ArchivoSolicitud)}
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Flex>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      )}
                    </Card>

                    {/* Sección: Archivos Adjuntos */}
                    <Card>
                      <Flex justify="between" align="center" mb="3">
                        <Heading size="3">
                          <Paperclip className="w-4 h-4 inline mr-2" />
                          Archivos Adjuntos
                        </Heading>
                        <label>
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleUploadAdjunto}
                            disabled={uploadingAdjunto}
                          />
                          <Button variant="soft" size="1" asChild disabled={uploadingAdjunto}>
                            <span style={{ cursor: 'pointer' }}>
                              {uploadingAdjunto ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-1" />
                              )}
                              Subir Archivo
                            </span>
                          </Button>
                        </label>
                      </Flex>

                      {archivosAdjuntos.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" p="4" style={{ border: "1px dashed var(--gray-6)", borderRadius: "var(--radius-2)" }}>
                          <Text size="2" color="gray">No hay archivos adjuntos.</Text>
                        </Flex>
                      ) : (
                        <Table.Root size="1">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeaderCell>Nombre Archivo</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell style={{ width: 120, textAlign: 'center' }}>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {archivosAdjuntos.map((archivo) => (
                              <Table.Row key={archivo.ID_ArchivoSolicitud}>
                                <Table.Cell>
                                  <Text size="2">{archivo.FileName}</Text>
                                </Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}>
                                  <Flex gap="2" justify="center">
                                    <Button
                                      variant="ghost"
                                      size="1"
                                      onClick={() => handleDownloadFile(archivo.FileUrl)}
                                      title="Descargar"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="1"
                                      color="red"
                                      onClick={() => handleDeleteFile(archivo.ID_ArchivoSolicitud)}
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Flex>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      )}
                    </Card>
                  </Flex>
                </Tabs.Content>

                {/* Orden de Trabajo */}
                <Tabs.Content value="ordenTrabajo" className="orden-tab-content">
                  <Card>
                    <Flex justify="between" align="center" mb="3">
                      <Heading size="3">
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Lista de Órdenes de Trabajo
                      </Heading>
                      <Button variant="soft" size="1" onClick={handleOpenModalOrdenTrabajo}>
                        <Plus className="w-4 h-4 mr-1" />
                        Crear Nueva
                      </Button>
                    </Flex>

                    {ordenesTrabajo.length === 0 ? (
                      <Flex direction="column" align="center" justify="center" p="6" style={{ border: "1px dashed var(--gray-6)", borderRadius: "var(--radius-2)" }}>
                        <BookOpen className="w-8 h-8 mb-2" style={{ color: "var(--gray-8)" }} />
                        <Text size="2" color="gray">No hay órdenes de trabajo registradas.</Text>
                      </Flex>
                    ) : (
                      <Table.Root size="1">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell style={{ textAlign: 'center' }}>#</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ textAlign: 'center' }}>Contratista</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ textAlign: 'center' }}>Creado</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ textAlign: 'center' }}>Vencimiento</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: 100, textAlign: 'center' }}>Acciones</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {ordenesTrabajo.map((ot) => (
                            <Table.Row key={ot.ID_Orden}>
                              <Table.Cell style={{ textAlign: 'center' }}>
                                <Text size="2">{ot.ID_Orden}</Text>
                              </Table.Cell>
                              <Table.Cell style={{ textAlign: 'center' }}>
                                <Text size="2">{ot.Contratista || "-"}</Text>
                              </Table.Cell>
                              <Table.Cell style={{ textAlign: 'center' }}>
                                <Text size="2">{formatDate(ot.fecha_creado)}</Text>
                              </Table.Cell>
                              <Table.Cell style={{ textAlign: 'center' }}>
                                <Text size="2">{formatDate(ot.fecha_vencimiento)}</Text>
                              </Table.Cell>
                              <Table.Cell style={{ textAlign: 'center' }}>
                                <Flex gap="2" justify="center">
                                  <Button
                                    variant="ghost"
                                    size="1"
                                    onClick={() => handleEditOrdenTrabajo(ot)}
                                    title="Editar"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="1"
                                    color="red"
                                    onClick={() => handleDeleteOrdenTrabajo(ot.ID_Orden)}
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </Flex>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    )}
                  </Card>

                  {/* Modal para crear/editar Orden de Trabajo */}
                  <Dialog.Root open={modalOrdenTrabajoOpen} onOpenChange={setModalOrdenTrabajoOpen}>
                    <Dialog.Content maxWidth="800px">
                      <Dialog.Title>
                        {editingOrdenTrabajo ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo"}
                      </Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        {editingOrdenTrabajo ? "Modificar los datos de la orden de trabajo." : "Ingrese los datos para crear una nueva orden de trabajo."}
                      </Dialog.Description>

                      <Flex direction="column" gap="4" mt="4">
                        {/* Contratista */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Contratista</Text>
                          <Select.Root
                            size="2"
                            value={ordenTrabajoForm.ID_Contratista?.toString() || ""}
                            onValueChange={handleContratistaChange}
                          >
                            <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                            <Select.Content>
                              {contratistas.map((c) => (
                                <Select.Item key={c.id} value={c.id.toString()}>
                                  {c.Nombre}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Contacto */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Contacto</Text>
                          <Select.Root
                            size="2"
                            value={ordenTrabajoForm.ID_Contratista_Contacto?.toString() || ""}
                            onValueChange={(v) => setOrdenTrabajoForm(prev => ({ ...prev, ID_Contratista_Contacto: parseInt(v) || 0 }))}
                            disabled={contactosContratista.length === 0}
                          >
                            <Select.Trigger placeholder="--Seleccione--" style={{ width: "100%" }} />
                            <Select.Content>
                              {contactosContratista.map((c) => (
                                <Select.Item key={c.id} value={c.id.toString()}>
                                  {c.Nombre}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Fecha de Vencimiento */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Fecha de Vencimiento</Text>
                          <TextField.Root
                            type="date"
                            size="2"
                            value={ordenTrabajoForm.fecha_vencimiento || ""}
                            onChange={(e) => setOrdenTrabajoForm(prev => ({ ...prev, fecha_vencimiento: e.target.value }))}
                          />
                        </Box>

                        {/* Descripción del Trabajo */}
                        <Box>
                          <Text size="2" weight="bold" mb="2" as="label">Descripción del Trabajo</Text>
                          <TextArea
                            size="2"
                            rows={3}
                            placeholder="Ingrese la descripción del trabajo..."
                            value={ordenTrabajoForm.DescripcionTrabajo || ""}
                            onChange={(e) => setOrdenTrabajoForm(prev => ({ ...prev, DescripcionTrabajo: e.target.value }))}
                          />
                        </Box>

                        {/* Lista de Comprobación */}
                        <Box>
                          <Text size="3" weight="bold" mb="2">Lista de Comprobación</Text>

                          {/* Formulario para agregar item */}
                          <Flex gap="2" mb="3" align="end">
                            <Box style={{ flex: 1 }}>
                              <TextField.Root
                                size="2"
                                placeholder="Descripción del item..."
                                value={nuevoItemComprobacion.Descripcion}
                                onChange={(e) => setNuevoItemComprobacion(prev => ({ ...prev, Descripcion: e.target.value }))}
                              />
                            </Box>
                            <Flex gap="3" align="center">
                              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                                <Checkbox
                                  size="1"
                                  checked={nuevoItemComprobacion.Estado}
                                  onCheckedChange={(checked) => setNuevoItemComprobacion(prev => ({ ...prev, Estado: !!checked }))}
                                />
                                Activo
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                                <Checkbox
                                  size="1"
                                  checked={nuevoItemComprobacion.Importante}
                                  onCheckedChange={(checked) => setNuevoItemComprobacion(prev => ({ ...prev, Importante: !!checked }))}
                                />
                                Importante
                              </label>
                            </Flex>
                            <Button size="1" variant="soft" onClick={handleAddItemComprobacion}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </Flex>

                          {/* Tabla de items */}
                          {listaComprobacion.length > 0 && (
                            <Table.Root size="1">
                              <Table.Header>
                                <Table.Row>
                                  <Table.ColumnHeaderCell style={{ width: 80 }}>Estado</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Descripción</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell style={{ width: 100 }}>Nivel</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell style={{ width: 50 }}>Acción</Table.ColumnHeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {listaComprobacion.map((item) => (
                                  <Table.Row key={item.ID_Lista}>
                                    <Table.Cell>
                                      <Badge color={item.Estado === "Activo" ? "green" : "gray"} size="1">
                                        {item.Estado}
                                      </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Text size="1">{item.Descripcion}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Badge color={item.Importante === "Importante" ? "red" : "gray"} size="1">
                                        {item.Importante}
                                      </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Button
                                        variant="ghost"
                                        size="1"
                                        color="red"
                                        onClick={() => handleDeleteItemComprobacion(item)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                              </Table.Body>
                            </Table.Root>
                          )}

                          {listaComprobacion.length === 0 && (
                            <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>
                              No hay items en la lista de comprobación
                            </Text>
                          )}
                        </Box>
                      </Flex>

                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">
                            Cancelar
                          </Button>
                        </Dialog.Close>
                        <Button onClick={handleSaveOrdenTrabajo} disabled={savingOrdenTrabajo}>
                          {savingOrdenTrabajo ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-1" />
                          )}
                          {editingOrdenTrabajo ? "Actualizar" : "Guardar"}
                        </Button>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Tabs.Content>

              </Box>
            </Tabs.Root>
          </Box>
        )}
      </Box>

      {/* Dialog para crear Enlace */}
      {orden && ordenId && (
        <EnlaceDialog
          ordenId={parseInt(ordenId)}
          empresaNombre={orden.Operador || ""}
          open={modalEnlaceOpen}
          onOpenChange={setModalEnlaceOpen}
          onSuccess={() => {
            // Recargar la página para ver los cambios
            window.location.reload();
          }}
        />
      )}
    </Flex>
  );
};

export default OrdenEditar;
