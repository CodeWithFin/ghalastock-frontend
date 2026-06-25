"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { StockOutForm } from "@/components/stock/StockOutForm";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StockOutPage() {
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
        title="Stock Out"
        description="Dispatch inventory to shops using FEFO batch deduction"
      />
      <StockOutForm />
    </div>
  );
}
