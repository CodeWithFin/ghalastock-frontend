"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/schemas/auth.schema";
import { useOrg, useUpdateOrg } from "@/lib/hooks/useDashboard";
import { useChangePassword } from "@/lib/hooks/useUsers";
import { useAuth } from "@/lib/hooks/useAuth";

export default function SettingsPage() {
  const { user, org: authOrg } = useAuth();
  const { data: org, isLoading, error, refetch } = useOrg();
  const updateOrg = useUpdateOrg();
  const changePassword = useChangePassword();

  const orgForm = useForm<{ name: string; email: string }>({
    defaultValues: {
      name: org?.name ?? authOrg?.name ?? "",
      email: org?.email ?? authOrg?.email ?? "",
    },
    values: {
      name: org?.name ?? authOrg?.name ?? "",
      email: org?.email ?? authOrg?.email ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onOrgSubmit = orgForm.handleSubmit((data) => {
    updateOrg.mutate(data);
  });

  const onPasswordSubmit = passwordForm.handleSubmit((data) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      { onSuccess: () => passwordForm.reset() }
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your organization and account"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-sm text-danger">{error.message}</p>
                <Button variant="outline" onClick={() => refetch()} className="mt-4">
                  Try again
                </Button>
              </div>
            ) : (
              <form onSubmit={onOrgSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" {...orgForm.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Contact Email</Label>
                  <Input
                    id="orgEmail"
                    type="email"
                    {...orgForm.register("email")}
                  />
                </div>
                {(org ?? authOrg) && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Plan:</span>
                    <StatusBadge variant="primary" className="capitalize">
                      {(org ?? authOrg)?.plan}
                    </StatusBadge>
                  </div>
                )}
                <Button type="submit" disabled={updateOrg.isPending}>
                  {updateOrg.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted">Signed in as</p>
              <p className="font-medium">{user?.email}</p>
              {user?.name && (
                <p className="text-sm text-muted">{user.name}</p>
              )}
            </div>

            <form onSubmit={onPasswordSubmit} className="space-y-4">
              <p className="text-sm font-medium">Change Password</p>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-danger">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-danger">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-danger">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
