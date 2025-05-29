import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { DB_CONFIG } from "@/constants/app";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

// Sample data for initial seeding (commented out as seed file was removed)
// const sampleTasks = [...];

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

      // Sample tasks insertion removed
      console.log("Sample data insertion skipped (seed file removed)");
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