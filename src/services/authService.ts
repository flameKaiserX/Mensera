import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type AuthResult = {
  error: string | null;
};

const unavailableMessage = 'Cloud accounts are not configured yet. Guest mode is still available.';

function mapAuthError(message: string): string {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  if (message.toLowerCase().includes('user already registered')) {
    return 'An account with this email already exists.';
  }
  return message;
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signUpWithPassword(email: string, password: string): Promise<AuthResult> {
  if (!supabase || !isSupabaseConfigured) return { error: unavailableMessage };

  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error ? mapAuthError(error.message) : null };
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  if (!supabase || !isSupabaseConfigured) return { error: unavailableMessage };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? mapAuthError(error.message) : null };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!supabase || !isSupabaseConfigured) return { error: unavailableMessage };

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  return { error: error ? mapAuthError(error.message) : null };
}

export async function signOut(): Promise<AuthResult> {
  if (!supabase || !isSupabaseConfigured) return { error: null };

  const { error } = await supabase.auth.signOut();
  return { error: error ? mapAuthError(error.message) : null };
}

export function subscribeToAuthChanges(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): (() => void) {
  if (!supabase) return () => undefined;

  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
}
