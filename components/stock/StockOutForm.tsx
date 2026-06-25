"use client";

import { useMemo } from "react";
import { useFieldArray, useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockLineItem, type StockLineFields } from "@/components/stock/StockLineItem";
import { FEFOPreview } from "@/components/stock/FEFOPreview";
import { stockOutSchema, type StockOutFormData } from "@/lib/schemas/stock.schema";
import { useStockOut, useStockOutPreview } from "@/lib/hooks/useStock";
import { useShops } from "@/lib/hooks/useShops";

const emptyLine = {
  itemId: "",
  quantity: 1,
  notes: "",
};

interface StockOutFormProps {
  onSuccess?: () => void;
}

export function StockOutForm({ onSuccess }: StockOutFormProps) {
  const stockOut = useStockOut();
  const { data: shops = [], isLoading: shopsLoading } = useShops();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockOutFormData>({
    resolver: zodResolver(stockOutSchema),
    defaultValues: {
      shopId: "",
      lines: [emptyLine],
      transactionDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const lines = watch("lines");
  const shopId = watch("shopId");

  const previewLines = useMemo(
    () =>
      lines
        .filter((l) => l.itemId && l.quantity > 0)
        .map((l) => ({ itemId: l.itemId, quantity: Number(l.quantity) })),
    [lines]
  );

  const { data: preview = [], isLoading: previewLoading } =
    useStockOutPreview(previewLines);

  const onSubmit = (data: StockOutFormData) => {
    stockOut.mutate(
      {
        shopId: data.shopId,
        lines: data.lines.map((l) => ({
          itemId: l.itemId,
          quantity: l.quantity,
          notes: l.notes || null,
        })),
        transactionDate: data.transactionDate,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          reset({
            shopId: "",
            lines: [emptyLine],
            transactionDate: new Date().toISOString().split("T")[0],
            notes: "",
          });
          onSuccess?.();
        },
      }
    );
  };

  const canSubmit =
    preview.length === 0 || preview.every((line) => line.sufficient);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Destination Shop</Label>
          <Select
            value={shopId}
            onValueChange={(v) => setValue("shopId", v)}
            disabled={shopsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shop" />
            </SelectTrigger>
            <SelectContent>
              {shops
                .filter((s) => s.isActive)
                .map((shop) => (
                  <SelectItem key={shop.id} value={shop.id}>
                    {shop.name}
                    {shop.location && ` — ${shop.location}`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.shopId && (
            <p className="text-xs text-danger">{errors.shopId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="transactionDate">Date</Label>
          <Input
            id="transactionDate"
            type="date"
            {...register("transactionDate")}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            {...register("notes")}
            placeholder="Optional reference"
          />
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <StockLineItem
            key={field.id}
            index={index}
            register={register as UseFormRegister<StockLineFields>}
            errors={errors as FieldErrors<StockLineFields>}
            itemId={lines[index]?.itemId ?? ""}
            onItemChange={(id) => setValue(`lines.${index}.itemId`, id)}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>

      {previewLines.length > 0 && (
        <FEFOPreview preview={preview} loading={previewLoading} />
      )}

      {errors.lines?.root && (
        <p className="text-sm text-danger">{errors.lines.root.message}</p>
      )}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => append(emptyLine)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Line
        </Button>
        <Button
          type="submit"
          disabled={stockOut.isPending || !canSubmit}
        >
          {stockOut.isPending ? "Dispatching..." : "Dispatch Stock"}
        </Button>
      </div>
    </form>
  );
}
