import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Flex,
  Box,
  Text,
  Table,
  Button,
  Badge,
  IconButton,
  Dialog,
  TextField,
  Select,
  TextArea,
} from "@radix-ui/themes";
import { Plus, Pencil, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react";
import {
  useOtrosServiciosTRSList,
  useCreateOtrosServiciosTRS,
  useUpdateOtrosServiciosTRS,
  useDeleteOtrosServiciosTRS,
  useAprobarOtrosServiciosTRS,
  useCancelarOtrosServiciosTRS,
  useEmpresasOtrosServicios,
  useTiposServicio,
  useTiposCargo,
} from "@/hooks/useOtrosServiciosTRS";
import { OtrosServiciosTRS, OtrosServiciosTRSCreateRequest } from "@/types/otrosServiciosTRS";
import { toast } from "sonner";

const OtrosServiciosMRC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OtrosServiciosTRS | null>(null);
  const [formData, setFormData] = useState<OtrosServiciosTRSCreateRequest>({
    ID_Empresa: 0,
    TipoTrsID: 2, // RECURRENTE por defecto
    FechaTrs: new Date().toISOString().split("T")[0],
    OtrosServiciosID: 0,
    MRC: 0,
    NRC: 0,
    Observaciones: "",
  });

  const { data: items, isLoading } = useOtrosServiciosTRSList();
  const { data: empresas } = useEmpresasOtrosServicios();
  const { data: tiposServicio } = useTiposServicio();
  const { data: tiposCargo } = useTiposCargo();

  const createMutation = useCreateOtrosServiciosTRS();
  const updateMutation = useUpdateOtrosServiciosTRS();
  const deleteMutation = useDeleteOtrosServiciosTRS();
  const aprobarMutation = useAprobarOtrosServiciosTRS();
  const cancelarMutation = useCancelarOtrosServiciosTRS();

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ID_Empresa: empresas?.[0]?.id || 0,
      TipoTrsID: 2,
      FechaTrs: new Date().toISOString().split("T")[0],
      OtrosServiciosID: tiposServicio?.[0]?.id || 0,
      MRC: tiposServicio?.[0]?.MRC || 0,
      NRC: tiposServicio?.[0]?.NRC || 0,
      Observaciones: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: OtrosServiciosTRS) => {
    setEditingItem(item);
    setFormData({
      ID_Empresa: item.ID_Empresa,
      TipoTrsID: item.TipoTrsID,
      FechaTrs: new Date(item.FechaTrs).toISOString().split("T")[0],
      OtrosServiciosID: item.OtrosServiciosID,
      MRC: item.MRC,
      NRC: item.NRC,
      Observaciones: item.Observaciones || "",
    });
    setIsDialogOpen(true);
  };

  const handleTipoServicioChange = (value: string) => {
    const tipoId = parseInt(value);
    const tipo = tiposServicio?.find((t) => t.id === tipoId);
    setFormData({
      ...formData,
      OtrosServiciosID: tipoId,
      MRC: tipo?.MRC || 0,
      NRC: tipo?.NRC || 0,
    });
  };

  const handleSubmit = async () => {
    if (!formData.ID_Empresa || formData.ID_Empresa === 0) {
      toast.error("Seleccione una empresa");
      return;
    }
    if (!formData.OtrosServiciosID || formData.OtrosServiciosID === 0) {
      toast.error("Seleccione un tipo de servicio");
      return;
    }

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.ID, data: formData });
        toast.success("Registro actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Registro creado exitosamente");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error al guardar el registro");
    }
  };

  const handleAprobar = async (id: number) => {
    if (!confirm("¿Está seguro de generar el plan de pagos para este servicio?")) {
      return;
    }
    try {
      const result = await aprobarMutation.mutateAsync(id);
      toast.success(result.message);
    } catch (error) {
      toast.error("Error al generar el plan de pagos");
    }
  };

  const handleCancelar = async (id: number) => {
    if (!confirm("¿Está seguro de cancelar este servicio? Esta acción eliminará los cargos no contabilizados.")) {
      return;
    }
    try {
      const result = await cancelarMutation.mutateAsync(id);
      toast.success(result.message);
    } catch (error) {
      toast.error("Error al cancelar el servicio");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este registro?")) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Registro eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el registro");
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Flex className="h-screen w-full" style={{ backgroundColor: "var(--gray-1)" }}>
      <AppSidebar />
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Box className="border-b p-4" style={{ borderColor: "var(--gray-6)", backgroundColor: "white" }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="5" weight="bold">Otros Servicios MRC</Text>
              <Text size="2" style={{ color: "var(--gray-11)" }} className="block mt-1">
                Otros Cargos por Servicios al Operador
              </Text>
            </Box>
            <Button onClick={handleOpenCreate}>
              <Plus className="w-4 h-4" />
              Crear Nuevo
            </Button>
          </Flex>
        </Box>

        {/* Tabla */}
        <Box className="flex-1 overflow-auto p-4">
          <Box className="bg-white rounded-lg border" style={{ borderColor: "var(--gray-6)" }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                  <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>OPERADOR</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>TIPO SERVICIO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>TIPO CARGO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>NRC ($)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>MRC ($)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ACTIVACION</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CANCELACION</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ESTADO</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ACCIONES</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={10}>
                      <Flex align="center" justify="center" className="p-8">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4cb74a" }} />
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ) : !items || items.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={10}>
                      <Box className="p-8 text-center">
                        <Text size="2" style={{ color: "var(--gray-11)" }}>
                          No hay registros
                        </Text>
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  items.map((item) => (
                    <Table.Row key={item.ID}>
                      <Table.Cell>
                        <Text size="2" weight="medium">{item.ID}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.RazonSocial || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{item.TipoServicio || "-"}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={item.TipoTrsID === 1 ? "blue" : "green"} variant="soft">
                          {item.TipoTrsNombre}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatCurrency(item.NRC)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" weight="bold" style={{ color: "var(--green-11)" }}>
                          {formatCurrency(item.MRC)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatDate(item.FechaTrs)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatDate(item.FechaCancelacion)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={item.Estado ? "green" : "red"} variant="soft">
                          {item.Estado ? "Activo" : "Cancelado"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="1">
                          {item.Estado && !item.isContab && (
                            <>
                              <IconButton
                                variant="ghost"
                                size="1"
                                onClick={() => handleOpenEdit(item)}
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="1"
                                color="green"
                                onClick={() => handleAprobar(item.ID)}
                                title="Generar Plan de Pagos"
                                disabled={aprobarMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="1"
                                color="red"
                                onClick={() => handleCancelar(item.ID)}
                                title="Cancelar Servicio"
                                disabled={cancelarMutation.isPending}
                              >
                                <XCircle className="w-4 h-4" />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="1"
                                color="red"
                                onClick={() => handleDelete(item.ID)}
                                title="Eliminar"
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </IconButton>
                            </>
                          )}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </Box>

      {/* Dialog para Crear/Editar */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{editingItem ? "Editar Servicio" : "Crear Nuevo Servicio"}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Complete los campos para {editingItem ? "actualizar" : "crear"} el registro.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Operador *</Text>
              <Select.Root
                value={formData.ID_Empresa.toString()}
                onValueChange={(v) => setFormData({ ...formData, ID_Empresa: parseInt(v) })}
              >
                <Select.Trigger placeholder="Seleccionar empresa" className="w-full" />
                <Select.Content>
                  {empresas?.map((emp) => (
                    <Select.Item key={emp.id} value={emp.id.toString()}>
                      {emp.Nombre}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Tipo de Concepto *</Text>
              <Select.Root
                value={formData.TipoTrsID.toString()}
                onValueChange={(v) => setFormData({ ...formData, TipoTrsID: parseInt(v) })}
              >
                <Select.Trigger placeholder="Seleccionar tipo" className="w-full" />
                <Select.Content>
                  {tiposCargo?.map((tipo) => (
                    <Select.Item key={tipo.id} value={tipo.id.toString()}>
                      {tipo.Nombre}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Fecha Activacion *</Text>
              <TextField.Root
                type="date"
                value={formData.FechaTrs}
                onChange={(e) => setFormData({ ...formData, FechaTrs: e.target.value })}
              />
            </Box>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Tipo de Servicio *</Text>
              <Select.Root
                value={formData.OtrosServiciosID.toString()}
                onValueChange={handleTipoServicioChange}
              >
                <Select.Trigger placeholder="Seleccionar servicio" className="w-full" />
                <Select.Content>
                  {tiposServicio?.map((tipo) => (
                    <Select.Item key={tipo.id} value={tipo.id.toString()}>
                      {tipo.Nombre}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Flex gap="3">
              <Box className="flex-1">
                <Text size="2" weight="medium" className="mb-1 block">MRC ($)</Text>
                <TextField.Root
                  type="number"
                  step="0.01"
                  value={formData.MRC.toString()}
                  onChange={(e) => setFormData({ ...formData, MRC: parseFloat(e.target.value) || 0 })}
                />
              </Box>
              <Box className="flex-1">
                <Text size="2" weight="medium" className="mb-1 block">NRC ($)</Text>
                <TextField.Root
                  type="number"
                  step="0.01"
                  value={formData.NRC.toString()}
                  onChange={(e) => setFormData({ ...formData, NRC: parseFloat(e.target.value) || 0 })}
                />
              </Box>
            </Flex>

            <Box>
              <Text size="2" weight="medium" className="mb-1 block">Observaciones</Text>
              <TextArea
                value={formData.Observaciones}
                onChange={(e) => setFormData({ ...formData, Observaciones: e.target.value })}
                rows={3}
              />
            </Box>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancelar</Button>
            </Dialog.Close>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {editingItem ? "Actualizar" : "Guardar"}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default OtrosServiciosMRC;
