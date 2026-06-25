"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useItems } from "@/lib/hooks/useItems";
import { cn } from "@/lib/utils/cn";
import type { Item } from "@/types/item";

interface ItemSearchSelectProps {
  value: string;
  onChange: (itemId: string, item?: Item) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ItemSearchSelect({
  value,
  onChange,
  placeholder = "Search items...",
  disabled,
  className,
}: ItemSearchSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useItems({
    search: debouncedSearch || undefined,
    limit: 10,
  });

  const selectedItem = data?.items.find((i) => i.id === value);

  const handleSelect = (item: Item) => {
    onChange(item.id, item);
    setSearch(item.name);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        value={open ? search : selectedItem?.name ?? search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("", undefined);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
      />

      {open && (debouncedSearch || !value) && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : data?.items.length === 0 ? (
            <p className="p-4 text-sm text-muted">No items found</p>
          ) : (
            data?.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-surface",
                  value === item.id && "bg-surface"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.sku && (
                    <span className="ml-2 font-mono text-xs text-muted">
                      {item.sku}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{item.totalStock} {item.unit}</span>
                  {value === item.id && <Check className="h-3 w-3 text-landing-accent" />}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
