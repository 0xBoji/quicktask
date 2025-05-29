import type { Config } from "drizzle-kit";
import { DB_CONFIG } from "./src/constants/app";
import * as dotenv from "dotenv";

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.CONNECT_STRING || DB_CONFIG.CONNECTION_STRING || "",
  },
  verbose: true,
  strict: true,
} satisfies Config;