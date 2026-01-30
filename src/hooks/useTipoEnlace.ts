import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tipoEnlaceService } from '@/services/tipoEnlace.service';
import type { TipoEnlaceFormData, TipoEnlace } from '@/types/tipoEnlace';

interface UseTipoEnlacesParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useTipoEnlaces(params: UseTipoEnlacesParams = {}) {
  return useQuery({
    queryKey: ['tipoEnlaces', params],
    queryFn: () => tipoEnlaceService.getAll(params),
  });
}

export function useTipoEnlace(id: number) {
  return useQuery({
    queryKey: ['tipoEnlace', id],
    queryFn: () => tipoEnlaceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTipoEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TipoEnlaceFormData) => tipoEnlaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoEnlaces'] });
      queryClient.invalidateQueries({ queryKey: ['tipoEnlaceStats'] });
    },
  });
}

export function useUpdateTipoEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TipoEnlace> }) =>
      tipoEnlaceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoEnlaces'] });
      queryClient.invalidateQueries({ queryKey: ['tipoEnlace'] });
      queryClient.invalidateQueries({ queryKey: ['tipoEnlaceStats'] });
    },
  });
}

export function useDeleteTipoEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tipoEnlaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoEnlaces'] });
      queryClient.invalidateQueries({ queryKey: ['tipoEnlaceStats'] });
    },
  });
}

export function useTipoEnlaceStats() {
  return useQuery({
    queryKey: ['tipoEnlaceStats'],
    queryFn: () => tipoEnlaceService.getStats(),
  });
}
