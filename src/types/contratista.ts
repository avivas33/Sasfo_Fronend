export interface Contratista {
  id: number;
  ID_Empresa: number;
  Nombre: string;
  RUC?: string;
  Direccion?: string;
  Corregimiento?: string;
  Distrito?: string;
  Provincia?: string;
  Pais?: string;
  Estado: boolean;
  ID_CategoriaEmpresa?: number;
  Tipo_empresa: string;
  Fecha_Vigencia_Contrato: Date | string;
  Fecha_Firma_Contrato: Date | string;
  Fecha_Cancelacion_Contrato?: Date | string | null;
  create_uid?: string;
  create_date?: Date | string;
  write_uid?: string;
  write_date?: Date | string;
  note?: string;
}

export interface ContratistaFormData {
  Nombre: string;
  RUC?: string;
  Direccion?: string;
  Corregimiento?: string;
  Distrito?: string;
  Provincia?: string;
  Pais?: string;
  ID_CategoriaEmpresa?: number;
  Tipo_empresa: string;
  Fecha_Vigencia_Contrato: Date | string;
  Fecha_Firma_Contrato: Date | string;
  note?: string;
}

export interface ContratistasStats {
  TotalContratistas: number;
  ContratistasActivos: number;
  ContratistasInactivos: number;
  ContratosVigentes: number;
  ContratosVencidos: number;
}
