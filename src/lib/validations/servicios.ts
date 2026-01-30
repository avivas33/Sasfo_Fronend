import { z } from "zod";

export const servicioSchema = z.object({
  ID_Servicio: z.number().default(0),
  Desde: z.number().min(0, "El valor 'Desde' debe ser mayor o igual a 0"),
  Hasta: z.number().min(0, "El valor 'Hasta' debe ser mayor o igual a 0"),
  Codigo: z.string().max(50, "El código no puede exceder los 50 caracteres").optional().nullable(),
  Precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  Unidad_Medida: z.string().max(50, "La unidad de medida no puede exceder los 50 caracteres").optional().nullable(),
  Estado: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export type ServicioFormValues = z.infer<typeof servicioSchema>;
