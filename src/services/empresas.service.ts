import { Empresa, EmpresaFormData } from '@/types/empresa';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const EMPRESAS_API = `${API_BASE_URL}/api/EmpresasApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface EmpresasStats {
  TotalEmpresas: number;
  EmpresasActivas: number;
  EmpresasInactivas: number;
  PorTipo: Array<{ Tipo: string; Count: number }>;
}

export const empresasService = {
  /**
   * Obtener lista de empresas con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Empresa>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${EMPRESAS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Empresa[]>(response);

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
   * Obtener una empresa por ID
   */
  async getById(id: number): Promise<Empresa> {
    const response = await fetch(`${EMPRESAS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Empresa>(response);
  },

  /**
   * Crear una nueva empresa
   */
  async create(data: EmpresaFormData): Promise<Empresa> {
    const response = await fetch(EMPRESAS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<Empresa>(response);
  },

  /**
   * Actualizar una empresa existente
   */
  async update(id: number, data: Partial<Empresa>): Promise<void> {
    const response = await fetch(`${EMPRESAS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar una empresa (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${EMPRESAS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de empresas
   */
  async getStats(): Promise<EmpresasStats> {
    const response = await fetch(`${EMPRESAS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<EmpresasStats>(response);
  },
};
