export interface CircuitoVetro {
  ID_CircuitoVetro: number;
  Circuit_ID: string | null;
  CustomerName: string | null;
  Note: string | null;
  Type: string | null;
  cir_id: number;
  OTDR: number;
  OTDRLength: string | null;
  Utilizado: boolean;
  ODF: string | null;
  FTP: string | null;
  Feature_ID: number;
  PuertoODF: number;
  PuertoFTP: number;
  NodeSubIdA: number;
  NodeSubIdZ: number;
  ServiceLocation: string | null;
  isExistVetro: boolean;
  isNotUseVetro: boolean;
  VetroId: string | null;
}

export interface CircuitoVetroListResponse {
  data: CircuitoVetro[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CircuitoVetroStats {
  total: number;
  utilizados: number;
  noUtilizados: number;
  existenEnVetro: number;
  noUsadosEnVetro: number;
}

export interface CircuitoVetroFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}
