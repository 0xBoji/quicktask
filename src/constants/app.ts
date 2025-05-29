export const APP_CONFIG = { name: "QuickTask", description: "A Collaborative To-Do App with Auth & Realtime Updates" };
export const TASK_PRIORITIES = { LOW: "low", MEDIUM: "medium", HIGH: "high" } as const;
export const TASK_STATUS = { TODO: "todo", IN_PROGRESS: "in-progress", COMPLETED: "completed" } as const;
export const DEFAULT_AVATAR_URL = "https://github.com/shadcn.png";
export const ROUTES = { HOME: "/", LOGIN: "/login", REGISTER: "/register", DASHBOARD: "/dashboard", TASKS: "/tasks", PROFILE: "/profile", SETTINGS: "/settings" };
export const LOCAL_STORAGE_KEYS = { THEME: "quicktask-theme", AUTH_TOKEN: "quicktask-auth-token" };

// Task priority constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Database connection constants
export const DB_CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  CONNECTION_STRING: process.env.CONNECT_STRING,
} as const;

// Authentication constants
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
} as const;
