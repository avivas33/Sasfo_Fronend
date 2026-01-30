import { useMutation } from '@tanstack/react-query';
import { vetroService, type ProcessServiceLocationRequest, type VetroProcessMessage } from '@/services/vetro.service';

/**
 * Hook para ejecutar todos los procesos de actualización de Vetro API v2
 * Útil al cargar el formulario de creación/edición de módulos
 */
export function useExecuteAllVetroProcesses() {
  return useMutation<VetroProcessMessage[], Error>({
    mutationFn: () => vetroService.executeAllProcesses(),
  });
}

/**
 * Hook para actualizar Service Locations desde Vetro
 */
export function useServiceLocationList() {
  return useMutation({
    mutationFn: () => vetroService.serviceLocationList(),
  });
}

/**
 * Hook para actualizar Compañías de Enlace (CO) desde Vetro
 */
export function useCOList() {
  return useMutation({
    mutationFn: () => vetroService.coList(),
  });
}

/**
 * Hook para validar circuitos en Vetro
 */
export function useCircuitoVetroValid() {
  return useMutation({
    mutationFn: () => vetroService.circuitoVetroValid(),
  });
}

/**
 * Hook para procesar circuitos de un Service Location específico
 * Útil al guardar un módulo con Service Location
 */
export function useProcessServiceLocationCircuits() {
  return useMutation<VetroProcessMessage[], Error, ProcessServiceLocationRequest>({
    mutationFn: (request: ProcessServiceLocationRequest) =>
      vetroService.processServiceLocationCircuits(request),
  });
}
