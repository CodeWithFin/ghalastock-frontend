"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/components/users/UsersTable";
import { InviteUserDialog } from "@/components/users/InviteUserDialog";
import { useUsers, useInvites, useCancelInvite } from "@/lib/hooks/useUsers";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatDate } from "@/lib/utils/format";
import { UserPlus, Mail } from "lucide-react";

export default function UsersPage() {
  const { isAdmin, user } = useAuth();
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: users = [], isLoading, error, refetch } = useUsers();
  const { data: invites = [], isLoading: invitesLoading } = useInvites();
  const cancelInvite = useCancelInvite();

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Manage users and invitations"
      >
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </PageHeader>

      <section>
        <h2 className="mb-4 text-lg font-medium">Members</h2>
        <UsersTable
          users={users}
          loading={isLoading}
          error={error}
          onRetry={() => refetch()}
          currentUserId={user?.id}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Pending Invites</h2>
        {invitesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : invites.length === 0 ? (
          <p className="text-sm text-muted">No pending invitations.</p>
        ) : (
          <div className="space-y-2">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface-raised px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted" />
                  <div>
                    <p className="text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-muted capitalize">
                      {invite.role} · Expires {formatDate(invite.expiresAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelInvite.mutate(invite.id)}
                  disabled={cancelInvite.isPending}
                >
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
