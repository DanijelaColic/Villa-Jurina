import { createClient } from '@supabase/supabase-js';

export type Booking = {
  id: string;
  apartment_slug: string;
  check_in: string;
  check_out: string;
  nights: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  adults: number;
  children: number;
  price_per_night: number;
  total_price: number;
  deposit: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  created_at: string;
};

export type BookedRange = {
  check_in: string;
  check_out: string;
};

export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('Nedostaju Supabase environment varijable. Dodaj ih u .env.local');
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
