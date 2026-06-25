import { cn } from "@/lib/utils/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-landing-border/60", className)}
      {...props}
    />
  );
}

export { Skeleton };
