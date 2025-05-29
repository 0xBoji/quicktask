import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { TASK_STATUS, DB_CONFIG } from "@/constants/app";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

// Sample data for initial seeding
const sampleTasks = [
  {
    title: 'Complete project setup',
    description: 'Set up the initial project structure and dependencies',
    status: TASK_STATUS.COMPLETED,
    priority: 'high',
    user_id: 'anonymous',
  },
  {
    title: 'Implement authentication',
    description: 'Add user authentication using Supabase Auth',
    status: TASK_STATUS.IN_PROGRESS,
    priority: 'high',
    user_id: 'anonymous',
  },
  {
    title: 'Create task components',
    description: 'Design and implement UI components for task management',
    status: TASK_STATUS.TODO,
    priority: 'medium',
    user_id: 'anonymous',
  },
  {
    title: 'Write unit tests',
    description: 'Add comprehensive test coverage for all components',
    status: TASK_STATUS.TODO,
    priority: 'medium',
    user_id: 'anonymous',
  },
  {
    title: 'Deploy to production',
    description: 'Deploy the application to production environment',
    status: TASK_STATUS.TODO,
    priority: 'low',
    user_id: 'anonymous',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  }
];

// Main migration function
async function main() {
  console.log("Starting database migration...");

  const connectionString = process.env.CONNECT_STRING || DB_CONFIG.CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('Database connection string not found. Please check your environment variables.');
  }

  console.log('Using connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  // Run migrations
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully!");

    // Seed data if needed
    // Uncomment the following code to seed data after migration
    /*
    console.log("Seeding initial data...");
    const { schema } = await import("./index");

    // Check if we already have data
    const existingTasks = await db.select().from(schema.tasks).limit(1);

    if (existingTasks.length === 0) {
      console.log("No existing tasks found. Inserting sample data...");

      for (const task of sampleTasks) {
        await db.insert(schema.tasks).values(task);
      }

      console.log(`Successfully inserted ${sampleTasks.length} sample tasks`);
    } else {
      console.log("Data already exists. Skipping seed.");
    }
    */
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

// Run the migration
main().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});