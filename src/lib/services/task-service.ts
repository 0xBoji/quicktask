import { db, schema } from '@/lib/db';
import { Task, TaskStatus } from '@/types';
import { TASK_STATUS } from '@/constants/app';
import { eq, and } from 'drizzle-orm';

// Helper function to convert database task to Task type
const convertDbTaskToTask = (dbTask: any): Task => ({
  ...dbTask,
  created_at: dbTask.created_at.toISOString(),
  updated_at: dbTask.updated_at.toISOString(),
  due_date: dbTask.due_date?.toISOString() || null,
});

// Helper function to convert Task due_date to Date for database
const convertTaskForDb = (task: any) => ({
  ...task,
  due_date: task.due_date ? new Date(task.due_date) : null,
});

// Task service for database operations
export const TaskService = {
  // Get all tasks for a specific user
  async getTasks(userId: string): Promise<Task[]> {
    try {
      const tasks = await db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.user_id, userId))
        .orderBy(schema.tasks.created_at);

      return tasks.map(convertDbTaskToTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get tasks by status for a specific user
  async getTasksByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    try {
      const tasks = await db
        .select()
        .from(schema.tasks)
        .where(and(
          eq(schema.tasks.user_id, userId),
          eq(schema.tasks.status, status)
        ))
        .orderBy(schema.tasks.created_at);

      return tasks.map(convertDbTaskToTask);
    } catch (error) {
      console.error(`Error fetching ${status} tasks:`, error);
      throw error;
    }
  },

  // Get task by ID for a specific user
  async getTaskById(userId: string, id: string): Promise<Task | null> {
    try {
      const [task] = await db
        .select()
        .from(schema.tasks)
        .where(and(
          eq(schema.tasks.user_id, userId),
          eq(schema.tasks.id, id)
        ));

      return task ? convertDbTaskToTask(task) : null;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create a new task
  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    try {
      const now = new Date();
      const taskForDb = convertTaskForDb(task);
      const [newTask] = await db
        .insert(schema.tasks)
        .values({
          ...taskForDb,
          created_at: now,
          updated_at: now,
        })
        .returning();

      return convertDbTaskToTask(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update an existing task for a specific user
  async updateTask(userId: string, id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Promise<Task> {
    try {
      const updatesForDb = convertTaskForDb(updates);
      const [updatedTask] = await db
        .update(schema.tasks)
        .set({ ...updatesForDb, updated_at: new Date() })
        .where(and(
          eq(schema.tasks.user_id, userId),
          eq(schema.tasks.id, id)
        ))
        .returning();

      return convertDbTaskToTask(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Update task status for a specific user
  async updateTaskStatus(userId: string, id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(userId, id, { status });
  },

  // Delete a task for a specific user
  async deleteTask(userId: string, id: string): Promise<void> {
    try {
      await db
        .delete(schema.tasks)
        .where(and(
          eq(schema.tasks.user_id, userId),
          eq(schema.tasks.id, id)
        ));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get task counts by status for a specific user
  async getTaskCounts(userId: string): Promise<Record<TaskStatus, number>> {
    try {
      const tasks = await db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.user_id, userId));

      const counts = {
        [TASK_STATUS.TODO]: 0,
        [TASK_STATUS.IN_PROGRESS]: 0,
        [TASK_STATUS.COMPLETED]: 0,
      };

      tasks.forEach(task => {
        if (counts[task.status as TaskStatus] !== undefined) {
          counts[task.status as TaskStatus]++;
        }
      });

      return counts;
    } catch (error) {
      console.error('Error fetching task counts:', error);
      throw error;
    }
  }
};