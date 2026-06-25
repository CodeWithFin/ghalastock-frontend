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
  if (days <= 7) return "border-red-900/50 bg-red-950/30";
  if (days <= 30) return "border-amber-900/50 bg-amber-950/30";
  return "border-landing-border";
}

function urgencyTextClass(days: number) {
  if (days <= 7) return "text-red-400";
  if (days <= 30) return "text-amber-400";
  return "text-landing-muted";
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
                className={cn("rounded-lg border p-3", urgencyClass(alert.daysRemaining))}
              >
                <p className="text-sm font-medium">{alert.itemName}</p>
                <p className="text-xs text-landing-muted mt-1 font-light">
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
