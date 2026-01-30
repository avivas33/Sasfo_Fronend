import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulosService } from '@/services/modulos.service';
import { Modulo, ModuloFormData } from '@/types/modulo';
import { handleError } from '@/services/api';

// Hook para obtener lista de módulos
export function useModulos(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  estado?: boolean;
  idAreaDesarrollo?: number;
  idUbicacion?: number;
  idListaUbicaciones?: number;
}) {
  return useQuery({
    queryKey: ['modulos', params],
    queryFn: () => modulosService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un módulo por ID
export function useModulo(id: number | undefined) {
  return useQuery({
    queryKey: ['modulo', id],
    queryFn: () => modulosService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear módulo
export function useCreateModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModuloFormData) => modulosService.create(data),
    onSuccess: () => {
      // Invalidar cache de módulos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['modulos'] });
    },
    onError: (error) => {
      console.error('Error al crear módulo:', handleError(error));
    },
  });
}

// Hook para actualizar módulo
export function useUpdateModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Modulo> }) =>
      modulosService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del módulo específico y la lista
      queryClient.invalidateQueries({ queryKey: ['modulo', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['modulos'] });
    },
    onError: (error) => {
      console.error('Error al actualizar módulo:', handleError(error));
    },
  });
}

// Hook para eliminar módulo
export function useDeleteModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => modulosService.delete(id),
    onSuccess: () => {
      // Invalidar cache de módulos
      queryClient.invalidateQueries({ queryKey: ['modulos'] });
    },
    onError: (error) => {
      console.error('Error al eliminar módulo:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useModulosStats() {
  return useQuery({
    queryKey: ['modulos', 'stats'],
    queryFn: () => modulosService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
