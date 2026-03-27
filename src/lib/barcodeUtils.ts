import bwipjs from 'bwip-js/node';
import QRCode from 'qrcode';

const RECIPIENT_NAME = 'Antonija Pušić';
const RECIPIENT_IBAN = 'HR6523900013223724831';
const CURRENCY = 'EUR';

function normalizeCroatian(str: string): string {
  const map: Record<string, string> = {
    č: 'c',
    ć: 'c',
    đ: 'd',
    š: 's',
    ž: 'z',
    Č: 'C',
    Ć: 'C',
    Đ: 'D',
    Š: 'S',
    Ž: 'Z',
  };
  return str.replace(/[čćđšžČĆĐŠŽ]/g, (c) => map[c] ?? c);
}

// HUB3 format — PDF417 2D barcode za hrvatske banke (m-zaba, m-keks, Erste, OTP...)
export function formatHUB3String(amount: number, guestName: string, reference: string): string {
  const amountCents = Math.round(amount * 100).toString();
  const normalizedPayer = normalizeCroatian(guestName);

  return [
    'HRVHUB30',
    CURRENCY,
    amountCents,
    '', // reserved
    '',
    '',
    RECIPIENT_NAME, // točno ime vlasnika računa (s dijakritikama)
    '', // adresa (optional)
    '', // adresa (optional)
    RECIPIENT_IBAN,
    'HR00',
    reference, // poziv na broj
    '', // MUST be empty per HUB3 spec
    normalizedPayer, // ime platitelja (normalized)
    '',
    '',
  ].join('\n');
}

// EPC/SEPA format — standardni QR kod za EU banke (Revolut, N26, Wise, SEPA banke)
export function formatEPCString(amount: number, guestName: string, reference: string): string {
  const amountFormatted = `EUR${amount.toFixed(2)}`;
  const remittance = `${normalizeCroatian(guestName)} - ${reference}`.substring(0, 140);

  return [
    'BCD',
    '002',
    '1',
    'SCT',
    '', // BIC (nije obavezan za SEPA unutar HR/EU)
    RECIPIENT_NAME,
    RECIPIENT_IBAN,
    amountFormatted,
    '', // purpose (optional)
    '', // structured reference
    remittance, // unstructured remittance
    '', // info to originator
  ].join('\n');
}

const PDF417_OPTS = { bcid: 'pdf417', scale: 5, height: 14, includetext: false } as const;
const QR_OPTS = { errorCorrectionLevel: 'M' as const, margin: 2, width: 300 };

// ── Buffer verzije — za email attachments ─────────────────────────

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

// ── Data URL verzije — za frontend prikaz ─────────────────────────

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
