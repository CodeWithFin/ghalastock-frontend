import { StatusBadge } from "@/components/ui/StatusBadge";
import type { User } from "@/types/auth";

interface UserRoleBadgeProps {
  role: User["role"];
}

const config: Record<
  User["role"],
  { label: string; variant: "primary" | "success" | "default" }
> = {
  admin: { label: "Admin", variant: "primary" },
  staff: { label: "Staff", variant: "success" },
  viewer: { label: "Viewer", variant: "default" },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const { label, variant } = config[role];

  return (
    <StatusBadge variant={variant} className="capitalize">
      {label}
    </StatusBadge>
  );
}
