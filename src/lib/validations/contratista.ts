import { z } from "zod";

export const contratistaSchema = z.object({
  Nombre: z.string().min(1, "La razón social es requerida"),
  RUC: z.string().optional(),
  Direccion: z.string().optional(),
  Corregimiento: z.string().optional(),
  Distrito: z.string().optional(),
  Provincia: z.string().optional(),
  Pais: z.string().optional(),
  Tipo_empresa: z.string().default("CONTRATISTA"),
  Fecha_Firma_Contrato: z.string().min(1, "La fecha de firma es requerida"),
  Fecha_Vigencia_Contrato: z.string().min(1, "La fecha de vigencia es requerida"),
  note: z.string().optional(),
});

export type ContratistaFormValues = z.infer<typeof contratistaSchema>;
