import {
  EnlaceFactura,
  ElementoFactura,
  FacturaHistorial,
  FacturaDetalle,
  FacturacionStats,
  ContabilizarRequest,
  FacturarRequest,
  ActualizarEnlaceRequest,
  FiltrosFacturacion,
} from '@/types/facturacion';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const FACTURACION_API = `${API_BASE_URL}/api/FacturacionApi`;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const facturacionService = {
  /**
   * Obtener enlaces pendientes de contabilizar
   */
  async getEnlacesPendientes(params?: FiltrosFacturacion): Promise<PaginatedResponse<EnlaceFactura>> {
    const queryParams = new URLSearchParams();
    if (params?.empresa) queryParams.append('empresa', params.empresa);
    if (params?.fechaDesde) queryParams.append('fechaDesde', new Date(params.fechaDesde).toISOString());
    if (params?.fechaHasta) queryParams.append('fechaHasta', new Date(params.fechaHasta).toISOString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${FACTURACION_API}/enlaces-pendientes${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<EnlaceFactura[]>(response);

    const totalCount = parseInt(response.headers.get('X-Total-Count') || data.length.toString());
    const page = parseInt(response.headers.get('X-Page') || '1');
    const pageSize = parseInt(response.headers.get('X-Page-Size') || '50');

    return { data, totalCount, page, pageSize };
  },

  /**
   * Obtener elementos agrupados para facturar
   */
  async getElementosFacturar(params?: FiltrosFacturacion): Promise<ElementoFactura[]> {
    const queryParams = new URLSearchParams();
    if (params?.empresa) queryParams.append('empresa', params.empresa);
    if (params?.fechaDesde) queryParams.append('fechaDesde', new Date(params.fechaDesde).toISOString());
    if (params?.fechaHasta) queryParams.append('fechaHasta', new Date(params.fechaHasta).toISOString());

    const url = `${FACTURACION_API}/elementos-facturar${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<ElementoFactura[]>(response);
  },

  /**
   * Contabilizar enlaces
   */
  async contabilizar(ids: number[]): Promise<{ success: boolean; message: string; contabilizados: number }> {
    const response = await fetch(`${FACTURACION_API}/contabilizar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ Ids: ids } as ContabilizarRequest),
    });

    return handleResponse(response);
  },

  /**
   * Facturar enlaces
   */
  async facturar(request: FacturarRequest): Promise<{ success: boolean; message: string; facturas: number[] }> {
    const response = await fetch(`${FACTURACION_API}/facturar`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
    });

    return handleResponse(response);
  },

  /**
   * Obtener historial de contabilizaciones
   */
  async getHistorialContabilizacion(params?: FiltrosFacturacion): Promise<PaginatedResponse<EnlaceFactura>> {
    const queryParams = new URLSearchParams();
    if (params?.empresa) queryParams.append('empresa', params.empresa);
    if (params?.fechaDesde) queryParams.append('fechaDesde', new Date(params.fechaDesde).toISOString());
    if (params?.fechaHasta) queryParams.append('fechaHasta', new Date(params.fechaHasta).toISOString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${FACTURACION_API}/historial-contabilizacion${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<EnlaceFactura[]>(response);

    const totalCount = parseInt(response.headers.get('X-Total-Count') || data.length.toString());
    const page = parseInt(response.headers.get('X-Page') || '1');
    const pageSize = parseInt(response.headers.get('X-Page-Size') || '50');

    return { data, totalCount, page, pageSize };
  },

  /**
   * Obtener historial de facturas
   */
  async getHistorialFacturas(params?: FiltrosFacturacion): Promise<PaginatedResponse<FacturaHistorial>> {
    const queryParams = new URLSearchParams();
    if (params?.empresa) queryParams.append('empresa', params.empresa);
    if (params?.fechaDesde) queryParams.append('fechaDesde', new Date(params.fechaDesde).toISOString());
    if (params?.fechaHasta) queryParams.append('fechaHasta', new Date(params.fechaHasta).toISOString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = `${FACTURACION_API}/historial-facturas${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse<FacturaHistorial[]>(response);

    const totalCount = parseInt(response.headers.get('X-Total-Count') || data.length.toString());
    const page = parseInt(response.headers.get('X-Page') || '1');
    const pageSize = parseInt(response.headers.get('X-Page-Size') || '50');

    return { data, totalCount, page, pageSize };
  },

  /**
   * Anular contabilización
   */
  async anularContabilizacion(ids: number[]): Promise<{ success: boolean; message: string; anulados: number }> {
    const response = await fetch(`${FACTURACION_API}/anular-contabilizacion`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ Ids: ids } as ContabilizarRequest),
    });

    return handleResponse(response);
  },

  /**
   * Anular factura
   */
  async anularFactura(noFactura: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${FACTURACION_API}/anular-factura/${noFactura}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  /**
   * Obtener detalle completo de una factura
   */
  async getFacturaDetalle(noFactura: number): Promise<FacturaDetalle> {
    const response = await fetch(`${FACTURACION_API}/factura/${noFactura}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<FacturaDetalle>(response);
  },

  /**
   * Reimpresión de Anexo con AFO
   */
  async reimpresionAFO(noFactura: number): Promise<FacturaDetalle> {
    const response = await fetch(`${FACTURACION_API}/reimpresion-afo/${noFactura}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<FacturaDetalle>(response);
  },

  /**
   * Reimpresión de Anexo sin AFO
   */
  async reimpresion(noFactura: number): Promise<FacturaDetalle> {
    const response = await fetch(`${FACTURACION_API}/reimpresion/${noFactura}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<FacturaDetalle>(response);
  },

  /**
   * Obtener detalle de un enlace
   */
  async getEnlace(id: number): Promise<EnlaceFactura> {
    const response = await fetch(`${FACTURACION_API}/enlace/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<EnlaceFactura>(response);
  },

  /**
   * Actualizar importes de un enlace
   */
  async actualizarEnlace(id: number, data: ActualizarEnlaceRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${FACTURACION_API}/enlace/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  /**
   * Obtener lista de empresas/carriers
   */
  async getEmpresas(): Promise<string[]> {
    const response = await fetch(`${FACTURACION_API}/empresas`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<string[]>(response);
  },

  /**
   * Obtener estadísticas de facturación
   */
  async getStats(): Promise<FacturacionStats> {
    const response = await fetch(`${FACTURACION_API}/stats`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<FacturacionStats>(response);
  },
};
