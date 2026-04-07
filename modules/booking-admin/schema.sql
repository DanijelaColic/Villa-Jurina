-- Pokreni ovo u Supabase SQL editoru (https://supabase.com/dashboard → SQL Editor)

create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  apartment_slug text not null,
  check_in date not null,
  check_out date not null,
  nights integer not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  adults integer not null default 1,
  children integer not null default 0,
  price_per_night numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  deposit numeric(10, 2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  deposit_paid boolean not null default false,
  notes text,
  created_at timestamptz default now()
);

-- Ako tablica već postoji bez deposit_paid kolone, dodaj je:
-- alter table bookings add column if not exists deposit_paid boolean not null default false;

-- Indexi za brže upite
create index if not exists bookings_apartment_status_idx
  on bookings (apartment_slug, status);

create index if not exists bookings_dates_idx
  on bookings (check_in, check_out);

-- Row Level Security
alter table bookings enable row level security;

-- Samo service role (server API) može raditi sve operacije
-- Anon korisnici nemaju direktan pristup
create policy "Service role full access"
  on bookings
  using (true)
  with check (true);
