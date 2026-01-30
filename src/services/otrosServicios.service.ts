import { API_BASE_URL, getHeaders, handleResponse } from "./api";
import type {
  OtroServicio,
  OtroServicioFormData,
  PaginatedOtrosServicios,
  OtroServicioStats,
} from "@/types/otrosServicios";

const OTROS_SERVICIOS_API = `${API_BASE_URL}/api/OtrosServiciosApi`;

interface GetAllParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const otrosServiciosService = {
  async getAll(params: GetAllParams = {}): Promise<PaginatedOtrosServicios> {
    const { search, page = 1, pageSize = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    const url = `${OTROS_SERVICIOS_API}?${queryParams}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedOtrosServicios>(response);
  },

  async getById(id: number): Promise<OtroServicio> {
    const url = `${OTROS_SERVICIOS_API}/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<OtroServicio>(response);
  },

  async create(data: OtroServicioFormData): Promise<OtroServicio> {
    const url = OTROS_SERVICIOS_API;
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<OtroServicio>(response);
  },

  async update(id: number, data: Partial<OtroServicio>): Promise<OtroServicio> {
    const url = `${OTROS_SERVICIOS_API}/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<OtroServicio>(response);
  },

  async delete(id: number): Promise<void> {
    const url = `${OTROS_SERVICIOS_API}/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  async getStats(): Promise<OtroServicioStats> {
    const url = `${OTROS_SERVICIOS_API}/stats`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<OtroServicioStats>(response);
  },
};
