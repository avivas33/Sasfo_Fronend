import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tecnicosService } from '@/services/tecnicos.service';
import { TecnicoCreateRequest, TecnicoUpdateRequest, TecnicosFilters } from '@/types/tecnicos';

// Hook para obtener lista de Tecnicos
export function useTecnicosList(filters?: TecnicosFilters) {
  return useQuery({
    queryKey: ['tecnicos', filters],
    queryFn: () => tecnicosService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para obtener un tecnico por ID
export function useTecnico(id: number | undefined) {
  return useQuery({
    queryKey: ['tecnico', id],
    queryFn: () => tecnicosService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener estadisticas
export function useTecnicosStats() {
  return useQuery({
    queryKey: ['tecnicos', 'stats'],
    queryFn: () => tecnicosService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener tipos de usuario
export function useTiposUsuario() {
  return useQuery({
    queryKey: ['tecnicos', 'tipos-usuario'],
    queryFn: () => tecnicosService.getTiposUsuario(),
    staleTime: 30 * 60 * 1000,
  });
}

// Hook para crear tecnico
export function useCreateTecnico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TecnicoCreateRequest) => tecnicosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicos'] });
    },
  });
}

// Hook para actualizar tecnico
export function useUpdateTecnico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TecnicoUpdateRequest }) =>
      tecnicosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicos'] });
    },
  });
}

// Hook para eliminar tecnico
export function useDeleteTecnico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tecnicosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicos'] });
    },
  });
}

// Hook para inhabilitar tecnico
export function useInhabilitarTecnico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tecnicosService.inhabilitar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicos'] });
    },
  });
}

// Hook para habilitar tecnico
export function useHabilitarTecnico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tecnicosService.habilitar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicos'] });
    },
  });
}
