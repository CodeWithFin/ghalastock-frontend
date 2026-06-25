"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { Transaction } from "@/types/transaction";
import { Undo2 } from "lucide-react";

interface TransactionRowProps {
  transaction: Transaction;
  canUndo: boolean;
  onUndo: (transaction: Transaction) => void;
}

export function TransactionRow({
  transaction,
  canUndo,
  onUndo,
}: TransactionRowProps) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
      <td className="px-4 py-3">
        <StatusBadge variant={transaction.type === "IN" ? "success" : "warning"}>
          {transaction.type}
        </StatusBadge>
      </td>
      <td className="px-4 py-3">
        <p className="font-medium">{transaction.itemName}</p>
        {transaction.itemSku && (
          <p className="font-mono text-xs text-muted">{transaction.itemSku}</p>
        )}
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        {formatNumber(transaction.quantity)} {transaction.itemUnit}
      </td>
      <td className="hidden px-4 py-3 text-muted lg:table-cell">
        {transaction.shopName ?? "—"}
      </td>
      <td className="hidden px-4 py-3 text-muted md:table-cell">
        {formatDate(transaction.transactionDate)}
      </td>
      <td className="hidden px-4 py-3 text-muted lg:table-cell">
        {transaction.createdByEmail ?? "—"}
      </td>
      {canUndo && (
        <td className="px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUndo(transaction)}
          >
            <Undo2 className="mr-1 h-3 w-3" />
            Undo
          </Button>
        </td>
      )}
    </tr>
  );
}
