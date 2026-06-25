"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  PackageMinus,
  MoreHorizontal,
  AlertTriangle,
  ArrowLeftRight,
  Store,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUIStore } from "@/lib/store/uiStore";
import { useAuth } from "@/lib/hooks/useAuth";

const mainTabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/items", label: "Inventory", icon: Package },
  { href: "/stock-in", label: "Stock In", icon: PackagePlus },
  { href: "/stock-out", label: "Stock Out", icon: PackageMinus },
];

const moreItems = [
  { href: "/expiring", label: "Expiring", icon: AlertTriangle },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const { isAdmin } = useAuth();

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-surface-raised safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {mainTabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </Link>
            );
          })}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium text-muted"
          >
            <MoreHorizontal className="h-5 w-5" />
            More
          </button>
        </div>
      </nav>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-4 mt-6 pb-4">
            {moreItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-surface transition-colors"
                >
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
