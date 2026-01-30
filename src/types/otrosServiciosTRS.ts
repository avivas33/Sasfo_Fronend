// Tipos para OtrosServiciosTRS

export interface OtrosServiciosTRS {
  ID: number;
  ID_Empresa: number;
  RazonSocial: string | null;
  TipoServicio: string | null;
  OtrosServiciosID: number;
  TipoTrsID: number;
  TipoTrsNombre: string | null;
  NRC: number;
  MRC: number;
  FechaTrs: Date | string;
  FechaCancelacion: Date | string | null;
  Observaciones: string | null;
  Estado: boolean;
  isContab: boolean;
}

export interface OtrosServiciosTRSCreateRequest {
  ID_Empresa: number;
  TipoTrsID: number;
  FechaTrs: string;
  OtrosServiciosID: number;
  MRC: number;
  NRC: number;
  Observaciones?: string;
}

export interface OtrosServiciosTRSUpdateRequest {
  ID_Empresa: number;
  TipoTrsID: number;
  FechaTrs: string;
  OtrosServiciosID: number;
  MRC: number;
  NRC: number;
  Observaciones?: string;
}

export interface EmpresaSelect {
  id: number;
  Nombre: string;
}

export interface TipoServicio {
  id: number;
  Nombre: string;
  MRC: number;
  NRC: number;
}

export interface TipoCargo {
  id: number;
  Nombre: string;
}

// Enum para tipos de cargo
export enum TipoCargos {
  FIJO = 1,
  RECURRENTE = 2
}
