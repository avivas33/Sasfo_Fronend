import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '@/services/usuarios.service';
import { Usuario, CreateUsuarioData, UpdateUsuarioData, ChangePasswordData } from '@/types/usuario';
import { handleError } from '@/services/api';

// Hook para obtener lista de usuarios
export function useUsuarios(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un usuario por ID
export function useUsuario(id: string | undefined) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuariosService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear usuario
export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUsuarioData) => usuariosService.create(data),
    onSuccess: () => {
      // Invalidar cache de usuarios para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => {
      console.error('Error al crear usuario:', handleError(error));
    },
  });
}

// Hook para actualizar usuario
export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioData }) =>
      usuariosService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del usuario específico y la lista
      queryClient.invalidateQueries({ queryKey: ['usuario', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => {
      console.error('Error al actualizar usuario:', handleError(error));
    },
  });
}

// Hook para eliminar usuario
export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosService.delete(id),
    onSuccess: () => {
      // Invalidar cache de usuarios
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => {
      console.error('Error al eliminar usuario:', handleError(error));
    },
  });
}

// Hook para cambiar contraseña
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordData }) =>
      usuariosService.changePassword(id, data),
    onError: (error) => {
      console.error('Error al cambiar contraseña:', handleError(error));
    },
  });
}

// Hook para bloquear/desbloquear usuario
export function useToggleLockUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosService.toggleLock(id),
    onSuccess: () => {
      // Invalidar cache de usuarios
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => {
      console.error('Error al cambiar estado de bloqueo:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useUsuariosStats() {
  return useQuery({
    queryKey: ['usuarios', 'stats'],
    queryFn: () => usuariosService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para obtener roles disponibles
export function useAvailableRoles() {
  return useQuery({
    queryKey: ['usuarios', 'available-roles'],
    queryFn: () => usuariosService.getAvailableRoles(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
