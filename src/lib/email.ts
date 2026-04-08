import { Resend } from 'resend';
import { formatDisplayDate } from './dates';
import { generateHUB3Buffer, generateEPCBuffer } from './barcodeUtils';
import { getSiteUrl } from './siteUrl';

export type BookingEmailData = {
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  apartmentName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalPrice: number;
  deposit: number;
  bookingId?: string; // koristi se za generiranje QR kodova i poziva na broj
};

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn('RESEND_API_KEY nije postavljen — emailovi se ne šalju');
    return null;
  }
  return new Resend(apiKey);
}

const FROM = () => process.env.RESEND_FROM?.trim() ?? 'onboarding@resend.dev';
const OWNER = () => process.env.OWNER_EMAIL?.trim() ?? 'villajurina@gmail.com';
const SITE_URL = () => getSiteUrl();
const PAYMENT_INSTRUCTIONS_URL = () => `${SITE_URL()}/upute-za-uplatu`;

// Šalje gost email (primljeno) + vlasnik email (nova rezervacija)
export async function sendNewBookingEmails(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) return;

  const checkInStr = formatDisplayDate(data.checkIn);
  const checkOutStr = formatDisplayDate(data.checkOut);
  const reference = data.bookingId
    ? `REZ-${data.bookingId.substring(0, 8).toUpperCase()}`
    : null;
  const fullData: FullData = { ...data, checkInStr, checkOutStr, reference };

  // Generiraj QR attachmente samo ako imamo booking ID
  const attachments: { filename: string; content: string }[] = [];
  if (reference) {
    const [hub3, epc] = await Promise.allSettled([
      generateHUB3Buffer(data.deposit, data.guestName, reference),
      generateEPCBuffer(data.deposit, data.guestName, reference),
    ]);
    if (hub3.status === 'fulfilled') {
      attachments.push({ filename: 'qr-uplata-hrvatska.png', content: hub3.value.toString('base64') });
    } else {
      console.error('[email] HUB3 barcode generation failed:', hub3.reason);
    }
    if (epc.status === 'fulfilled') {
      attachments.push({ filename: 'qr-uplata-eu.png', content: epc.value.toString('base64') });
    } else {
      console.error('[email] EPC QR generation failed:', epc.reason);
    }
  }

  const [guestResult, ownerResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM(),
      to: data.guestEmail,
      subject: `Potvrda rezervacije – Apartman ${data.apartmentName} | Villa Jurina`,
      html: guestReceivedHtml(fullData),
      ...(attachments.length > 0 && { attachments }),
    }),
    resend.emails.send({
      from: FROM(),
      to: OWNER(),
      subject: `Nova rezervacija – ${data.guestName} | Apartman ${data.apartmentName}`,
      html: ownerNewBookingHtml(fullData),
    }),
  ]);
  if (guestResult.status === 'rejected') {
    console.error('[email] Guest email failed:', guestResult.reason);
  } else if (guestResult.value.error) {
    console.error('[email] Guest email API error:', guestResult.value.error);
  }

  if (ownerResult.status === 'rejected') {
    console.error('[email] Owner email failed:', ownerResult.reason);
  } else if (ownerResult.value.error) {
    console.error('[email] Owner email API error:', ownerResult.value.error);
  }
}

// Šalje samo gostu — potvrda kad admin odobri rezervaciju
export async function sendConfirmationEmail(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) return;

  const checkInStr = formatDisplayDate(data.checkIn);
  const checkOutStr = formatDisplayDate(data.checkOut);
  const reference = data.bookingId
    ? `REZ-${data.bookingId.substring(0, 8).toUpperCase()}`
    : null;
  const fullData: FullData = { ...data, checkInStr, checkOutStr, reference };

  const attachments: { filename: string; content: string }[] = [];
  if (reference) {
    const [hub3, epc] = await Promise.allSettled([
      generateHUB3Buffer(data.deposit, data.guestName, reference),
      generateEPCBuffer(data.deposit, data.guestName, reference),
    ]);
    if (hub3.status === 'fulfilled') {
      attachments.push({ filename: 'qr-uplata-hrvatska.png', content: hub3.value.toString('base64') });
    } else {
      console.error('[email] HUB3 barcode generation failed:', hub3.reason);
    }
    if (epc.status === 'fulfilled') {
      attachments.push({ filename: 'qr-uplata-eu.png', content: epc.value.toString('base64') });
    } else {
      console.error('[email] EPC QR generation failed:', epc.reason);
    }
  }

  const result = await resend.emails.send({
    from: FROM(),
    to: data.guestEmail,
    subject: `Rezervacija potvrđena ✓ – Apartman ${data.apartmentName} | Villa Jurina`,
    html: guestConfirmedHtml(fullData),
    ...(attachments.length > 0 && { attachments }),
  });
  if (result.error) console.error('[email] Confirmation email failed:', result.error);
}

