import { CO, COFormData } from '@/types/co';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const COS_API = `${API_BASE_URL}/api/COApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface COsStats {
  TotalCOs: number;
  COsActivos: number;
  COsInactivos: number;
  COsDefault: number;
}

export const cosService = {
  /**
   * Obtener lista de COs con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    estado?: boolean;
  }): Promise<PaginatedResponse<CO>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.estado !== undefined) queryParams.append('estado', params.estado.toString());

    const url = `${COS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<CO[]>(response);

    // Extraer metadata de paginación de los headers
    const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
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
   * Obtener un CO por ID
   */
  async getById(id: number): Promise<CO> {
    const response = await fetch(`${COS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<CO>(response);
  },

  /**
   * Crear un nuevo CO
   */
  async create(data: COFormData): Promise<CO> {
    const response = await fetch(COS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<CO>(response);
  },

  /**
   * Actualizar un CO existente
   */
  async update(id: number, data: Partial<CO>): Promise<void> {
    const response = await fetch(`${COS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un CO (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${COS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de COs
   */
  async getStats(): Promise<COsStats> {
    const response = await fetch(`${COS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<COsStats>(response);
  },
};
