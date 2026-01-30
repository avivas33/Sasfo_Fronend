import {
  Usuario,
  CreateUsuarioData,
  UpdateUsuarioData,
  ChangePasswordData,
  UsuariosStats,
  AvailableRole
} from '@/types/usuario';
import { API_BASE_URL, getHeaders, handleResponse } from './api';
import { PaginatedResponse } from './empresas.service';

const USERS_API = `${API_BASE_URL}/api/UsersApi`;

export const usuariosService = {
  /**
   * Obtener lista de usuarios con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Usuario>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${USERS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Usuario[]>(response);

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
   * Obtener un usuario por ID
   */
  async getById(id: string): Promise<Usuario> {
    const response = await fetch(`${USERS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Usuario>(response);
  },

  /**
   * Crear un nuevo usuario
   */
  async create(data: CreateUsuarioData): Promise<Usuario> {
    const response = await fetch(USERS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<Usuario>(response);
  },

  /**
   * Actualizar un usuario existente
   */
  async update(id: string, data: UpdateUsuarioData): Promise<void> {
    const response = await fetch(`${USERS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un usuario
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${USERS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Cambiar contraseña de un usuario
   */
  async changePassword(id: string, data: ChangePasswordData): Promise<void> {
    const response = await fetch(`${USERS_API}/${id}/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<void>(response);
  },

  /**
   * Bloquear/Desbloquear un usuario
   */
  async toggleLock(id: string): Promise<void> {
    const response = await fetch(`${USERS_API}/${id}/toggle-lock`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de usuarios
   */
  async getStats(): Promise<UsuariosStats> {
    const response = await fetch(`${USERS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<UsuariosStats>(response);
  },

  /**
   * Obtener roles disponibles
   */
  async getAvailableRoles(): Promise<AvailableRole[]> {
    const response = await fetch(`${USERS_API}/available-roles`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<AvailableRole[]>(response);
  },
};
