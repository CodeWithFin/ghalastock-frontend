export function ScannerOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="w-64 h-40 border-2 border-white/50 rounded-lg relative overflow-hidden">
        <div className="absolute inset-x-2 h-0.5 bg-success animate-scan-line" />
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-landing-accent" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-landing-accent" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-landing-accent" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-landing-accent" />
      </div>
    </div>
  );
}
