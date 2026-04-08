import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { isAdminAuthenticatedFromRequest } from '@/lib/admin-auth';
import { getApartment } from '@/lib/apartments';
import { parseLocalDate, diffDays } from '@/lib/dates';

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

// POST /api/admin/bookings — nova ručna rezervacija
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
  if (!apt) return NextResponse.json({ error: 'Apartman nije pronađen' }, { status: 404 });

  const checkInDate = parseLocalDate(check_in);
  const checkOutDate = parseLocalDate(check_out);
  const nights = diffDays(checkOutDate, checkInDate);

  if (nights < 1) return NextResponse.json({ error: 'Check-out mora biti nakon check-in' }, { status: 400 });

  // Izračun cijene
  let lowNights = 0, highNights = 0;
  const d = new Date(checkInDate);
  while (d < checkOutDate) {
    const m = d.getMonth() + 1;
    if (m === 7 || m === 8) highNights++; else lowNights++;
    d.setDate(d.getDate() + 1);
  }
  const totalPrice = lowNights * apt.priceOffSeason + highNights * apt.priceHighSeason;
  const deposit = Math.round(totalPrice * 0.3);

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

// DELETE /api/admin/bookings — grupno brisanje rezervacija
export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ids = body?.ids;

  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === 'string')) {
    return NextResponse.json({ error: 'Polje ids mora biti neprazan niz stringova' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('bookings').delete().in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, deletedCount: ids.length });
}
