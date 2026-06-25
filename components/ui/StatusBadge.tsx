import { cn } from "@/lib/utils/cn";

type StatusVariant = "success" | "warning" | "danger" | "default" | "primary";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
}

const variants: Record<StatusVariant, string> = {
  success: "bg-green-950/50 text-green-400 border-green-800/50",
  warning: "bg-amber-950/50 text-amber-400 border-amber-800/50",
  danger: "bg-red-950/50 text-red-400 border-red-800/50",
  default: "bg-surface-hover text-landing-muted border-landing-border",
  primary: "bg-landing-accent/10 text-landing-accent border-landing-accent/30",
};

export function StatusBadge({ children, variant = "default", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
