import { z } from "zod";

export const tipoConexionSchema = z.object({
  ID_TipoConexion: z.number().default(0),
  Nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  Descripcion: z
    .string()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .optional()
    .nullable(),
  Estado: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export type TipoConexionFormValues = z.infer<typeof tipoConexionSchema>;
