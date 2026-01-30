export interface OtroServicio {
  id: number;
  Nombre: string;
  Observaciones: string | null;
  MRC: number;
  NRC: number;
  Estado: boolean;
  create_uid: string | null;
  create_date: string;
  write_uid: string | null;
  write_date: string;
}

export interface OtroServicioFormData {
  Nombre: string;
  Observaciones?: string;
  MRC: number;
  NRC: number;
  Estado: boolean;
}

export interface PaginatedOtrosServicios {
  data: OtroServicio[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface OtroServicioStats {
  total: number;
  activos: number;
  inactivos: number;
}
