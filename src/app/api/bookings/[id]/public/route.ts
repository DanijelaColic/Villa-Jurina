import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getApartment } from '@/lib/apartments';
import { formatDisplayDate, parseLocalDate } from '@/lib/dates';
import { verifyBookingViewToken } from '@/lib/bookingConfirmation';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = new URL(request.url).searchParams.get('token')?.trim() ?? '';

    if (!id || !token) {
      return NextResponse.json({ error: 'Nedostaju parametri' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(
        'id, apartment_slug, check_in, check_out, nights, guest_name, guest_email, total_price, deposit, status, created_at',
      )
      .eq('id', id)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Rezervacija nije pronađena' }, { status: 404 });
    }

    if (!verifyBookingViewToken(token, booking.id, booking.guest_email)) {
      return NextResponse.json({ error: 'Nevažeći pristupni token' }, { status: 403 });
    }

    const apartment = getApartment(booking.apartment_slug);
    const checkInDate = parseLocalDate(booking.check_in);
    const checkOutDate = parseLocalDate(booking.check_out);
    const pricePerNight =
      booking.nights > 0 ? Math.round(booking.total_price / booking.nights) : booking.total_price;

    return NextResponse.json({
      id: booking.id,
      reference: `REZ-${booking.id.substring(0, 8).toUpperCase()}`,
      status: booking.status,
      guestName: booking.guest_name,
      apartmentName: apartment?.name ?? booking.apartment_slug,
      checkIn: formatDisplayDate(checkInDate),
      checkOut: formatDisplayDate(checkOutDate),
      nights: booking.nights,
      pricePerNight,
      totalPrice: booking.total_price,
      deposit: booking.deposit,
      createdAt: booking.created_at,
      payment: {
        recipient: 'Antonija Pušić',
        iban: 'HR6523900013223724831',
        bic: 'HPBZHR2X',
        bankName: 'Hrvatska poštanska banka d.d.',
        bankAddress: 'Jurišićeva 4, 10000 Zagreb, Croatia',
        description: 'Rezervacija Villa Jurina',
      },
    });
  } catch (error) {
    console.error('GET /api/bookings/[id]/public error:', error);
    return NextResponse.json({ error: 'Greška pri dohvaćanju potvrde rezervacije' }, { status: 500 });
  }
}
