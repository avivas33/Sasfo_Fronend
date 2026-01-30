import {
  CircuitoVetro,
  CircuitoVetroListResponse,
  CircuitoVetroStats,
  CircuitoVetroFilters,
} from '@/types/circuitoVetro';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const API_URL = `${API_BASE_URL}/api/CircuitosVetroApi`;

export const circuitoVetroService = {
  /**
   * Obtener lista de CircuitosVetro con paginacion
   */
  async getAll(filters?: CircuitoVetroFilters): Promise<CircuitoVetroListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<CircuitoVetroListResponse>(response);
  },

  /**
   * Obtener un circuito por ID
   */
  async getById(id: number): Promise<CircuitoVetro> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<CircuitoVetro>(response);
  },

  /**
   * Obtener estadisticas de circuitos
   */
  async getStats(): Promise<CircuitoVetroStats> {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<CircuitoVetroStats>(response);
  },
};
