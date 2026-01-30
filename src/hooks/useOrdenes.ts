import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordenesService } from '@/services/ordenes.service';
import { OrdenesFilters, CancelarOrdenRequest, UpdateOrdenRequest } from '@/types/ordenes';

// Keys para React Query
const QUERY_KEYS = {
  ordenes: ['ordenes'] as const,
  ordenesFiltered: (filters: OrdenesFilters) => ['ordenes', filters] as const,
  ordenDetalle: (id: number) => ['ordenes', 'detalle', id] as const,
  ordenesStats: ['ordenes', 'stats'] as const,
};

/**
 * Hook para obtener lista de órdenes con paginación y filtros
 */
export function useOrdenes(filters?: OrdenesFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.ordenesFiltered(filters || {}),
    queryFn: () => ordenesService.getAll(filters),
  });
}

/**
 * Hook para obtener el detalle de una orden
 */
export function useOrdenDetalle(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.ordenDetalle(id!),
    queryFn: () => ordenesService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Hook para obtener estadísticas de órdenes
 */
export function useOrdenesStats() {
  return useQuery({
    queryKey: QUERY_KEYS.ordenesStats,
    queryFn: () => ordenesService.getStats(),
  });
}

/**
 * Hook para cancelar una orden
 */
export function useCancelarOrden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request?: CancelarOrdenRequest }) =>
      ordenesService.cancelar(id, request),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenesStats });
    },
  });
}

/**
 * Hook para completar una orden
 */
export function useCompletarOrden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordenesService.completar(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenesStats });
    },
  });
}

/**
 * Hook para actualizar una orden
 */
export function useUpdateOrden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateOrdenRequest }) =>
      ordenesService.update(id, request),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenDetalle(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenesStats });
    },
  });
}
