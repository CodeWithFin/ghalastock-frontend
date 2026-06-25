"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { BatchAddTable } from "@/components/items/BatchAddTable";
import { useCreateBatchItems } from "@/lib/hooks/useItems";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";
import type { BatchAddFormData } from "@/lib/schemas/item.schema";

export default function NewItemsPage() {
  const router = useRouter();
  const { isViewer } = useAuth();
  const createBatch = useCreateBatchItems();

  useEffect(() => {
    if (isViewer) {
      router.replace("/items");
    }
  }, [isViewer, router]);

  const handleSubmit = (data: BatchAddFormData) => {
    const items = data.items.filter((item) => item.name.trim());
    if (items.length === 0) return;

    createBatch.mutate(items, {
      onSuccess: () => router.push("/items"),
    });
  };

  if (isViewer) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Add Items"
        description="Add multiple items at once using the spreadsheet below"
      >
        <Button variant="outline" asChild>
          <Link href="/items">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </PageHeader>

      <BatchAddTable
        onSubmit={handleSubmit}
        loading={createBatch.isPending}
      />
    </div>
  );
}
