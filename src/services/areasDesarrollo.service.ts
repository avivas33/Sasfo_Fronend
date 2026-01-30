import { AreaDesarrollo, AreaDesarrolloFormData } from '@/types/areaDesarrollo';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const AREAS_API = `${API_BASE_URL}/api/AreasDesarrolloApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface AreasDesarrolloStats {
  TotalAreas: number;
  AreasActivas: number;
  AreasInactivas: number;
  AreasDefault: number;
}

export const areasDesarrolloService = {
  /**
   * Obtener lista de áreas de desarrollo con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    estado?: boolean;
  }): Promise<PaginatedResponse<AreaDesarrollo>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.estado !== undefined) queryParams.append('estado', params.estado.toString());

    const url = `${AREAS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<AreaDesarrollo[]>(response);

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
   * Obtener un área de desarrollo por ID
   */
  async getById(id: number): Promise<AreaDesarrollo> {
    const response = await fetch(`${AREAS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<AreaDesarrollo>(response);
  },

  /**
   * Crear una nueva área de desarrollo
   */
  async create(data: AreaDesarrolloFormData): Promise<AreaDesarrollo> {
    const response = await fetch(AREAS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<AreaDesarrollo>(response);
  },

  /**
   * Actualizar un área de desarrollo existente
   */
  async update(id: number, data: Partial<AreaDesarrollo>): Promise<void> {
    const response = await fetch(`${AREAS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un área de desarrollo (soft delete - toggle estado)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${AREAS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de áreas de desarrollo
   */
  async getStats(): Promise<AreasDesarrolloStats> {
    const response = await fetch(`${AREAS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<AreasDesarrolloStats>(response);
  },
};
