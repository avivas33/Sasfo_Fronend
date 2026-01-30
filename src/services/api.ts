// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5147';

// Configuración de headers
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('sasfo_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
    // Crear un error con detalles adicionales
    const error = new Error(errorData.error || `HTTP error! status: ${response.status}`) as Error & {
      details?: string;
      innerError?: string;
    };
    error.details = errorData.details;
    error.innerError = errorData.innerError;
    throw error;
  }

  // Si es 204 No Content, retornar objeto vacío
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Helper para manejar errores
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
}

// Exportar la URL base para uso en otros servicios
export { API_BASE_URL, getHeaders, handleResponse };
