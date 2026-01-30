import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { viabilidadesService, AprobarViabilidadData } from '@/services/viabilidades.service';
import { Viabilidad, ViabilidadFormData } from '@/types/viabilidad';
import { handleError } from '@/services/api';

// Hook para obtener lista de viabilidades
export function useViabilidades(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  idEmpresa?: number;
  idProcesoViabilidad?: number;
  isEspecial?: boolean;
}) {
  return useQuery({
    queryKey: ['viabilidades', params],
    queryFn: () => viabilidadesService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener viabilidades especiales (cotizaciones especiales)
export function useViabilidadesEspeciales(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  idEmpresa?: number;
  idProcesoViabilidad?: number;
}) {
  return useQuery({
    queryKey: ['viabilidades', 'especiales', params],
    queryFn: () => viabilidadesService.getAll({ ...params, isEspecial: true }),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener una viabilidad por ID
export function useViabilidad(id: number | undefined) {
  return useQuery({
    queryKey: ['viabilidad', id],
    queryFn: () => viabilidadesService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para crear viabilidad
export function useCreateViabilidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ViabilidadFormData) => viabilidadesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viabilidades'] });
    },
    onError: (error) => {
      console.error('Error al crear viabilidad:', handleError(error));
    },
  });
}

// Hook para actualizar viabilidad
export function useUpdateViabilidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Viabilidad> }) =>
      viabilidadesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['viabilidad', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['viabilidades'] });
    },
    onError: (error) => {
      console.error('Error al actualizar viabilidad:', handleError(error));
    },
  });
}

// Hook para eliminar viabilidad
export function useDeleteViabilidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => viabilidadesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viabilidades'] });
    },
    onError: (error) => {
      console.error('Error al eliminar viabilidad:', handleError(error));
    },
  });
}

// Hook para aprobar viabilidad con información complementaria
export function useAprobarViabilidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, infoComplementaria }: { id: number; infoComplementaria?: AprobarViabilidadData }) =>
      viabilidadesService.aprobar(id, infoComplementaria),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['viabilidad', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['viabilidades'] });
    },
    onError: (error) => {
      console.error('Error al aprobar viabilidad:', handleError(error));
    },
  });
}

// Hook para rechazar viabilidad
export function useRechazarViabilidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      viabilidadesService.rechazar(id, motivo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['viabilidad', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['viabilidades'] });
    },
    onError: (error) => {
      console.error('Error al rechazar viabilidad:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useViabilidadesStats() {
  return useQuery({
    queryKey: ['viabilidades', 'stats'],
    queryFn: () => viabilidadesService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
