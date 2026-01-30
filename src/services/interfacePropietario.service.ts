import {
  FtpConfig,
  SaveFtpConfigData,
  FtpFile,
  UploadResult,
  TestConnectionResult
} from '@/types/interfacePropietario';
import { API_BASE_URL, getHeaders, handleResponse } from './api';

const API_URL = `${API_BASE_URL}/api/InterfacePropietarioApi`;

export const interfacePropietarioService = {
  /**
   * Obtener configuración FTP
   */
  async getConfig(): Promise<FtpConfig> {
    const response = await fetch(`${API_URL}/config`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<FtpConfig>(response);
  },

  /**
   * Guardar configuración FTP
   */
  async saveConfig(data: SaveFtpConfigData): Promise<FtpConfig> {
    const response = await fetch(`${API_URL}/config`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<FtpConfig>(response);
  },

  /**
   * Probar conexión FTP
   */
  async testConnection(data: SaveFtpConfigData): Promise<TestConnectionResult> {
    const response = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<TestConnectionResult>(response);
  },

  /**
   * Listar archivos en un directorio FTP
   */
  async listFiles(directory: string = ''): Promise<FtpFile[]> {
    const queryParams = new URLSearchParams();
    if (directory) queryParams.append('directory', directory);

    const url = `${API_URL}/files${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<FtpFile[]>(response);
  },

  /**
   * Subir archivo al FTP
   */
  async uploadFile(file: File, directory: string = ''): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const queryParams = new URLSearchParams();
    if (directory) queryParams.append('directory', directory);

    const url = `${API_URL}/upload${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // No incluir Content-Type header, el navegador lo establece automáticamente con el boundary
    });

    return handleResponse<UploadResult>(response);
  },

  /**
   * Descargar archivo del FTP
   */
  async downloadFile(filename: string, directory: string = ''): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('filename', filename);
    if (directory) queryParams.append('directory', directory);

    const response = await fetch(`${API_URL}/download?${queryParams}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error al descargar archivo' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.blob();
  },

  /**
   * Eliminar archivo del FTP
   */
  async deleteFile(filename: string, directory: string = ''): Promise<void> {
    const queryParams = new URLSearchParams();
    if (directory) queryParams.append('directory', directory);

    const url = `${API_URL}/files/${encodeURIComponent(filename)}${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<void>(response);
  },
};
