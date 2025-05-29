import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { DB_CONFIG } from "@/constants/app";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: DB_CONFIG.CONNECTION_STRING,
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export schema for use in other files
export { schema };