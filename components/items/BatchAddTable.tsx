"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { batchAddSchema, type BatchAddFormData } from "@/lib/schemas/item.schema";

const emptyRow = {
  name: "",
  sku: "",
  barcode: "",
  category: "",
  unit: "pcs",
  price: null as number | null,
  minStock: 0,
};

interface BatchAddTableProps {
  onSubmit: (data: BatchAddFormData) => void;
  loading?: boolean;
}

export function BatchAddTable({ onSubmit, loading }: BatchAddTableProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchAddFormData>({
    resolver: zodResolver(batchAddSchema),
    defaultValues: { items: [emptyRow, emptyRow, emptyRow] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-medium text-muted">
              <th className="px-3 py-2">Name *</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Barcode</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Unit *</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Min Stock</th>
              <th className="w-10 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">
                  <Input
                    {...register(`items.${index}.name`)}
                    placeholder="Item name"
                    className="min-w-[140px]"
                  />
                  {errors.items?.[index]?.name && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.items[index]?.name?.message}
                    </p>
                  )}
                </td>
                <td className="px-3 py-2">
                  <Input {...register(`items.${index}.sku`)} className="min-w-[100px]" />
                </td>
                <td className="px-3 py-2">
                  <Input {...register(`items.${index}.barcode`)} className="min-w-[100px]" />
                </td>
                <td className="px-3 py-2">
                  <Input {...register(`items.${index}.category`)} className="min-w-[100px]" />
                </td>
                <td className="px-3 py-2">
                  <Input {...register(`items.${index}.unit`)} className="w-20" />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    {...register(`items.${index}.price`)}
                    className="w-24"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    min={0}
                    {...register(`items.${index}.minStock`)}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-muted" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.items?.root && (
        <p className="text-sm text-danger">{errors.items.root.message}</p>
      )}
      {typeof errors.items?.message === "string" && (
        <p className="text-sm text-danger">{errors.items.message}</p>
      )}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(emptyRow)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save All Items"}
        </Button>
      </div>
    </form>
  );
}
