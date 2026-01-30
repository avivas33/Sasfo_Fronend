import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { otrosServiciosTRSService } from '@/services/otrosServiciosTRS.service';
import { OtrosServiciosTRSCreateRequest, OtrosServiciosTRSUpdateRequest } from '@/types/otrosServiciosTRS';
import { handleError } from '@/services/api';

// Hook para obtener lista de OtrosServiciosTRS
export function useOtrosServiciosTRSList() {
  return useQuery({
    queryKey: ['otrosServiciosTRS'],
    queryFn: () => otrosServiciosTRSService.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para obtener un registro por ID
export function useOtrosServiciosTRS(id: number | undefined) {
  return useQuery({
    queryKey: ['otrosServiciosTRS', id],
    queryFn: () => otrosServiciosTRSService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para crear registro
export function useCreateOtrosServiciosTRS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OtrosServiciosTRSCreateRequest) => otrosServiciosTRSService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServiciosTRS'] });
    },
    onError: (error) => {
      console.error('Error al crear:', handleError(error));
    },
  });
}

// Hook para actualizar registro
export function useUpdateOtrosServiciosTRS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OtrosServiciosTRSUpdateRequest }) =>
      otrosServiciosTRSService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServiciosTRS'] });
    },
    onError: (error) => {
      console.error('Error al actualizar:', handleError(error));
    },
  });
}

// Hook para eliminar registro
export function useDeleteOtrosServiciosTRS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => otrosServiciosTRSService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServiciosTRS'] });
    },
    onError: (error) => {
      console.error('Error al eliminar:', handleError(error));
    },
  });
}

// Hook para aprobar (generar plan de pagos)
export function useAprobarOtrosServiciosTRS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => otrosServiciosTRSService.aprobar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServiciosTRS'] });
    },
    onError: (error) => {
      console.error('Error al aprobar:', handleError(error));
    },
  });
}

// Hook para cancelar
export function useCancelarOtrosServiciosTRS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => otrosServiciosTRSService.cancelar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosServiciosTRS'] });
    },
    onError: (error) => {
      console.error('Error al cancelar:', handleError(error));
    },
  });
}

// Hook para obtener empresas
export function useEmpresasOtrosServicios() {
  return useQuery({
    queryKey: ['otrosServiciosTRS', 'empresas'],
    queryFn: () => otrosServiciosTRSService.getEmpresas(),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para obtener tipos de servicio
export function useTiposServicio() {
  return useQuery({
    queryKey: ['otrosServiciosTRS', 'tipos-servicio'],
    queryFn: () => otrosServiciosTRSService.getTiposServicio(),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para obtener tipos de cargo
export function useTiposCargo() {
  return useQuery({
    queryKey: ['otrosServiciosTRS', 'tipos-cargo'],
    queryFn: () => otrosServiciosTRSService.getTiposCargo(),
    staleTime: 30 * 60 * 1000,
  });
}
