import { z } from "zod";
import { CategoriaEmpresa } from "@/types/empresa";

export const empresaSchema = z.object({
  Nombre: z.string().min(1, "El nombre es requerido"),
  RUC: z.string().optional(),
  Direccion: z.string().optional(),
  Corregimiento: z.string().optional(),
  Distrito: z.string().optional(),
  Provincia: z.string().optional(),
  Pais: z.string().optional(),
  CategoriaEmpresaId: z.nativeEnum(CategoriaEmpresa),
  Tipo_empresa: z.string().optional(),
  Fecha_Firma_Contrato: z.string().min(1, "La fecha de firma es requerida"),
  Fecha_Vigencia_Contrato: z.string().min(1, "La fecha de vigencia es requerida"),
  ID_Carrier_Interface: z.string().optional(),
  Subir_Orden: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  Interface_No_Importar: z.boolean().default(false),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
