export interface AreaDesarrollo {
  id: number;
  ID_Area: number;
  Nombre: string;
  Estado: boolean;
  isDefault: boolean;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
}

export interface AreaDesarrolloFormData {
  Nombre: string;
  ID_Area?: number;
  isDefault?: boolean;
}
