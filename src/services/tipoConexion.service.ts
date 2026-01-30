import type {
  TipoConexion,
  TipoConexionFormData,
  PaginatedTipoConexions,
  TipoConexionStats
} from "@/types/tipoConexion";
import { API_BASE_URL, getHeaders, handleResponse } from "./api";

const TIPO_CONEXION_API = `${API_BASE_URL}/api/TipoConexionApi`;

interface GetTipoConexionsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const tipoConexionService = {
  /**
   * Obtener lista de Tipos de Conexión con paginación y búsqueda
   */
  async getAll(params?: GetTipoConexionsParams): Promise<PaginatedTipoConexions> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const url = `${TIPO_CONEXION_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedTipoConexions>(response);
  },

  /**
   * Obtener un Tipo de Conexión por ID
   */
  async getById(id: number): Promise<TipoConexion> {
    const response = await fetch(`${TIPO_CONEXION_API}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<TipoConexion>(response);
  },

  /**
   * Crear un nuevo Tipo de Conexión
   */
  async create(data: TipoConexionFormData): Promise<TipoConexion> {
    const response = await fetch(TIPO_CONEXION_API, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<TipoConexion>(response);
  },

  /**
   * Actualizar un Tipo de Conexión existente
   */
  async update(id: number, data: Partial<TipoConexion>): Promise<void> {
    const response = await fetch(`${TIPO_CONEXION_API}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ ...data, id: id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un Tipo de Conexión (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${TIPO_CONEXION_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de Tipos de Conexión
   */
  async getStats(): Promise<TipoConexionStats> {
    const response = await fetch(`${TIPO_CONEXION_API}/stats`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<TipoConexionStats>(response);
  }
};
