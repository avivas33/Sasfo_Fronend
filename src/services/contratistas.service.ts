import { Contratista, ContratistaFormData, ContratistasStats } from '@/types/contratista';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const CONTRATISTAS_API = `${API_BASE_URL}/api/ContratistasApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const contratistasService = {
  /**
   * Obtener lista de contratistas con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    estado?: boolean;
  }): Promise<PaginatedResponse<Contratista>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.estado !== undefined) queryParams.append('estado', params.estado.toString());

    const url = `${CONTRATISTAS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Contratista[]>(response);

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
   * Obtener un contratista por ID
   */
  async getById(id: number): Promise<Contratista> {
    const response = await fetch(`${CONTRATISTAS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Contratista>(response);
  },

  /**
   * Crear un nuevo contratista
   */
  async create(data: ContratistaFormData): Promise<Contratista> {
    const response = await fetch(CONTRATISTAS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        Estado: true,
        Tipo_empresa: 'CONTRATISTA',
      }),
    });

    return handleResponse<Contratista>(response);
  },

  /**
   * Actualizar un contratista existente
   */
  async update(id: number, data: Partial<Contratista>): Promise<void> {
    const response = await fetch(`${CONTRATISTAS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar/Desactivar un contratista (toggle estado)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${CONTRATISTAS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de contratistas
   */
  async getStats(): Promise<ContratistasStats> {
    const response = await fetch(`${CONTRATISTAS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ContratistasStats>(response);
  },
};
