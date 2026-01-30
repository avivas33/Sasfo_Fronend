import { z } from "zod";
import { TipoUbicacion } from "@/types/listaUbicaciones";

export const listaUbicacionSchema = z.object({
  ID_Ubicaciones: z.number().min(0, "El ID de ubicaciones debe ser mayor o igual a 0"),
  Nombre_Ubicacion: z.string().min(1, "El nombre de la ubicación es requerido"),
  ID_AreaDesarrollo: z.number().min(1, "Debe seleccionar un área de desarrollo"),
  Estado: z.boolean().default(true),
  Nombre_Area: z.string().optional(),
  Tipo_UbicacionID: z.nativeEnum(TipoUbicacion, {
    errorMap: () => ({ message: "Debe seleccionar un tipo de ubicación válido" })
  }),
  isDefault: z.boolean().default(false),
});

export type ListaUbicacionFormValues = z.infer<typeof listaUbicacionSchema>;
