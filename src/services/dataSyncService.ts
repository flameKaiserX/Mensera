import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { DayLog, UserProfile } from '../types';

export type SyncResult = { error: string | null };

type ProfileRow = {
  id: string;
  data: UserProfile;
  updated_at: string;
};

type DayLogRow = {
  date: string;
  data: DayLog;
  updated_at: string;
};

const unavailableMessage = 'Cloud accounts are not configured yet.';

export async function loadCloudData(userId: string): Promise<{
  profile: UserProfile | null;
  logs: DayLog[];
  error: string | null;
}> {
  if (!supabase) return { profile: null, logs: [], error: unavailableMessage };

  const [profileResult, logsResult] = await Promise.all([
    supabase.from('profiles').select('id, data, updated_at').eq('id', userId).maybeSingle<ProfileRow>(),
    supabase.from('day_logs').select('date, data, updated_at').eq('user_id', userId).order('date', { ascending: false }).returns<DayLogRow[]>(),
  ]);

  if (profileResult.error) return { profile: null, logs: [], error: profileResult.error.message };
  if (logsResult.error) return { profile: null, logs: [], error: logsResult.error.message };

  return {
    profile: profileResult.data?.data ?? null,
    logs: logsResult.data?.map((row) => ({ ...row.data, date: row.date })) ?? [],
    error: null,
  };
}

export async function saveCloudProfile(userId: string, profile: UserProfile): Promise<SyncResult> {
  if (!supabase) return { error: unavailableMessage };

  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    data: profile,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function saveCloudLogs(userId: string, logs: DayLog[]): Promise<SyncResult> {
  if (!supabase) return { error: unavailableMessage };
  if (logs.length === 0) return { error: null };

  const rows = logs.map((log) => ({
    user_id: userId,
    date: log.date,
    data: log,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('day_logs').upsert(rows, { onConflict: 'user_id,date' });
  return { error: error?.message ?? null };
}

export function mergeLogs(localLogs: DayLog[], cloudLogs: DayLog[]): DayLog[] {
  const merged = new Map(cloudLogs.map((log) => [log.date, log]));
  localLogs.forEach((localLog) => {
    const remoteLog = merged.get(localLog.date);
    merged.set(localLog.date, remoteLog ? { ...remoteLog, ...localLog, symptoms: { ...remoteLog.symptoms, ...localLog.symptoms } } : localLog);
  });
  return [...merged.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function getUserEmail(user: User | null): string | null {
  return user?.email ?? null;
}
