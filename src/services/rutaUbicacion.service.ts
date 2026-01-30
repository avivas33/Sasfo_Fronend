import type { PaginatedRutasUbicacion } from "@/types/rutaUbicacion";
import { API_BASE_URL, getHeaders, handleResponse } from "./api";

const RUTA_UBICACION_API = `${API_BASE_URL}/api/RutaUbicacionApi`;

interface GetRutasUbicacionParams {
  idListaUbicacion?: number;
  pageSize?: number;
  page?: number;
}

export const rutaUbicacionService = {
  /**
   * Obtener lista de rutas filtradas por lista de ubicación
   */
  async getAll(params?: GetRutasUbicacionParams): Promise<PaginatedRutasUbicacion> {
    const queryParams = new URLSearchParams();

    if (params?.idListaUbicacion) queryParams.append("idListaUbicacion", params.idListaUbicacion.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.page) queryParams.append("page", params.page.toString());

    const url = `${RUTA_UBICACION_API}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return handleResponse<PaginatedRutasUbicacion>(response);
  },
};
