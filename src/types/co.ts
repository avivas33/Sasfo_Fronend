export interface CO {
  id: number;
  ID_CO: number;
  Codigo: string | null;
  Nombre: string;
  Nombre_Proyecto: string | null;
  Nombre_Plan: string | null;
  Estado: boolean;
  isDefault: boolean;
  coordenadas1: string | null;
  coordenadas2: string | null;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
  VetroId: string | null;
}

export interface COFormData {
  Codigo?: string;
  Nombre: string;
  Nombre_Proyecto?: string;
  Nombre_Plan?: string;
  Estado: boolean;
  isDefault: boolean;
  coordenadas1?: string;
  coordenadas2?: string;
}
