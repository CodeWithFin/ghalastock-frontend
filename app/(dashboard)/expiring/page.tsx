"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useExpiringBatches } from "@/lib/hooks/useStock";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { expiryRowClass } from "@/lib/utils/stock";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle } from "lucide-react";

export default function ExpiringPage() {
  const [search, setSearch] = useState("");
  const [days, setDays] = useState(30);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, error, refetch } = useExpiringBatches({
    days,
    search: debouncedSearch || undefined,
  });

  const batches = data?.batches ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expiring Stock"
        description="Batches approaching their expiry date"
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search items..."
          className="flex-1 min-w-[200px]"
        />
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d} days
            </Button>
          ))}
        </div>
      </FilterBar>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="error-panel">
          <p className="text-sm text-danger">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Try again
          </Button>
        </div>
      ) : batches.length === 0 ? (
        <EmptyState
          title="No expiring stock"
          description={`Nothing expiring in the next ${days} days.`}
          icon={<AlertTriangle className="h-8 w-8" />}
        />
      ) : (
        <div className="space-y-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className={cn(
                "rounded-lg border p-4",
                expiryRowClass(batch.daysRemaining)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{batch.itemName}</p>
                  {batch.itemSku && (
                    <p className="font-mono text-xs text-muted">{batch.itemSku}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">
                    {formatNumber(batch.quantity)} units · Expires{" "}
                    {formatDate(batch.expiryDate)}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-2 py-1 text-xs font-medium",
                    batch.daysRemaining <= 7
                      ? "bg-red-950/50 text-red-400 border border-red-900/50"
                      : batch.daysRemaining <= 30
                        ? "bg-amber-950/50 text-amber-400 border border-amber-900/50"
                        : "bg-surface-hover text-landing-muted border border-landing-border"
                  )}
                >
                  {batch.daysRemaining} days left
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
