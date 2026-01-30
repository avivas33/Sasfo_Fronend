export interface TipoConexion {
  id: number;
  ID_TipoConexion: number;
  Nombre: string;
  Descripcion: string | null;
  Estado: boolean;
  isDefault: boolean;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
}

export interface TipoConexionFormData {
  ID_TipoConexion: number;
  Nombre: string;
  Descripcion?: string;
  Estado: boolean;
  isDefault: boolean;
}

export interface PaginatedTipoConexions {
  data: TipoConexion[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TipoConexionStats {
  total: number;
  activos: number;
  inactivos: number;
  porDefecto: number;
}
