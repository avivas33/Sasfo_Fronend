import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresasService } from '@/services/empresas.service';
import { Empresa, EmpresaFormData } from '@/types/empresa';
import { handleError } from '@/services/api';

// Hook para obtener lista de empresas
export function useEmpresas(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['empresas', params],
    queryFn: () => empresasService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener una empresa por ID
export function useEmpresa(id: number | undefined) {
  return useQuery({
    queryKey: ['empresa', id],
    queryFn: () => empresasService.getById(id!),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para crear empresa
export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmpresaFormData) => empresasService.create(data),
    onSuccess: () => {
      // Invalidar cache de empresas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
    onError: (error) => {
      console.error('Error al crear empresa:', handleError(error));
    },
  });
}

// Hook para actualizar empresa
export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Empresa> }) =>
      empresasService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache de la empresa específica y la lista
      queryClient.invalidateQueries({ queryKey: ['empresa', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
    onError: (error) => {
      console.error('Error al actualizar empresa:', handleError(error));
    },
  });
}

// Hook para eliminar empresa
export function useDeleteEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => empresasService.delete(id),
    onSuccess: () => {
      // Invalidar cache de empresas
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
    onError: (error) => {
      console.error('Error al eliminar empresa:', handleError(error));
    },
  });
}

// Hook para obtener estadísticas
export function useEmpresasStats() {
  return useQuery({
    queryKey: ['empresas', 'stats'],
    queryFn: () => empresasService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
