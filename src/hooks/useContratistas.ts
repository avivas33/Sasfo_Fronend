import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contratistasService } from '@/services/contratistas.service';
import { Contratista, ContratistaFormData } from '@/types/contratista';
import { handleError } from '@/services/api';

// Hook para obtener lista de contratistas
export function useContratistas(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  estado?: boolean;
}) {
  return useQuery({
    queryKey: ['contratistas', params],
    queryFn: () => contratistasService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un contratista por ID
export function useContratista(id: number | undefined) {
  return useQuery({
    queryKey: ['contratista', id],
    queryFn: () => contratistasService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear contratista
export function useCreateContratista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContratistaFormData) => contratistasService.create(data),
    onSuccess: () => {
      // Invalidar cache de contratistas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
    },
    onError: (error) => {
      console.error('Error al crear contratista:', handleError(error));
    },
  });
}

// Hook para actualizar contratista
export function useUpdateContratista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contratista> }) =>
      contratistasService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del contratista específico y la lista
      queryClient.invalidateQueries({ queryKey: ['contratista', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
    },
    onError: (error) => {
      console.error('Error al actualizar contratista:', handleError(error));
    },
  });
}

// Hook para eliminar/desactivar contratista
export function useDeleteContratista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contratistasService.delete(id),
    onSuccess: () => {
      // Invalidar cache de contratistas
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
    },
    onError: (error) => {
      console.error('Error al cambiar estado del contratista:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useContratistasStats() {
  return useQuery({
    queryKey: ['contratistas', 'stats'],
    queryFn: () => contratistasService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
