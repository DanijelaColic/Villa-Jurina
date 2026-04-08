import { Resend } from 'resend';
import { formatDisplayDate } from './dates';
import { generateHUB3Buffer, generateEPCBuffer } from './barcode';
import {
  SITE_NAME,
  SITE_LOCATION,
  OWNER_EMAIL,
  OWNER_PHONE,
  OWNER_WHATSAPP,
  RECIPIENT_IBAN,
  DEPOSIT_PERCENT,
} from '../booking.config';
import type { BookingEmailData } from '../types';

export type { BookingEmailData };

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — emails will not be sent');
    return null;
  }
  return new Resend(apiKey);
}

const FROM = () => process.env.RESEND_FROM ?? 'onboarding@resend.dev';
// Owner inbox je fiksan kako bi sve poruke išle samo na jednu adresu.
const OWNER = () => 'villajurina@gmail.com';
const DEPOSIT_PCT_DISPLAY = Math.round(DEPOSIT_PERCENT * 100);

/** Šalje gost email (potvrda primitka) + vlasnik email (nova rezervacija) */
export async function sendNewBookingEmails(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) return;

  const checkInStr = formatDisplayDate(data.checkIn);
  const checkOutStr = formatDisplayDate(data.checkOut);
  const reference = data.bookingId
    ? `REZ-${data.bookingId.substring(0, 8).toUpperCase()}`
    : null;
  const fullData: FullData = { ...data, checkInStr, checkOutStr, reference };

  const attachments: { filename: string; content: string }[] = [];
  if (reference && RECIPIENT_IBAN) {
    const [hub3, epc] = await Promise.allSettled([
      generateHUB3Buffer(data.deposit, data.guestName, reference),
      generateEPCBuffer(data.deposit, data.guestName, reference),
    ]);
    if (hub3.status === 'fulfilled') {
      attachments.push({ filename: 'qr-payment-hr.png', content: hub3.value.toString('base64') });
    } else {
      console.error('[email] HUB3 generation failed:', hub3.reason);
    }
    if (epc.status === 'fulfilled') {
      attachments.push({ filename: 'qr-payment-eu.png', content: epc.value.toString('base64') });
    } else {
      console.error('[email] EPC QR generation failed:', epc.reason);
    }
  }

  const [guestResult, ownerResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM(),
      to: data.guestEmail,
      subject: `Booking received – ${data.apartmentName} | ${SITE_NAME}`,
      html: guestReceivedHtml(fullData),
      ...(attachments.length > 0 && { attachments }),
    }),
    resend.emails.send({
      from: FROM(),
      to: OWNER(),
      subject: `New booking – ${data.guestName} | ${data.apartmentName}`,
      html: ownerNewBookingHtml(fullData),
    }),
  ]);

  if (guestResult.status === 'rejected') console.error('[email] Guest email failed:', guestResult.reason);
  if (ownerResult.status === 'rejected') console.error('[email] Owner email failed:', ownerResult.reason);
}

/** Šalje samo gostu — potvrda kad admin odobri rezervaciju */
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
  if (reference && RECIPIENT_IBAN) {
    const [hub3, epc] = await Promise.allSettled([
      generateHUB3Buffer(data.deposit, data.guestName, reference),
      generateEPCBuffer(data.deposit, data.guestName, reference),
    ]);
    if (hub3.status === 'fulfilled') {
      attachments.push({ filename: 'qr-payment-hr.png', content: hub3.value.toString('base64') });
    }
    if (epc.status === 'fulfilled') {
      attachments.push({ filename: 'qr-payment-eu.png', content: epc.value.toString('base64') });
    }
  }

  const result = await resend.emails.send({
    from: FROM(),
    to: data.guestEmail,
    subject: `Booking confirmed ✓ – ${data.apartmentName} | ${SITE_NAME}`,
    html: guestConfirmedHtml(fullData),
    ...(attachments.length > 0 && { attachments }),
  });

  if (result.error) console.error('[email] Confirmation email failed:', result.error);
}

/** Šalje obavijest vlasniku o kontakt poruci */
export async function sendContactEmail(opts: {
  senderName: string;
  senderEmail: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM(),
    to: OWNER(),
    subject: `New contact message – ${opts.senderName}`,
    html: contactEmailHtml(opts),
  });
}

// ── HTML predlošci ────────────────────────────────────────────────

