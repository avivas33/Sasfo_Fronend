import { useQuery } from '@tanstack/react-query';
import { odfInternosService } from '@/services/odfInternos.service';
import { ODFInternosFilters } from '@/types/odfInternos';

// Hook para obtener lista de ODF Internos
export function useODFInternosList(filters?: ODFInternosFilters) {
  return useQuery({
    queryKey: ['odfInternos', filters],
    queryFn: () => odfInternosService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para obtener estadisticas
export function useODFInternosStats() {
  return useQuery({
    queryKey: ['odfInternos', 'stats'],
    queryFn: () => odfInternosService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener lista de ODFs para filtro
export function useODFList() {
  return useQuery({
    queryKey: ['odfInternos', 'odfs'],
    queryFn: () => odfInternosService.getODFList(),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para obtener lista de Service Locations para filtro
export function useServiceLocationList() {
  return useQuery({
    queryKey: ['odfInternos', 'serviceLocations'],
    queryFn: () => odfInternosService.getServiceLocationList(),
    staleTime: 10 * 60 * 1000,
  });
}
