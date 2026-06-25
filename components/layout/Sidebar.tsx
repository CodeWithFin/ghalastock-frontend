"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  PackageMinus,
  AlertTriangle,
  ArrowLeftRight,
  Store,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUIStore } from "@/lib/store/uiStore";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/items", label: "Inventory", icon: Package },
  { href: "/stock-in", label: "Stock In", icon: PackagePlus },
  { href: "/stock-out", label: "Stock Out", icon: PackageMinus },
  { href: "/expiring", label: "Expiring", icon: AlertTriangle },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { org, user, isAdmin, clearAuth } = useAuth();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleSidebarCollapsed);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-surface-raised transition-all duration-200 h-screen sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/dashboard" className="font-semibold text-primary text-lg">
            Ghala
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="shrink-0">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-surface hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-border p-4 space-y-3">
        {!collapsed && org && (
          <div>
            <p className="text-sm font-medium truncate">{org.name}</p>
            <StatusBadge variant="primary" className="mt-1 capitalize">
              {org.plan}
            </StatusBadge>
          </div>
        )}
        {!collapsed && user && (
          <p className="text-xs text-muted truncate">{user.email}</p>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={handleLogout}
          className={cn("w-full text-muted", !collapsed && "justify-start")}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
