"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ScanLine, LogOut, Settings } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useItems } from "@/lib/hooks/useItems";
import { useDashboardSummary } from "@/lib/hooks/useDashboard";
import { useUIStore } from "@/lib/store/uiStore";
import { ScannerDrawer } from "@/components/scanner/ScannerDrawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { toast } from "sonner";
import { itemsApi } from "@/lib/api/items";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user, clearAuth } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const setScannerOpen = useUIStore((s) => s.setScannerOpen);
  const scannerOpen = useUIStore((s) => s.scannerOpen);
  const [desktopScannerOpen, setDesktopScannerOpen] = useState(false);
  const { data: summary } = useDashboardSummary();
  const { data: searchResults } = useItems({
    search: debouncedSearch,
    limit: 5,
  });

  const handleScan = async (barcode: string) => {
    try {
      const result = await itemsApi.getAll({ barcode });
      if (result.items.length > 0) {
        toast.success(`Item found: ${result.items[0].name}`);
        router.push(`/items`);
      } else {
        toast.error("Barcode not found — add new item?", {
          action: { label: "Add Item", onClick: () => router.push("/items/new") },
        });
      }
    } catch {
      toast.error("Could not search for barcode");
    }
    setScannerOpen(false);
    setDesktopScannerOpen(false);
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "GH";
  const lowStockCount = summary?.lowStockItems ?? 0;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-surface-raised px-4 md:px-6">
        {title && (
          <h1 className="text-lg font-semibold text-foreground shrink-0 hidden sm:block">
            {title}
          </h1>
        )}

        <div className="flex-1 max-w-md relative">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search items by name or SKU..."
          />
          {debouncedSearch && searchResults?.items && searchResults.items.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-surface-raised shadow-lg z-50">
              {searchResults.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push("/items");
                    setSearch("");
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                  {item.sku && (
                    <span className="ml-2 font-mono text-xs text-muted">{item.sku}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setScannerOpen(true)}
          >
            <ScanLine className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-2"
            onClick={() => setDesktopScannerOpen(true)}
          >
            <ScanLine className="h-4 w-4" />
            Scan
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/items")}>
            <Bell className="h-4 w-4" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning text-[10px] text-white flex items-center justify-center">
                {lowStockCount > 9 ? "9+" : lowStockCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ScannerDrawer open={scannerOpen} onOpenChange={setScannerOpen} onScan={handleScan} />

      <Dialog open={desktopScannerOpen} onOpenChange={setDesktopScannerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          <BarcodeScanner onScan={handleScan} />
        </DialogContent>
      </Dialog>
    </>
  );
}
