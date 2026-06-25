"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);

  const handleScan = useCallback(
    (barcode: string) => {
      const now = Date.now();
      if (barcode === lastScanRef.current && now - lastScanTimeRef.current < 2000) return;
      lastScanRef.current = barcode;
      lastScanTimeRef.current = now;
      onScan(barcode);
    },
    [onScan]
  );

  const start = useCallback(async () => {
    try {
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader();
      }
      controlsRef.current = await readerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, err) => {
          if (result) {
            handleScan(result.getText());
          }
          if (err && err.name !== "NotFoundException") {
            setError(err.message);
          }
        }
      );
      setIsActive(true);
      setError(null);
    } catch {
      setError("Camera access denied");
    }
  }, [handleScan]);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsActive(false);
  }, []);

  useEffect(() => () => controlsRef.current?.stop(), []);

  return { videoRef, isActive, error, start, stop };
}
