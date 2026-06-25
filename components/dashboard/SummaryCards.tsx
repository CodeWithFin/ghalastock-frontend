import {
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "primary" | "warning" | "danger";
}

const variantStyles = {
  primary: "text-landing-accent bg-landing-accent/10",
  warning: "text-amber-400 bg-amber-950/40",
  danger: "text-red-400 bg-red-950/40",
};

function SummaryCard({ title, value, icon: Icon, variant }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-landing-muted font-light">{title}</p>
            <p className="text-3xl font-medium mt-1">{value}</p>
          </div>
          <div className={cn("rounded-2xl p-3", variantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SummaryCardsProps {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringIn30Days: number;
  loading?: boolean;
}

export function SummaryCards({
  totalItems,
  lowStockItems,
  outOfStockItems,
  expiringIn30Days,
  loading,
}: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard title="Total Items" value={totalItems} icon={Package} variant="primary" />
      <SummaryCard title="Low Stock Items" value={lowStockItems} icon={AlertTriangle} variant="warning" />
      <SummaryCard title="Out of Stock" value={outOfStockItems} icon={XCircle} variant="danger" />
      <SummaryCard title="Expiring in 30 days" value={expiringIn30Days} icon={Clock} variant="warning" />
    </div>
  );
}
