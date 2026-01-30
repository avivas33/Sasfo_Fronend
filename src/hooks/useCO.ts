import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cosService } from '@/services/cos.service';
import { type CO, type COFormData } from '@/types/co';

/**
 * Hook para obtener lista de COs con paginación
 */
export function useCOs(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  estado?: boolean;
}) {
  return useQuery({
    queryKey: ['cos', params],
    queryFn: () => cosService.getAll(params),
  });
}

/**
 * Hook para obtener un CO por ID
 */
export function useCO(id: number) {
  return useQuery({
    queryKey: ['co', id],
    queryFn: () => cosService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para crear un nuevo CO
 */
export function useCreateCO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: COFormData) => cosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cos'] });
    },
  });
}

/**
 * Hook para actualizar un CO
 */
export function useUpdateCO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CO> }) =>
      cosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cos'] });
    },
  });
}

/**
 * Hook para eliminar un CO
 */
export function useDeleteCO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cos'] });
    },
  });
}

/**
 * Hook para obtener estadísticas de COs
 */
export function useCOStats() {
  return useQuery({
    queryKey: ['co-stats'],
    queryFn: () => cosService.getStats(),
  });
}
