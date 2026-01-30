import { API_BASE_URL, getHeaders, handleResponse } from "./api";
import type {
  Circuito,
  CircuitoFormData,
  PaginatedCircuitos,
  CircuitoStats,
} from "@/types/circuitos";

const CIRCUITOS_API = `${API_BASE_URL}/api/CircuitosApi`;

interface GetAllParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const circuitosService = {
  async getAll(params: GetAllParams = {}): Promise<PaginatedCircuitos> {
    const { search, page = 1, pageSize = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    const url = `${CIRCUITOS_API}?${queryParams}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedCircuitos>(response);
  },

  async getById(id: number): Promise<Circuito> {
    const url = `${CIRCUITOS_API}/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<Circuito>(response);
  },

  async create(data: CircuitoFormData): Promise<Circuito> {
    const url = CIRCUITOS_API;
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<Circuito>(response);
  },

  async update(id: number, data: Partial<Circuito>): Promise<Circuito> {
    const url = `${CIRCUITOS_API}/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleResponse<Circuito>(response);
  },

  async delete(id: number): Promise<void> {
    const url = `${CIRCUITOS_API}/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<void>(response);
  },

  async getStats(): Promise<CircuitoStats> {
    const url = `${CIRCUITOS_API}/stats`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<CircuitoStats>(response);
  },
};
