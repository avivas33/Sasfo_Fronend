import { z } from "zod";
import { TipoContacto } from "@/types/contacto";

export const contactoSchema = z.object({
  Nombre: z.string().min(1, "El nombre es requerido"),
  Telefono_Fijo: z.string().optional(),
  Telefono_movil: z.string().optional(),
  extension: z.number().optional().nullable(),
  correo_electronico: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),
  tipo_contacto: z.nativeEnum(TipoContacto),
  ID_Empresa: z.number().min(1, "Debe seleccionar una empresa"),
  Cedula: z.string().optional(),
  ID_Carrier_Hansa: z.string().optional(),
  ID_Carrier_Interface: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type ContactoFormValues = z.infer<typeof contactoSchema>;
