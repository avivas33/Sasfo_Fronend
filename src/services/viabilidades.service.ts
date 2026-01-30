import { Viabilidad, ViabilidadFormData, ViabilidadStats } from '@/types/viabilidad';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

export interface AprobarViabilidadData {
  ContactoComercialId?: number;
  ContactoTecnicoId?: number;
  ODFInterno1?: string;
  PuertoODF1?: number;
  ODFInterno2?: string;
  PuertoODF2?: number;
  IndicadorOtroODF?: string;
}

const VIABILIDADES_API = `${API_BASE_URL}/api/ViabilidadesApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const viabilidadesService = {
  /**
   * Obtener lista de viabilidades con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    idEmpresa?: number;
    idProcesoViabilidad?: number;
    isEspecial?: boolean;
  }): Promise<PaginatedResponse<Viabilidad>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.idEmpresa) queryParams.append('idEmpresa', params.idEmpresa.toString());
    if (params?.idProcesoViabilidad) queryParams.append('idProcesoViabilidad', params.idProcesoViabilidad.toString());
    if (params?.isEspecial !== undefined) queryParams.append('isEspecial', params.isEspecial.toString());

    const url = `${VIABILIDADES_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Viabilidad[]>(response);

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
   * Obtener una viabilidad por ID
   */
  async getById(id: number): Promise<Viabilidad> {
    const response = await fetch(`${VIABILIDADES_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Viabilidad>(response);
  },

  /**
   * Crear una nueva viabilidad
   */
  async create(data: ViabilidadFormData): Promise<Viabilidad> {
    const response = await fetch(VIABILIDADES_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<Viabilidad>(response);
  },

  /**
   * Actualizar una viabilidad existente
   */
  async update(id: number, data: Partial<Viabilidad>): Promise<void> {
    const response = await fetch(`${VIABILIDADES_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar una viabilidad
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${VIABILIDADES_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Aprobar una viabilidad con información complementaria
   */
  async aprobar(id: number, infoComplementaria?: AprobarViabilidadData): Promise<void> {
    const response = await fetch(`${VIABILIDADES_API}/${id}/aprobar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: infoComplementaria ? JSON.stringify(infoComplementaria) : undefined,
    });

    return handleResponse<void>(response);
  },

  /**
   * Rechazar una viabilidad
   */
  async rechazar(id: number, motivo: string): Promise<void> {
    const response = await fetch(`${VIABILIDADES_API}/${id}/rechazar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(motivo),
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de viabilidades
   */
  async getStats(): Promise<ViabilidadStats> {
    const response = await fetch(`${VIABILIDADES_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ViabilidadStats>(response);
  },
};
