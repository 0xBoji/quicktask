import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

// Define the tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  due_date: timestamp("due_date", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  user_id: text("user_id").notNull(),
}, (table) => {
  return {
    statusIdx: index("idx_tasks_status").on(table.status),
    userIdIdx: index("idx_tasks_user_id").on(table.user_id),
    createdAtIdx: index("idx_tasks_created_at").on(table.created_at),
  };
});

// Export all tables for use in other files
export const tables = { tasks };

// Types for the tasks table
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert; 