type FullData = BookingEmailData & {
  checkInStr: string;
  checkOutStr: string;
  reference: string | null;
};

function guestReceivedHtml(d: FullData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Georgia, serif; color: #1c2b35; background: #fdfcfa; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #f0e6d3; border-radius: 12px; overflow: hidden;">
    <div style="background: #1e4a5f; padding: 32px 40px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 1px;">${SITE_NAME}</h1>
      ${SITE_LOCATION ? `<p style="color: #c4975a; margin: 8px 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">${SITE_LOCATION}</p>` : ''}
    </div>
    <div style="padding: 40px;">
      <p style="font-size: 18px; margin-top: 0;">Dear ${d.guestName},</p>
      <p style="color: #6b7a85; line-height: 1.7;">Your booking request has been received. We will contact you shortly with confirmation and payment instructions.</p>
      <div style="background: #fdf8f3; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #c4975a;">
        <h2 style="font-size: 16px; margin: 0 0 16px; color: #c4975a; text-transform: uppercase; letter-spacing: 1px;">Booking details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7a85; width: 140px;">Apartment</td><td style="font-weight: bold;">${d.apartmentName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-in</td><td style="font-weight: bold;">${d.checkInStr} from 14:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-out</td><td style="font-weight: bold;">${d.checkOutStr} by 11:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Nights</td><td style="font-weight: bold;">${d.nights}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Total</td><td style="font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        </table>
      </div>
      ${RECIPIENT_IBAN ? `
      <div style="background: #fff8e7; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; font-size: 15px;">Deposit (${DEPOSIT_PCT_DISPLAY}%)</h3>
        <p style="margin: 0; color: #6b7a85; font-size: 14px; line-height: 1.7;">
          Please pay <strong style="color: #1c2b35;">${d.deposit}€</strong> within 24 hours:
        </p>
        <p style="margin: 12px 0 0; font-family: monospace; background: #fff; border: 1px solid #f0e6d3; padding: 10px 14px; border-radius: 6px; font-size: 14px;">
          IBAN: ${RECIPIENT_IBAN}
        </p>
        <p style="margin: 8px 0 0; font-size: 13px; color: #6b7a85;">
          Reference: <strong style="color: #1c2b35;">${d.reference ?? `${d.guestName} — ${d.apartmentName}`}</strong>
        </p>
        ${d.reference ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px 16px; margin-top: 14px; font-size: 13px; color: #0c4a6e; line-height: 1.6;">
          📎 <strong>QR payment codes are attached to this email.</strong><br>
          Open the attached files and scan the appropriate code:<br>
          &nbsp;· <em>qr-payment-hr.png</em> — for Croatian banks (HUB3 format)<br>
          &nbsp;· <em>qr-payment-eu.png</em> — for Revolut, N26, Wise and other SEPA banks
        </div>` : ''}
      </div>` : ''}
      ${OWNER_EMAIL ? `
      <p style="color: #6b7a85; font-size: 14px; line-height: 1.7;">
        For any questions, contact us at <a href="mailto:${OWNER_EMAIL}" style="color: #1e4a5f;">${OWNER_EMAIL}</a>${OWNER_PHONE ? ` or ${OWNER_PHONE}` : ''}.
      </p>` : ''}
    </div>
    <div style="background: #f0e6d3; padding: 20px 40px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6b7a85;">${SITE_NAME}${OWNER_EMAIL ? ` · ${OWNER_EMAIL}` : ''}</p>
    </div>
  </div>
</body>
</html>`;
}

