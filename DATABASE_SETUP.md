# Database Setup with Drizzle ORM

This document provides instructions on how to set up and use Drizzle ORM with the QuickTask application.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (we're using Supabase)

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://bdakwjapkiuovjeghdkv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkYWt3amFwa2l1b3ZqZWdoZGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTc5MDksImV4cCI6MjA2Mzk5MzkwOX0.hbgPviizbF2oEkvXDbYyIPWEW6c7ViXrpSBoOanFMV0
CONNECT_STRING=postgresql://postgres:51224!Pich@db.bdakwjapkiuovjeghdkv.supabase.co:5432/postgres
```

## Database Commands

The following npm scripts are available for database management:

```bash
# Generate migration files based on schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio to view and edit data
npm run db:studio

# Push schema changes directly to the database
npm run db:push

# Pull database schema into your local project
npm run db:pull

# Check for schema drift
npm run db:check

# Update schema and run migrations
npm run db:up

# Seed the database with sample data
npm run db:seed
```

## Project Structure

- `src/lib/db/schema.ts` - Database schema definition
- `src/lib/db/index.ts` - Database connection for server-side operations
- `src/lib/db/client.ts` - Database connection for client-side operations
- `src/lib/db/migrate.ts` - Migration script
- `src/lib/db/seed.ts` - Seed script for sample data
- `drizzle/` - Generated migration files
- `drizzle.config.ts` - Drizzle configuration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate migration files:
   ```bash
   npm run db:generate
   ```

3. Run migrations:
   ```bash
   npm run db:migrate
   ```

4. Seed the database:
   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Using Drizzle Studio

Drizzle Studio provides a visual interface to manage your database:

```bash
npm run db:studio
```

This will open a browser window where you can view and edit your database tables.

## Troubleshooting

If you encounter any issues:

1. Make sure your environment variables are correctly set
2. Check the database connection in Supabase dashboard
3. Verify that the schema matches your expectations using `db:check`
4. Try running `db:pull` to sync with the current database schema 