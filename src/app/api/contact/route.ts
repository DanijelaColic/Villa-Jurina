import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Sva polja su obavezna' }, { status: 400 });
    }

    if (typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Poruka je prekratka' }, { status: 400 });
    }

    await sendContactEmail({
      senderName: name,
      senderEmail: email,
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Greška pri slanju poruke' }, { status: 500 });
  }
}
