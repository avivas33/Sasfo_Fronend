// Tipos para Ordenes de Servicio

export interface OrdenServicio {
  id: number;
  ID_OrdenServicio: number;
  document_number: string;
  ID_Empresa: number;
  Operador: string | null;
  Cliente_Final: string | null;
  Cliente_FinalA: string | null;
  ID_TipoEnlace: number;
  TipoEnlace: string | null;
  NRC: number;
  MRC: number;
  Fecha_Creacion: string;
  Fecha_Aprobacion: string | null;
  FechaActivacionEnlace: string;
  FechaCancelacionEnlace: string;
  ID_ProcesoViabilidad: number; // 1=Aprobada, 2=En Proceso, 3=Completado, 4=Cancelada
  ClasificacionViabilidad_Id: number;
  Status: string;
  StatusCode: number; // ID_ProcesoViabilidad: 2=En Proceso, 3=Completado, 4=Cancelada
  Enlace_Creado: boolean;
  Service_Location: string | null;
  CoordenadasA: string | null;
  Coordenadas: string | null;
  Puerto1: number;
  Puerto2: number;
  CID_P1: string | null;
  CID_P2: string | null;
  Observaciones: string | null;
  Comentarios: string | null;
}

export interface OrdenServicioDetalle extends OrdenServicio {
  ID_Viabilidad: number;
  IDViabilidadOLDTXT: string | null;
  ID_Enlace: number;
  ID_ProcesoViabilidad: number;
  ID_TipoConexion: number;
  TipoConexion: string | null;
  DireccionEmpresa: string | null;
  Distancia: number;
  Precio_AFO: number;
  Fecha_Vencimiento: string;
  // Punto A
  adesarrolloaid: number;
  AreaDesarrolloA: string | null;
  listaUbicacionesaId: number;
  UbicacionA: string | null;
  moduloaId: number;
  ModuloA: string | null;
  elementoaId: number;
  ElementoA: string | null;
  // Punto Z
  adesarrollozid: number;
  AreaDesarrolloZ: string | null;
  listaUbicacioneszId: number;
  UbicacionZ: string | null;
  modulozId: number;
  ModuloZ: string | null;
  elementozId: number;
  ElementoZ: string | null;
  // Inquilinos (desde Módulo)
  InquilinoA: string | null;
  InquilinoZ: string | null;
  // Puertos y CIDs
  PuertoODF1: number;
  PuertoODF2: number;
  // ODF y FTP
  ID_ODF: number | null;
  No_ODF: string | null;
  No_ODF2: string | null;
  No_FTP: string | null;
  No_FTP2: string | null;
  FTP_P1: string | null;
  FTP_P2: string | null;
  ODFInterno1: string | null;
  ODFInterno2: string | null;
  // Contactos
  ContactoComercialId: number;
  ContactoComercial: string | null;
  TelefonoFijo: string | null;
  TelefonoMovil: string | null;
  CorreoElectronico: string | null;
  ContactoTecnicoId: number;
  ContactoTecnico: string | null;
  // Servicio (Detalle de Servicios)
  ID_Servicio: number | null;
  Servicio: string | null;
  ID_RutaUbicacion: number | null;
  Ruta: string | null;
  // Interface
  Centro_Costo: string | null;
  Item_Interface: string | null;
  // Costo del Servicio
  Servicio_Factura: string | null;
  Costo_Servicio: number | null;
  // Otros
  isEspecial: boolean;
  create_uid: string | null;
  create_date: string;
  write_uid: string | null;
  write_date: string;
  // Técnico asignado
  Nombre_Tecnico: string | null;
}

export interface OrdenesStats {
  TotalOrdenes: number;
  EnProceso: number;
  Completadas: number;
  Canceladas: number;
  TotalMRC: number;
  TotalNRC: number;
}

export interface OrdenesFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  idEmpresa?: number;
  status?: number; // 2=En Proceso, 3=Completado, 4=Cancelada
}

export interface CancelarOrdenRequest {
  Motivo?: string;
}

export interface UpdateOrdenRequest {
  ID_ProcesoViabilidad?: number;
  ID_OrdenServicio?: number;
  IDViabilidadOLDTXT?: string;
  // Punto A
  adesarrolloaid?: number;
  listaUbicacionesaId?: number;
  moduloaId?: number;
  elementoaId?: number;
  Cliente_FinalA?: string;
  CoordenadasA?: string;
  // Punto Z
  adesarrollozid?: number;
  listaUbicacioneszId?: number;
  modulozId?: number;
  elementozId?: number;
  Cliente_Final?: string;
  Coordenadas?: string;
  // Circuitos
  CID_P1?: string;
  CID_P2?: string;
  // Puertos ODF
  Puerto1?: number;
  Puerto2?: number;
  // ODF
  No_ODF?: string;
  No_ODF2?: string;
  // FTP
  No_FTP?: string;
  No_FTP2?: string;
  FTP_P1?: string;
  FTP_P2?: string;
  // ODF Crossconnect (ODF Interno)
  ODFInterno1?: string;
  ODFInterno2?: string;
  PuertoODF1?: number;
  PuertoODF2?: number;
  // Observaciones
  Observaciones?: string;
  Comentarios?: string;
  // Interface
  Centro_Costo?: string;
  Item_Interface?: string;
  // Detalle de Servicios
  ID_TipoConexion?: number;
  ID_RutaUbicacion?: number;
  Distancia?: number;
  NRC?: number;
  MRC?: number;
  // Costo del Servicio
  Servicio_Factura?: string;
  Costo_Servicio?: number;
}

// Tipos para catálogos de Detalle de Servicios
export interface TipoConexion {
  ID_TipoConexion: number;
  Nombre: string;
}

export interface RutaUbicacion {
  id: number;
  ID_RutaUbicacion: number;
  Nombre_Ruta: string;
  MRC: number;
  NRC: number;
}

export interface TipoServicioFactura {
  ID_Servicio: number;
  Nombre: string;
}

export type OrdenStatusCode = 2 | 3 | 4;

export const OrdenStatusLabels: Record<OrdenStatusCode, string> = {
  2: 'En Proceso',
  3: 'Completado',
  4: 'Cancelada'
};

export const OrdenStatusColors: Record<OrdenStatusCode, 'yellow' | 'green' | 'red'> = {
  2: 'yellow',
  3: 'green',
  4: 'red'
};
