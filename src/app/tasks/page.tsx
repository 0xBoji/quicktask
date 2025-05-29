"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ROUTES, TASK_STATUS } from "@/constants/app";
import { ListTodo } from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TaskDialog } from "@/components/task-dialog";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useTask } from "@/providers/task-provider";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Pagination } from "@/components/pagination";
import { useSearchParams, useRouter } from "next/navigation";

export default function TasksPage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  return <TasksPageContent searchParams={searchParams} router={router} />;
}

function TasksPageContent({ searchParams, router }: { searchParams: any, router: any }) {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    deleteTask,
    updateTask,
    page,
    limit,
    totalCount,
    setPage,
    setLimit,
    statusFilter,
    setStatusFilter
  } = useTask();

  // Get query parameters
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const statusParam = searchParams.get('status');

  // Initialize with URL parameters or defaults
  useEffect(() => {
    const pageValue = pageParam ? parseInt(pageParam) : 1;
    const limitValue = limitParam ? parseInt(limitParam) : 10;
    const statusValue = statusParam as TaskStatus | 'all' || 'all';

    fetchTasks({
      page: pageValue,
      limit: limitValue,
      status: statusValue
    });
  }, [fetchTasks, pageParam, limitParam, statusParam]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${ROUTES.TASKS}?${params.toString()}`);

    // Update state
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Reset to first page
    router.push(`${ROUTES.TASKS}?${params.toString()}`);

    // Update state
    setLimit(newLimit);
  };

  // Handle status filter change
  const handleStatusChange = (status: TaskStatus | 'all') => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', status);
    params.set('page', '1'); // Reset to first page
    router.push(`${ROUTES.TASKS}?${params.toString()}`);

    // Update state
    setStatusFilter(status);
  };

  async function handleDeleteTask(id: string) {
    try {
      await deleteTask(id);
    } catch (err) {
      // Error handling is done in the store
    }
  }

  async function handleTaskStatusChange(id: string, status: TaskStatus) {
    try {
      await updateTask(id, { status });
    } catch (err) {
      // Error handling is done in the store
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Tasks</h2>
          <TaskDialog onSuccess={fetchTasks} />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === TASK_STATUS.TODO ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange(TASK_STATUS.TODO)}
          >
            To Do
          </Button>
          <Button
            variant={statusFilter === TASK_STATUS.IN_PROGRESS ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange(TASK_STATUS.IN_PROGRESS)}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === TASK_STATUS.COMPLETED ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange(TASK_STATUS.COMPLETED)}
          >
            Completed
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
            <TaskDialog onSuccess={fetchTasks} />
          </div>
        ) : (
          <>
            <div className="bg-card rounded-lg border mb-6">
              <div className="p-6">
                <div className="space-y-4">
                  {tasks.map((task: Task) => (
                    <div key={task.id} className={`flex items-center justify-between p-4 border rounded-md transition-all ${
                      task.status === TASK_STATUS.COMPLETED ? 'bg-green-50/50 border-green-100' : ''
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${
                            task.status === TASK_STATUS.COMPLETED ? 'line-through text-muted-foreground' : ''
                          }`}>{task.title}</h4>
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(task.updated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value={TASK_STATUS.TODO}>To Do</option>
                          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                          <option value={TASK_STATUS.COMPLETED}>Completed</option>
                        </select>
                        <EditTaskDialog
                          task={task}
                          onSuccess={fetchTasks}
                        />
                        <DeleteConfirmDialog
                          onConfirm={() => handleDeleteTask(task.id)}
                          title="Delete Task"
                          description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
    </div>
  );
}
