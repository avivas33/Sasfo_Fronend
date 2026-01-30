export interface Viabilidad {
  id: number;
  ID_Viabilidad: number;

  // Paso 1: Tipo de Enlace
  ID_TipoEnlace: number;
  TipoEnlaceNombre?: string;
  ID_Empresa: number;
  EmpresaNombre?: string;

  // Paso 2: Punto A
  adesarrolloaid: number;
  AreaDesarrolloANombre?: string;
  listaUbicacionesaId: number;
  UbicacionANombre?: string;
  moduloaId: number;
  ModuloANombre?: string;
  CoordenadasA: string;

  // Paso 3: Punto Z
  isEspecial: boolean;
  adesarrollozid: number;
  AreaDesarrolloZNombre?: string;
  listaUbicacioneszId: number;
  UbicacionZNombre?: string;
  modulozId: number;
  ModuloZNombre?: string;
  Coordenadas: string;

  // Paso 4: Ruta y Conexión
  Cliente_FinalA?: string;
  Cliente_Final?: string;
  ID_Ruta: number;
  RutaNombre?: string;
  ID_TipoConexion: number;
  TipoConexionNombre?: string;
  Observaciones?: string;

  // Información adicional
  Fecha_Creacion: Date | string;
  Fecha_Vencimiento: Date | string;
  Fecha_Aprobacion?: Date | string | null;
  MRC: number;
  NRC: number;

  // Contactos
  ContactoComercialId: number;
  ContactoComercialNombre?: string;
  ContactoTecnicoId: number;
  ContactoTecnicoNombre?: string;

  // ODF y Puertos
  ID_ODF?: number | null;
  ODFNombre?: string;
  Puerto1: number;
  Puerto2: number;

  // Service Location
  Service_Location?: string;
  CID_P1?: string;
  CID_P2?: string;
  No_FTP?: string;
  FTP_P1?: string;
  FTP_P2?: string;

  // Distancia y Servicio
  Distancia: number;
  ID_Servicio?: number | null;
  ServicioNombre?: string;
  Precio_AFO: number;
  Enlace_Creado: boolean;

  // Elementos y Ubicaciones
  elementoaId: number;
  ElementoANombre?: string;
  elementozId: number;
  ElementoZNombre?: string;
  UbicacionaId: number;
  UbicacionzId: number;
  ID_RutaUbicacion: number;

  // Procesos
  ID_ProcesoViabilidad: number;
  ProcesoViabilidadNombre?: string;
  ID_Proceso: number;
  ProcesoNombre?: string;
  ClasificacionViabilidad_Id: number;
  ClasificacionNombre?: string;

  // Documento
  document_number: string;

  // Comentarios
  Comentarios?: string;

  // Auditoría
  create_uid?: string;
  create_date: Date | string;
  write_uid?: string;
  write_date: Date | string;

  // Campos adicionales
  ID_OrdenServicio: number;
  FechaActivacionEnlace?: Date | string;
  FechaCancelacionEnlace?: Date | string;
  ID_Proceso_Enlace: number;
  Centro_Costo?: string;
  Item_Interface?: string;
}

export interface ViabilidadFormData {
  // Paso 1
  ID_TipoEnlace: number;
  ID_Empresa: number;

  // Paso 2
  adesarrolloaid: number;
  listaUbicacionesaId: number;
  moduloaId: number;
  CoordenadasA: string;

  // Paso 3
  isEspecial: boolean;
  adesarrollozid: number;
  listaUbicacioneszId: number;
  modulozId: number;
  Coordenadas: string;

  // Paso 4
  Cliente_FinalA?: string;
  ID_Ruta: number;
  ID_TipoConexion: number;
  Observaciones?: string;

  // Requeridos por el sistema
  ContactoComercialId: number;
  ContactoTecnicoId: number;
  elementoaId: number;
  elementozId: number;
  UbicacionaId: number;
  UbicacionzId: number;
  ID_RutaUbicacion: number;
  ID_ProcesoViabilidad: number;
  ID_Proceso: number;
  ClasificacionViabilidad_Id: number;
  document_number: string;

  // Campos para P2P (cuando viene desde wizard de P2P)
  Elemento_A?: number;  // ID del P2P
  CID_P1?: string;      // "Punto1" o "Punto2"
}

export interface ViabilidadStats {
  TotalViabilidades: number;
  ViabilidadesPendientes: number;
  ViabilidadesAprobadas: number;
  ViabilidadesRechazadas: number;
  ViabilidadesVencidas: number;
}

export enum EstadoViabilidad {
  Pendiente = 1,
  Aprobada = 2,
  Rechazada = 3,
  EnProceso = 4,
  Completada = 5
}

export const EstadoViabilidadLabels = {
  [EstadoViabilidad.Pendiente]: "Pendiente",
  [EstadoViabilidad.Aprobada]: "Aprobada",
  [EstadoViabilidad.Rechazada]: "Rechazada",
  [EstadoViabilidad.EnProceso]: "En Proceso",
  [EstadoViabilidad.Completada]: "Completada",
};
