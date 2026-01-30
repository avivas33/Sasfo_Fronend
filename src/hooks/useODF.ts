import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { odfService } from "@/services/odf.service";
import type {
  ODF,
  ODFFormData,
  PaginatedODFs
} from "@/types/odf";

interface UseODFsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useODFs(params?: UseODFsParams) {
  return useQuery<PaginatedODFs>({
    queryKey: ["odfs", params],
    queryFn: () => odfService.getAll(params),
  });
}

export function useODF(id: number) {
  return useQuery<ODF>({
    queryKey: ["odf", id],
    queryFn: () => odfService.getById(id),
    enabled: !!id,
  });
}

export function useCreateODF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ODFFormData) => odfService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odfs"] });
      queryClient.invalidateQueries({ queryKey: ["odfStats"] });
    },
  });
}

export function useUpdateODF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ODF> }) =>
      odfService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odfs"] });
      queryClient.invalidateQueries({ queryKey: ["odf"] });
      queryClient.invalidateQueries({ queryKey: ["odfStats"] });
    },
  });
}

export function useDeleteODF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => odfService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["odfs"] });
      queryClient.invalidateQueries({ queryKey: ["odfStats"] });
    },
  });
}

export function useODFStats() {
  return useQuery({
    queryKey: ["odfStats"],
    queryFn: () => odfService.getStats(),
  });
}
