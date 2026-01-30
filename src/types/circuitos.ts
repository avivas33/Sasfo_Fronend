export interface Circuito {
  ID_CircuitosSLPE: number;
  CircuitID: string | null;
  Circuiot_ID: number;
  ID_ServiceLocation: number;
  ServiceLocation: string | null;
  Coordenadas1: string | null;
  Coordenadas2: string | null;
  Estado: boolean;
  Inquilino: string | null;
  ID_AreaDesarrollo: number;
  AreaDesarrollo: string | null;
  ID_ListaUbicaciones: number;
  ListaUbicacion: string | null;
  VetroId: string | null;
  create_uid: string | null;
  create_date: string;
  write_uid: string | null;
  write_date: string;
}

export interface CircuitoFormData {
  CircuitID: string;
  Circuiot_ID: number;
  ID_ServiceLocation: number;
  ServiceLocation?: string;
  Coordenadas1?: string;
  Coordenadas2?: string;
  Estado: boolean;
  Inquilino?: string;
  ID_AreaDesarrollo: number;
  ID_ListaUbicaciones: number;
  VetroId?: string;
}

export interface PaginatedCircuitos {
  data: Circuito[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CircuitoStats {
  total: number;
  activos: number;
  inactivos: number;
}
