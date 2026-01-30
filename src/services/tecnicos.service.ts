import {
  Tecnico,
  TecnicoCreateRequest,
  TecnicoUpdateRequest,
  TecnicosListResponse,
  TecnicosStats,
  TecnicosFilters,
  TipoUsuario,
} from '@/types/tecnicos';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const API_URL = `${API_BASE_URL}/api/TecnicosApi`;

export const tecnicosService = {
  /**
   * Obtener lista de Tecnicos con paginacion y filtros
   */
  async getAll(filters?: TecnicosFilters): Promise<TecnicosListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tipoUsuario) params.append('tipoUsuario', filters.tipoUsuario.toString());
    if (filters?.estado !== undefined) params.append('estado', filters.estado.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<TecnicosListResponse>(response);
  },

  /**
   * Obtener un tecnico por ID
   */
  async getById(id: number): Promise<Tecnico> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<Tecnico>(response);
  },

  /**
   * Crear nuevo tecnico
   */
  async create(data: TecnicoCreateRequest): Promise<{ success: boolean; message: string; id: number }> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Actualizar tecnico existente
   */
  async update(id: number, data: TecnicoUpdateRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Eliminar tecnico (permanente)
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Inhabilitar tecnico (soft delete)
   */
  async inhabilitar(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}/inhabilitar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Habilitar tecnico
   */
  async habilitar(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}/habilitar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener estadisticas
   */
  async getStats(): Promise<TecnicosStats> {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<TecnicosStats>(response);
  },

  /**
   * Obtener tipos de usuario para dropdown
   */
  async getTiposUsuario(): Promise<TipoUsuario[]> {
    const response = await fetch(`${API_URL}/tipos-usuario`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<TipoUsuario[]>(response);
  },
};
