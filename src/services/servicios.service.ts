import type {
  Servicio,
  ServicioFormData,
  PaginatedServicios,
  ServicioStats
} from "@/types/servicios";
import { API_BASE_URL, getHeaders, handleResponse } from "./api";

const SERVICIOS_API = `${API_BASE_URL}/api/ServiciosApi`;

interface GetServiciosParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const serviciosService = {
  async getAll(params?: GetServiciosParams): Promise<PaginatedServicios> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const url = `${SERVICIOS_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedServicios>(response);
  },

  async getById(id: number): Promise<Servicio> {
    const response = await fetch(`${SERVICIOS_API}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<Servicio>(response);
  },

  async create(data: ServicioFormData): Promise<Servicio> {
    const response = await fetch(SERVICIOS_API, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<Servicio>(response);
  },

  async update(id: number, data: Partial<Servicio>): Promise<void> {
    const response = await fetch(`${SERVICIOS_API}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ ...data, id: id }),
    });

    return handleResponse<void>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${SERVICIOS_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  async getStats(): Promise<ServicioStats> {
    const response = await fetch(`${SERVICIOS_API}/stats`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<ServicioStats>(response);
  }
};
