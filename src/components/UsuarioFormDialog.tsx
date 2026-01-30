import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, Flex, Box, Text, TextField, Button, Select, ScrollArea, Checkbox } from "@radix-ui/themes";
import { X } from "lucide-react";
import { Usuario, CreateUsuarioData, UpdateUsuarioData } from "@/types/usuario";
import { useCreateUsuario, useUpdateUsuario, useAvailableRoles } from "@/hooks/useUsuarios";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "sonner";

// Schema de validación para crear usuario
const createUsuarioSchema = z.object({
  email: z.string().email("El correo electrónico no es válido").min(1, "El correo es requerido"),
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirme la contraseña"),
  phoneNumber: z.string().optional(),
  organizationId: z.number().optional(),
  roles: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Schema de validación para editar usuario
const editUsuarioSchema = z.object({
  email: z.string().email("El correo electrónico no es válido").min(1, "El correo es requerido"),
  userName: z.string().min(1, "El nombre de usuario es requerido"),
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  phoneNumber: z.string().optional(),
  organizationId: z.number().optional(),
  roles: z.array(z.string()).optional(),
  lockoutEnabled: z.boolean().optional(),
});

type CreateFormValues = z.infer<typeof createUsuarioSchema>;
type EditFormValues = z.infer<typeof editUsuarioSchema>;

interface UsuarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: Usuario | null;
  mode: "create" | "edit";
}

export function UsuarioFormDialog({ open, onOpenChange, usuario, mode }: UsuarioFormDialogProps) {
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();
  const { data: rolesData } = useAvailableRoles();
  const { data: empresasData } = useEmpresas({ pageSize: 100 });

  const availableRoles = rolesData || [];
  const empresas = empresasData?.data || [];

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: {
      email: "",
      nombreCompleto: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      organizationId: 0,
      roles: [],
    },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editUsuarioSchema),
    defaultValues: {
      email: "",
      userName: "",
      nombreCompleto: "",
      phoneNumber: "",
      organizationId: 0,
      roles: [],
      lockoutEnabled: false,
    },
  });

  const form = mode === "create" ? createForm : editForm;
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = form;

  // Cargar datos cuando se edita
  useEffect(() => {
    if (mode === "edit" && usuario) {
      editForm.reset({
        email: usuario.Email,
        userName: usuario.UserName,
        nombreCompleto: usuario.NombreCompleto,
        phoneNumber: usuario.PhoneNumber || "",
        organizationId: usuario.OrganizationId,
        roles: usuario.Roles,
        lockoutEnabled: usuario.LockoutEnabled,
      });
    } else if (mode === "create") {
      createForm.reset({
        email: "",
        nombreCompleto: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        organizationId: 0,
        roles: [],
      });
    }
  }, [mode, usuario, open]);

  const onSubmitCreate = async (data: CreateFormValues) => {
    try {
      const createData: CreateUsuarioData = {
        Email: data.email,
        NombreCompleto: data.nombreCompleto,
        Password: data.password,
        PhoneNumber: data.phoneNumber,
        OrganizationId: data.organizationId || 0,
        Roles: data.roles || [],
      };
      await createMutation.mutateAsync(createData);
      toast.success("Usuario creado exitosamente");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al crear usuario");
    }
  };

  const onSubmitEdit = async (data: EditFormValues) => {
    if (!usuario) return;
    try {
      const updateData: UpdateUsuarioData = {
        Email: data.email,
        UserName: data.userName,
        NombreCompleto: data.nombreCompleto,
        PhoneNumber: data.phoneNumber,
        OrganizationId: data.organizationId || 0,
        Roles: data.roles || [],
        LockoutEnabled: data.lockoutEnabled || false,
      };
      await updateMutation.mutateAsync({ id: usuario.Id, data: updateData });
      toast.success("Usuario actualizado exitosamente");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar usuario");
    }
  };

  const selectedRoles = watch("roles") as string[] || [];

  const toggleRole = (roleName: string) => {
    const current = selectedRoles;
    const newRoles = current.includes(roleName)
      ? current.filter(r => r !== roleName)
      : [...current, roleName];
    setValue("roles", newRoles);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600, maxHeight: "90vh" }}>
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex justify="between" align="center">
            <Dialog.Title>
              {mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </Flex>

          <Dialog.Description size="2" color="gray">
            {mode === "create"
              ? "Complete el formulario para crear un nuevo usuario"
              : "Modifique los campos necesarios para actualizar el usuario"}
          </Dialog.Description>

          {/* Form */}
          <ScrollArea style={{ maxHeight: "60vh" }}>
            <form
              onSubmit={handleSubmit(mode === "create" ? onSubmitCreate : onSubmitEdit)}
              id="usuario-form"
            >
              <Flex direction="column" gap="4" style={{ padding: "0 4px" }}>
                {/* Nombre Completo */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="nombreCompleto">
                    Nombre Completo <Text color="red">*</Text>
                  </Text>
                  <TextField.Root
                    id="nombreCompleto"
                    {...register("nombreCompleto")}
                    placeholder="Nombre completo del usuario"
                    autoFocus
                  />
                  {errors.nombreCompleto && (
                    <Text size="1" color="red">
                      {errors.nombreCompleto.message as string}
                    </Text>
                  )}
                </Box>

                {/* Email */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="email">
                    Correo Electrónico <Text color="red">*</Text>
                  </Text>
                  <TextField.Root
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <Text size="1" color="red">
                      {errors.email.message as string}
                    </Text>
                  )}
                </Box>

                {/* Username (solo en edición) */}
                {mode === "edit" && (
                  <Box>
                    <Text size="2" weight="medium" as="label" htmlFor="userName">
                      Nombre de Usuario <Text color="red">*</Text>
                    </Text>
                    <TextField.Root
                      id="userName"
                      {...register("userName")}
                      placeholder="Nombre de usuario"
                    />
                    {(errors as any).userName && (
                      <Text size="1" color="red">
                        {(errors as any).userName.message}
                      </Text>
                    )}
                  </Box>
                )}

                {/* Contraseña (solo en creación) */}
                {mode === "create" && (
                  <>
                    <Box>
                      <Text size="2" weight="medium" as="label" htmlFor="password">
                        Contraseña <Text color="red">*</Text>
                      </Text>
                      <TextField.Root
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="Mínimo 6 caracteres"
                      />
                      {(errors as any).password && (
                        <Text size="1" color="red">
                          {(errors as any).password.message}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <Text size="2" weight="medium" as="label" htmlFor="confirmPassword">
                        Confirmar Contraseña <Text color="red">*</Text>
                      </Text>
                      <TextField.Root
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Repita la contraseña"
                      />
                      {(errors as any).confirmPassword && (
                        <Text size="1" color="red">
                          {(errors as any).confirmPassword.message}
                        </Text>
                      )}
                    </Box>
                  </>
                )}

                {/* Teléfono */}
                <Box>
                  <Text size="2" weight="medium" as="label" htmlFor="phoneNumber">
                    Teléfono
                  </Text>
                  <TextField.Root
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="Número de teléfono"
                  />
                </Box>

                {/* Organización */}
                <Box>
                  <Text size="2" weight="medium" as="label">
                    Organización
                  </Text>
                  <Controller
                    name="organizationId"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <Select.Trigger placeholder="Seleccione organización" style={{ width: "100%" }} />
                        <Select.Content>
                          <Select.Item value="0">Sin organización</Select.Item>
                          {empresas.map((empresa) => (
                            <Select.Item key={empresa.id} value={empresa.id.toString()}>
                              {empresa.Nombre}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </Box>

                {/* Roles */}
                <Box>
                  <Text size="2" weight="medium" className="mb-2 block">
                    Roles
                  </Text>
                  <Flex direction="column" gap="2">
                    {availableRoles.length > 0 ? (
                      availableRoles.map((role) => (
                        <label key={role.Id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <Checkbox
                            checked={selectedRoles.includes(role.Name)}
                            onCheckedChange={() => toggleRole(role.Name)}
                          />
                          <Text size="2">{role.Name}</Text>
                        </label>
                      ))
                    ) : (
                      <Text size="2" color="gray">No hay roles disponibles</Text>
                    )}
                  </Flex>
                </Box>

                {/* Lockout (solo en edición) */}
                {mode === "edit" && (
                  <Box>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <Controller
                        name="lockoutEnabled"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Text size="2">Habilitar bloqueo de cuenta</Text>
                    </label>
                  </Box>
                )}
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
            <Button
              type="submit"
              form="usuario-form"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
                <span className="animate-spin mr-2">⏳</span>
              )}
              {mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
