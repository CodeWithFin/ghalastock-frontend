import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { FEFOPreviewLine } from "@/types/transaction";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface FEFOPreviewProps {
  preview: FEFOPreviewLine[];
  loading?: boolean;
}

export function FEFOPreview({ preview, loading }: FEFOPreviewProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (preview.length === 0) {
    return null;
  }

  const allSufficient = preview.every((line) => line.sufficient);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-4 flex items-center gap-2">
        {allSufficient ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-danger" />
        )}
        <h3 className="text-sm font-medium">
          FEFO Deduction Preview
        </h3>
        <StatusBadge variant={allSufficient ? "success" : "danger"}>
          {allSufficient ? "Sufficient stock" : "Insufficient stock"}
        </StatusBadge>
      </div>

      <div className="space-y-4">
        {preview.map((line) => (
          <div
            key={line.itemId}
            className="rounded-md border border-border bg-card p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{line.itemName}</p>
              <span className="text-sm text-muted">
                {formatNumber(line.quantity)} required
              </span>
            </div>

            {line.batches.length > 0 ? (
              <table className="mt-2 w-full text-xs">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="pb-1 font-medium">Batch Expiry</th>
                    <th className="pb-1 text-right font-medium">Deduct</th>
                  </tr>
                </thead>
                <tbody>
                  {line.batches.map((batch) => (
                    <tr key={batch.batchId} className="border-t border-border/50">
                      <td className="py-1.5">
                        {batch.expiryDate
                          ? formatDate(batch.expiryDate)
                          : "No expiry"}
                      </td>
                      <td className="py-1.5 text-right font-mono">
                        {formatNumber(batch.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-2 text-xs text-danger">No batches available</p>
            )}

            {!line.sufficient && (
              <p className="mt-2 text-xs text-danger">
                Not enough stock to fulfill this quantity
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
