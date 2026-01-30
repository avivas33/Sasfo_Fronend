import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enlacesService } from '@/services/enlaces.service';
import type { EnlaceFormData, Enlace } from '@/types/enlaces';

interface UseEnlacesParams {
  search?: string;
  estado?: boolean;
  page?: number;
  pageSize?: number;
}

export function useEnlaces(params: UseEnlacesParams = {}) {
  return useQuery({
    queryKey: ['enlaces', params],
    queryFn: () => enlacesService.getAll(params),
  });
}

export function useEnlace(id: number) {
  return useQuery({
    queryKey: ['enlace', id],
    queryFn: () => enlacesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnlaceFormData) => enlacesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enlaces'] });
      queryClient.invalidateQueries({ queryKey: ['enlaceStats'] });
    },
  });
}

export function useUpdateEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Enlace> }) =>
      enlacesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enlaces'] });
      queryClient.invalidateQueries({ queryKey: ['enlace'] });
      queryClient.invalidateQueries({ queryKey: ['enlaceStats'] });
    },
  });
}

export function useDeleteEnlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => enlacesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enlaces'] });
      queryClient.invalidateQueries({ queryKey: ['enlaceStats'] });
    },
  });
}

export function useEnlaceStats() {
  return useQuery({
    queryKey: ['enlaceStats'],
    queryFn: () => enlacesService.getStats(),
  });
}
