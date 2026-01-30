import { Contacto, ContactoFormData } from '@/types/contacto';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const CONTACTOS_API = `${API_BASE_URL}/api/ContactosApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ContactosStats {
  TotalContactos: number;
  ContactosActivos: number;
  ContactosInactivos: number;
  ContactosDefault: number;
  PorTipo: Array<{ Tipo: string; Count: number }>;
}

export const contactosService = {
  /**
   * Obtener lista de contactos con paginación y búsqueda
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    estado?: boolean;
    idEmpresa?: number;
  }): Promise<PaginatedResponse<Contacto>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.estado !== undefined) queryParams.append('estado', params.estado.toString());
    if (params?.idEmpresa) queryParams.append('idEmpresa', params.idEmpresa.toString());

    const url = `${CONTACTOS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<Contacto[]>(response);

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
   * Obtener un contacto por ID
   */
  async getById(id: number): Promise<Contacto> {
    const response = await fetch(`${CONTACTOS_API}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<Contacto>(response);
  },

  /**
   * Crear un nuevo contacto
   */
  async create(data: ContactoFormData): Promise<Contacto> {
    const response = await fetch(CONTACTOS_API, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<Contacto>(response);
  },

  /**
   * Actualizar un contacto existente
   */
  async update(id: number, data: Partial<Contacto>): Promise<void> {
    const response = await fetch(`${CONTACTOS_API}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un contacto (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${CONTACTOS_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de contactos
   */
  async getStats(): Promise<ContactosStats> {
    const response = await fetch(`${CONTACTOS_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ContactosStats>(response);
  },
};
