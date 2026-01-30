import { z } from "zod";

export const moduloSchema = z.object({
  modulo: z.string().min(1, "El código del módulo es requerido"),
  Inquilino: z.string().optional(),
  Coordenadas: z.string().optional(),
  ID_Ubicacion: z.number().min(1, "Debe seleccionar una ubicación"),
  ID_AreaDesarrollo: z.number().min(1, "Debe seleccionar un área de desarrollo"),
  Service_Location: z.string().optional(),
  ID_CO: z.number().min(0, "Debe seleccionar una compañía de enlace"),
  ID_ListaUbicaciones: z.number().min(0, "Debe seleccionar una lista de ubicaciones"),
  ID_ServiceLocation: z.number().default(0),
  Estado: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export type ModuloFormValues = z.infer<typeof moduloSchema>;
