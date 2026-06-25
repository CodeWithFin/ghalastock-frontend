"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useAuth } from "@/lib/hooks/useAuth";
import { useShops } from "@/lib/hooks/useShops";

export default function TransactionsPage() {
  const { isViewer } = useAuth();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | "IN" | "OUT">("all");
  const [shopId, setShopId] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);
  const { data: shops = [] } = useShops();
  const { data, isLoading, error, refetch } = useTransactions({
    search: debouncedSearch || undefined,
    type: type !== "all" ? type : undefined,
    shopId: shopId !== "all" ? shopId : undefined,
    page,
    limit: 20,
  });

  const transactions = data?.transactions ?? [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="History of all stock movements"
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search transactions..."
          className="flex-1 min-w-[200px]"
        />
        <Select
          value={type}
          onValueChange={(v) => setType(v as typeof type)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="IN">Stock In</SelectItem>
            <SelectItem value="OUT">Stock Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={shopId} onValueChange={setShopId}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Shop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All shops</SelectItem>
            {shops.map((shop) => (
              <SelectItem key={shop.id} value={shop.id}>
                {shop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      <TransactionsTable
        transactions={transactions}
        loading={isLoading}
        error={error}
        onRetry={() => refetch()}
        canUndo={!isViewer}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
