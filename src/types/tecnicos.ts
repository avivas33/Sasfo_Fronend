export interface Tecnico {
  id: number;
  ID_Tecnico: number;
  Nombre: string;
  Cedula: string | null;
  Telefono: number;
  Extension: number;
  Celular: number;
  Email: string | null;
  Usuario: string | null;
  TipoUsuarioId: number;
  TipoUsuarioNombre: string;
  Estado: boolean;
  create_date: string;
}

export interface TecnicoCreateRequest {
  Nombre: string;
  Cedula?: string;
  Telefono: number;
  Extension: number;
  Celular: number;
  Email?: string;
  Usuario?: string;
  TipoUsuarioId: number;
}

export interface TecnicoUpdateRequest {
  Nombre: string;
  Cedula?: string;
  Telefono: number;
  Extension: number;
  Celular: number;
  Email?: string;
  Usuario?: string;
  TipoUsuarioId: number;
}

export interface TecnicosListResponse {
  data: Tecnico[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TecnicosStats {
  total: number;
  activos: number;
  inactivos: number;
  tecnicos: number;
  supervisores: number;
}

export interface TecnicosFilters {
  search?: string;
  tipoUsuario?: number;
  estado?: boolean;
  page?: number;
  pageSize?: number;
}

export interface TipoUsuario {
  id: number;
  nombre: string;
}

export const TipoUsuarioEnum = {
  USUARIO: 1,
  TECNICO: 2,
  SUPERVISOR: 3,
} as const;
