import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Flex, Text, TextField, Button, Card, TextArea } from "@radix-ui/themes";
import { Server, User, Lock, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useFtpConfig, useSaveFtpConfig, useTestConnection } from "@/hooks/useInterfacePropietario";
import { toast } from "sonner";

const configSchema = z.object({
  ftpUrl: z.string().min(1, "La URL del FTP es requerida"),
  ftpUsername: z.string().min(1, "El usuario es requerido"),
  ftpPassword: z.string().min(1, "La contraseña es requerida"),
  observaciones: z.string().optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export function FtpConfigForm() {
  const { data: config, isLoading: isLoadingConfig } = useFtpConfig();
  const saveMutation = useSaveFtpConfig();
  const testMutation = useTestConnection();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      ftpUrl: "",
      ftpUsername: "",
      ftpPassword: "",
      observaciones: "",
    },
  });

  // Cargar datos de configuración existente
  useEffect(() => {
    if (config) {
      reset({
        ftpUrl: config.FtpUrl || "",
        ftpUsername: config.FtpUsername || "",
        ftpPassword: config.FtpPassword || "",
        observaciones: config.Observaciones || "",
      });
    }
  }, [config, reset]);

  const onSubmit = async (data: ConfigFormValues) => {
    try {
      await saveMutation.mutateAsync({
        FtpUrl: data.ftpUrl,
        FtpUsername: data.ftpUsername,
        FtpPassword: data.ftpPassword,
        Observaciones: data.observaciones,
      });
      toast.success("Configuración guardada correctamente");
    } catch (error: any) {
      toast.error(error.message || "Error al guardar configuración");
    }
  };

  const handleTestConnection = async () => {
    const values = getValues();

    if (!values.ftpUrl || !values.ftpUsername || !values.ftpPassword) {
      toast.error("Complete todos los campos requeridos antes de probar la conexión");
      return;
    }

    setTestResult(null);

    try {
      const result = await testMutation.mutateAsync({
        FtpUrl: values.ftpUrl,
        FtpUsername: values.ftpUsername,
        FtpPassword: values.ftpPassword,
      });

      setTestResult(result);

      if (result.success) {
        toast.success("Conexión exitosa");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || "Error al probar conexión" });
      toast.error(error.message || "Error al probar conexión");
    }
  };

  if (isLoadingConfig) {
    return (
      <Flex align="center" justify="center" className="h-full">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--blue-9)" }} />
      </Flex>
    );
  }

  return (
    <Box className="p-6 max-w-2xl">
      <Text size="4" weight="bold" className="mb-4 block">
        Configuración del Sitio FTP
      </Text>
      <Text size="2" style={{ color: "var(--gray-11)" }} className="mb-6 block">
        Configure los datos de acceso al servidor FTP para la gestión de archivos.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6">
          <Flex direction="column" gap="4">
            {/* URL del FTP */}
            <Box>
              <Flex align="center" gap="2" className="mb-2">
                <Server className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
                <Text size="2" weight="medium">
                  Dirección del Sitio FTP <Text color="red">*</Text>
                </Text>
              </Flex>
              <TextField.Root
                {...register("ftpUrl")}
                placeholder="ftp://tu-sitio-ftp.com"
              />
              {errors.ftpUrl && (
                <Text size="1" color="red" className="mt-1">
                  {errors.ftpUrl.message}
                </Text>
              )}
            </Box>

            {/* Usuario */}
            <Box>
              <Flex align="center" gap="2" className="mb-2">
                <User className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
                <Text size="2" weight="medium">
                  Usuario <Text color="red">*</Text>
                </Text>
              </Flex>
              <TextField.Root
                {...register("ftpUsername")}
                placeholder="Nombre de usuario"
              />
              {errors.ftpUsername && (
                <Text size="1" color="red" className="mt-1">
                  {errors.ftpUsername.message}
                </Text>
              )}
            </Box>

            {/* Contraseña */}
            <Box>
              <Flex align="center" gap="2" className="mb-2">
                <Lock className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
                <Text size="2" weight="medium">
                  Contraseña <Text color="red">*</Text>
                </Text>
              </Flex>
              <TextField.Root
                type="password"
                {...register("ftpPassword")}
                placeholder="Contraseña"
              />
              {errors.ftpPassword && (
                <Text size="1" color="red" className="mt-1">
                  {errors.ftpPassword.message}
                </Text>
              )}
            </Box>

            {/* Observaciones */}
            <Box>
              <Flex align="center" gap="2" className="mb-2">
                <FileText className="w-4 h-4" style={{ color: "var(--gray-11)" }} />
                <Text size="2" weight="medium">
                  Observaciones
                </Text>
              </Flex>
              <TextArea
                {...register("observaciones")}
                placeholder="Notas adicionales sobre la configuración..."
                rows={3}
              />
            </Box>

            {/* Resultado del test de conexión */}
            {testResult && (
              <Box
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: testResult.success ? "var(--green-3)" : "var(--red-3)",
                }}
              >
                <Flex align="center" gap="2">
                  {testResult.success ? (
                    <CheckCircle className="w-4 h-4" style={{ color: "var(--green-11)" }} />
                  ) : (
                    <XCircle className="w-4 h-4" style={{ color: "var(--red-11)" }} />
                  )}
                  <Text
                    size="2"
                    style={{ color: testResult.success ? "var(--green-11)" : "var(--red-11)" }}
                  >
                    {testResult.message}
                  </Text>
                </Flex>
              </Box>
            )}

            {/* Botones */}
            <Flex gap="3" justify="end" className="mt-4">
              <Button
                type="button"
                variant="soft"
                onClick={handleTestConnection}
                disabled={testMutation.isPending}
              >
                {testMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Probar Conexión
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || saveMutation.isPending}
              >
                {(isSubmitting || saveMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Guardar Configuración
              </Button>
            </Flex>
          </Flex>
        </Card>
      </form>
    </Box>
  );
}
