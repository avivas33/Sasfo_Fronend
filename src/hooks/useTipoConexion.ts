import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tipoConexionService } from '@/services/tipoConexion.service';
import type { TipoConexionFormData, TipoConexion } from '@/types/tipoConexion';

interface UseTipoConexionsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useTipoConexions(params: UseTipoConexionsParams = {}) {
  return useQuery({
    queryKey: ['tipoConexions', params],
    queryFn: () => tipoConexionService.getAll(params),
  });
}

export function useTipoConexion(id: number) {
  return useQuery({
    queryKey: ['tipoConexion', id],
    queryFn: () => tipoConexionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTipoConexion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TipoConexionFormData) => tipoConexionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoConexions'] });
      queryClient.invalidateQueries({ queryKey: ['tipoConexionStats'] });
    },
  });
}

export function useUpdateTipoConexion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TipoConexion> }) =>
      tipoConexionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoConexions'] });
      queryClient.invalidateQueries({ queryKey: ['tipoConexion'] });
      queryClient.invalidateQueries({ queryKey: ['tipoConexionStats'] });
    },
  });
}

export function useDeleteTipoConexion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tipoConexionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoConexions'] });
      queryClient.invalidateQueries({ queryKey: ['tipoConexionStats'] });
    },
  });
}

export function useTipoConexionStats() {
  return useQuery({
    queryKey: ['tipoConexionStats'],
    queryFn: () => tipoConexionService.getStats(),
  });
}
