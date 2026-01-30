import { z } from "zod";

export const otroServicioSchema = z.object({
  Nombre: z.string().min(1, "El nombre es requerido"),
  Observaciones: z.string().optional(),
  MRC: z.number().min(0, "El MRC debe ser mayor o igual a 0"),
  NRC: z.number().min(0, "El NRC debe ser mayor o igual a 0"),
  Estado: z.boolean().default(true),
});

export type OtroServicioFormValues = z.infer<typeof otroServicioSchema>;
