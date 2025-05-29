"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTaskStore } from '@/lib/store/task-store';
import { useAuthContext } from '@/providers/auth-provider';

// Create a context for the task store
const TaskContext = createContext<ReturnType<typeof useTaskStore> | null>(null);

// Dashboard configuration constants
const DASHBOARD_FETCH_LIMIT = 20; // Fetch more tasks for the dashboard view

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  // Get the task store state and actions
  const taskStore = useTaskStore();
  const { isAuthenticated, loading } = useAuthContext();

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      taskStore.fetchTasks({ limit: DASHBOARD_FETCH_LIMIT });
    }
  }, [isAuthenticated, loading]);

  return (
    <TaskContext.Provider value={taskStore}>
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to use the task store
export function useTask() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }

  return context;
}