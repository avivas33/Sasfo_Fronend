import {
  ODFInterno,
  ODFInternosListResponse,
  ODFInternosStats,
  ODFInternosFilters,
} from '@/types/odfInternos';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const API_URL = `${API_BASE_URL}/api/ODFInternosApi`;

export const odfInternosService = {
  /**
   * Obtener lista de ODF Internos con paginacion y filtros
   */
  async getAll(filters?: ODFInternosFilters): Promise<ODFInternosListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.odf) params.append('odf', filters.odf);
    if (filters?.serviceLocation) params.append('serviceLocation', filters.serviceLocation);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<ODFInternosListResponse>(response);
  },

  /**
   * Obtener estadisticas de ODF Internos
   */
  async getStats(): Promise<ODFInternosStats> {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<ODFInternosStats>(response);
  },

  /**
   * Obtener lista de ODFs para filtro
   */
  async getODFList(): Promise<string[]> {
    const response = await fetch(`${API_URL}/odfs`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<string[]>(response);
  },

  /**
   * Obtener lista de Service Locations para filtro
   */
  async getServiceLocationList(): Promise<string[]> {
    const response = await fetch(`${API_URL}/service-locations`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<string[]>(response);
  },
};
