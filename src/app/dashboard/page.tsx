"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES, TASK_STATUS } from "@/constants/app";
import { CheckCircle, ListTodo } from "lucide-react";
import { Task } from "@/types";
import { TaskDialog } from "@/components/task-dialog";
import { useTask } from "@/providers/task-provider";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";

// Dashboard configuration constants
const DASHBOARD_CONFIG = {
  RECENT_TASKS_LIMIT: 10 // Number of recent tasks to display
};

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { tasks = [], isLoading = false, error = null, getTaskCounts = () => {} } = useTask() || {};

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <TaskDialog />
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="To Do"
            value={getTaskCounts()[TASK_STATUS.TODO].toString()}
            description="Tasks waiting to be processed"
            icon={<ListTodo className="h-8 w-8" />}
          />
          <StatsCard
            title="In Progress"
            value={getTaskCounts()[TASK_STATUS.IN_PROGRESS].toString()}
            description="Tasks currently being processed"
            icon={<ListTodo className="h-8 w-8" />}
          />
          <StatsCard
            title="Completed"
            value={getTaskCounts()[TASK_STATUS.COMPLETED].toString()}
            description="Tasks that have been completed"
            icon={<CheckCircle className="h-8 w-8" />}
          />
        </div>
      )}

      <div className="bg-card rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Tasks</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.TASKS}>View All Tasks</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks found. Create a new task!</p>
            <div className="mt-4">
              <TaskDialog />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, DASHBOARD_CONFIG.RECENT_TASKS_LIMIT).map((task: Task) => (
              <div key={task.id} className={`flex items-center justify-between p-4 border rounded-md transition-all ${
                task.status === TASK_STATUS.COMPLETED ? 'bg-green-50/50 border-green-100' : ''
              }`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${
                      task.status === TASK_STATUS.COMPLETED ? 'line-through text-muted-foreground' : ''
                    }`}>{task.title}</h4>
                    <StatusBadge status={task.status} size="sm" />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Updated {new Date(task.updated_at).toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`${ROUTES.TASKS}`}>View Details</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, icon }: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-8 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );
}

function TaskItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div>
        <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
    </div>
  );
}