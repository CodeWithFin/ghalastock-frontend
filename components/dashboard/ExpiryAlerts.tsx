import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface ExpiryAlert {
  id: string;
  itemName: string;
  itemSku: string | null;
  quantity: number;
  expiryDate: string;
  daysRemaining: number;
}

interface ExpiryAlertsProps {
  alerts: ExpiryAlert[];
  loading?: boolean;
}

function urgencyClass(days: number) {
  if (days <= 7) return "border-red-200 bg-red-50";
  if (days <= 30) return "border-amber-200 bg-amber-50";
  return "border-border";
}

function urgencyTextClass(days: number) {
  if (days <= 7) return "text-danger";
  if (days <= 30) return "text-warning";
  return "text-muted";
}

export function ExpiryAlerts({ alerts, loading }: ExpiryAlertsProps) {
  if (loading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Expiry Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState title="No expiring stock" description="Nothing expiring in the next 30 days." />
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={cn(
                  "rounded-lg border p-3",
                  urgencyClass(alert.daysRemaining)
                )}
              >
                <p className="text-sm font-medium">{alert.itemName}</p>
                <p className="text-xs text-muted mt-1">
                  {alert.quantity} units · Expires {formatDate(alert.expiryDate)}
                </p>
                <p className={cn("text-xs font-medium mt-1", urgencyTextClass(alert.daysRemaining))}>
                  {alert.daysRemaining} days remaining
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
