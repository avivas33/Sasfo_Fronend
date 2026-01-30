import { API_BASE_URL, getHeaders, handleResponse } from './api';

const VETRO_API = `${API_BASE_URL}/api/VetroApi`;

// Types para Vetro API
export interface VetroResponse {
  isSuccess: boolean;
  messageError: string;
  messageInfo: string;
  result?: any;
}

export interface VetroProcessMessage {
  msgId: number;
  msgInfo: string;
  msgTipo: string; // "1" = success, "2" = error
}

export interface ProcessServiceLocationRequest {
  vetroId: string;
  featureId: number;
  serviceLocation: string;
  codeCO: string;
  isSLType: boolean;
}

// Servicio principal de Vetro API
export const vetroService = {
  /**
   * Ejecuta todos los procesos de actualización de Vetro API v2
   * Este método se debe llamar al cargar el formulario de creación/edición de módulos
   */
  executeAllProcesses: async (): Promise<VetroProcessMessage[]> => {
    const response = await fetch(`${VETRO_API}/execute-all-processes`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<VetroProcessMessage[]>(response);
  },

  /**
   * Actualiza la lista de Service Locations desde Vetro
   */
  serviceLocationList: async (): Promise<VetroResponse> => {
    const response = await fetch(`${VETRO_API}/service-location-list`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<VetroResponse>(response);
  },

  /**
   * Actualiza la lista de Compañías de Enlace (CO) desde Vetro
   */
  coList: async (): Promise<VetroResponse> => {
    const response = await fetch(`${VETRO_API}/co-list`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<VetroResponse>(response);
  },

  /**
   * Valida los circuitos existentes en Vetro
   */
  circuitoVetroValid: async (): Promise<VetroResponse> => {
    const response = await fetch(`${VETRO_API}/circuito-vetro-valid`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<VetroResponse>(response);
  },

  /**
   * Procesa los circuitos de un Service Location específico
   * Este método se debe llamar al guardar un módulo con Service Location
   */
  processServiceLocationCircuits: async (
    request: ProcessServiceLocationRequest
  ): Promise<VetroProcessMessage[]> => {
    const response = await fetch(`${VETRO_API}/process-service-location-circuits`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });

    return handleResponse<VetroProcessMessage[]>(response);
  },

  /**
   * Obtiene los circuitos asociados a un Service Location
   */
  getCircuitosByServiceLocation: async (
    vetroId: string,
    featureId: number
  ): Promise<VetroResponse> => {
    const response = await fetch(`${VETRO_API}/circuitos-by-sl/${vetroId}/${featureId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<VetroResponse>(response);
  },
};