function guestConfirmedHtml(d: FullData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Georgia, serif; color: #1c2b35; background: #fdfcfa; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #f0e6d3; border-radius: 12px; overflow: hidden;">
    <div style="background: #1e4a5f; padding: 32px 40px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 1px;">${SITE_NAME}</h1>
      ${SITE_LOCATION ? `<p style="color: #c4975a; margin: 8px 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">${SITE_LOCATION}</p>` : ''}
    </div>
    <div style="padding: 40px;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; font-size: 16px; color: #166534; font-weight: bold;">✓ Booking confirmed!</p>
      </div>
      <p style="font-size: 18px; margin-top: 0;">Dear ${d.guestName},</p>
      <p style="color: #6b7a85; line-height: 1.7;">We are pleased to confirm your booking. We look forward to welcoming you!</p>
      <div style="background: #fdf8f3; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #c4975a;">
        <h2 style="font-size: 16px; margin: 0 0 16px; color: #c4975a; text-transform: uppercase; letter-spacing: 1px;">Booking details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7a85; width: 140px;">Apartment</td><td style="font-weight: bold;">${d.apartmentName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-in</td><td style="font-weight: bold;">${d.checkInStr} from 14:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Check-out</td><td style="font-weight: bold;">${d.checkOutStr} by 11:00</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Nights</td><td style="font-weight: bold;">${d.nights}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7a85;">Total</td><td style="font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        </table>
      </div>
      ${RECIPIENT_IBAN ? `
      <div style="background: #fff8e7; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px; font-size: 15px;">Deposit (${DEPOSIT_PCT_DISPLAY}% = ${d.deposit}€)</h3>
        <p style="margin: 0; color: #6b7a85; font-size: 14px; line-height: 1.7;">
          If you haven't paid the deposit yet, please do so as soon as possible:
        </p>
        <p style="margin: 12px 0 0; font-family: monospace; background: #fff; border: 1px solid #f0e6d3; padding: 10px 14px; border-radius: 6px; font-size: 14px;">
          IBAN: ${RECIPIENT_IBAN}
        </p>
        <p style="margin: 8px 0 0; font-size: 13px; color: #6b7a85;">
          Reference: <strong style="color: #1c2b35;">${d.reference ?? `${d.guestName} — ${d.apartmentName}`}</strong>
        </p>
        ${d.reference ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px 16px; margin-top: 14px; font-size: 13px; color: #0c4a6e; line-height: 1.6;">
          📎 <strong>QR payment codes are attached to this email.</strong><br>
          &nbsp;· <em>qr-payment-hr.png</em> — Croatian banks (HUB3)<br>
          &nbsp;· <em>qr-payment-eu.png</em> — Revolut, N26, Wise, SEPA banks
        </div>` : ''}
      </div>` : ''}
      ${OWNER_EMAIL ? `
      <p style="color: #6b7a85; font-size: 14px; line-height: 1.7;">
        Questions? Contact us at <a href="mailto:${OWNER_EMAIL}" style="color: #1e4a5f;">${OWNER_EMAIL}</a>${OWNER_PHONE ? ` or ${OWNER_PHONE}` : ''}.
      </p>` : ''}
    </div>
    <div style="background: #f0e6d3; padding: 20px 40px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6b7a85;">${SITE_NAME}${OWNER_EMAIL ? ` · ${OWNER_EMAIL}` : ''}</p>
    </div>
  </div>
</body>
</html>`;
}

function ownerNewBookingHtml(d: FullData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #1c2b35; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: #1e4a5f; padding: 24px 32px;">
      <h1 style="color: #ffffff; font-size: 20px; margin: 0;">New booking 🏠</h1>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #fdf8f3;"><td colspan="2" style="padding: 10px 12px; font-weight: bold; font-size: 15px; color: #c4975a;">${d.apartmentName}</td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85; width: 130px;">Guest</td><td style="padding: 8px 12px; font-weight: bold;">${d.guestName}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Email</td><td style="padding: 8px 12px;"><a href="mailto:${d.guestEmail}">${d.guestEmail}</a></td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85;">Phone</td><td style="padding: 8px 12px;">${d.guestPhone ?? '—'}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Check-in</td><td style="padding: 8px 12px; font-weight: bold;">${d.checkInStr}</td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85;">Check-out</td><td style="padding: 8px 12px; font-weight: bold;">${d.checkOutStr}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Nights</td><td style="padding: 8px 12px;">${d.nights}</td></tr>
        <tr><td style="padding: 8px 12px; color: #6b7a85;">Total</td><td style="padding: 8px 12px; font-weight: bold; font-size: 18px; color: #1e4a5f;">${d.totalPrice}€</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 8px 12px; color: #6b7a85;">Deposit</td><td style="padding: 8px 12px;">${d.deposit}€</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

function contactEmailHtml(d: { senderName: string; senderEmail: string; message: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #1c2b35; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: #1e4a5f; padding: 24px 32px;">
      <h1 style="color: #ffffff; font-size: 20px; margin: 0;">New contact message</h1>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 12px; color: #6b7a85; width: 80px;">Name</td><td style="padding: 8px 12px; font-weight: bold;">${d.senderName}</td></tr>
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
