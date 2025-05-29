import { TASK_PRIORITIES, TASK_STATUS } from "@/constants/app";

export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}