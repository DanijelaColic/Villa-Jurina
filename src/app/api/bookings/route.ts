import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getApartment } from '@/lib/apartments';
import { parseLocalDate, isRangeAvailable, diffDays } from '@/lib/dates';
import { sendNewBookingEmails } from '@/lib/email';
import { createBookingViewToken, getBookingConfirmationUrl } from '@/lib/bookingConfirmation';

// GET /api/bookings?apartment=slug
// Vraća zauzete datume za odabrani apartman
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('apartment');

  if (!slug) {
    return NextResponse.json({ error: 'Nedostaje parametar apartment' }, { status: 400 });
  }

  const apt = getApartment(slug);
  if (!apt) {
    return NextResponse.json({ error: 'Apartman nije pronađen' }, { status: 404 });
  }

  // Ako je apartman zauzet cijelu sezonu — blokiraj tekuću godinu (Lipanj–Rujan)
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
  } catch (err) {
    const detail =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : String(err);
    console.error('GET /api/bookings:', detail, err);
    return NextResponse.json({ error: 'Greška pri dohvatu rezervacija' }, { status: 500 });
  }
}

// POST /api/bookings
// Kreira novu rezervaciju
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

    // Validacija obaveznih polja
    if (!apartment_slug || !check_in || !check_out || !guest_name || !guest_email) {
      return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 });
    }

    const apt = getApartment(apartment_slug);
    if (!apt) {
      return NextResponse.json({ error: 'Apartman nije pronađen' }, { status: 404 });
    }

    if (apt.fullyBooked) {
      return NextResponse.json(
        { error: 'Ovaj apartman nije dostupan za rezervaciju' },
        { status: 400 },
      );
    }

    const checkInDate = parseLocalDate(check_in);
    const checkOutDate = parseLocalDate(check_out);
    const nights = diffDays(checkOutDate, checkInDate);

    if (nights < 2) {
      return NextResponse.json(
        { error: 'Minimalni boravak su 2 noći' },
        { status: 400 },
      );
    }

    const totalGuests = (adults ?? 1) + (children ?? 0);
    if (totalGuests > apt.capacity) {
      return NextResponse.json(
        { error: `Apartman ${apt.name} prima maksimalno ${apt.capacity} osoba.` },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    // Provjera preklapanja s postojećim rezervacijama
    const { data: existing } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('apartment_slug', apartment_slug)
      .neq('status', 'cancelled');

    const existingRanges = existing ?? [];
    if (!isRangeAvailable(checkInDate, checkOutDate, existingRanges)) {
      return NextResponse.json(
        { error: 'Odabrani termini su već zauzeti. Molimo odaberite druge datume.' },
        { status: 409 },
      );
    }

    // Izračun cijene (noć po noć zbog mješovitih sezona)
    let lowNights = 0;
    let highNights = 0;
    const current = new Date(checkInDate);
    while (current < checkOutDate) {
      const month = current.getMonth() + 1;
      if (month === 7 || month === 8) highNights++;
      else lowNights++;
      current.setDate(current.getDate() + 1);
    }
    const totalPrice =
      lowNights * apt.priceOffSeason + highNights * apt.priceHighSeason;
    const deposit = Math.round(totalPrice * 0.3);
    const avgPricePerNight = Math.round(totalPrice / nights);

    // Insert u bazu
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

    // Sigurni javni link za original potvrdu rezervacije (isti URL ide i u email i u success ekran).
    const confirmationToken = createBookingViewToken(booking.id, guest_email);
    const confirmationUrl = getBookingConfirmationUrl(booking.id, confirmationToken);

    // Slanje emailova (gost + vlasnik) — booking.id koristi se za QR kod i poziv na broj
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
      confirmationUrl,
    });

    return NextResponse.json(
      { success: true, bookingId: booking.id, confirmationUrl },
      { status: 201 },
    );
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json(
      { error: 'Greška pri kreiranju rezervacije. Pokušajte ponovo ili nas kontaktirajte.' },
      { status: 500 },
    );
  }
}
