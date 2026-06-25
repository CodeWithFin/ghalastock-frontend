import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { shopsApi } from "@/lib/api/shops";
import type { CreateShopPayload, UpdateShopPayload } from "@/types/shop";

export function useShops() {
  return useQuery({
    queryKey: ["shops"],
    queryFn: () => shopsApi.getAll(),
    staleTime: 60_000,
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShopPayload) => shopsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShopPayload }) =>
      shopsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shopsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
