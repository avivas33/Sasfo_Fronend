import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { p2pService } from '@/services/p2p.service';
import { P2PFormData } from '@/types/p2p';
import { handleError } from '@/services/api';

// Hook para obtener lista de P2P
export function useP2PList(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  tipoP2P?: number;
  estado?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['p2p', params],
    queryFn: () => p2pService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un P2P por ID
export function useP2P(id: number | undefined) {
  return useQuery({
    queryKey: ['p2p', id],
    queryFn: () => p2pService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para crear P2P
export function useCreateP2P() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: P2PFormData) => p2pService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['p2p'] });
    },
    onError: (error) => {
      console.error('Error al crear P2P:', handleError(error));
    },
  });
}

// Hook para actualizar P2P
export function useUpdateP2P() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<P2PFormData> }) =>
      p2pService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['p2p', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['p2p'] });
    },
    onError: (error) => {
      console.error('Error al actualizar P2P:', handleError(error));
    },
  });
}

// Hook para eliminar/cancelar P2P
export function useDeleteP2P() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => p2pService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['p2p'] });
    },
    onError: (error) => {
      console.error('Error al eliminar P2P:', handleError(error));
    },
  });
}

// Hook para aprobar P2P
export function useAprobarP2P() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => p2pService.aprobar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['p2p', id] });
      queryClient.invalidateQueries({ queryKey: ['p2p'] });
    },
    onError: (error) => {
      console.error('Error al aprobar P2P:', handleError(error));
    },
  });
}

// Hook para completar P2P
export function useCompletarP2P() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => p2pService.completar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['p2p', id] });
      queryClient.invalidateQueries({ queryKey: ['p2p'] });
    },
    onError: (error) => {
      console.error('Error al completar P2P:', handleError(error));
    },
  });
}

// Hook para cancelar P2P
export function useCancelarP2P() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => p2pService.cancelar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['p2p', id] });
      queryClient.invalidateQueries({ queryKey: ['p2p'] });
    },
    onError: (error) => {
      console.error('Error al cancelar P2P:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useP2PStats() {
  return useQuery({
    queryKey: ['p2p', 'stats'],
    queryFn: () => p2pService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
