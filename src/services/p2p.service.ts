import { P2P, P2PFormData, P2PStats } from '@/types/p2p';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const P2P_API = `${API_BASE_URL}/api/P2PApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const p2pService = {
  /**
   * Obtener lista de P2P con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    tipoP2P?: number;
    estado?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<P2P>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.tipoP2P !== undefined) queryParams.append('tipoP2P', params.tipoP2P.toString());
    if (params?.estado) queryParams.append('estado', params.estado.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${P2P_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<P2P[]>(response);

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
   * Obtener un P2P por ID
   */
  async getById(id: number): Promise<P2P> {
    const response = await fetch(`${P2P_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<P2P>(response);
  },

  /**
   * Crear un nuevo P2P
   */
  async create(data: P2PFormData): Promise<P2P> {
    const response = await fetch(P2P_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<P2P>(response);
  },

  /**
   * Actualizar un P2P existente
   */
  async update(id: number, data: Partial<P2PFormData>): Promise<void> {
    const response = await fetch(`${P2P_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, ID_P2P: id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar/Cancelar un P2P
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${P2P_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Aprobar un P2P
   */
  async aprobar(id: number): Promise<void> {
    const response = await fetch(`${P2P_API}/${id}/aprobar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Completar un P2P
   */
  async completar(id: number): Promise<void> {
    const response = await fetch(`${P2P_API}/${id}/completar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Cancelar un P2P
   */
  async cancelar(id: number): Promise<void> {
    const response = await fetch(`${P2P_API}/${id}/cancelar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de P2P
   */
  async getStats(): Promise<P2PStats> {
    const response = await fetch(`${P2P_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<P2PStats>(response);
  },
};
