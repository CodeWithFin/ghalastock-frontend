"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Store } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useShops,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
} from "@/lib/hooks/useShops";
import { shopSchema, type ShopFormData } from "@/lib/schemas/shop.schema";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Shop } from "@/types/shop";

export default function ShopsPage() {
  const { isViewer } = useAuth();
  const { data: shops = [], isLoading, error, refetch } = useShops();
  const createShop = useCreateShop();
  const updateShop = useUpdateShop();
  const deleteShop = useDeleteShop();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editShop, setEditShop] = useState<Shop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shop | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
  });

  const openCreate = () => {
    setEditShop(null);
    reset({ name: "", location: "" });
    setDialogOpen(true);
  };

  const openEdit = (shop: Shop) => {
    setEditShop(shop);
    reset({ name: shop.name, location: shop.location ?? "" });
    setDialogOpen(true);
  };

  const onSubmit = (data: ShopFormData) => {
    if (editShop) {
      updateShop.mutate(
        { id: editShop.id, payload: data },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createShop.mutate(data, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteShop.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Shops" description="Manage dispatch destinations">
        {!isViewer && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Shop
          </Button>
        )}
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-danger">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Try again
          </Button>
        </div>
      ) : shops.length === 0 ? (
        <EmptyState
          title="No shops yet"
          description="Add shops to dispatch stock to your retail locations."
          icon={<Store className="h-8 w-8" />}
          actionLabel={!isViewer ? "Add Shop" : undefined}
          onAction={!isViewer ? openCreate : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="rounded-lg border border-border bg-surface-raised p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{shop.name}</h3>
                  {shop.location && (
                    <p className="mt-1 text-sm text-muted">{shop.location}</p>
                  )}
                </div>
                <span
                  className={
                    shop.isActive
                      ? "text-xs text-success"
                      : "text-xs text-muted"
                  }
                >
                  {shop.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {!isViewer && (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(shop)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-danger"
                    onClick={() => setDeleteTarget(shop)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editShop ? "Edit Shop" : "Add Shop"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Shop Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Optional"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createShop.isPending || updateShop.isPending}
            >
              {createShop.isPending || updateShop.isPending
                ? "Saving..."
                : editShop
                  ? "Update"
                  : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete shop"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteShop.isPending}
        destructive
      />
    </div>
  );
}
