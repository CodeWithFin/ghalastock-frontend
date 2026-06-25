"use client";

import { useCallback, useEffect, useState } from "react";
import { Flashlight, FlashlightOff } from "lucide-react";
import { useBarcodeScanner } from "./useBarcodeScanner";
import { ScannerOverlay } from "./ScannerOverlay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [lastScanned, setLastScanned] = useState("");
  const [manualEntry, setManualEntry] = useState("");
  const [success, setSuccess] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const handleScan = useCallback(
    (barcode: string) => {
      setLastScanned(barcode);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000);
      onScan(barcode);
    },
    [onScan]
  );

  const { videoRef, isActive, error, start, stop } = useBarcodeScanner(handleScan);

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  const toggleTorch = async () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      const track = stream?.getVideoTracks()[0];
      if (track && "applyConstraints" in track) {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
        });
        setTorchOn(!torchOn);
      }
    } catch {
      // Torch not supported
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative aspect-video rounded-lg overflow-hidden bg-black transition-colors",
          success && "ring-2 ring-success"
        )}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <ScannerOverlay />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-white text-sm text-center px-4">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={toggleTorch} type="button">
          {torchOn ? <FlashlightOff className="h-4 w-4" /> : <Flashlight className="h-4 w-4" />}
        </Button>
        {!isActive && (
          <Button onClick={start} type="button" className="flex-1">
            Start Camera
          </Button>
        )}
      </div>

      {lastScanned && (
        <p className="text-sm text-muted text-center font-mono">
          Last scanned: {lastScanned}
        </p>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Enter barcode manually"
          value={manualEntry}
          onChange={(e) => setManualEntry(e.target.value)}
          className="font-mono"
        />
        <Button
          onClick={() => {
            if (manualEntry.trim()) {
              handleScan(manualEntry.trim());
              setManualEntry("");
            }
          }}
          disabled={!manualEntry.trim()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
