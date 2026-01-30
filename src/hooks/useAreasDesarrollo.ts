import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { areasDesarrolloService } from '@/services/areasDesarrollo.service';
import { AreaDesarrollo, AreaDesarrolloFormData } from '@/types/areaDesarrollo';
import { handleError } from '@/services/api';

// Hook para obtener lista de áreas de desarrollo
export function useAreasDesarrollo(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  estado?: boolean;
}) {
  return useQuery({
    queryKey: ['areasDesarrollo', params],
    queryFn: () => areasDesarrolloService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un área de desarrollo por ID
export function useAreaDesarrollo(id: number | undefined) {
  return useQuery({
    queryKey: ['areaDesarrollo', id],
    queryFn: () => areasDesarrolloService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear área de desarrollo
export function useCreateAreaDesarrollo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AreaDesarrolloFormData) => areasDesarrolloService.create(data),
    onSuccess: () => {
      // Invalidar cache de áreas de desarrollo para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['areasDesarrollo'] });
    },
    onError: (error) => {
      console.error('Error al crear área de desarrollo:', handleError(error));
    },
  });
}

// Hook para actualizar área de desarrollo
export function useUpdateAreaDesarrollo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AreaDesarrollo> }) =>
      areasDesarrolloService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del área específica y la lista
      queryClient.invalidateQueries({ queryKey: ['areaDesarrollo', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['areasDesarrollo'] });
    },
    onError: (error) => {
      console.error('Error al actualizar área de desarrollo:', handleError(error));
    },
  });
}

// Hook para eliminar área de desarrollo
export function useDeleteAreaDesarrollo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => areasDesarrolloService.delete(id),
    onSuccess: () => {
      // Invalidar cache de áreas de desarrollo
      queryClient.invalidateQueries({ queryKey: ['areasDesarrollo'] });
    },
    onError: (error) => {
      console.error('Error al eliminar área de desarrollo:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useAreasDesarrolloStats() {
  return useQuery({
    queryKey: ['areasDesarrollo', 'stats'],
    queryFn: () => areasDesarrolloService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
