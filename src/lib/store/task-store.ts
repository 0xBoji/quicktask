import { create } from 'zustand';
import { Task, TaskStatus } from '@/types';
import { TASK_STATUS } from '@/constants/app';
import { supabase, getCurrentUser } from '@/lib/supabase';

// Database table name constant
const TASKS_TABLE = 'tasks';
const DEFAULT_LIMIT = 10;

// Task store state interface
interface TaskState {
  // Tasks data
  tasks: Task[];
  filteredTasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Filters and pagination
  statusFilter: TaskStatus | 'all';
  searchQuery: string;
  limit: number;
  page: number;
  totalCount: number;

  // Actions
  fetchTasks: (options?: { limit?: number; page?: number; status?: TaskStatus | 'all' }) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  selectTask: (task: Task | null) => void;
  setStatusFilter: (status: TaskStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  getTaskCounts: () => Record<TaskStatus, number>;
}

// Create the task store
export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  filteredTasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  statusFilter: 'all',
  searchQuery: '',
  limit: DEFAULT_LIMIT,
  page: 1,
  totalCount: 0,

  // Actions
  fetchTasks: async (options = {}) => {
    try {
      set({ isLoading: true, error: null });

      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        set({
          tasks: [],
          filteredTasks: [],
          totalCount: 0,
          error: 'Please sign in to view your tasks'
        });
        return;
      }

      const {
        limit = get().limit || DEFAULT_LIMIT,
        page = get().page || 1,
        status = get().statusFilter
      } = options;

      // First get the total count for pagination
      const countQuery = supabase
        .from(TASKS_TABLE)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Apply status filter if not 'all'
      if (status !== 'all') {
        countQuery.eq('status', status);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;

      // Then get the actual data with pagination
      const offset = (page - 1) * limit;
      let query = supabase
        .from(TASKS_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply status filter if not 'all'
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      const tasks = data || [];

      set({
        tasks,
        limit,
        page,
        totalCount: count || 0,
        statusFilter: status
      });

      // Apply search query if exists
      const { searchQuery } = get();
      if (searchQuery) {
        get().setSearchQuery(searchQuery);
      } else {
        set({ filteredTasks: tasks });
      }

    } catch (err) {
      console.error('Error fetching tasks:', err);
      set({ error: 'Failed to load tasks. Please try again later.' });
    } finally {
      set({ isLoading: false });
    }
  },

  getTasksByStatus: (status: TaskStatus) => {
    return get().tasks.filter(task => task.status === status);
  },

  createTask: async (task) => {
    const { tasks } = get();

    try {
      set({ isLoading: true, error: null });

      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        set({ error: 'Please sign in to create tasks' });
        throw new Error('User not authenticated');
      }

      const newTask = {
        ...task,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TASKS_TABLE)
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set({
        tasks: [data, ...tasks],
        totalCount: get().totalCount + 1
      });

      // Apply current filters
      const { statusFilter } = get();
      get().setStatusFilter(statusFilter);

      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      set({ error: 'Failed to create task. Please try again.' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, updates) => {
    const { tasks } = get();

    try {
      set({ isLoading: true, error: null });

      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        set({ error: 'Please sign in to update tasks' });
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from(TASKS_TABLE)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set({
        tasks: tasks.map(task => task.id === id ? data : task),
        selectedTask: get().selectedTask?.id === id ? data : get().selectedTask
      });

      // Apply current filters
      const { statusFilter } = get();
      get().setStatusFilter(statusFilter);

      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      set({ error: 'Failed to update task. Please try again.' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    const { tasks } = get();

    try {
      set({ isLoading: true, error: null });

      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        set({ error: 'Please sign in to delete tasks' });
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from(TASKS_TABLE)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      set({
        tasks: tasks.filter(task => task.id !== id),
        selectedTask: get().selectedTask?.id === id ? null : get().selectedTask,
        totalCount: Math.max(0, get().totalCount - 1)
      });

      // Apply current filters
      const { statusFilter } = get();
      get().setStatusFilter(statusFilter);

    } catch (err) {
      console.error('Error deleting task:', err);
      set({ error: 'Failed to delete task. Please try again.' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  selectTask: (task) => {
    set({ selectedTask: task });
  },

  setStatusFilter: (status) => {
    const { tasks, searchQuery } = get();
    let filtered = [...tasks];

    // Apply status filter if not 'all'
    if (status !== 'all') {
      filtered = filtered.filter(task => task.status === status);
    }

    // Apply search query if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    set({ statusFilter: status, filteredTasks: filtered });
  },

  setSearchQuery: (query) => {
    const { tasks, statusFilter } = get();
    let filtered = [...tasks];

    // Apply status filter if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply search query if exists
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(lowercaseQuery) ||
        (task.description && task.description.toLowerCase().includes(lowercaseQuery))
      );
    }

    set({ searchQuery: query, filteredTasks: filtered });
  },

  setPage: (page) => {
    set({ page });
    get().fetchTasks({ page });
  },

  setLimit: (limit) => {
    set({ limit, page: 1 });
    get().fetchTasks({ limit, page: 1 });
  },

  getTaskCounts: () => {
    const { tasks } = get();
    const counts = {
      [TASK_STATUS.TODO]: 0,
      [TASK_STATUS.IN_PROGRESS]: 0,
      [TASK_STATUS.COMPLETED]: 0,
    };

    tasks.forEach(task => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });

    return counts;
  }
}));