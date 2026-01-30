import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { otrosServiciosService } from '@/services/otrosServicios.service';
import type { OtroServicioFormData, OtroServicio } from '@/types/otrosServicios';

interface UseOtrosServiciosParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useOtrosServicios(params: UseOtrosServiciosParams = {}) {
  return useQuery({
    queryKey: ['otrosServicios', params],
    queryFn: () => otrosServiciosService.getAll(params),
  });
}

export function useOtroServicio(id: number) {
  return useQuery({
    queryKey: ['otroServicio', id],
    queryFn: () => otrosServiciosService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOtroServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OtroServicioFormData) => otrosServiciosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServicios'] });
      queryClient.invalidateQueries({ queryKey: ['otroServicioStats'] });
    },
  });
}

export function useUpdateOtroServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OtroServicio> }) =>
      otrosServiciosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServicios'] });
      queryClient.invalidateQueries({ queryKey: ['otroServicio'] });
      queryClient.invalidateQueries({ queryKey: ['otroServicioStats'] });
    },
  });
}

export function useDeleteOtroServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => otrosServiciosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServicios'] });
      queryClient.invalidateQueries({ queryKey: ['otroServicioStats'] });
    },
  });
}

export function useOtroServicioStats() {
  return useQuery({
    queryKey: ['otroServicioStats'],
    queryFn: () => otrosServiciosService.getStats(),
  });
}
