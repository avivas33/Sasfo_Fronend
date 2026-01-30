// Estados de P2P
export enum EstadoP2P {
  Proceso = 1,
  Aprobado = 2,
  Completado = 3,
  Cancelado = 4
}

export const EstadoP2PLabels: Record<EstadoP2P, string> = {
  [EstadoP2P.Proceso]: "En Proceso",
  [EstadoP2P.Aprobado]: "Aprobada",
  [EstadoP2P.Completado]: "Completada",
  [EstadoP2P.Cancelado]: "Cancelada",
};

export const EstadoP2PColors: Record<EstadoP2P, "blue" | "green" | "amber" | "red"> = {
  [EstadoP2P.Proceso]: "blue",
  [EstadoP2P.Aprobado]: "amber",
  [EstadoP2P.Completado]: "green",
  [EstadoP2P.Cancelado]: "red",
};

// Interfaz principal de P2P
export interface P2P {
  ID_P2P: number;
  NombrePto1: string;
  NombrePto2: string;
  Punto1: number;
  Punto2: number;
  Observaciones?: string;
  Estado: EstadoP2P;
  TipoP2P: number;
  create_date: Date | string;
  // Campos adicionales del ViewModel
  Orden1?: number;
  Orden2?: number;
}

// Datos para crear/editar P2P
export interface P2PFormData {
  NombrePto1: string;
  NombrePto2: string;
  Punto1: number;
  Punto2: number;
  Observaciones?: string;
  Estado?: EstadoP2P;
  TipoP2P?: number;
}

// Estadísticas de P2P
export interface P2PStats {
  TotalP2P: number;
  EnProceso: number;
  Aprobadas: number;
  Completadas: number;
  Canceladas: number;
}
