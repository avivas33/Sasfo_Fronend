import { useState, useEffect } from "react";
import { Dialog, Flex, Box, Text, Button, Select, ScrollArea, Switch } from "@radix-ui/themes";
import { X, Shield, Loader2 } from "lucide-react";
import { useRol, useRolOperaciones, useModulos, useOpcionesMenu, useToggleOperacion } from "@/hooks/useRoles";
import { toast } from "sonner";

interface RolPermisosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rolId: string | null;
}

export function RolPermisosDialog({ open, onOpenChange, rolId }: RolPermisosDialogProps) {
  const [selectedModuloId, setSelectedModuloId] = useState<number | undefined>(undefined);
  const [selectedOpcionMenuId, setSelectedOpcionMenuId] = useState<number | undefined>(undefined);

  const { data: rol, isLoading: isLoadingRol } = useRol(rolId || undefined);
  const { data: modulos, isLoading: isLoadingModulos } = useModulos();
  const { data: opcionesMenu, isLoading: isLoadingOpciones } = useOpcionesMenu(selectedModuloId);
  const { data: operaciones, isLoading: isLoadingOperaciones } = useRolOperaciones(rolId || undefined, {
    opcionMenuId: selectedOpcionMenuId,
  });

  const toggleOperacion = useToggleOperacion();

  // Seleccionar el primer módulo por defecto
  useEffect(() => {
    if (modulos && modulos.length > 0 && !selectedModuloId) {
      setSelectedModuloId(modulos[0].ID);
    }
  }, [modulos]);

  // Seleccionar la primera opción de menú cuando cambia el módulo
  useEffect(() => {
    if (opcionesMenu && opcionesMenu.length > 0) {
      setSelectedOpcionMenuId(opcionesMenu[0].ID);
    } else {
      setSelectedOpcionMenuId(undefined);
    }
  }, [opcionesMenu, selectedModuloId]);

  const handleToggleOperacion = async (operacionId: number) => {
    if (!rolId) return;
    try {
      await toggleOperacion.mutateAsync({ roleId: rolId, operacionId });
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar permiso");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedModuloId(undefined);
      setSelectedOpcionMenuId(undefined);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content style={{ maxWidth: 700, maxHeight: "90vh" }}>
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Shield className="w-5 h-5" />
              <Dialog.Title>
                Permisos del Rol: {rol?.Name || "Cargando..."}
              </Dialog.Title>
            </Flex>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </Flex>

          <Dialog.Description size="2" color="gray">
            Configure los permisos de acceso para cada operación del sistema
          </Dialog.Description>

          {/* Filtros */}
          <Flex gap="3" wrap="wrap">
            {/* Selector de Módulo */}
            <Box style={{ flex: "1 1 200px" }}>
              <Text size="2" weight="medium" className="mb-1 block">
                Módulo
              </Text>
              <Select.Root
                value={selectedModuloId?.toString() || ""}
                onValueChange={(value) => setSelectedModuloId(parseInt(value))}
                disabled={isLoadingModulos}
              >
                <Select.Trigger placeholder="Seleccione módulo" style={{ width: "100%" }} />
                <Select.Content>
                  {modulos?.map((modulo) => (
                    <Select.Item key={modulo.ID} value={modulo.ID.toString()}>
                      {modulo.NombreModulo}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Selector de Opción de Menú */}
            <Box style={{ flex: "1 1 200px" }}>
              <Text size="2" weight="medium" className="mb-1 block">
                Opción de Menú
              </Text>
              <Select.Root
                value={selectedOpcionMenuId?.toString() || ""}
                onValueChange={(value) => setSelectedOpcionMenuId(parseInt(value))}
                disabled={isLoadingOpciones || !selectedModuloId}
              >
                <Select.Trigger placeholder="Seleccione opción" style={{ width: "100%" }} />
                <Select.Content>
                  {opcionesMenu?.map((opcion) => (
                    <Select.Item key={opcion.ID} value={opcion.ID.toString()}>
                      {opcion.NombreMenu}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>

          {/* Lista de Operaciones */}
          <Box>
            <Text size="2" weight="medium" className="mb-2 block">
              Operaciones
            </Text>
            <ScrollArea style={{ maxHeight: "40vh" }}>
              <Box className="border rounded-lg" style={{ borderColor: "var(--gray-6)" }}>
                {isLoadingOperaciones ? (
                  <Flex align="center" justify="center" className="p-8">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#4cb74a" }} />
                  </Flex>
                ) : !operaciones || operaciones.length === 0 ? (
                  <Box className="p-4 text-center">
                    <Text size="2" style={{ color: "var(--gray-11)" }}>
                      {!selectedOpcionMenuId
                        ? "Seleccione un módulo y opción de menú para ver las operaciones"
                        : "No hay operaciones disponibles para esta opción de menú"}
                    </Text>
                  </Box>
                ) : (
                  <Flex direction="column" gap="0">
                    {operaciones.map((operacion, index) => (
                      <Flex
                        key={operacion.Id}
                        align="center"
                        justify="between"
                        className="p-3"
                        style={{
                          borderBottom: index < operaciones.length - 1 ? "1px solid var(--gray-6)" : "none",
                        }}
                      >
                        <Box>
                          <Text size="2" weight="medium">
                            {operacion.NombreOperacion}
                          </Text>
                          {operacion.NombreOpcionMenu && (
                            <Text size="1" style={{ color: "var(--gray-11)", display: "block" }}>
                              {operacion.NombreOpcionMenu}
                            </Text>
                          )}
                        </Box>
                        <Switch
                          checked={operacion.Estado}
                          onCheckedChange={() => handleToggleOperacion(operacion.Id)}
                          disabled={toggleOperacion.isPending}
                        />
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Box>
            </ScrollArea>
          </Box>

          {/* Footer */}
          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cerrar
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
