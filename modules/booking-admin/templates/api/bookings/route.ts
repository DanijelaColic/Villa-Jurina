/**
 * TEMPLATE: kopiraj kao src/app/api/bookings/route.ts
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'MODULE_ROOT/lib/supabase';
import { getApartment } from 'MODULE_ROOT/booking.config';
import { parseLocalDate, isRangeAvailable, diffDays } from 'MODULE_ROOT/lib/dates';
import { sendNewBookingEmails } from 'MODULE_ROOT/lib/email';
import { MIN_NIGHTS, DEPOSIT_PERCENT, HIGH_SEASON_MONTHS } from 'MODULE_ROOT/booking.config';

// GET /api/bookings?apartment=slug
// Vraća zauzete datume za odabrani apartman (koristi BookingCalendar)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('apartment');

  if (!slug) {
    return NextResponse.json({ error: 'Missing apartment parameter' }, { status: 400 });
  }

  const apt = getApartment(slug);
  if (!apt) {
    return NextResponse.json({ error: 'Apartment not found' }, { status: 404 });
  }

  // Ako je apartman zauzet cijelu sezonu — vrati sintetički blok
  if (apt.fullyBooked) {
    const year = new Date().getFullYear();
    return NextResponse.json([{ check_in: `${year}-06-01`, check_out: `${year}-10-01` }]);
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('apartment_slug', slug)
      .neq('status', 'cancelled');

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}

// POST /api/bookings
// Kreira novu rezervaciju (javna forma)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      apartment_slug,
      check_in,
      check_out,
      guest_name,
      guest_email,
      guest_phone,
      adults,
      children,
      notes,
    } = body;

    if (!apartment_slug || !check_in || !check_out || !guest_name || !guest_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apt = getApartment(apartment_slug);
    if (!apt) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 });
    }

    if (apt.fullyBooked) {
      return NextResponse.json(
        { error: 'This apartment is not available for booking' },
        { status: 400 },
      );
    }

    const checkInDate = parseLocalDate(check_in);
    const checkOutDate = parseLocalDate(check_out);
    const nights = diffDays(checkOutDate, checkInDate);

    if (nights < MIN_NIGHTS) {
      return NextResponse.json(
        { error: `Minimum stay is ${MIN_NIGHTS} nights` },
        { status: 400 },
      );
    }

    const totalGuests = (adults ?? 1) + (children ?? 0);
    if (totalGuests > apt.capacity) {
      return NextResponse.json(
        { error: `${apt.name} accommodates a maximum of ${apt.capacity} guests.` },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: existing } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('apartment_slug', apartment_slug)
      .neq('status', 'cancelled');

    if (!isRangeAvailable(checkInDate, checkOutDate, existing ?? [])) {
      return NextResponse.json(
        { error: 'Selected dates are already booked. Please choose different dates.' },
        { status: 409 },
      );
    }

    // Izračun cijene po sezoni
    let lowNights = 0;
    let highNights = 0;
    const current = new Date(checkInDate);
    while (current < checkOutDate) {
      const month = current.getMonth() + 1;
      if (HIGH_SEASON_MONTHS.includes(month)) highNights++;
      else lowNights++;
      current.setDate(current.getDate() + 1);
    }
    const totalPrice = lowNights * apt.priceOffSeason + highNights * apt.priceHighSeason;
    const deposit = Math.round(totalPrice * DEPOSIT_PERCENT);
    const avgPricePerNight = Math.round(totalPrice / nights);

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        apartment_slug,
        check_in,
        check_out,
        nights,
        guest_name,
        guest_email,
        guest_phone: guest_phone || null,
        adults: adults ?? 1,
        children: children ?? 0,
        price_per_night: avgPricePerNight,
        total_price: totalPrice,
        deposit,
        status: 'pending',
        notes: notes || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await sendNewBookingEmails({
      guestName: guest_name,
      guestEmail: guest_email,
      guestPhone: guest_phone,
      apartmentName: apt.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      totalPrice,
      deposit,
      bookingId: booking.id,
    });

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json(
      { error: 'Error creating booking. Please try again or contact us.' },
      { status: 500 },
    );
  }
}
