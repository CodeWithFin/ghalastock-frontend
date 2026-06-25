import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils/format";
import type { Transaction } from "@/types/transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  if (loading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState title="No transactions yet" />
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      variant={tx.type === "IN" ? "success" : "warning"}
                    >
                      {tx.type}
                    </StatusBadge>
                    <span className="text-sm font-medium truncate">{tx.itemName}</span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {tx.quantity} {tx.itemUnit}
                    {tx.shopName && ` → ${tx.shopName}`}
                    {" · "}
                    {formatDate(tx.transactionDate)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
