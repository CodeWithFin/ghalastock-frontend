import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface LowStockItem {
  id: string;
  name: string;
  totalStock: number;
  minStock: number;
  unit: string;
}

interface LowStockListProps {
  items: LowStockItem[];
  loading?: boolean;
}

export function LowStockList({ items, loading }: LowStockListProps) {
  if (loading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Low Stock</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState title="All stock levels OK" description="No items below minimum stock." />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.totalStock} / {item.minStock} {item.unit}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/stock-in">Stock In</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
