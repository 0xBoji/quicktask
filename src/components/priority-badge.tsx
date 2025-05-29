import { TaskPriority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TASK_PRIORITIES } from "@/constants/app";

// Priority colors for different states
const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  [TASK_PRIORITIES.MEDIUM]: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  [TASK_PRIORITIES.HIGH]: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
} as const;

// Priority labels for display
const PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: "Low",
  [TASK_PRIORITIES.MEDIUM]: "Medium",
  [TASK_PRIORITIES.HIGH]: "High",
} as const;

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
  showLabel?: boolean;
}

export function PriorityBadge({ priority, className, showLabel = true }: PriorityBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border-transparent",
        PRIORITY_COLORS[priority],
        className
      )}
    >
      {showLabel ? PRIORITY_LABELS[priority] : priority}
    </Badge>
  );
} 