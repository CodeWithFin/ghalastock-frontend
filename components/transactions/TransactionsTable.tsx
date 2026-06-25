"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { UndoTransactionDialog } from "@/components/transactions/UndoTransactionDialog";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { Transaction } from "@/types/transaction";
import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  canUndo?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function TransactionsTable({
  transactions,
  loading,
  error,
  onRetry,
  canUndo = true,
  page = 1,
  totalPages = 1,
  onPageChange,
}: TransactionsTableProps) {
  const [undoTx, setUndoTx] = useState<Transaction | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-danger">{error.message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Stock movements will appear here once you record stock in or out."
        icon={<ArrowLeftRight className="h-8 w-8" />}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Item</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                Quantity
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
                Shop
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                Date
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
                By
              </th>
              {canUndo && (
                <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                canUndo={canUndo}
                onUndo={setUndoTx}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="rounded-lg border border-border bg-surface-raised p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge variant={tx.type === "IN" ? "success" : "warning"}>
                    {tx.type}
                  </StatusBadge>
                  <span className="font-medium">{tx.itemName}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {formatNumber(tx.quantity)} {tx.itemUnit}
                  {tx.shopName && ` → ${tx.shopName}`}
                </p>
              </div>
              <span className="text-xs text-muted">
                {formatDate(tx.transactionDate)}
              </span>
            </div>
            {canUndo && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setUndoTx(tx)}
              >
                Undo
              </Button>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <UndoTransactionDialog
        transaction={undoTx}
        open={!!undoTx}
        onOpenChange={(open) => !open && setUndoTx(null)}
      />
    </>
  );
}
