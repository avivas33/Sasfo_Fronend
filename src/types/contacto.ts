export enum TipoContacto {
  COMERCIAL = 1,
  TECNICO = 2,
  SIN_CLASIFICAR = 3,
  CONTRATISTA = 4,
}

export const TipoContactoLabels = {
  [TipoContacto.COMERCIAL]: "Comercial",
  [TipoContacto.TECNICO]: "Técnico",
  [TipoContacto.SIN_CLASIFICAR]: "Sin Clasificar",
  [TipoContacto.CONTRATISTA]: "Contratista",
};

export interface Contacto {
  id: number;
  ID_Contacto: number;
  Nombre: string;
  Telefono_Fijo?: string;
  Telefono_movil?: string;
  extension?: number;
  correo_electronico?: string;
  tipo_contacto: TipoContacto;
  ID_Empresa: number;
  EmpresaNombre?: string;
  Estado: boolean;
  Cedula?: string;
  ID_Carrier_Hansa?: string;
  ID_Carrier_Interface?: string;
  isDefault: boolean;
  create_uid?: string;
  create_date?: Date;
  write_uid?: string;
  write_date?: Date;
}

export interface ContactoFormData {
  Nombre: string;
  Telefono_Fijo?: string;
  Telefono_movil?: string;
  extension?: number;
  correo_electronico?: string;
  tipo_contacto: TipoContacto;
  ID_Empresa: number;
  Cedula?: string;
  ID_Carrier_Hansa?: string;
  ID_Carrier_Interface?: string;
  isDefault?: boolean;
}
