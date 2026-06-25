import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { invitesApi, usersApi } from "@/lib/api/users";
import type { ChangePasswordPayload } from "@/types/auth";
import type { CreateInvitePayload, UpdateUserPayload } from "@/types/user";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 30_000,
  });
}

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: () => invitesApi.getAll(),
    staleTime: 30_000,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvitePayload) => invitesApi.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      toast.success(`Invite sent to ${variables.email}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitesApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      toast.success("Invite cancelled");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      usersApi.changePassword(payload),
    onSuccess: () => toast.success("Password updated successfully"),
    onError: (error: Error) => toast.error(error.message),
  });
}
