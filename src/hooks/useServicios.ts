import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviciosService } from '@/services/servicios.service';
import type { ServicioFormData, Servicio } from '@/types/servicios';

interface UseServiciosParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useServicios(params: UseServiciosParams = {}) {
  return useQuery({
    queryKey: ['servicios', params],
    queryFn: () => serviciosService.getAll(params),
  });
}

export function useServicio(id: number) {
  return useQuery({
    queryKey: ['servicio', id],
    queryFn: () => serviciosService.getById(id),
    enabled: !!id,
  });
}

export function useCreateServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServicioFormData) => serviciosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['servicioStats'] });
    },
  });
}

export function useUpdateServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Servicio> }) =>
      serviciosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['servicio'] });
      queryClient.invalidateQueries({ queryKey: ['servicioStats'] });
    },
  });
}

export function useDeleteServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => serviciosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['servicioStats'] });
    },
  });
}

export function useServicioStats() {
  return useQuery({
    queryKey: ['servicioStats'],
    queryFn: () => serviciosService.getStats(),
  });
}
