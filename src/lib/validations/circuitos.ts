import { z } from "zod";

export const circuitoSchema = z.object({
  CircuitID: z.string().min(1, "El código de circuito es requerido"),
  Circuiot_ID: z.number().min(0, "El ID de circuito Vetro debe ser mayor o igual a 0").default(0),
  ID_ServiceLocation: z.number().min(0, "El ID de Service Location debe ser mayor o igual a 0").default(0),
  ServiceLocation: z.string().optional(),
  Coordenadas1: z.string().optional(),
  Coordenadas2: z.string().optional(),
  Estado: z.boolean().default(true),
  Inquilino: z.string().optional(),
  ID_AreaDesarrollo: z.number().min(1, "Debe seleccionar un área de desarrollo"),
  ID_ListaUbicaciones: z.number().min(1, "Debe seleccionar una ubicación"),
  VetroId: z.string().optional(),
});

export type CircuitoFormValues = z.infer<typeof circuitoSchema>;
