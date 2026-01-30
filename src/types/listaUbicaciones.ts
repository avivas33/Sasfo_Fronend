export enum TipoUbicacion {
  No_Clasificado = 1,
  Comercial = 2,
  Residencial = 3,
  Poste = 4
}

export const TipoUbicacionLabels: Record<TipoUbicacion, string> = {
  [TipoUbicacion.No_Clasificado]: "No Clasificado",
  [TipoUbicacion.Comercial]: "Comercial",
  [TipoUbicacion.Residencial]: "Residencial",
  [TipoUbicacion.Poste]: "Poste p/Cámara"
};

export interface ListaUbicacion {
  id: number;
  ID_Ubicaciones: number;
  Nombre_Ubicacion: string;
  ID_AreaDesarrollo: number;
  Estado: boolean;
  Nombre_Area: string | null;
  Tipo_UbicacionID: TipoUbicacion;
  isDefault: boolean;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
  AreaDesarrolloNombre?: string;
}

export interface ListaUbicacionFormData {
  ID_Ubicaciones: number;
  Nombre_Ubicacion: string;
  ID_AreaDesarrollo: number;
  Estado: boolean;
  Nombre_Area?: string;
  Tipo_UbicacionID: TipoUbicacion;
  isDefault: boolean;
}

export interface PaginatedListaUbicaciones {
  data: ListaUbicacion[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ListaUbicacionesStats {
  total: number;
  activas: number;
  inactivas: number;
  porDefecto: number;
}
