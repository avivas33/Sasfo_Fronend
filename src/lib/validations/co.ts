import { z } from "zod";

export const coSchema = z.object({
  Codigo: z.string().optional(),
  Nombre: z.string().min(1, "El nombre es requerido"),
  Nombre_Proyecto: z.string().optional(),
  Nombre_Plan: z.string().optional(),
  Estado: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  coordenadas1: z.string().optional(),
  coordenadas2: z.string().optional(),
});

export type COFormValues = z.infer<typeof coSchema>;
