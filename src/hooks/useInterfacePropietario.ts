import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interfacePropietarioService } from '@/services/interfacePropietario.service';
import { SaveFtpConfigData } from '@/types/interfacePropietario';

// Keys para React Query
const QUERY_KEYS = {
  config: ['ftp-config'],
  files: (directory: string) => ['ftp-files', directory],
};

/**
 * Hook para obtener la configuración FTP
 */
export function useFtpConfig() {
  return useQuery({
    queryKey: QUERY_KEYS.config,
    queryFn: () => interfacePropietarioService.getConfig(),
  });
}

/**
 * Hook para guardar la configuración FTP
 */
export function useSaveFtpConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveFtpConfigData) => interfacePropietarioService.saveConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.config });
    },
  });
}

/**
 * Hook para probar la conexión FTP
 */
export function useTestConnection() {
  return useMutation({
    mutationFn: (data: SaveFtpConfigData) => interfacePropietarioService.testConnection(data),
  });
}

/**
 * Hook para listar archivos FTP
 */
export function useFtpFiles(directory: string = '') {
  return useQuery({
    queryKey: QUERY_KEYS.files(directory),
    queryFn: () => interfacePropietarioService.listFiles(directory),
    enabled: true,
    retry: 1,
  });
}

/**
 * Hook para subir archivo al FTP
 */
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, directory }: { file: File; directory?: string }) =>
      interfacePropietarioService.uploadFile(file, directory),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables.directory || '') });
    },
  });
}

/**
 * Hook para descargar archivo del FTP
 */
export function useDownloadFile() {
  return useMutation({
    mutationFn: ({ filename, directory }: { filename: string; directory?: string }) =>
      interfacePropietarioService.downloadFile(filename, directory),
    onSuccess: (blob, variables) => {
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = variables.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}

/**
 * Hook para eliminar archivo del FTP
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filename, directory }: { filename: string; directory?: string }) =>
      interfacePropietarioService.deleteFile(filename, directory),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files(variables.directory || '') });
    },
  });
}
