import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DB_CONFIG } from '@/constants/app';

// Create a single supabase client for interacting with your database
export const supabase = createClient(DB_CONFIG.SUPABASE_URL, DB_CONFIG.SUPABASE_ANON_KEY);

// Create a postgres client with the correct settings for Supabase connection pooler
// Disable prefetch as it is not supported for "Transaction" pool mode
const queryClient = postgres(DB_CONFIG.CONNECTION_STRING, { prepare: false });

// Create a Drizzle client
export const db = drizzle(queryClient, { schema });

// Export schema for use in other files
export { schema }; 