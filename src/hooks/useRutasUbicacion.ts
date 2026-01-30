import { useQuery } from "@tanstack/react-query";
import { rutaUbicacionService } from "@/services/rutaUbicacion.service";

export function useRutasUbicacion(params?: {
  idListaUbicacion?: number;
  pageSize?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["rutasUbicacion", params],
    queryFn: () => rutaUbicacionService.getAll(params),
    enabled: !!params?.idListaUbicacion, // Solo ejecutar si hay lista ubicación seleccionada
  });
}
