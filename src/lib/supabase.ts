import { createClient } from '@supabase/supabase-js';

// Supabase configuration constants
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication functions

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // Provide user-friendly error messages
    let friendlyMessage = error.message;

    if (error.message.includes('User already registered')) {
      friendlyMessage = 'An account with this email already exists. Please try logging in instead.';
    } else if (error.message.includes('Password should be at least')) {
      friendlyMessage = 'Password must be at least 6 characters long.';
    } else if (error.message.includes('Invalid email')) {
      friendlyMessage = 'Please enter a valid email address.';
    } else if (error.message.includes('Signup is disabled')) {
      friendlyMessage = 'Account registration is currently disabled. Please contact support.';
    }

    const friendlyError = new Error(friendlyMessage);
    throw friendlyError;
  }

  return data;
};

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Provide user-friendly error messages
    let friendlyMessage = 'Email or password is incorrect. Please try again.';

    if (error.message.includes('Invalid login credentials')) {
      friendlyMessage = 'Email or password is incorrect. Please try again.';
    } else if (error.message.includes('Email not confirmed')) {
      friendlyMessage = 'Please check your email and click the confirmation link before signing in.';
    } else if (error.message.includes('Invalid email')) {
      friendlyMessage = 'Please enter a valid email address.';
    } else if (error.message.includes('Too many requests')) {
      friendlyMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
    } else if (error.message.includes('User not found')) {
      friendlyMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
    }

    const friendlyError = new Error(friendlyMessage);
    throw friendlyError;
  }

  return data;
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    // Provide user-friendly error messages for Google OAuth
    let friendlyMessage = 'Google sign-in failed. Please try again.';

    if (error.message.includes('OAuth provider not enabled')) {
      friendlyMessage = 'Google sign-in is not available at the moment. Please try signing in with email and password.';
    } else if (error.message.includes('popup_closed_by_user')) {
      friendlyMessage = 'Sign-in was cancelled. Please try again.';
    } else if (error.message.includes('access_denied')) {
      friendlyMessage = 'Access was denied. Please allow permissions to continue with Google sign-in.';
    } else if (error.message.includes('network')) {
      friendlyMessage = 'Network error. Please check your internet connection and try again.';
    }

    const friendlyError = new Error(friendlyMessage);
    throw friendlyError;
  }

  return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    // Provide user-friendly error message for sign out
    const friendlyMessage = 'Failed to sign out. Please try again.';
    const friendlyError = new Error(friendlyMessage);
    throw friendlyError;
  }
};

/**
 * Get the current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log('No active session:', error.message);
      return null;
    }

    return data.session;
  } catch (error) {
    console.log('Error getting session:', error);
    return null;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log('No authenticated user:', error.message);
      return null;
    }

    return data.user;
  } catch (error) {
    console.log('Error getting user:', error);
    return null;
  }
};