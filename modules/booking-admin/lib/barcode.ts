import bwipjs from 'bwip-js/node';
import QRCode from 'qrcode';
import { RECIPIENT_NAME, RECIPIENT_IBAN } from '../booking.config';

const CURRENCY = 'EUR';

function normalizeCroatian(str: string): string {
  const map: Record<string, string> = {
    č: 'c', ć: 'c', đ: 'd', š: 's', ž: 'z',
    Č: 'C', Ć: 'C', Đ: 'D', Š: 'S', Ž: 'Z',
  };
  return str.replace(/[čćđšžČĆĐŠŽ]/g, (c) => map[c] ?? c);
}

/** HUB3 PDF417 2D barcode za hrvatske banke (m-zaba, m-keks, Erste, OTP...) */
export function formatHUB3String(amount: number, guestName: string, reference: string): string {
  const amountCents = Math.round(amount * 100).toString();
  const normalizedPayer = normalizeCroatian(guestName);

  return [
    'HRVHUB30',
    CURRENCY,
    amountCents,
    '', '', '',
    RECIPIENT_NAME,
    '', '',
    RECIPIENT_IBAN,
    'HR00',
    reference,
    '',
    normalizedPayer,
    '', '',
  ].join('\n');
}

/** EPC/SEPA QR za EU banke (Revolut, N26, Wise, SEPA banke) */
export function formatEPCString(amount: number, guestName: string, reference: string): string {
  const amountFormatted = `EUR${amount.toFixed(2)}`;
  const remittance = `${normalizeCroatian(guestName)} - ${reference}`.substring(0, 140);

  return [
    'BCD', '002', '1', 'SCT',
    '',
    RECIPIENT_NAME,
    RECIPIENT_IBAN,
    amountFormatted,
    '', '',
    remittance, '',
  ].join('\n');
}

const PDF417_OPTS = { bcid: 'pdf417', scale: 5, height: 14, includetext: false } as const;
const QR_OPTS = { errorCorrectionLevel: 'M' as const, margin: 2, width: 300 };

// ── Buffer verzije — za email attachments ────────────────────────

export async function generateHUB3Buffer(
  amount: number,
  guestName: string,
  reference: string,
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (bwipjs as any).toBuffer({ ...PDF417_OPTS, text: formatHUB3String(amount, guestName, reference) });
}

export async function generateEPCBuffer(
  amount: number,
  guestName: string,
  reference: string,
): Promise<Buffer> {
  return QRCode.toBuffer(formatEPCString(amount, guestName, reference), QR_OPTS);
}

// ── Data URL verzije — za frontend prikaz ────────────────────────

export async function generateHUB3Barcode(
  amount: number,
  guestName: string,
  reference: string,
): Promise<string> {
  const png = await generateHUB3Buffer(amount, guestName, reference);
  return `data:image/png;base64,${png.toString('base64')}`;
}

export async function generateEPCQR(
  amount: number,
  guestName: string,
  reference: string,
): Promise<string> {
  return QRCode.toDataURL(formatEPCString(amount, guestName, reference), QR_OPTS);
}
