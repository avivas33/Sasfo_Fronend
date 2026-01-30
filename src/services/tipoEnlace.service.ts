import type {
  TipoEnlace,
  TipoEnlaceFormData,
  PaginatedTipoEnlaces,
  TipoEnlaceStats
} from "@/types/tipoEnlace";
import { API_BASE_URL, getHeaders, handleResponse } from "./api";

const TIPO_ENLACE_API = `${API_BASE_URL}/api/TipoEnlaceApi`;

interface GetTipoEnlacesParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const tipoEnlaceService = {
  async getAll(params?: GetTipoEnlacesParams): Promise<PaginatedTipoEnlaces> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const url = `${TIPO_ENLACE_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedTipoEnlaces>(response);
  },

  async getById(id: number): Promise<TipoEnlace> {
    const response = await fetch(`${TIPO_ENLACE_API}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<TipoEnlace>(response);
  },

  async create(data: TipoEnlaceFormData): Promise<TipoEnlace> {
    const response = await fetch(TIPO_ENLACE_API, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<TipoEnlace>(response);
  },

  async update(id: number, data: Partial<TipoEnlace>): Promise<void> {
    const response = await fetch(`${TIPO_ENLACE_API}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ ...data, id: id }),
    });

    return handleResponse<void>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${TIPO_ENLACE_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  async getStats(): Promise<TipoEnlaceStats> {
    const response = await fetch(`${TIPO_ENLACE_API}/stats`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<TipoEnlaceStats>(response);
  }
};
