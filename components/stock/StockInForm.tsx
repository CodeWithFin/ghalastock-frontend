"use client";

import { useFieldArray, useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockLineItem, type StockLineFields } from "@/components/stock/StockLineItem";
import { stockInSchema, type StockInFormData } from "@/lib/schemas/stock.schema";
import { useStockIn } from "@/lib/hooks/useStock";

const emptyLine = {
  itemId: "",
  quantity: 1,
  expiryDate: "",
  notes: "",
};

interface StockInFormProps {
  onSuccess?: () => void;
}

export function StockInForm({ onSuccess }: StockInFormProps) {
  const stockIn = useStockIn();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockInFormData>({
    resolver: zodResolver(stockInSchema),
    defaultValues: {
      lines: [emptyLine],
      transactionDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const lines = watch("lines");

  const onSubmit = (data: StockInFormData) => {
    stockIn.mutate(
      {
        lines: data.lines.map((l) => ({
          itemId: l.itemId,
          quantity: l.quantity,
          expiryDate: l.expiryDate || null,
          notes: l.notes || null,
        })),
        transactionDate: data.transactionDate,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          reset({
            lines: [emptyLine],
            transactionDate: new Date().toISOString().split("T")[0],
            notes: "",
          });
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="transactionDate">Date</Label>
          <Input
            id="transactionDate"
            type="date"
            {...register("transactionDate")}
          />
        </div>
        <div className="space-y-2">
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
            showExpiry
            itemId={lines[index]?.itemId ?? ""}
            onItemChange={(id) => setValue(`lines.${index}.itemId`, id)}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>

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
        <Button type="submit" disabled={stockIn.isPending}>
          {stockIn.isPending ? "Recording..." : "Record Stock In"}
        </Button>
      </div>
    </form>
  );
}
