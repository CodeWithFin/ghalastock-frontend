import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard";
import { orgsApi } from "@/lib/api/orgs";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardApi.getSummary(),
    staleTime: 30_000,
  });
}

export function useOrg() {
  return useQuery({
    queryKey: ["org"],
    queryFn: () => orgsApi.getMe(),
    staleTime: 60_000,
  });
}

export function useUpdateOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgsApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org"] });
      toast.success("Organization updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
