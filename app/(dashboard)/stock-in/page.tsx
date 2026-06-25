"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { StockInForm } from "@/components/stock/StockInForm";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StockInPage() {
  const { isViewer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isViewer) {
      router.replace("/dashboard");
    }
  }, [isViewer, router]);

  if (isViewer) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock In"
        description="Record incoming inventory with optional expiry dates"
      />
      <StockInForm />
    </div>
  );
}
