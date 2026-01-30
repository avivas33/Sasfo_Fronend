import { Modulo, ModuloFormData } from '@/types/modulo';
import { ListaUbicacion } from '@/types/listaUbicaciones';
import { ServicesLocation, ServiceLocationCoordinates } from '@/types/servicesLocation';
import { CO } from '@/types/co';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const MODULOS_API = `${API_BASE_URL}/api/ModulosApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ModulosStats {
  TotalModulos: number;
  ModulosActivos: number;
  ModulosInactivos: number;
  ModulosDefault: number;
  PorAreaDesarrollo: Array<{ AreaId: number; AreaNombre: string; Count: number }>;
}

export const modulosService = {
  /**
   * Obtener lista de módulos con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    estado?: boolean;
    idAreaDesarrollo?: number;
    idUbicacion?: number;
    idListaUbicaciones?: number;
  }): Promise<PaginatedResponse<Modulo>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.estado !== undefined) queryParams.append('estado', params.estado.toString());
    if (params?.idAreaDesarrollo) queryParams.append('idAreaDesarrollo', params.idAreaDesarrollo.toString());
    if (params?.idUbicacion) queryParams.append('idUbicacion', params.idUbicacion.toString());
    if (params?.idListaUbicaciones) queryParams.append('idListaUbicaciones', params.idListaUbicaciones.toString());

    const url = `${MODULOS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Modulo[]>(response);

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
   * Obtener un módulo por ID
   */
  async getById(id: number): Promise<Modulo> {
    const response = await fetch(`${MODULOS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Modulo>(response);
  },

  /**
   * Crear un nuevo módulo
   */
  async create(data: ModuloFormData): Promise<Modulo> {
    const response = await fetch(MODULOS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<Modulo>(response);
  },

  /**
   * Actualizar un módulo existente
   */
  async update(id: number, data: Partial<Modulo>): Promise<void> {
    const response = await fetch(`${MODULOS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un módulo (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${MODULOS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de módulos
   */
  async getStats(): Promise<ModulosStats> {
    const response = await fetch(`${MODULOS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ModulosStats>(response);
  },

  /**
   * Obtener ubicaciones filtradas por área de desarrollo
   */
  async getUbicacionesByArea(idArea: number): Promise<ListaUbicacion[]> {
    const response = await fetch(`${MODULOS_API}/ubicaciones-by-area/${idArea}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ListaUbicacion[]>(response);
  },

  /**
   * Obtener todos los service locations
   */
  async getServiceLocations(): Promise<ServicesLocation[]> {
    const response = await fetch(`${MODULOS_API}/service-locations`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ServicesLocation[]>(response);
  },

  /**
   * Obtener coordenadas de un service location específico
   */
  async getServiceLocationCoordinates(id: number): Promise<ServiceLocationCoordinates> {
    const response = await fetch(`${MODULOS_API}/service-locations/${id}/coordinates`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ServiceLocationCoordinates>(response);
  },

  /**
   * Obtener todas las compañías de enlace (COs)
   */
  async getCOs(): Promise<CO[]> {
    const response = await fetch(`${MODULOS_API}/cos`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<CO[]>(response);
  },
};
