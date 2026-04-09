import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getApartment } from '@/lib/apartments';
import { parseLocalDate, isRangeAvailable, diffDays } from '@/lib/dates';
import { sendNewBookingEmails } from '@/lib/email';
import { createBookingViewToken, getBookingConfirmationUrl } from '@/lib/bookingConfirmation';
import { getRequestLocale } from '@/lib/requestLocale';

// GET /api/bookings?apartment=slug
// Vraća zauzete datume za odabrani apartman
export async function GET(request: NextRequest) {
  const locale = getRequestLocale(request);
  const msg = {
    missingApartment:
      locale === 'en'
        ? 'Missing apartment parameter'
        : locale === 'de'
          ? 'Apartment-Parameter fehlt'
          : 'Nedostaje parametar apartment',
    apartmentNotFound:
      locale === 'en'
        ? 'Apartment not found'
        : locale === 'de'
          ? 'Apartment nicht gefunden'
          : 'Apartman nije pronađen',
    fetchError:
      locale === 'en'
        ? 'Error fetching bookings'
        : locale === 'de'
          ? 'Fehler beim Laden der Buchungen'
          : 'Greška pri dohvatu rezervacija',
  };

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('apartment');

  if (!slug) {
    return NextResponse.json({ error: msg.missingApartment }, { status: 400 });
  }

  const apt = getApartment(slug);
  if (!apt) {
    return NextResponse.json({ error: msg.apartmentNotFound }, { status: 404 });
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
    return NextResponse.json({ error: msg.fetchError }, { status: 500 });
  }
}

// POST /api/bookings
// Kreira novu rezervaciju
export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request);
  const msg = {
    missingFields:
      locale === 'en'
        ? 'Missing required fields'
        : locale === 'de'
          ? 'Erforderliche Felder fehlen'
          : 'Nedostaju obavezna polja',
    apartmentNotFound:
      locale === 'en'
        ? 'Apartment not found'
        : locale === 'de'
          ? 'Apartment nicht gefunden'
          : 'Apartman nije pronađen',
    apartmentUnavailable:
      locale === 'en'
        ? 'This apartment is not available for booking'
        : locale === 'de'
          ? 'Dieses Apartment ist nicht buchbar'
          : 'Ovaj apartman nije dostupan za rezervaciju',
    minStay:
      locale === 'en'
        ? 'Minimum stay is 2 nights'
        : locale === 'de'
          ? 'Mindestaufenthalt sind 2 Nächte'
          : 'Minimalni boravak su 2 noći',
    datesTaken:
      locale === 'en'
        ? 'Selected dates are already booked. Please choose different dates.'
        : locale === 'de'
          ? 'Die ausgewählten Termine sind bereits belegt. Bitte wählen Sie andere Daten.'
          : 'Odabrani termini su već zauzeti. Molimo odaberite druge datume.',
    createError:
      locale === 'en'
        ? 'Error creating booking. Please try again or contact us.'
        : locale === 'de'
          ? 'Fehler beim Erstellen der Buchung. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
          : 'Greška pri kreiranju rezervacije. Pokušajte ponovo ili nas kontaktirajte.',
  };

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
      return NextResponse.json({ error: msg.missingFields }, { status: 400 });
    }

    const apt = getApartment(apartment_slug);
    if (!apt) {
      return NextResponse.json({ error: msg.apartmentNotFound }, { status: 404 });
    }

    if (apt.fullyBooked) {
      return NextResponse.json(
        { error: msg.apartmentUnavailable },
        { status: 400 },
      );
    }

    const checkInDate = parseLocalDate(check_in);
    const checkOutDate = parseLocalDate(check_out);
    const nights = diffDays(checkOutDate, checkInDate);

    if (nights < 2) {
      return NextResponse.json(
        { error: msg.minStay },
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
        { error: msg.datesTaken },
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
      locale,
    });

    return NextResponse.json(
      { success: true, bookingId: booking.id, confirmationUrl },
      { status: 201 },
    );
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json(
      { error: msg.createError },
      { status: 500 },
    );
  }
}
