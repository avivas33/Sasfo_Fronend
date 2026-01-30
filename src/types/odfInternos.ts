export interface ODFInterno {
  ID_CircuitoVetro: number;
  Circuit_ID: string | null;
  CustomerName: string | null;
  Type: string | null;
  ODF: string | null;
  FTP: string | null;
  PuertoODF: number;
  PuertoFTP: number;
  NodeSubIdA: number;
  NodeSubIdZ: number;
  ServiceLocation: string | null;
  OTDR: number;
  OTDRLength: string | null;
  Utilizado: boolean;
  isExistVetro: boolean;
  VetroId: string | null;
}

export interface ODFInternosListResponse {
  data: ODFInterno[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ODFInternosStats {
  total: number;
  utilizados: number;
  disponibles: number;
  odfsUnicos: number;
  serviceLocationsUnicos: number;
}

export interface ODFInternosFilters {
  search?: string;
  odf?: string;
  serviceLocation?: string;
  page?: number;
  pageSize?: number;
}
