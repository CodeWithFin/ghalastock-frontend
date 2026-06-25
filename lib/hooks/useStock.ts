import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stockApi } from "@/lib/api/stock";
import type { StockInPayload, StockOutPayload } from "@/types/transaction";

export function useExpiringBatches(params: { days?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ["stock", "expiring", params],
    queryFn: () => stockApi.getExpiring(params),
    staleTime: 30_000,
  });
}

export function useRecentStockIn(limit = 10) {
  return useQuery({
    queryKey: ["stock", "in", "recent", limit],
    queryFn: () => stockApi.getRecentIn(limit),
    staleTime: 15_000,
  });
}

export function useRecentStockOut(limit = 10) {
  return useQuery({
    queryKey: ["stock", "out", "recent", limit],
    queryFn: () => stockApi.getRecentOut(limit),
    staleTime: 15_000,
  });
}

export function useStockOutPreview(lines: { itemId: string; quantity: number }[]) {
  return useQuery({
    queryKey: ["stock", "out", "preview", lines],
    queryFn: () => stockApi.previewOut(lines),
    enabled: lines.length > 0 && lines.every((l) => l.itemId && l.quantity > 0),
    staleTime: 5_000,
  });
}

export function useStockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockInPayload) => stockApi.stockIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Stock in recorded successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useStockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockOutPayload) => stockApi.stockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Stock dispatched successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
