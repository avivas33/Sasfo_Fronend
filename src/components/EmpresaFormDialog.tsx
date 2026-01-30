import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Flex, Box, Text, TextField, Button, Select, ScrollArea } from "@radix-ui/themes";
import { X } from "lucide-react";
import { empresaSchema, type EmpresaFormValues } from "@/lib/validations/empresa";
import { CategoriaEmpresa, type Empresa } from "@/types/empresa";
import { useCreateEmpresa, useUpdateEmpresa } from "@/hooks/useEmpresas";
import { toast } from "sonner";

interface EmpresaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa?: Empresa | null;
  mode: "create" | "edit";
}

export function EmpresaFormDialog({ open, onOpenChange, empresa, mode }: EmpresaFormDialogProps) {
  const createMutation = useCreateEmpresa();
  const updateMutation = useUpdateEmpresa();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      Nombre: "",
      RUC: "",
      Direccion: "",
      Corregimiento: "",
      Distrito: "",
      Provincia: "",
      Pais: "",
      CategoriaEmpresaId: CategoriaEmpresa.SIN_CLASIFICAR,
      Tipo_empresa: "",
      Fecha_Firma_Contrato: new Date().toISOString().split("T")[0],
      Fecha_Vigencia_Contrato: new Date().toISOString().split("T")[0],
      ID_Carrier_Interface: "",
      Subir_Orden: false,
      isDefault: false,
      Interface_No_Importar: false,
    },
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && empresa) {
      reset({
        Nombre: empresa.Nombre,
        RUC: empresa.RUC || "",
        Direccion: empresa.Direccion || "",
        Corregimiento: empresa.Corregimiento || "",
        Distrito: empresa.Distrito || "",
        Provincia: empresa.Provincia || "",
        Pais: empresa.Pais || "",
        CategoriaEmpresaId: empresa.CategoriaEmpresaId,
        Tipo_empresa: empresa.Tipo_empresa || "",
        Fecha_Firma_Contrato: new Date(empresa.Fecha_Firma_Contrato).toISOString().split("T")[0],
        Fecha_Vigencia_Contrato: new Date(empresa.Fecha_Vigencia_Contrato).toISOString().split("T")[0],
        ID_Carrier_Interface: empresa.ID_Carrier_Interface || "",
        Subir_Orden: empresa.Subir_Orden || false,
        isDefault: empresa.isDefault || false,
        Interface_No_Importar: empresa.Interface_No_Importar || false,
      });
    } else if (mode === "create") {
      reset({
        Nombre: "",
        RUC: "",
        Direccion: "",
        Corregimiento: "",
        Distrito: "",
        Provincia: "",
        Pais: "",
        CategoriaEmpresaId: CategoriaEmpresa.SIN_CLASIFICAR,
        Tipo_empresa: "",
        Fecha_Firma_Contrato: new Date().toISOString().split("T")[0],
        Fecha_Vigencia_Contrato: new Date().toISOString().split("T")[0],
        ID_Carrier_Interface: "",
        Subir_Orden: false,
        isDefault: false,
        Interface_No_Importar: false,
      });
    }
  }, [mode, empresa, reset]);

  const onSubmit = async (data: EmpresaFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          ...data,
          Fecha_Firma_Contrato: new Date(data.Fecha_Firma_Contrato),
          Fecha_Vigencia_Contrato: new Date(data.Fecha_Vigencia_Contrato),
        } as any);
        toast.success("Empresa creada exitosamente");
      } else if (mode === "edit" && empresa) {
        await updateMutation.mutateAsync({
          id: empresa.id,
          data: {
            ...empresa,
            ...data,
            Fecha_Firma_Contrato: new Date(data.Fecha_Firma_Contrato),
            Fecha_Vigencia_Contrato: new Date(data.Fecha_Vigencia_Contrato),
          },
        });
        toast.success("Empresa actualizada exitosamente");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(mode === "create" ? "Error al crear empresa" : "Error al actualizar empresa");
      console.error(error);
    }
  };

  const categoriaValue = watch("CategoriaEmpresaId");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 800, maxHeight: "90vh" }}>
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex justify="between" align="center">
            <Dialog.Title>
              {mode === "create" ? "Nueva Empresa" : "Editar Empresa"}
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </Flex>

          <Dialog.Description size="2" color="gray">
            {mode === "create"
              ? "Complete el formulario para crear una nueva empresa"
              : "Modifique los campos necesarios para actualizar la empresa"}
          </Dialog.Description>

          {/* Form */}
          <ScrollArea style={{ maxHeight: "60vh" }}>
            <form onSubmit={handleSubmit(onSubmit)} id="empresa-form">
              <Flex direction="column" gap="4" style={{ padding: "0 4px" }}>
                {/* Nombre */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="Nombre">
                    Nombre <Text color="red">*</Text>
                  </Text>
                  <TextField.Root
                    id="Nombre"
                    {...register("Nombre")}
                    placeholder="Nombre de la empresa"
                    autoFocus
                  />
                  {errors.Nombre && (
                    <Text size="1" color="red">
                      {errors.Nombre.message}
                    </Text>
                  )}
                </Box>

                {/* RUC */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="RUC">
                    RUC
                  </Text>
                  <TextField.Root id="RUC" {...register("RUC")} placeholder="RUC de la empresa" />
                </Box>

                {/* Dirección */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="Direccion">
                    Dirección
                  </Text>
                  <TextField.Root
                    id="Direccion"
                    {...register("Direccion")}
                    placeholder="Dirección"
                  />
                </Box>

                {/* Grid de ubicación */}
                <Flex gap="3" wrap="wrap">
                  <Box style={{ flex: "1 1 200px" }}>
                    <Text size="2" weight="medium" as="label" htmlFor="Corregimiento">
                      Corregimiento
                    </Text>
                    <TextField.Root
                      id="Corregimiento"
                      {...register("Corregimiento")}
                      placeholder="Corregimiento"
                    />
                  </Box>

                  <Box style={{ flex: "1 1 200px" }}>
                    <Text size="2" weight="medium" as="label" htmlFor="Distrito">
                      Distrito
                    </Text>
                    <TextField.Root
                      id="Distrito"
                      {...register("Distrito")}
                      placeholder="Distrito"
                    />
                  </Box>
                </Flex>

                <Flex gap="3" wrap="wrap">
                  <Box style={{ flex: "1 1 200px" }}>
                    <Text size="2" weight="medium" as="label" htmlFor="Provincia">
                      Provincia
                    </Text>
                    <TextField.Root
                      id="Provincia"
                      {...register("Provincia")}
                      placeholder="Provincia"
                    />
                  </Box>

                  <Box style={{ flex: "1 1 200px" }}>
                    <Text size="2" weight="medium" as="label" htmlFor="Pais">
                      País
                    </Text>
                    <TextField.Root id="Pais" {...register("Pais")} placeholder="País" />
                  </Box>
                </Flex>

                {/* Categoría Empresa */}
                <Box>
                  <Text size="2" weight="medium" as="label">
                    Categoría Empresa
                  </Text>
                  <Select.Root
                    value={categoriaValue?.toString()}
                    onValueChange={(value) =>
                      setValue("CategoriaEmpresaId", parseInt(value) as CategoriaEmpresa)
                    }
                  >
                    <Select.Trigger placeholder="Seleccione categoría" style={{ width: "100%" }} />
                    <Select.Content>
                      <Select.Item value={CategoriaEmpresa.SIN_CLASIFICAR.toString()}>
                        Sin Clasificar
                      </Select.Item>
                      <Select.Item value={CategoriaEmpresa.CARRIER.toString()}>
                        Carrier
                      </Select.Item>
                      <Select.Item value={CategoriaEmpresa.CLIENTE.toString()}>
                        Cliente
                      </Select.Item>
                      <Select.Item value={CategoriaEmpresa.PROVEEDOR.toString()}>
                        Proveedor
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                {/* Tipo de Empresa */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="Tipo_empresa">
                    Tipo de Empresa
                  </Text>
                  <TextField.Root
                    id="Tipo_empresa"
                    {...register("Tipo_empresa")}
                    placeholder="Tipo de empresa"
                  />
                </Box>

                {/* Fechas */}
                <Flex gap="3" wrap="wrap">
                  <Box style={{ flex: "1 1 200px" }}>
                    <Text size="2" weight="medium" as="label" htmlFor="Fecha_Firma_Contrato">
                      Fecha Firma Contrato <Text color="red">*</Text>
                    </Text>
                    <TextField.Root
                      id="Fecha_Firma_Contrato"
                      type="date"
                      {...register("Fecha_Firma_Contrato")}
                    />
                    {errors.Fecha_Firma_Contrato && (
                      <Text size="1" color="red">
                        {errors.Fecha_Firma_Contrato.message}
                      </Text>
                    )}
                  </Box>

                  <Box style={{ flex: "1 1 200px" }}>
                    <Text size="2" weight="medium" as="label" htmlFor="Fecha_Vigencia_Contrato">
                      Fecha Vigencia Contrato <Text color="red">*</Text>
                    </Text>
                    <TextField.Root
                      id="Fecha_Vigencia_Contrato"
                      type="date"
                      {...register("Fecha_Vigencia_Contrato")}
                    />
                    {errors.Fecha_Vigencia_Contrato && (
                      <Text size="1" color="red">
                        {errors.Fecha_Vigencia_Contrato.message}
                      </Text>
                    )}
                  </Box>
                </Flex>

                {/* ID Carrier Interface (solo en edición) */}
                {mode === "edit" && (
                  <Box>
                    <Text size="2" weight="medium" as="label" htmlFor="ID_Carrier_Interface">
                      ID Carrier Interface
                    </Text>
                    <TextField.Root
                      id="ID_Carrier_Interface"
                      {...register("ID_Carrier_Interface")}
                      placeholder="ID Carrier"
                    />
                  </Box>
                )}

                {/* Checkboxes */}
                <Flex direction="column" gap="2">
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" {...register("Subir_Orden")} />
                    <Text size="2">Subir Orden</Text>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" {...register("isDefault")} />
                    <Text size="2">Adjuntar Documentos</Text>
                  </label>

                  {mode === "edit" && (
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input type="checkbox" {...register("Interface_No_Importar")} />
                      <Text size="2">Interface: No Importar</Text>
                    </label>
                  )}
                </Flex>
              </Flex>
            </form>
          </ScrollArea>

          {/* Footer */}
          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Dialog.Close>
            <Button type="submit" form="empresa-form" disabled={isSubmitting} loading={isSubmitting}>
              {mode === "create" ? "Crear Empresa" : "Guardar Cambios"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
