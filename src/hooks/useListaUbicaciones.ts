import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listaUbicacionesService } from "@/services/listaUbicaciones.service";
import type {
  ListaUbicacion,
  ListaUbicacionFormData,
  PaginatedListaUbicaciones
} from "@/types/listaUbicaciones";

interface UseListaUbicacionesParams {
  search?: string;
  page?: number;
  pageSize?: number;
  idAreaDesarrollo?: number;
}

export function useListaUbicaciones(params?: UseListaUbicacionesParams) {
  return useQuery<PaginatedListaUbicaciones>({
    queryKey: ["listaUbicaciones", params],
    queryFn: () => listaUbicacionesService.getAll(params),
  });
}

export function useListaUbicacion(id: number) {
  return useQuery<ListaUbicacion>({
    queryKey: ["listaUbicacion", id],
    queryFn: () => listaUbicacionesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateListaUbicacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ListaUbicacionFormData) => listaUbicacionesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listaUbicaciones"] });
      queryClient.invalidateQueries({ queryKey: ["listaUbicacionesStats"] });
    },
  });
}

export function useUpdateListaUbicacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ListaUbicacion> }) =>
      listaUbicacionesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listaUbicaciones"] });
      queryClient.invalidateQueries({ queryKey: ["listaUbicacion"] });
      queryClient.invalidateQueries({ queryKey: ["listaUbicacionesStats"] });
    },
  });
}

export function useDeleteListaUbicacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => listaUbicacionesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listaUbicaciones"] });
      queryClient.invalidateQueries({ queryKey: ["listaUbicacionesStats"] });
    },
  });
}

export function useListaUbicacionesStats() {
  return useQuery({
    queryKey: ["listaUbicacionesStats"],
    queryFn: () => listaUbicacionesService.getStats(),
  });
}
