import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { getRequestLocale } from '@/lib/requestLocale';

export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request);
  const msg = {
    required:
      locale === 'en'
        ? 'All fields are required'
        : locale === 'de'
          ? 'Alle Felder sind erforderlich'
          : 'Sva polja su obavezna',
    tooShort:
      locale === 'en'
        ? 'Message is too short'
        : locale === 'de'
          ? 'Nachricht ist zu kurz'
          : 'Poruka je prekratka',
    sendError:
      locale === 'en'
        ? 'Error while sending message'
        : locale === 'de'
          ? 'Fehler beim Senden der Nachricht'
          : 'Greška pri slanju poruke',
  };

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: msg.required }, { status: 400 });
    }

    if (typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: msg.tooShort }, { status: 400 });
    }

    await sendContactEmail({
      senderName: name,
      senderEmail: email,
      message: message.trim(),
      locale,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: msg.sendError }, { status: 500 });
  }
}
