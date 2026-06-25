"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itemSchema, type ItemFormData } from "@/lib/schemas/item.schema";
import { useCategories } from "@/lib/hooks/useItems";
import type { Item } from "@/types/item";

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  onSubmit: (data: ItemFormData) => void;
  loading?: boolean;
}

export function ItemForm({
  open,
  onOpenChange,
  item,
  onSubmit,
  loading,
}: ItemFormProps) {
  const { data: categories = [] } = useCategories();
  const isEdit = !!item;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      category: "",
      unit: "pcs",
      price: null,
      minStock: 0,
    },
  });

  const categoryValue = watch("category");

  useEffect(() => {
    if (open) {
      reset(
        item
          ? {
              name: item.name,
              sku: item.sku ?? "",
              barcode: item.barcode ?? "",
              category: item.category ?? "",
              unit: item.unit,
              price: item.price,
              minStock: item.minStock,
            }
          : {
              name: "",
              sku: "",
              barcode: "",
              category: "",
              unit: "pcs",
              price: null,
              minStock: 0,
            }
      );
    }
  }, [open, item, reset]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Item" : "Add Item"}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register("sku")} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" {...register("barcode")} placeholder="Optional" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryValue ?? ""}
              onValueChange={(v) => setValue("category", v || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select or type below" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              {...register("category")}
              placeholder="Or enter new category"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" {...register("unit")} placeholder="pcs, kg, L" />
              {errors.unit && (
                <p className="text-xs text-danger">{errors.unit.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock</Label>
              <Input
                id="minStock"
                type="number"
                min={0}
                {...register("minStock")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (KES)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              {...register("price")}
              placeholder="Optional"
            />
            {errors.price && (
              <p className="text-xs text-danger">{errors.price.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
