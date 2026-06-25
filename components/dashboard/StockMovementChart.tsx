"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format";

interface StockMovementChartProps {
  data: { date: string; in: number; out: number }[];
  loading?: boolean;
}

export function StockMovementChart({ data, loading }: StockMovementChartProps) {
  if (loading) {
    return <Skeleton className="h-80 w-full" />;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Stock Movement (30 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="in"
              name="Stock In"
              stroke="#16A34A"
              fill="#B7E4C7"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="out"
              name="Stock Out"
              stroke="#F59E0B"
              fill="#FDE68A"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
