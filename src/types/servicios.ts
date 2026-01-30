export interface Servicio {
  id: number;
  ID_Servicio: number;
  Desde: number;
  Hasta: number;
  Codigo: string | null;
  Precio: number;
  Unidad_Medida: string | null;
  Estado: boolean;
  isDefault: boolean;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
}

export interface ServicioFormData {
  ID_Servicio: number;
  Desde: number;
  Hasta: number;
  Codigo?: string;
  Precio: number;
  Unidad_Medida?: string;
  Estado: boolean;
  isDefault: boolean;
}

export interface PaginatedServicios {
  data: Servicio[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ServicioStats {
  total: number;
  activos: number;
  inactivos: number;
  porDefecto: number;
}
