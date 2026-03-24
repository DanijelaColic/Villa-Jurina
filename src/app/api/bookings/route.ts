import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getApartment } from '@/lib/apartments';
import { parseLocalDate, isRangeAvailable, diffDays, formatDisplayDate } from '@/lib/dates';
import { Resend } from 'resend';

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

  // Ako je apartman zauzet cijelu sezonu — vrati blokiran raspon
  if (apt.fullyBooked) {
    return NextResponse.json([{ check_in: '2025-06-01', check_out: '2025-10-01' }]);
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

    // Slanje emailova
    await sendEmails({
      guestName: guest_name,
      guestEmail: guest_email,
      guestPhone: guest_phone,
      apartmentName: apt.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      totalPrice,
      deposit,
    });

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json(
      { error: 'Greška pri kreiranju rezervacije. Pokušajte ponovo ili nas kontaktirajte.' },
      { status: 500 },
    );
  }
}

// ── Email notifikacije ──────────────────────────────────────────────

type EmailData = {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  apartmentName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalPrice: number;
  deposit: number;
};

async function sendEmails(data: EmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL ?? 'villajurina@gmail.com';

  if (!apiKey) {
    console.warn('RESEND_API_KEY nije postavljen — emailovi se ne šalju');
    return;
  }

  const resend = new Resend(apiKey);

  const checkInStr = formatDisplayDate(data.checkIn);
  const checkOutStr = formatDisplayDate(data.checkOut);

  const fromAddress = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

  // Email gostu
  await resend.emails.send({
    from: fromAddress,
    to: data.guestEmail,
    subject: `Potvrda rezervacije – Apartman ${data.apartmentName} | Villa Jurina`,
    html: guestEmailHtml({ ...data, checkInStr, checkOutStr }),
  });

  // Email vlasniku
  await resend.emails.send({
    from: fromAddress,
    to: ownerEmail,
    subject: `Nova rezervacija – ${data.guestName} | Apartman ${data.apartmentName}`,
    html: ownerEmailHtml({ ...data, checkInStr, checkOutStr }),
  });
}

function guestEmailHtml(d: EmailData & { checkInStr: string; checkOutStr: string }) {
  return `
<!DOCTYPE html>
<html lang="hr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Georgia, serif; color: #1c2b35; background: #fdfcfa; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #f0e6d3; border-radius: 12px; overflow: hidden;">
    
    <div style="background: #1e4a5f; padding: 32px 40px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 1px;">Villa Jurina</h1>
      <p style="color: #c4975a; margin: 8px 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Drašnice · Makarska rivijera</p>
    </div>

    <div style="padding: 40px;">
      <p style="font-size: 18px; margin-top: 0;">Poštovani/a ${d.guestName},</p>
      <p style="color: #6b7a85; line-height: 1.7;">Vaša rezervacija je uspješno primljena. Kontaktirat ćemo vas u kratkom roku s potvrdom i uputama za plaćanje depozita.</p>

      <div style="background: #fdf8f3; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #c4975a;">
        <h2 style="font-size: 16px; margin: 0 0 16px; color: #c4975a; text-transform: uppercase; letter-spacing: 1px;">Detalji rezervacije</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7a85; width: 140px;">Apartman</td><td style="font-weight: bold;">Apartman ${d.apartmentName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-in</td><td style="font-weight: bold;">${d.checkInStr} od 14:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-out</td><td style="font-weight: bold;">${d.checkOutStr} do 11:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Broj noći</td><td style="font-weight: bold;">${d.nights}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Ukupno</td><td style="font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        </table>
      </div>

      <div style="background: #fff8e7; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; font-size: 15px;">Uplata depozita (30%)</h3>
        <p style="margin: 0; color: #6b7a85; font-size: 14px; line-height: 1.7;">
          Molimo uplatite <strong style="color: #1c2b35;">${d.deposit}€</strong> na račun u roku od 24 sata kako bismo potvrdili vašu rezervaciju:
        </p>
        <p style="margin: 12px 0 0; font-family: monospace; background: #fff; border: 1px solid #f0e6d3; padding: 10px 14px; border-radius: 6px; font-size: 14px;">
          IBAN: HR6523900013223724831
        </p>
        <p style="margin: 8px 0 0; font-size: 13px; color: #6b7a85;">Poziv na broj: Vaše ime i prezime — ${d.apartmentName}</p>
      </div>

      <p style="color: #6b7a85; font-size: 14px; line-height: 1.7;">
        Za sva pitanja slobodno nas kontaktirajte na <a href="mailto:villajurina@gmail.com" style="color: #1e4a5f;">villajurina@gmail.com</a> ili WhatsApp: 091 6391 305.
      </p>
    </div>

    <div style="background: #f0e6d3; padding: 20px 40px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6b7a85;">Villa Jurina · Soline 116, Drašnice · villajurina@gmail.com</p>
    </div>
  </div>
</body>
</html>`;
}

function ownerEmailHtml(d: EmailData & { checkInStr: string; checkOutStr: string }) {
  return `
<!DOCTYPE html>
<html lang="hr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #1c2b35; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: #1e4a5f; padding: 24px 32px;">
      <h1 style="color: #ffffff; font-size: 20px; margin: 0;">Nova rezervacija 🏠</h1>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #fdf8f3;"><td colspan="2" style="padding: 10px 12px; font-weight: bold; font-size: 15px; color: #c4975a;">Apartman ${d.apartmentName}</td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85; width: 130px;">Gost</td><td style="padding: 8px 12px; font-weight: bold;">${d.guestName}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Email</td><td style="padding: 8px 12px;"><a href="mailto:${d.guestEmail}">${d.guestEmail}</a></td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85;">Telefon</td><td style="padding: 8px 12px;">${d.guestPhone ?? '—'}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Check-in</td><td style="padding: 8px 12px; font-weight: bold;">${d.checkInStr}</td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85;">Check-out</td><td style="padding: 8px 12px; font-weight: bold;">${d.checkOutStr}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Noći</td><td style="padding: 8px 12px;">${d.nights}</td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85;">Ukupno</td><td style="padding: 8px 12px; font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Depozit</td><td style="padding: 8px 12px;">${d.deposit}€</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}
