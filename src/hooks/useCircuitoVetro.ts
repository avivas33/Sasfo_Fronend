import { useQuery } from '@tanstack/react-query';
import { circuitoVetroService } from '@/services/circuitoVetro.service';
import { CircuitoVetroFilters } from '@/types/circuitoVetro';

// Hook para obtener lista de CircuitosVetro
export function useCircuitosVetroList(filters?: CircuitoVetroFilters) {
  return useQuery({
    queryKey: ['circuitosVetro', filters],
    queryFn: () => circuitoVetroService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para obtener un circuito por ID
export function useCircuitoVetro(id: number | undefined) {
  return useQuery({
    queryKey: ['circuitoVetro', id],
    queryFn: () => circuitoVetroService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener estadisticas
export function useCircuitosVetroStats() {
  return useQuery({
    queryKey: ['circuitosVetro', 'stats'],
    queryFn: () => circuitoVetroService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}
