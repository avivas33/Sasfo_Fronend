import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '@/services/roles.service';
import { CreateRolData, UpdateRolData } from '@/types/rol';
import { handleError } from '@/services/api';

// Hook para obtener lista de roles
export function useRoles(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => rolesService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un rol por ID
export function useRol(id: string | undefined) {
  return useQuery({
    queryKey: ['rol', id],
    queryFn: () => rolesService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear rol
export function useCreateRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRolData) => rolesService.create(data),
    onSuccess: () => {
      // Invalidar cache de roles para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error al crear rol:', handleError(error));
    },
  });
}

// Hook para actualizar rol
export function useUpdateRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRolData }) =>
      rolesService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del rol específico y la lista
      queryClient.invalidateQueries({ queryKey: ['rol', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error al actualizar rol:', handleError(error));
    },
  });
}

// Hook para eliminar rol
export function useDeleteRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesService.delete(id),
    onSuccess: () => {
      // Invalidar cache de roles
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error al eliminar rol:', handleError(error));
    },
  });
}

// Hook para obtener operaciones de un rol
export function useRolOperaciones(id: string | undefined, params?: {
  moduloId?: number;
  opcionMenuId?: number;
}) {
  return useQuery({
    queryKey: ['rol', id, 'operaciones', params],
    queryFn: () => rolesService.getOperaciones(id!, params),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para alternar estado de operación
export function useToggleOperacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, operacionId }: { roleId: string; operacionId: number }) =>
      rolesService.toggleOperacion(roleId, operacionId),
    onSuccess: (_, variables) => {
      // Invalidar cache de operaciones del rol
      queryClient.invalidateQueries({ queryKey: ['rol', variables.roleId, 'operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['rol', variables.roleId] });
    },
    onError: (error) => {
      console.error('Error al cambiar estado de operación:', handleError(error));
    },
  });
}

// Hook para sincronizar operaciones
export function useSyncOperaciones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesService.syncOperaciones(id),
    onSuccess: (_, id) => {
      // Invalidar cache de operaciones del rol
      queryClient.invalidateQueries({ queryKey: ['rol', id, 'operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['rol', id] });
    },
    onError: (error) => {
      console.error('Error al sincronizar operaciones:', handleError(error));
    },
  });
}

// Hook para obtener módulos
export function useModulos() {
  return useQuery({
    queryKey: ['modulos'],
    queryFn: () => rolesService.getModulos(),
    staleTime: 30 * 60 * 1000, // 30 minutos (no cambian frecuentemente)
  });
}

// Hook para obtener opciones de menú de un módulo
export function useOpcionesMenu(moduloId: number | undefined) {
  return useQuery({
    queryKey: ['modulos', moduloId, 'opciones-menu'],
    queryFn: () => rolesService.getOpcionesMenu(moduloId!),
    enabled: !!moduloId, // Solo ejecutar si hay ID de módulo
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para obtener estadísticas de roles
export function useRolesStats() {
  return useQuery({
    queryKey: ['roles', 'stats'],
    queryFn: () => rolesService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
