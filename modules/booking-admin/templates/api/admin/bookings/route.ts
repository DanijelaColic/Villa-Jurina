/**
 * TEMPLATE: kopiraj kao src/app/api/admin/bookings/route.ts
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'MODULE_ROOT/lib/supabase';
import { isAdminAuthenticatedFromRequest } from 'MODULE_ROOT/lib/admin-auth';
import { getApartment, HIGH_SEASON_MONTHS, DEPOSIT_PERCENT } from 'MODULE_ROOT/booking.config';
import { parseLocalDate, diffDays } from 'MODULE_ROOT/lib/dates';

// GET /api/admin/bookings — sve rezervacije
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('check_in', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/bookings — ručna rezervacija
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    apartment_slug, check_in, check_out,
    guest_name, guest_email, guest_phone,
    adults, children, notes, status, deposit_paid,
  } = body;

  const apt = getApartment(apartment_slug);
  if (!apt) return NextResponse.json({ error: 'Apartment not found' }, { status: 404 });

  const checkInDate = parseLocalDate(check_in);
  const checkOutDate = parseLocalDate(check_out);
  const nights = diffDays(checkOutDate, checkInDate);

  if (nights < 1) {
    return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
  }

  let lowNights = 0, highNights = 0;
  const d = new Date(checkInDate);
  while (d < checkOutDate) {
    const m = d.getMonth() + 1;
    if (HIGH_SEASON_MONTHS.includes(m)) highNights++;
    else lowNights++;
    d.setDate(d.getDate() + 1);
  }
  const totalPrice = lowNights * apt.priceOffSeason + highNights * apt.priceHighSeason;
  const deposit = Math.round(totalPrice * DEPOSIT_PERCENT);

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      apartment_slug, check_in, check_out, nights,
      guest_name, guest_email: guest_email || '',
      guest_phone: guest_phone || null,
      adults: adults ?? 1, children: children ?? 0,
      price_per_night: Math.round(totalPrice / nights),
      total_price: totalPrice, deposit,
      status: status ?? 'confirmed',
      deposit_paid: deposit_paid ?? false,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
