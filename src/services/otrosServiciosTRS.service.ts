import {
  OtrosServiciosTRS,
  OtrosServiciosTRSCreateRequest,
  OtrosServiciosTRSUpdateRequest,
  EmpresaSelect,
  TipoServicio,
  TipoCargo,
} from '@/types/otrosServiciosTRS';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const API_URL = `${API_BASE_URL}/api/OtrosServiciosTRSApi`;

export const otrosServiciosTRSService = {
  /**
   * Obtener lista de OtrosServiciosTRS
   */
  async getAll(): Promise<OtrosServiciosTRS[]> {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<OtrosServiciosTRS[]>(response);
  },

  /**
   * Obtener un registro por ID
   */
  async getById(id: number): Promise<OtrosServiciosTRS> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<OtrosServiciosTRS>(response);
  },

  /**
   * Crear nuevo registro
   */
  async create(data: OtrosServiciosTRSCreateRequest): Promise<{ success: boolean; message: string; id: number }> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Actualizar registro existente
   */
  async update(id: number, data: OtrosServiciosTRSUpdateRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Eliminar registro
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Aprobar/Generar plan de pagos
   */
  async aprobar(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}/aprobar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Cancelar servicio
   */
  async cancelar(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/${id}/cancelar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Obtener empresas activas
   */
  async getEmpresas(): Promise<EmpresaSelect[]> {
    const response = await fetch(`${API_URL}/empresas`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<EmpresaSelect[]>(response);
  },

  /**
   * Obtener tipos de servicio activos
   */
  async getTiposServicio(): Promise<TipoServicio[]> {
    const response = await fetch(`${API_URL}/tipos-servicio`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<TipoServicio[]>(response);
  },

  /**
   * Obtener tipos de cargo
   */
  async getTiposCargo(): Promise<TipoCargo[]> {
    const response = await fetch(`${API_URL}/tipos-cargo`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse<TipoCargo[]>(response);
  },
};
