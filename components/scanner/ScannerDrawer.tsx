"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BarcodeScanner } from "./BarcodeScanner";

interface ScannerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (barcode: string) => void;
}

export function ScannerDrawer({ open, onOpenChange, onScan }: ScannerDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Scan Barcode</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <BarcodeScanner
            onScan={(barcode) => {
              onScan(barcode);
              onOpenChange(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
