"use client";

import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { ExpiryAlerts } from "@/components/dashboard/ExpiryAlerts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDashboardSummary } from "@/lib/hooks/useDashboard";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardSummary();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <div className="error-panel">
          <p className="text-sm text-danger">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory health"
      />

      <SummaryCards
        totalItems={data?.totalItems ?? 0}
        lowStockItems={data?.lowStockItems ?? 0}
        outOfStockItems={data?.outOfStockItems ?? 0}
        expiringIn30Days={data?.expiringIn30Days ?? 0}
        loading={isLoading}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <StockMovementChart
          data={data?.stockMovement ?? []}
          loading={isLoading}
        />
        <LowStockList items={data?.lowStockList ?? []} loading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpiryAlerts alerts={data?.expiryAlerts ?? []} loading={isLoading} />
        <RecentTransactions
          transactions={data?.recentTransactions ?? []}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
