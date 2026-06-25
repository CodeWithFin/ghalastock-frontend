"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useUndoTransaction } from "@/lib/hooks/useTransactions";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { Transaction } from "@/types/transaction";

interface UndoTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UndoTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: UndoTransactionDialogProps) {
  const undo = useUndoTransaction();

  const handleConfirm = () => {
    if (!transaction) return;
    undo.mutate(transaction.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  if (!transaction) return null;

  const description =
    transaction.type === "IN"
      ? `This will reverse the stock-in of ${formatNumber(transaction.quantity)} ${transaction.itemUnit} of "${transaction.itemName}" recorded on ${formatDate(transaction.transactionDate)}.`
      : `This will reverse the dispatch of ${formatNumber(transaction.quantity)} ${transaction.itemUnit} of "${transaction.itemName}" to ${transaction.shopName ?? "the shop"} on ${formatDate(transaction.transactionDate)}.`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Undo transaction"
      description={description}
      confirmLabel="Undo"
      onConfirm={handleConfirm}
      loading={undo.isPending}
      destructive
    />
  );
}
