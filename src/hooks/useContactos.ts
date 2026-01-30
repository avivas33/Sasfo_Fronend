import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactosService } from '@/services/contactos.service';
import { Contacto, ContactoFormData } from '@/types/contacto';
import { handleError } from '@/services/api';

// Hook para obtener lista de contactos
export function useContactos(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  estado?: boolean;
  idEmpresa?: number;
}) {
  return useQuery({
    queryKey: ['contactos', params],
    queryFn: () => contactosService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un contacto por ID
export function useContacto(id: number | undefined) {
  return useQuery({
    queryKey: ['contacto', id],
    queryFn: () => contactosService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear contacto
export function useCreateContacto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactoFormData) => contactosService.create(data),
    onSuccess: () => {
      // Invalidar cache de contactos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
    },
    onError: (error) => {
      console.error('Error al crear contacto:', handleError(error));
    },
  });
}

// Hook para actualizar contacto
export function useUpdateContacto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contacto> }) =>
      contactosService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del contacto específico y la lista
      queryClient.invalidateQueries({ queryKey: ['contacto', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
    },
    onError: (error) => {
      console.error('Error al actualizar contacto:', handleError(error));
    },
  });
}

// Hook para eliminar contacto
export function useDeleteContacto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactosService.delete(id),
    onSuccess: () => {
      // Invalidar cache de contactos
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
    },
    onError: (error) => {
      console.error('Error al eliminar contacto:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useContactosStats() {
  return useQuery({
    queryKey: ['contactos', 'stats'],
    queryFn: () => contactosService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
