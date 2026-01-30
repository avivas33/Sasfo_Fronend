export interface RutaUbicacion {
  id: number;
  ID_RutaUbicacion: number;
  Nombre_Ruta: string;
  Tipo_Conexion?: string;
  Centro_Costo?: string;
  Item_Interface?: string;
  MRC: number;
  NRC: number;
  Distancia: number;
  Estado: boolean;
  ID_Ubicacion: number;
  isDefault: boolean;
}

export interface PaginatedRutasUbicacion {
  data: RutaUbicacion[];
  totalCount: number;
}
