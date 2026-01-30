import type {
  ODF,
  ODFFormData,
  PaginatedODFs,
  ODFStats
} from "@/types/odf";
import { API_BASE_URL, getHeaders, handleResponse } from "./api";

const ODF_API = `${API_BASE_URL}/api/ODFApi`;

interface GetODFsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const odfService = {
  /**
   * Obtener lista de ODFs con paginación y búsqueda
   */
  async getAll(params?: GetODFsParams): Promise<PaginatedODFs> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const url = `${ODF_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedODFs>(response);
  },

  /**
   * Obtener un ODF por ID
   */
  async getById(id: number): Promise<ODF> {
    const response = await fetch(`${ODF_API}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<ODF>(response);
  },

  /**
   * Crear un nuevo ODF
   */
  async create(data: ODFFormData): Promise<ODF> {
    const response = await fetch(ODF_API, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<ODF>(response);
  },

  /**
   * Actualizar un ODF existente
   */
  async update(id: number, data: Partial<ODF>): Promise<void> {
    const response = await fetch(`${ODF_API}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ ...data, Id: id }),
    });

    return handleResponse<void>(response);
  },

  /**
   * Eliminar un ODF (soft delete)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${ODF_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  /**
   * Obtener estadísticas de ODFs
   */
  async getStats(): Promise<ODFStats> {
    const response = await fetch(`${ODF_API}/stats`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<ODFStats>(response);
  },

  /**
   * Obtener puertos disponibles de un ODF
   */
  async getPuertosDisponibles(id: number): Promise<PuertosDisponiblesResponse> {
    const response = await fetch(`${ODF_API}/${id}/puertos-disponibles`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PuertosDisponiblesResponse>(response);
  }
};

export interface PuertosDisponiblesResponse {
  odfId: number;
  codigo: string;
  totalPuertos: number;
  puertosDisponibles: number[];
}
