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
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#888888" }} />
            <YAxis tick={{ fontSize: 11, fill: "#888888" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#121212",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="in"
              name="Stock In"
              stroke="#D4D414"
              fill="rgba(212,212,20,0.15)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="out"
              name="Stock Out"
              stroke="#888888"
              fill="rgba(136,136,136,0.1)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
