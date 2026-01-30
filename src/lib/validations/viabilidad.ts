import { z } from "zod";

export const viabilidadSchema = z.object({
  // Paso 1: Tipo de Enlace
  ID_TipoEnlace: z.number().min(1, "Debe seleccionar un tipo de enlace"),
  ID_Empresa: z.number().min(1, "Debe seleccionar una empresa/carrier"),

  // Paso 2: Punto A
  adesarrolloaid: z.number().min(1, "Debe seleccionar un área de desarrollo A"),
  listaUbicacionesaId: z.number().min(1, "Debe seleccionar una ubicación A"),
  moduloaId: z.number().min(1, "Debe seleccionar un módulo A"),
  CoordenadasA: z.string().min(1, "Las coordenadas A son requeridas"),

  // Paso 3: Punto Z
  isEspecial: z.boolean().default(false),
  adesarrollozid: z.number().min(1, "Debe seleccionar un área de desarrollo Z"),
  listaUbicacioneszId: z.number().min(1, "Debe seleccionar una ubicación Z"),
  modulozId: z.number().min(1, "Debe seleccionar un módulo Z"),
  Coordenadas: z.string().min(1, "Las coordenadas Z son requeridas"),

  // Paso 4: Ruta y Conexión
  Cliente_FinalA: z.string().optional(),
  ID_Ruta: z.number().min(1, "Debe seleccionar una ruta"),
  ID_TipoConexion: z.number().min(1, "Debe seleccionar un tipo de conexión"),
  Observaciones: z.string().optional(),

  // Campos requeridos adicionales (valores por defecto para simplificar wizard)
  ContactoComercialId: z.number().default(1),
  ContactoTecnicoId: z.number().default(1),
  elementoaId: z.number().default(1),
  elementozId: z.number().default(1),
  UbicacionaId: z.number().default(1),
  UbicacionzId: z.number().default(1),
  ID_RutaUbicacion: z.number().default(1),
  // Valores para "Convertir a Viabilidad por Aprobar":
  // ID_ProcesoViabilidad: 1 = Por Aprobar (aparece en tab "Viabilidades por Aprobar")
  // ID_Proceso: 2 = En Proceso
  // ClasificacionViabilidad_Id: 3 = Viabilidad por Aprobar
  ID_ProcesoViabilidad: z.number().default(1),
  ID_Proceso: z.number().default(2),
  ClasificacionViabilidad_Id: z.number().default(3),
  document_number: z.string().min(1, "Número de documento requerido"),
});

export type ViabilidadFormValues = z.infer<typeof viabilidadSchema>;
