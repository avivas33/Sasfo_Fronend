import { z } from "zod";

export const odfSchema = z.object({
  ID_ODF: z.number().min(0, "El ID de ODF debe ser mayor o igual a 0"),
  Codigo: z.string().optional(),
  ID_Empresa: z.number().min(1, "Debe seleccionar una empresa"),
  Estado: z.boolean().default(true),
  Cantidad_Puertos: z.number().min(0, "La cantidad de puertos debe ser mayor o igual a 0"),
  NodeSubIdA: z.number().min(0, "El NodeSubIdA debe ser mayor o igual a 0"),
  NodeSubIdZ: z.number().min(0, "El NodeSubIdZ debe ser mayor o igual a 0"),
  Nombre_Empresa: z.string().min(1, "El nombre de la empresa es requerido"),
  Rack: z.string().optional(),
  IsDefault: z.boolean().default(false),
  Comments: z.string().max(800, "Los comentarios no pueden exceder 800 caracteres").optional(),
  CircuitoId: z.number().min(0, "El ID de circuito debe ser mayor o igual a 0"),
});

export type ODFFormValues = z.infer<typeof odfSchema>;
