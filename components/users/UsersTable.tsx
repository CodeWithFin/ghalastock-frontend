"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoleBadge } from "@/components/users/UserRoleBadge";
import { useUpdateUser } from "@/lib/hooks/useUsers";
import { formatDate } from "@/lib/utils/format";
import type { User } from "@/types/auth";
import { Users } from "lucide-react";

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  currentUserId?: string;
}

export function UsersTable({
  users,
  loading,
  error,
  onRetry,
  currentUserId,
}: UsersTableProps) {
  const updateUser = useUpdateUser();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = (userId: string, role: User["role"]) => {
    setUpdatingId(userId);
    updateUser.mutate(
      { id: userId, payload: { role } },
      { onSettled: () => setUpdatingId(null) }
    );
  };

  const handleToggleActive = (user: User) => {
    setUpdatingId(user.id);
    updateUser.mutate(
      { id: user.id, payload: { isActive: !user.isActive } },
      { onSettled: () => setUpdatingId(null) }
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-panel">
        <p className="text-sm text-danger">{error.message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No team members"
        description="Invite colleagues to collaborate on inventory management."
        icon={<Users className="h-8 w-8" />}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-landing-border bg-surface-hover">
              <th className="px-4 py-3 text-left font-medium text-muted">User</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Role</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const isPending = updatingId === user.id;

              return (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.name ?? user.email}</p>
                    {user.name && (
                      <p className="text-xs text-muted">{user.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <UserRoleBadge role={user.role} />
                    ) : (
                      <Select
                        value={user.role}
                        onValueChange={(v) =>
                          handleRoleChange(user.id, v as User["role"])
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={
                        user.isActive
                          ? "inline-flex items-center rounded-md border border-green-800/50 bg-green-950/40 px-2 py-0.5 text-xs font-medium text-green-400"
                          : "inline-flex items-center rounded-md border border-landing-border bg-surface-hover px-2 py-0.5 text-xs font-medium text-landing-muted"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {!isSelf && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user)}
                        disabled={isPending}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{user.name ?? user.email}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
              <UserRoleBadge role={user.role} />
            </div>
            <p className="mt-2 text-xs text-muted">
              Joined {formatDate(user.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
