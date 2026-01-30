import { z } from "zod";

export const p2pSchema = z.object({
  NombrePto1: z.string().min(1, "El nombre del Punto 1 es requerido"),
  NombrePto2: z.string().min(1, "El nombre del Punto 2 es requerido"),
  Punto1: z.number().min(0, "El ID del Punto 1 es requerido"),
  Punto2: z.number().min(0, "El ID del Punto 2 es requerido"),
  Observaciones: z.string().optional(),
  Estado: z.number().optional().default(1),
  TipoP2P: z.number().optional().default(0),
});

export type P2PFormValues = z.infer<typeof p2pSchema>;
