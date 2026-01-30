export enum CategoriaEmpresa {
  SIN_CLASIFICAR = 0,
  CARRIER = 1,
  CLIENTE = 2,
  PROVEEDOR = 3,
}

export interface Empresa {
  id: number;
  ID_Empresa: number;
  Nombre: string;
  RUC: string;
  Direccion?: string;
  Corregimiento?: string;
  Distrito?: string;
  Provincia?: string;
  Pais?: string;
  Estado: boolean;
  Interface_No_Importar?: boolean;
  ID_CategoriaEmpresa?: number;
  CategoriaEmpresaId: CategoriaEmpresa;
  Tipo_empresa: string;
  Vigencia_Contrato?: string;
  ID_Carrier_Interface?: string;
  Fecha_Vigencia_Contrato: Date;
  Fecha_Firma_Contrato: Date;
  Subir_Orden?: boolean;
  isDefault: boolean;
  Fecha_Cancelacion_Contrato?: Date | null;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
  note?: string;
}

export interface EmpresaFormData {
  Nombre: string;
  RUC: string;
  Direccion?: string;
  Corregimiento?: string;
  Distrito?: string;
  Provincia?: string;
  Pais?: string;
  Tipo_empresa: string;
  CategoriaEmpresaId: CategoriaEmpresa;
  Fecha_Vigencia_Contrato: Date;
  Fecha_Firma_Contrato: Date;
  Subir_Orden?: boolean;
}
