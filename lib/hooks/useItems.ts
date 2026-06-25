import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemsApi } from "@/lib/api/items";
import type { BatchCreateItem, CreateItemPayload, ItemFilters, UpdateItemPayload } from "@/types/item";

export function useItems(filters: ItemFilters = {}) {
  return useQuery({
    queryKey: ["items", filters],
    queryFn: () => itemsApi.getAll(filters),
    staleTime: 30_000,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["items", "categories"],
    queryFn: () => itemsApi.getCategories(),
    staleTime: 60_000,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemPayload) => itemsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCreateBatchItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: BatchCreateItem[]) => itemsApi.createBatch(items),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success(`${data.length} items added successfully`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateItemPayload }) =>
      itemsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
