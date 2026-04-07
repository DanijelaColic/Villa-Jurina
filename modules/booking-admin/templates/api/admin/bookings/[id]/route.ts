/**
 * TEMPLATE: kopiraj kao src/app/api/admin/bookings/[id]/route.ts
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'MODULE_ROOT/lib/supabase';
import { isAdminAuthenticatedFromRequest } from 'MODULE_ROOT/lib/admin-auth';
import { getApartment, HIGH_SEASON_MONTHS, DEPOSIT_PERCENT } from 'MODULE_ROOT/booking.config';
import { parseLocalDate, diffDays } from 'MODULE_ROOT/lib/dates';
import { sendConfirmationEmail } from 'MODULE_ROOT/lib/email';
import type { Booking } from 'MODULE_ROOT/types';

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/bookings/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const updates: Partial<Booking> & Record<string, unknown> = await request.json();
  const supabase = createServerSupabaseClient();

  // Posebna akcija: samo pošalji email bez update-a
  if (updates._resend_email === true) {
    const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const apt = getApartment(booking.apartment_slug);
    if (apt && booking.guest_email) {
      await sendConfirmationEmail({
        guestName: booking.guest_name,
        guestEmail: booking.guest_email,
        guestPhone: booking.guest_phone,
        apartmentName: apt.name,
        checkIn: parseLocalDate(booking.check_in),
        checkOut: parseLocalDate(booking.check_out),
        nights: booking.nights,
        totalPrice: booking.total_price,
        deposit: booking.deposit,
        bookingId: booking.id,
      }).catch((err) => console.error('Resend email failed:', err));
    }
    return NextResponse.json({ success: true });
  }

  const needsRecalc = updates.check_in || updates.check_out || updates.apartment_slug;
  const needsConfirmEmail = updates.status === 'confirmed';

  let existing: Booking | null = null;
  if (needsRecalc || needsConfirmEmail) {
    const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
    existing = data;
  }

  if (needsRecalc && existing) {
    const slug = (updates.apartment_slug as string | undefined) ?? existing.apartment_slug;
    const checkIn = parseLocalDate((updates.check_in as string | undefined) ?? existing.check_in);
    const checkOut = parseLocalDate((updates.check_out as string | undefined) ?? existing.check_out);
    const apt = getApartment(slug);

    if (apt && checkOut > checkIn) {
      const nights = diffDays(checkOut, checkIn);
      let lowNights = 0;
      let highNights = 0;
      const d = new Date(checkIn);
      while (d < checkOut) {
        const m = d.getMonth() + 1;
        if (HIGH_SEASON_MONTHS.includes(m)) highNights++;
        else lowNights++;
        d.setDate(d.getDate() + 1);
      }
      const totalPrice = lowNights * apt.priceOffSeason + highNights * apt.priceHighSeason;
      const deposit = Math.round(totalPrice * DEPOSIT_PERCENT);
      updates.nights = nights;
      updates.total_price = totalPrice;
      updates.deposit = deposit;
      updates.price_per_night = Math.round(totalPrice / nights);
    }
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (needsConfirmEmail && existing) {
    const apt = getApartment(existing.apartment_slug);
    if (apt && existing.guest_email) {
      await sendConfirmationEmail({
        guestName: existing.guest_name,
        guestEmail: existing.guest_email,
        guestPhone: existing.guest_phone,
        apartmentName: apt.name,
        checkIn: parseLocalDate(existing.check_in),
        checkOut: parseLocalDate(existing.check_out),
        nights: existing.nights,
        totalPrice: existing.total_price,
        deposit: existing.deposit,
        bookingId: existing.id,
      }).catch((err) => console.error('Confirmation email failed:', err));
    }
  }

  return NextResponse.json(data);
}

// DELETE /api/admin/bookings/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
