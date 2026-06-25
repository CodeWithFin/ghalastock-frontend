"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { ItemsTable } from "@/components/items/ItemsTable";
import { ItemForm } from "@/components/items/ItemForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useItems, useCreateItem, useCategories } from "@/lib/hooks/useItems";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useAuth } from "@/lib/hooks/useAuth";
import type { ItemFormData } from "@/lib/schemas/item.schema";

export default function ItemsPage() {
  const { isViewer } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "ok" | "low" | "out">("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { data: categories = [] } = useCategories();
  const { data, isLoading, error, refetch } = useItems({
    search: debouncedSearch || undefined,
    category: category !== "all" ? category : undefined,
    status: status !== "all" ? status : undefined,
    page,
    limit: 20,
  });

  const createItem = useCreateItem();
  const items = data?.items ?? [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 1;

  const handleCreate = (formData: ItemFormData) => {
    createItem.mutate(formData, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage your products and stock levels"
      >
        {!isViewer && (
          <>
            <Button variant="outline" asChild>
              <Link href="/items/new">
                <Upload className="mr-2 h-4 w-4" />
                Batch Add
              </Link>
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </>
        )}
      </PageHeader>

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or SKU..."
          className="flex-1 min-w-[200px]"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as typeof status)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="ok">In stock</SelectItem>
            <SelectItem value="low">Low stock</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <ItemsTable
        items={items}
        loading={isLoading}
        error={error}
        onRetry={() => refetch()}
        canEdit={!isViewer}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ItemForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        loading={createItem.isPending}
      />
    </div>
  );
}
