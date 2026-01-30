export interface Enlace {
  ID_Enlace: number;
  Fecha_Activacion: string | null;
  Area_DesarrolloA: string | null;
  Area_DesarrolloZ: string | null;
  SitioA: string | null;
  SitioZ: string | null;
  CoordenadasA: string | null;
  CoordenadasZ: string | null;
  Cliente: string | null;
  Modulo: string | null;
  Service_Location: string | null;
  CID_P1: string | null;
  CID_P2: string | null;
  ODF: string | null;
  ODFP1: number;
  ODFP2: number;
  FTP: string | null;
  FTPP1: string | null;
  FTPP2: string | null;
  DistanciaP1: number;
  DistanciaP2: number;
  Servicio: string | null;
  Tipo: string | null;
  Ruta: string | null;
  MRC_Venta: number;
  Estado: boolean;
  Fecha_Desactivacion: string | null;
  Carrier: string | null;
  Codigo_AFO: string | null;
  MRC_Costo: number;
  Fecha_Desde: string | null;
  Fecha_Hasta: string | null;
  Aprob_Cont: boolean;
  ID_Viabilidad: number;
  ID_EstadoEnlace: number;
  ID_OrdenServicio: number;
}

export interface EnlaceFormData {
  Fecha_Activacion?: string;
  Area_DesarrolloA?: string;
  Area_DesarrolloZ?: string;
  SitioA?: string;
  SitioZ?: string;
  CoordenadasA?: string;
  CoordenadasZ?: string;
  Cliente: string;
  Modulo?: string;
  Service_Location?: string;
  CID_P1?: string;
  CID_P2?: string;
  ODF?: string;
  ODFP1: number;
  ODFP2: number;
  FTP?: string;
  FTPP1?: string;
  FTPP2?: string;
  DistanciaP1: number;
  DistanciaP2: number;
  Servicio?: string;
  Tipo?: string;
  Ruta?: string;
  MRC_Venta: number;
  Estado: boolean;
  Carrier?: string;
  Codigo_AFO?: string;
  MRC_Costo: number;
  ID_Viabilidad: number;
  ID_EstadoEnlace: number;
  ID_OrdenServicio: number;
}

export interface PaginatedEnlaces {
  data: Enlace[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface EnlaceStats {
  total: number;
  activos: number;
  inactivos: number;
}
