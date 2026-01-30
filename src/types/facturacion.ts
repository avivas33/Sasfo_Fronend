// Enlace pendiente de facturación
export interface EnlaceFactura {
  ID_Enlace: number;
  Carrier: string | null;
  Cliente: string | null;
  Fecha_Cargo: Date | string;
  Fecha_Contabilizado?: Date | string | null;
  Servicio: string | null;
  Tipo: string | null;
  Tipo_Cargo: string | null;
  Venta_Importe: number;
  Costo_Importe: number;
  No_Enlace: number;
  Contabilizado: boolean;
  Facturado: boolean;
}

// Elemento agrupado para facturar
export interface ElementoFactura {
  Carrier: string;
  Cantidad_Enlace: number;
  Total_Facturar: number;
  selected?: boolean;
}

// Factura en historial
export interface FacturaHistorial {
  Id: number;
  No_Factura: number;
  Nombre_cliente: string | null;
  RUC_Cliente: string | null;
  Fecha_Factura: Date | string;
  Total: number;
}

// Estadísticas de facturación
export interface FacturacionStats {
  PendientesContabilizar: number;
  Contabilizados: number;
  Facturados: number;
  TotalFacturas: number;
  MontoTotalPendiente: number;
}

// Request para contabilizar
export interface ContabilizarRequest {
  Ids: number[];
}

// Request para facturar
export interface FacturarRequest {
  Empresas: string[];
  FechaDesde?: Date | string;
  FechaHasta?: Date | string;
}

// Request para actualizar enlace
export interface ActualizarEnlaceRequest {
  Venta_Importe?: number;
  Costo_Importe?: number;
}

// Filtros de búsqueda
export interface FiltrosFacturacion {
  empresa?: string;
  fechaDesde?: Date | string;
  fechaHasta?: Date | string;
  page?: number;
  pageSize?: number;
}

// Detalle completo de factura
export interface FacturaDetalle {
  Id: number;
  No_Factura: number;
  Nombre_cliente: string | null;
  RUC_Cliente: string | null;
  Direccion: string | null;
  Corregimiento: string | null;
  Distrito: string | null;
  Provincia: string | null;
  Pais: string | null;
  Fecha_Factura: Date | string;
  Detalles: DetalleFacturaItem[];
  Subtotal: number;
  Total: number;
  EsReimpresion?: boolean;
}

// Item de detalle de factura
export interface DetalleFacturaItem {
  Id: number;
  Cliente: string | null;
  Servicio: string | null;
  Tipo: string | null;
  Tipo_Cargo: string | null;
  No_Orden: number | null;
  MRC_Venta: number;
}
