import { useState, useRef } from "react";
import { Box, Flex, Text, Button, Table, Badge, IconButton, Card } from "@radix-ui/themes";
import {
  Upload,
  Download,
  Trash2,
  Folder,
  File,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Home,
} from "lucide-react";
import { useFtpFiles, useUploadFile, useDownloadFile, useDeleteFile } from "@/hooks/useInterfacePropietario";
import { toast } from "sonner";

export function FtpFilesManager() {
  const [currentDirectory, setCurrentDirectory] = useState("");
  const [directoryHistory, setDirectoryHistory] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: files, isLoading, isError, error, refetch } = useFtpFiles(currentDirectory);
  const uploadMutation = useUploadFile();
  const downloadMutation = useDownloadFile();
  const deleteMutation = useDeleteFile();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadMutation.mutateAsync({ file, directory: currentDirectory });
      toast.success(`Archivo "${file.name}" subido correctamente`);
    } catch (error: any) {
      toast.error(error.message || "Error al subir archivo");
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      await downloadMutation.mutateAsync({ filename, directory: currentDirectory });
      toast.success(`Archivo "${filename}" descargado`);
    } catch (error: any) {
      toast.error(error.message || "Error al descargar archivo");
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`¿Está seguro de eliminar el archivo "${filename}"?`)) return;

    try {
      await deleteMutation.mutateAsync({ filename, directory: currentDirectory });
      toast.success(`Archivo "${filename}" eliminado`);
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar archivo");
    }
  };

  const navigateToDirectory = (dirName: string) => {
    setDirectoryHistory([...directoryHistory, currentDirectory]);
    const newPath = currentDirectory ? `${currentDirectory}/${dirName}` : dirName;
    setCurrentDirectory(newPath);
  };

  const navigateBack = () => {
    if (directoryHistory.length > 0) {
      const previousDir = directoryHistory[directoryHistory.length - 1];
      setDirectoryHistory(directoryHistory.slice(0, -1));
      setCurrentDirectory(previousDir);
    }
  };

  const navigateHome = () => {
    setDirectoryHistory([]);
    setCurrentDirectory("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "-";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box className="p-6 h-full flex flex-col">
      {/* Header con navegación y acciones */}
      <Flex justify="between" align="center" className="mb-4">
        <Flex align="center" gap="2">
          <IconButton
            variant="soft"
            size="1"
            onClick={navigateHome}
            disabled={!currentDirectory}
            title="Ir al inicio"
          >
            <Home className="w-4 h-4" />
          </IconButton>
          <IconButton
            variant="soft"
            size="1"
            onClick={navigateBack}
            disabled={directoryHistory.length === 0}
            title="Volver"
          >
            <ChevronLeft className="w-4 h-4" />
          </IconButton>
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            /{currentDirectory || ""}
          </Text>
        </Flex>

        <Flex gap="2">
          <Button variant="soft" size="2" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            size="2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Subir Archivo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </Flex>
      </Flex>

      {/* Contenido */}
      <Card className="flex-1 overflow-auto">
        {isError && (
          <Flex direction="column" align="center" justify="center" className="h-full p-8">
            <AlertCircle className="w-12 h-12 mb-4" style={{ color: "var(--red-9)" }} />
            <Text size="3" weight="medium" style={{ color: "var(--red-11)" }} className="mb-2">
              Error al cargar archivos
            </Text>
            <Text size="2" style={{ color: "var(--gray-11)" }} className="text-center mb-4">
              {error?.message || "No se pudo conectar al servidor FTP. Verifique la configuración."}
            </Text>
            <Button variant="soft" onClick={() => refetch()}>
              Reintentar
            </Button>
          </Flex>
        )}

        {isLoading && (
          <Flex align="center" justify="center" className="h-full">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--blue-9)" }} />
          </Flex>
        )}

        {!isError && !isLoading && (
          <>
            {files && files.length === 0 ? (
              <Flex direction="column" align="center" justify="center" className="h-full p-8">
                <Folder className="w-12 h-12 mb-4" style={{ color: "var(--gray-9)" }} />
                <Text size="3" weight="medium" style={{ color: "var(--gray-11)" }}>
                  Directorio vacío
                </Text>
                <Text size="2" style={{ color: "var(--gray-11)" }} className="mt-2">
                  No hay archivos en este directorio
                </Text>
              </Flex>
            ) : (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Tamaño</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {files?.map((file) => (
                    <Table.Row key={file.FullPath}>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          {file.IsDirectory ? (
                            <Folder className="w-4 h-4" style={{ color: "var(--yellow-9)" }} />
                          ) : (
                            <File className="w-4 h-4" style={{ color: "var(--blue-9)" }} />
                          )}
                          {file.IsDirectory ? (
                            <Button
                              variant="ghost"
                              size="1"
                              onClick={() => navigateToDirectory(file.Name)}
                              className="p-0 h-auto"
                            >
                              <Text size="2" weight="medium" style={{ color: "var(--blue-11)" }}>
                                {file.Name}
                              </Text>
                            </Button>
                          ) : (
                            <Text size="2">{file.Name}</Text>
                          )}
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={file.IsDirectory ? "yellow" : "blue"} variant="soft">
                          {file.IsDirectory ? "Carpeta" : "Archivo"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" style={{ color: "var(--gray-11)" }}>
                          {file.IsDirectory ? "-" : formatFileSize(file.Size)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        {!file.IsDirectory && (
                          <Flex gap="1">
                            <IconButton
                              variant="ghost"
                              size="1"
                              onClick={() => handleDownload(file.Name)}
                              disabled={downloadMutation.isPending}
                              title="Descargar"
                            >
                              <Download className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              variant="ghost"
                              size="1"
                              color="red"
                              onClick={() => handleDelete(file.Name)}
                              disabled={deleteMutation.isPending}
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </Flex>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
