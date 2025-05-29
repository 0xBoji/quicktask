import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/types";
import { TASK_STATUS } from "@/constants/app";
import { CheckCircle, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TaskStatus;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, showIcon = true, size = "md" }: StatusBadgeProps) {
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case TASK_STATUS.TODO:
        return {
          label: "To Do",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300",
          icon: Circle,
          iconColor: "text-gray-500"
        };
      case TASK_STATUS.IN_PROGRESS:
        return {
          label: "In Progress",
          variant: "default" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
          icon: Clock,
          iconColor: "text-blue-600"
        };
      case TASK_STATUS.COMPLETED:
        return {
          label: "Completed",
          variant: "default" as const,
          className: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500"
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
          className: "",
          icon: Circle,
          iconColor: "text-gray-500"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.className,
        sizeClasses[size],
        "font-medium border",
        showIcon && "flex items-center gap-1.5"
      )}
    >
      {showIcon && (
        <Icon className={cn(iconSizes[size], config.iconColor)} />
      )}
      {config.label}
    </Badge>
  );
}
