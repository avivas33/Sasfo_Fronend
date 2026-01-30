import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { circuitosService } from '@/services/circuitos.service';
import type { CircuitoFormData, Circuito } from '@/types/circuitos';

interface UseCircuitosParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useCircuitos(params: UseCircuitosParams = {}) {
  return useQuery({
    queryKey: ['circuitos', params],
    queryFn: () => circuitosService.getAll(params),
  });
}

export function useCircuito(id: number) {
  return useQuery({
    queryKey: ['circuito', id],
    queryFn: () => circuitosService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCircuito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CircuitoFormData) => circuitosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circuitos'] });
      queryClient.invalidateQueries({ queryKey: ['circuitoStats'] });
    },
  });
}

export function useUpdateCircuito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Circuito> }) =>
      circuitosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circuitos'] });
      queryClient.invalidateQueries({ queryKey: ['circuito'] });
      queryClient.invalidateQueries({ queryKey: ['circuitoStats'] });
    },
  });
}

export function useDeleteCircuito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => circuitosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circuitos'] });
      queryClient.invalidateQueries({ queryKey: ['circuitoStats'] });
    },
  });
}

export function useCircuitoStats() {
  return useQuery({
    queryKey: ['circuitoStats'],
    queryFn: () => circuitosService.getStats(),
  });
}
