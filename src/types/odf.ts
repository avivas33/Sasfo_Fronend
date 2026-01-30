export interface ODF {
  Id: number;
  ID_ODF: number;
  Codigo: string | null;
  ID_Empresa: number;
  Estado: boolean;
  Cantidad_Puertos: number;
  NodeSubIdA: number;
  NodeSubIdZ: number;
  Nombre_Empresa: string;
  Rack: string | null;
  IsDefault: boolean;
  Comments: string | null;
  Create_uid?: string;
  Create_date?: Date;
  Write_uid?: string;
  Write_date?: Date;
  CircuitoId: number;
  EmpresaNombre?: string;
}

export interface ODFFormData {
  ID_ODF: number;
  Codigo?: string;
  ID_Empresa: number;
  Estado: boolean;
  Cantidad_Puertos: number;
  NodeSubIdA: number;
  NodeSubIdZ: number;
  Nombre_Empresa: string;
  Rack?: string;
  IsDefault: boolean;
  Comments?: string;
  CircuitoId: number;
}

export interface PaginatedODFs {
  data: ODF[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ODFStats {
  total: number;
  activos: number;
  inactivos: number;
  porDefecto: number;
}
