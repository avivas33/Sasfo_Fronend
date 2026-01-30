import { OrdenServicio, OrdenServicioDetalle, OrdenesStats, OrdenesFilters, CancelarOrdenRequest, UpdateOrdenRequest, TipoConexion, RutaUbicacion, TipoServicioFactura } from '@/types/ordenes';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const ORDENES_API = `${API_BASE_URL}/api/ViabilidadesApi/ordenes`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const ordenesService = {
  /**
   * Obtener lista de órdenes de servicio con paginación y filtros
   */
  async getAll(params?: OrdenesFilters): Promise<PaginatedResponse<OrdenServicio>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.idEmpresa) queryParams.append('idEmpresa', params.idEmpresa.toString());
    if (params?.status) queryParams.append('status', params.status.toString());

    const url = `${ORDENES_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<OrdenServicio[]>(response);

    // Extraer metadata de paginación de los headers
    const totalCount = parseInt(response.headers.get('X-Total-Count') || data.length.toString());
    const page = parseInt(response.headers.get('X-Page') || '1');
    const pageSize = parseInt(response.headers.get('X-Page-Size') || '10');

    return {
      data,
      totalCount,
      page,
      pageSize,
    };
  },

  /**
   * Obtener detalle de una orden por ID
   */
  async getById(id: number): Promise<OrdenServicioDetalle> {
    const response = await fetch(`${ORDENES_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<OrdenServicioDetalle>(response);
  },

  /**
   * Cancelar una orden de servicio
   */
  async cancelar(id: number, request?: CancelarOrdenRequest): Promise<{ message: string; id: number; ID_OrdenServicio: number; fechaCancelacion: string }> {
    const response = await fetch(`${ORDENES_API}/${id}/cancelar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request || {}),
    });

    return handleResponse(response);
  },

  /**
   * Completar una orden de servicio
   */
  async completar(id: number): Promise<{ message: string; id: number; ID_OrdenServicio: number; fechaActivacion: string }> {
    const response = await fetch(`${ORDENES_API}/${id}/completar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  /**
   * Obtener estadísticas de órdenes de servicio
   */
  async getStats(): Promise<OrdenesStats> {
    const response = await fetch(`${ORDENES_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<OrdenesStats>(response);
  },

  /**
   * Actualizar una orden de servicio
   */
  async update(id: number, request: UpdateOrdenRequest): Promise<{ message: string; id: number }> {
    const response = await fetch(`${ORDENES_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });

    return handleResponse(response);
  },

  // Catálogos en Cascada para Edición de Ubicación

  /**
   * Obtener lista de áreas de desarrollo
   */
  async getAreasDesarrollo(): Promise<{ id: number; Nombre: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/areas-desarrollo`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener ubicaciones por área de desarrollo
   */
  async getUbicacionesPorArea(areaId: number): Promise<{ id: number; Nombre_Ubicacion: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/ubicaciones/${areaId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener módulos por ubicación
   */
  async getModulosPorUbicacion(ubicacionId: number): Promise<{ id: number; modulo: string; Coordenadas: string; Inquilino: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/modulos/${ubicacionId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener elementos (identificadores de módulo) por módulo
   */
  async getElementosPorModulo(moduloId: number): Promise<{ id: number; Elemento: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/elementos/${moduloId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener detalle del módulo (coordenadas, inquilino)
   */
  async getModuloDetalle(moduloId: number): Promise<{ Coordenadas: string; Inquilino: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/modulo-detalle/${moduloId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener circuitos para CID P1 (basado en elemento Z de la orden)
   */
  async getCircuitosP1(ordenId: number): Promise<{ ID_CircuitosSL: number; CircuitID: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/circuitos-p1`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener circuitos para CID P2 (basado en elemento A de la orden)
   */
  async getCircuitosP2(ordenId: number): Promise<{ ID_CircuitosSL: number; CircuitID: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/circuitos-p2`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener detalle de un circuito (ODF, FTP, Puertos)
   */
  async getCircuitoDetalle(circuitoId: number): Promise<{ CircuitID: string; ODF: string; FTP: string; PuertoODF: number; PuertoFTP: number }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/circuitos/${circuitoId}/detalle`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener lista de ODFs para dropdowns (filtrado por empresa de la orden)
   */
  async getODFs(ordenId: number): Promise<{ Id: number; Codigo: string; Cantidad_Puertos: number }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/odfs`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener puertos de un ODF específico
   */
  async getPuertosODF(odfId: number): Promise<{ Puerto: number; Nombre: string }[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/odfs/${odfId}/puertos`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Actualizar ODF/FTP de un circuito desde Vetro API v2
   * Este método consulta la API de Vetro para obtener los datos más recientes
   */
  async actualizarCircuitoDesdeVetro(circuitoId: number): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    data?: { CircuitID: string; ODF: string; FTP: string; PuertoODF: number; PuertoFTP: number };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/circuitos/${circuitoId}/actualizar-vetro`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // ========== Catálogos para Detalle de Servicios ==========

  /**
   * Obtener lista de tipos de conexión
   */
  async getTiposConexion(): Promise<TipoConexion[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/tipos-conexion`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener lista de rutas de ubicación (todas)
   */
  async getRutasUbicacion(): Promise<RutaUbicacion[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/rutas-ubicacion`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener rutas de ubicación filtradas por orden y tipo de conexión
   * Filtra por la ubicación Z de la orden y opcionalmente por tipo de conexión
   */
  async getRutasUbicacionPorOrden(ordenId: number, tipoConexionId?: number): Promise<RutaUbicacion[]> {
    const queryParams = new URLSearchParams();
    if (tipoConexionId) queryParams.append('tipoConexionId', tipoConexionId.toString());

    const url = `${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/rutas-ubicacion${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener lista de tipos de servicio para factura
   */
  async getTiposServicioFactura(): Promise<TipoServicioFactura[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/tipos-servicio-factura`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener MRC y NRC de una ruta específica
   */
  async getRutaMrcNrc(rutaId: number): Promise<{ MRC: number; NRC: number }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/rutas-ubicacion/${rutaId}/precios`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // ========== Archivos Adjuntos ==========

  /**
   * Obtener archivos adjuntos de una orden
   */
  async getArchivosOrden(ordenId: number): Promise<ArchivoAdjunto[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/archivos`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener archivos OTDR de una orden
   */
  async getArchivosOTDR(ordenId: number): Promise<ArchivoAdjunto[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/archivos-otdr`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Subir archivo adjunto a una orden
   */
  async uploadArchivo(ordenId: number, file: File, tipoArchivo: 'adjunto' | 'otdr' = 'adjunto'): Promise<{ message: string; ID_ArchivoSolicitud: number; Filename: string; FileURL: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoArchivo', tipoArchivo);

    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/archivos`, {
      method: 'POST',
      headers: {
        'Authorization': getHeaders()['Authorization'] || '',
      },
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * Descargar archivo
   */
  getDownloadUrl(filePath: string): string {
    return `${API_BASE_URL}/api/ViabilidadesApi/archivos/download?filePath=${encodeURIComponent(filePath)}`;
  },

  /**
   * Eliminar archivo
   */
  async deleteArchivo(archivoId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/archivos/${archivoId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // ========== Orden de Trabajo ==========

  /**
   * Obtener órdenes de trabajo de una orden
   */
  async getOrdenesTrabajo(ordenId: number): Promise<OrdenTrabajo[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/ordenes-trabajo`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener detalle de una orden de trabajo
   */
  async getOrdenTrabajoById(id: number): Promise<OrdenTrabajo> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes-trabajo/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener lista de contratistas
   */
  async getContratistas(): Promise<Contratista[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/contratistas`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener contactos de un contratista
   */
  async getContactosContratista(contratistaId: number): Promise<ContactoContratista[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/catalogos/contratistas/${contratistaId}/contactos`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Crear nueva orden de trabajo
   */
  async createOrdenTrabajo(ordenId: number, request: CreateOrdenTrabajoRequest): Promise<{ message: string; ID_Orden: number; consecutivo_relacion: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes/${ordenId}/ordenes-trabajo`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Actualizar orden de trabajo
   */
  async updateOrdenTrabajo(id: number, request: CreateOrdenTrabajoRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes-trabajo/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Eliminar orden de trabajo
   */
  async deleteOrdenTrabajo(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes-trabajo/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // ========== Lista de Comprobación ==========

  /**
   * Obtener lista de comprobación de una orden de trabajo
   */
  async getListaComprobacion(ordenTrabajoId: number): Promise<ListaComprobacionItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes-trabajo/${ordenTrabajoId}/lista-comprobacion`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Agregar item a lista de comprobación
   */
  async addListaComprobacionItem(ordenTrabajoId: number, request: CreateListaComprobacionItemRequest): Promise<ListaComprobacionItem> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/ordenes-trabajo/${ordenTrabajoId}/lista-comprobacion`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Eliminar item de lista de comprobación
   */
  async deleteListaComprobacionItem(itemId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ViabilidadesApi/lista-comprobacion/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // ==================== ENLACE METHODS ====================

  /**
   * Obtener información para crear un enlace
   */
  async getInfoEnlace(ordenId: number): Promise<InfoEnlaceResponse> {
    const response = await fetch(`${ORDENES_API}/${ordenId}/info-enlace`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Verificar si es tipo SL (Service Location)
   */
  async verificarTipoSL(ordenId: number): Promise<boolean> {
    const response = await fetch(`${ORDENES_API}/${ordenId}/verificar-tipo-sl`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Validar archivos OTDR
   */
  async validarArchivosEnlace(ordenId: number): Promise<boolean> {
    const response = await fetch(`${ORDENES_API}/${ordenId}/validar-archivos`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Crear un nuevo enlace
   */
  async crearEnlace(ordenId: number, request: CrearEnlaceRequest): Promise<CrearEnlaceResponse> {
    const response = await fetch(`${ORDENES_API}/${ordenId}/crear-enlace`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },
};

// Tipo para archivos adjuntos
export interface ArchivoAdjunto {
  ID_ArchivoSolicitud: number;
  FileName: string;
  FileUrl: string;
}

// Tipos para Orden de Trabajo
export interface OrdenTrabajo {
  ID_Orden: number;
  Contratista: string | null;
  Contacto_Contratista: string | null;
  DescripcionTrabajo: string | null;
  fecha_vencimiento: string | null;
  fecha_creado: string | null;
  consecutivo_relacion: string | null;
  ID_Contratista: number;
  ID_Contratista_Contacto: number;
}

export interface Contratista {
  id: number;
  Nombre: string;
}

export interface ContactoContratista {
  id: number;
  Nombre: string;
}

export interface CreateOrdenTrabajoRequest {
  ID_Contratista: number;
  ID_Contratista_Contacto: number;
  fecha_vencimiento?: string;
  DescripcionTrabajo?: string;
}

// Tipos para Lista de Comprobación
export interface ListaComprobacionItem {
  ID_Lista: number;
  Estado: string;
  Descripcion: string;
  Importante: string;
}

export interface CreateListaComprobacionItemRequest {
  Estado: boolean;
  Descripcion: string;
  Importante: boolean;
}

// Tipos para Enlace
export interface InfoEnlaceResponse {
  areaA: string;
  areaZ: string;
  ubiA: string;
  ubiZ: string;
  CoordenadasA: string;
  Coordenadas: string;
  Cliente_Final: string;
  Nombre_Modulo: string;
  Nombre_ModuloA: string;
  Nombre_ElementoA: string;
  Nombre_ElementoZ: string;
  No_odf: string;
  Puerto1: number;
  Puerto2: number;
  CID_P1: string | null;
  CID_P2: string | null;
  No_FTP: string | null;
  FTP_P1: string | null;
  FTP_P2: string | null;
  Distancia: number;
  Nombre_Ruta: string;
  tip_Cone: string;
  MRC: number;
  NRC: number;
  Nombre_serv: string;
  Precio_AFO: number;
  ID_TipoConexion: number;
  ID_TipoEnlace: number;
  ID_Viabilidad: number;
}

export interface CrearEnlaceRequest {
  Fecha_Aprobacion: string;
  AreaDesarrolloA: string;
  AreaDesarrolloZ: string;
  UbicacionA: string;
  UbicacionZ: string;
  CoordenadasA: string;
  Coordenadas: string;
  Modulo: string;
  ServicesLocation: string;
  CID_P1: string;
  CID_P2: string;
  Cliente_Final: string;
  ODF: string;
  Puerto1_Enlace: number;
  Puerto2_Enlace: number;
  No_FTP: string;
  FTP_P1: string;
  FTP_P2: string;
  Distancia_Enlace: number;
  Servicio: string;
  Tipo_Conexion: string;
  Ruta: string;
  MRC: number;
  NRC: number;
  Nombre_Empresa: string;
  Costo_Servicio: number;
  Servicio_Factura: string;
  Mes: number;
  Año: number;
}

export interface CrearEnlaceResponse {
  success: boolean;
  message: string;
  ID_Enlace: number;
}
