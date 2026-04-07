import { createClient } from '@supabase/supabase-js';
import type { Booking, BookedRange } from '../types';

export type { Booking, BookedRange };

export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY to .env.local',
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
