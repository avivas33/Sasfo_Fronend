export interface TipoEnlace {
  id: number;
  ID_TipoEnlace: number;
  Nombre: string;
  Descripción: string | null;
  Estado: boolean;
  IsDefault: boolean;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
}

export interface TipoEnlaceFormData {
  ID_TipoEnlace: number;
  Nombre: string;
  Descripción?: string;
  Estado: boolean;
  IsDefault: boolean;
}

export interface PaginatedTipoEnlaces {
  data: TipoEnlace[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TipoEnlaceStats {
  total: number;
  activos: number;
  inactivos: number;
  porDefecto: number;
}
