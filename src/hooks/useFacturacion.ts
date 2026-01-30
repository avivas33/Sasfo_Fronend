import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facturacionService } from '@/services/facturacion.service';
import { FiltrosFacturacion, FacturarRequest, ActualizarEnlaceRequest } from '@/types/facturacion';
import { handleError } from '@/services/api';

// Hook para obtener enlaces pendientes de contabilizar
export function useEnlacesPendientes(params?: FiltrosFacturacion) {
  // Solo ejecutar si hay fechas (requeridas)
  const enabled = !!(params?.fechaDesde && params?.fechaHasta);

  return useQuery({
    queryKey: ['facturacion', 'pendientes', params],
    queryFn: () => facturacionService.getEnlacesPendientes(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled, // Solo ejecutar si hay fechas
  });
}

// Hook para obtener elementos agrupados para facturar
export function useElementosFacturar(params?: FiltrosFacturacion) {
  return useQuery({
    queryKey: ['facturacion', 'elementos', params],
    queryFn: () => facturacionService.getElementosFacturar(params),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para obtener historial de contabilizaciones
export function useHistorialContabilizacion(params?: FiltrosFacturacion) {
  return useQuery({
    queryKey: ['facturacion', 'historial-conta', params],
    queryFn: () => facturacionService.getHistorialContabilizacion(params),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para obtener historial de facturas
export function useHistorialFacturas(params?: FiltrosFacturacion) {
  return useQuery({
    queryKey: ['facturacion', 'historial-facturas', params],
    queryFn: () => facturacionService.getHistorialFacturas(params),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para contabilizar
export function useContabilizar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => facturacionService.contabilizar(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturacion'] });
    },
    onError: (error) => {
      console.error('Error al contabilizar:', handleError(error));
    },
  });
}

// Hook para facturar
export function useFacturar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FacturarRequest) => facturacionService.facturar(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturacion'] });
    },
    onError: (error) => {
      console.error('Error al facturar:', handleError(error));
    },
  });
}

// Hook para anular contabilización
export function useAnularContabilizacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => facturacionService.anularContabilizacion(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturacion'] });
    },
    onError: (error) => {
      console.error('Error al anular contabilización:', handleError(error));
    },
  });
}

// Hook para anular factura
export function useAnularFactura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noFactura: number) => facturacionService.anularFactura(noFactura),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturacion'] });
    },
    onError: (error) => {
      console.error('Error al anular factura:', handleError(error));
    },
  });
}

// Hook para obtener detalle de factura
export function useFacturaDetalle(noFactura: number | null) {
  return useQuery({
    queryKey: ['facturacion', 'factura', noFactura],
    queryFn: () => facturacionService.getFacturaDetalle(noFactura!),
    enabled: !!noFactura,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener un enlace
export function useEnlace(id: number | undefined) {
  return useQuery({
    queryKey: ['facturacion', 'enlace', id],
    queryFn: () => facturacionService.getEnlace(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para actualizar enlace
export function useActualizarEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarEnlaceRequest }) =>
      facturacionService.actualizarEnlace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturacion'] });
    },
    onError: (error) => {
      console.error('Error al actualizar enlace:', handleError(error));
    },
  });
}

// Hook para obtener lista de empresas
export function useEmpresasFacturacion() {
  return useQuery({
    queryKey: ['facturacion', 'empresas'],
    queryFn: () => facturacionService.getEmpresas(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para obtener estadísticas
export function useFacturacionStats() {
  return useQuery({
    queryKey: ['facturacion', 'stats'],
    queryFn: () => facturacionService.getStats(),
    staleTime: 2 * 60 * 1000,
  });
}
