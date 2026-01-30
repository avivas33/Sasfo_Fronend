import { z } from "zod";

export const areaDesarrolloSchema = z.object({
  Nombre: z.string().min(1, "El nombre es requerido"),
  ID_Area: z.number().default(0),
  isDefault: z.boolean().default(false),
});

export type AreaDesarrolloFormValues = z.infer<typeof areaDesarrolloSchema>;