// Šalje obavijest vlasniku kad netko pošalje kontakt poruku
export async function sendContactEmail(opts: {
  senderName: string;
  senderEmail: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const result = await resend.emails.send({
    from: FROM(),
    to: OWNER(),
    subject: `Nova poruka s web stranice – ${opts.senderName}`,
    html: contactEmailHtml(opts),
  });

  if (result.error) {
    console.error('[email] Contact email API error:', result.error);
  }
}

// ── HTML predlošci ────────────────────────────────────────────────

type FullData = BookingEmailData & { checkInStr: string; checkOutStr: string; reference: string | null };

function guestReceivedHtml(d: FullData) {
  const pricePerNight = Math.round(d.totalPrice / d.nights);
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
      <p style="color: #6b7a85; line-height: 1.7;">Vaša rezervacija je uspješno zaprimljena. U nastavku emaila nalaze se upute za uplatu depozita; nakon evidentirane uplate rezervacija postaje važeća.</p>
      <div style="background: #fdf8f3; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #c4975a;">
        <h2 style="font-size: 16px; margin: 0 0 16px; color: #c4975a; text-transform: uppercase; letter-spacing: 1px;">Detalji rezervacije</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7a85; width: 140px;">Apartman</td><td style="font-weight: bold;">Apartman ${d.apartmentName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-in</td><td style="font-weight: bold;">${d.checkInStr} od 14:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-out</td><td style="font-weight: bold;">${d.checkOutStr} do 11:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Broj noći</td><td style="font-weight: bold;">${d.nights}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Cijena / noć</td><td style="font-weight: bold;">${pricePerNight}€</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Ukupno</td><td style="font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        </table>
      </div>
      <div style="background: #fff8e7; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; font-size: 15px;">Uplata depozita (30%)</h3>
        <p style="margin: 0; color: #6b7a85; font-size: 14px; line-height: 1.7;">
          Molimo uplatite <strong style="color: #1c2b35;">${d.deposit}€</strong> na račun u roku od 24 sata. Ako uplata ne bude evidentirana u tom roku, rezervacija se smatra nevažećom.
        </p>
        <div style="margin: 12px 0 0; background: #fff; border: 1px solid #f0e6d3; padding: 12px 14px; border-radius: 6px; font-size: 14px; line-height: 1.7;">
          <div><strong>Primatelj:</strong> Antonija Pušić</div>
          <div><strong>IBAN:</strong> HR6523900013223724831</div>
          <div><strong>BIC/SWIFT:</strong> HPBZHR2X</div>
          <div><strong>Banka:</strong> Hrvatska poštanska banka d.d.</div>
          <div><strong>Adresa banke:</strong> Jurišićeva 4, 10000 Zagreb, Croatia</div>
          <div><strong>Opis plaćanja:</strong> Rezervacija Villa Jurina</div>
        </div>
        <p style="margin: 8px 0 0; font-size: 13px; color: #6b7a85;">
          Poziv na broj: <strong style="color: #1c2b35;">${d.reference ?? `${d.guestName} — Apartman ${d.apartmentName}`}</strong>
        </p>
        <p style="margin: 10px 0 0; font-size: 13px; color: #6b7a85; line-height: 1.6;">
          Potvrdu rezervacije i upute za uplatu možete otvoriti i na:
          <a href="${PAYMENT_INSTRUCTIONS_URL()}" style="color: #1e4a5f; word-break: break-all;">${PAYMENT_INSTRUCTIONS_URL()}</a>
        </p>
        ${d.reference ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px 16px; margin-top: 14px; font-size: 13px; color: #0c4a6e; line-height: 1.6;">
          📎 <strong>QR kodovi za brzo plaćanje priloženi su uz ovaj email.</strong><br>
          Otvorite priložene datoteke i skenirajte odgovarajući kod:<br>
          &nbsp;· <em>qr-uplata-hrvatska.png</em> — za m-zaba, m-keks, Erste, OTP, PBZ...<br>
          &nbsp;· <em>qr-uplata-eu.png</em> — za Revolut, N26, Wise i ostale SEPA banke
        </div>` : ''}
      </div>
      <p style="color: #6b7a85; font-size: 14px; line-height: 1.7;">
        Za sva pitanja slobodno nas kontaktirajte na <a href="mailto:villajurina@gmail.com" style="color: #1e4a5f;">villajurina@gmail.com</a> ili WhatsApp: 091 6391 305.
      </p>
    </div>
    <div style="background: #f0e6d3; padding: 20px 40px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6b7a85;">Villa Jurina · Drašnice 133, Podgora · villajurina@gmail.com</p>
    </div>
  </div>
</body>
</html>`;
}

function guestConfirmedHtml(d: FullData) {
  const pricePerNight = Math.round(d.totalPrice / d.nights);
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
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; font-size: 16px; color: #166534; font-weight: bold;">✓ Rezervacija je potvrđena!</p>
      </div>
      <p style="font-size: 18px; margin-top: 0;">Poštovani/a ${d.guestName},</p>
      <p style="color: #6b7a85; line-height: 1.7;">Drago nam je potvrditi vašu rezervaciju. Veselimo se vašem dolasku!</p>
      <div style="background: #fdf8f3; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #c4975a;">
        <h2 style="font-size: 16px; margin: 0 0 16px; color: #c4975a; text-transform: uppercase; letter-spacing: 1px;">Detalji rezervacije</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7a85; width: 140px;">Apartman</td><td style="font-weight: bold;">Apartman ${d.apartmentName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-in</td><td style="font-weight: bold;">${d.checkInStr} od 14:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-out</td><td style="font-weight: bold;">${d.checkOutStr} do 11:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Broj noći</td><td style="font-weight: bold;">${d.nights}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Cijena / noć</td><td style="font-weight: bold;">${pricePerNight}€</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Ukupno</td><td style="font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        </table>
      </div>
      <div style="background: #fff8e7; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px; font-size: 15px;">Depozit (30% = ${d.deposit}€)</h3>
        <p style="margin: 0; color: #6b7a85; font-size: 14px; line-height: 1.7;">
          Ako još niste platili depozit, molimo uplatite ga u roku od 24 sata. Ako uplata ne bude evidentirana u tom roku, rezervacija se smatra nevažećom.
        </p>
        <div style="margin: 12px 0 0; background: #fff; border: 1px solid #f0e6d3; padding: 12px 14px; border-radius: 6px; font-size: 14px; line-height: 1.7;">
          <div><strong>Primatelj:</strong> Antonija Pušić</div>
          <div><strong>IBAN:</strong> HR6523900013223724831</div>
          <div><strong>BIC/SWIFT:</strong> HPBZHR2X</div>
          <div><strong>Banka:</strong> Hrvatska poštanska banka d.d.</div>
          <div><strong>Adresa banke:</strong> Jurišićeva 4, 10000 Zagreb, Croatia</div>
          <div><strong>Opis plaćanja:</strong> Rezervacija Villa Jurina</div>
        </div>
        <p style="margin: 8px 0 0; font-size: 13px; color: #6b7a85;">
          Poziv na broj: <strong style="color: #1c2b35;">${d.reference ?? `${d.guestName} — Apartman ${d.apartmentName}`}</strong>
        </p>
        <p style="margin: 10px 0 0; font-size: 13px; color: #6b7a85; line-height: 1.6;">
          Potvrdu rezervacije i upute za uplatu možete otvoriti i na:
          <a href="${PAYMENT_INSTRUCTIONS_URL()}" style="color: #1e4a5f; word-break: break-all;">${PAYMENT_INSTRUCTIONS_URL()}</a>
        </p>
        ${d.reference ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px 16px; margin-top: 14px; font-size: 13px; color: #0c4a6e; line-height: 1.6;">
          📎 <strong>QR kodovi za brzo plaćanje priloženi su uz ovaj email.</strong><br>
          Otvorite priložene datoteke i skenirajte odgovarajući kod:<br>
          &nbsp;· <em>qr-uplata-hrvatska.png</em> — za m-zaba, m-keks, Erste, OTP, PBZ...<br>
          &nbsp;· <em>qr-uplata-eu.png</em> — za Revolut, N26, Wise i ostale SEPA banke
        </div>` : ''}
      </div>
      <p style="color: #6b7a85; font-size: 14px; line-height: 1.7;">
        Za sva pitanja slobodno nas kontaktirajte na <a href="mailto:villajurina@gmail.com" style="color: #1e4a5f;">villajurina@gmail.com</a> ili WhatsApp: 091 6391 305.
      </p>
    </div>
    <div style="background: #f0e6d3; padding: 20px 40px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6b7a85;">Villa Jurina · Drašnice 133, Podgora · villajurina@gmail.com</p>
    </div>
  </div>
</body>
</html>`;
}

function ownerNewBookingHtml(d: FullData) {
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

function contactEmailHtml(d: { senderName: string; senderEmail: string; message: string }) {
  return `
<!DOCTYPE html>
<html lang="hr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #1c2b35; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: #1e4a5f; padding: 24px 32px;">
      <h1 style="color: #ffffff; font-size: 20px; margin: 0;">Nova poruka s web stranice</h1>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 12px; color: #6b7a85; width: 80px;">Ime</td><td style="padding: 8px 12px; font-weight: bold;">${d.senderName}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Email</td><td style="padding: 8px 12px;"><a href="mailto:${d.senderEmail}">${d.senderEmail}</a></td></tr>
      </table>
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #374151; line-height: 1.7; white-space: pre-wrap;">${d.message}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
