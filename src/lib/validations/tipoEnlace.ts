import { z } from "zod";

export const tipoEnlaceSchema = z.object({
  ID_TipoEnlace: z.number().default(0),
  Nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  Descripción: z
    .string()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .optional()
    .nullable(),
  Estado: z.boolean().default(true),
  IsDefault: z.boolean().default(false),
});

export type TipoEnlaceFormValues = z.infer<typeof tipoEnlaceSchema>;
