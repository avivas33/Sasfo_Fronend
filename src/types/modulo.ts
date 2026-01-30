export interface Modulo {
  id: number;
  ID_Modulo: number;
  modulo: string;
  Inquilino?: string;
  Coordenadas?: string;
  ID_Ubicacion: number;
  UbicacionNombre?: string;
  ID_AreaDesarrollo: number;
  AreaDesarrolloNombre?: string;
  Nombre_Ubicacion?: string;
  Estado: boolean;
  Service_Location?: string;
  ID_CO: number;
  CONombre?: string;
  ID_ListaUbicaciones: number;
  ListaUbicacionesNombre?: string;
  isDefault: boolean;
  ID_ServiceLocation: number;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
}

export interface ModuloFormData {
  modulo: string;
  Inquilino?: string;
  Coordenadas?: string;
  ID_Ubicacion: number;
  ID_AreaDesarrollo: number;
  Service_Location?: string;
  ID_CO: number;
  ID_ListaUbicaciones: number;
  ID_ServiceLocation: number;
  Estado: boolean;
  isDefault?: boolean;
}
