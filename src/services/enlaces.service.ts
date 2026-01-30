import { API_BASE_URL, getHeaders, handleResponse } from "./api";
import type {
  Enlace,
  EnlaceFormData,
  PaginatedEnlaces,
  EnlaceStats,
} from "@/types/enlaces";

const ENLACES_API = `${API_BASE_URL}/api/EnlacesApi`;

interface GetAllParams {
  search?: string;
  estado?: boolean;
  page?: number;
  pageSize?: number;
}

export const enlacesService = {
  async getAll(params: GetAllParams = {}): Promise<PaginatedEnlaces> {
    const { search, estado, page = 1, pageSize = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    if (estado !== undefined) {
      queryParams.append("estado", estado.toString());
    }

    const url = `${ENLACES_API}?${queryParams}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedEnlaces>(response);
  },

  async getById(id: number): Promise<Enlace> {
    const url = `${ENLACES_API}/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<Enlace>(response);
  },

  async create(data: EnlaceFormData): Promise<Enlace> {
    const url = ENLACES_API;
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<Enlace>(response);
  },

  async update(id: number, data: Partial<Enlace>): Promise<Enlace> {
    const url = `${ENLACES_API}/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<Enlace>(response);
  },

  async delete(id: number): Promise<void> {
    const url = `${ENLACES_API}/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  async getStats(): Promise<EnlaceStats> {
    const url = `${ENLACES_API}/stats`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<EnlaceStats>(response);
  },
};
