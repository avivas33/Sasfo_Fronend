import type {
  ListaUbicacion,
  ListaUbicacionFormData,
  PaginatedListaUbicaciones,
  ListaUbicacionesStats
} from "@/types/listaUbicaciones";
import { API_BASE_URL, getHeaders, handleResponse } from "./api";

const LISTA_UBICACIONES_API = `${API_BASE_URL}/api/ListaUbicacionesApi`;

interface GetListaUbicacionesParams {
  search?: string;
  page?: number;
  pageSize?: number;
  idAreaDesarrollo?: number;
}

export const listaUbicacionesService = {
  /**
   * Obtener lista de ubicaciones con paginación y búsqueda
   */
  async getAll(params?: GetListaUbicacionesParams): Promise<PaginatedListaUbicaciones> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.idAreaDesarrollo) queryParams.append("idAreaDesarrollo", params.idAreaDesarrollo.toString());

    const url = `${LISTA_UBICACIONES_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedListaUbicaciones>(response);
  },

  /**
   * Obtener una ubicación por ID
   */
  async getById(id: number): Promise<ListaUbicacion> {
    const response = await fetch(`${LISTA_UBICACIONES_API}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<ListaUbicacion>(response);
  },

  /**
   * Crear una nueva ubicación
   */
  async create(data: ListaUbicacionFormData): Promise<ListaUbicacion> {
    const response = await fetch(LISTA_UBICACIONES_API, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<ListaUbicacion>(response);
  },

  /**
   * Actualizar una ubicación existente
   */
  async update(id: number, data: Partial<ListaUbicacion>): Promise<void> {
    const response = await fetch(`${LISTA_UBICACIONES_API}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ ...data, id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar una ubicación (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${LISTA_UBICACIONES_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de ubicaciones
   */
  async getStats(): Promise<ListaUbicacionesStats> {
    const response = await fetch(`${LISTA_UBICACIONES_API}/stats`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<ListaUbicacionesStats>(response);
  }
};
