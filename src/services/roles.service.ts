import {
  Rol,
  RolOperacion,
  CreateRolData,
  UpdateRolData,
  Modulo,
  OpcionMenu,
  RolesStats
} from '@/types/rol';
import { API_BASE_URL, getHeaders, handleResponse } from './api';
import { PaginatedResponse } from './empresas.service';

const ROLES_API = `${API_BASE_URL}/api/RolesApi`;

export const rolesService = {
  /**
   * Obtener lista de roles con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Rol>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${ROLES_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Rol[]>(response);

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
   * Obtener un rol por ID
   */
  async getById(id: string): Promise<Rol> {
    const response = await fetch(`${ROLES_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Rol>(response);
  },

  /**
   * Crear un nuevo rol
   */
  async create(data: CreateRolData): Promise<Rol> {
    const response = await fetch(ROLES_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<Rol>(response);
  },

  /**
   * Actualizar un rol existente
   */
  async update(id: string, data: UpdateRolData): Promise<void> {
    const response = await fetch(`${ROLES_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un rol
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${ROLES_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener operaciones de un rol
   */
  async getOperaciones(id: string, params?: {
    moduloId?: number;
    opcionMenuId?: number;
  }): Promise<RolOperacion[]> {
    const queryParams = new URLSearchParams();
    if (params?.moduloId) queryParams.append('moduloId', params.moduloId.toString());
    if (params?.opcionMenuId) queryParams.append('opcionMenuId', params.opcionMenuId.toString());

    const url = `${ROLES_API}/${id}/operaciones${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<RolOperacion[]>(response);
  },

  /**
   * Alternar estado de una operación
   */
  async toggleOperacion(roleId: string, operacionId: number): Promise<{ estado: boolean }> {
    const response = await fetch(`${ROLES_API}/${roleId}/operaciones/${operacionId}/toggle`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<{ estado: boolean }>(response);
  },

  /**
   * Sincronizar operaciones de un rol (agregar nuevas operaciones)
   */
  async syncOperaciones(id: string): Promise<{ message: string }> {
    const response = await fetch(`${ROLES_API}/${id}/sync-operaciones`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<{ message: string }>(response);
  },

  /**
   * Obtener módulos disponibles
   */
  async getModulos(): Promise<Modulo[]> {
    const response = await fetch(`${ROLES_API}/modulos`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Modulo[]>(response);
  },

  /**
   * Obtener opciones de menú de un módulo
   */
  async getOpcionesMenu(moduloId: number): Promise<OpcionMenu[]> {
    const response = await fetch(`${ROLES_API}/modulos/${moduloId}/opciones-menu`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<OpcionMenu[]>(response);
  },

  /**
   * Obtener estadísticas de roles
   */
  async getStats(): Promise<RolesStats> {
    const response = await fetch(`${ROLES_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<RolesStats>(response);
  },
};
