import type { BookedRange } from '../types';
import type { Apartment } from '../types';
import { HIGH_SEASON_MONTHS, HIGH_SEASON_LABEL, OFF_SEASON_LABEL, DEPOSIT_PERCENT } from '../booking.config';
import type { PriceBreakdown } from '../types';

// ── Lokalizirani nazivi — prilagodi po potrebi ────────────────────

export const MONTHS_HR = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac',
];

export const DAYS_HR = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];

// ── Osnovni date helpers ──────────────────────────────────────────

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return !isSameDay(a, b) && a < b;
}

export function diffDays(later: Date, earlier: Date): number {
  return Math.round((later.getTime() - earlier.getTime()) / 86400000);
}

/** Parsira "YYYY-MM-DD" bez timezone konverzije */
export function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('hr-HR', { day: 'numeric', month: 'short' });
}

// ── Dostupnost ────────────────────────────────────────────────────

/** Dan je zauzet ako check_in <= dan < check_out */
export function isDateBooked(date: Date, ranges: BookedRange[]): boolean {
  return ranges.some(({ check_in, check_out }) => {
    const ci = parseLocalDate(check_in);
    const co = parseLocalDate(check_out);
    return date >= ci && date < co;
  });
}

export function isRangeAvailable(
  checkIn: Date,
  checkOut: Date,
  ranges: BookedRange[],
): boolean {
  let d = new Date(checkIn);
  while (d < checkOut) {
    if (isDateBooked(d, ranges)) return false;
    d = addDays(d, 1);
  }
  return true;
}

/** Pronađi prvi zauzeti dan strogo nakon checkIn (granica za checkout selekciju) */
export function getFirstBlockedAfter(checkIn: Date, ranges: BookedRange[]): Date | null {
  let d = addDays(checkIn, 1);
  for (let i = 0; i < 365; i++) {
    if (isDateBooked(d, ranges)) return d;
    d = addDays(d, 1);
  }
  return null;
}

// ── Kalendar ──────────────────────────────────────────────────────

/** Generiraj grid za prikaz mjeseca (null za prazne ćelije, ponedjeljak = 0) */
export function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const grid: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(new Date(year, month, d));
  }
  return grid;
}

// ── Cijena ───────────────────────────────────────────────────────
// Visoka sezona je definirana u booking.config.ts (HIGH_SEASON_MONTHS)

export function calculatePrice(
  checkIn: Date,
  checkOut: Date,
  apartment: Apartment,
): PriceBreakdown {
  let lowNights = 0;
  let highNights = 0;

  let d = new Date(checkIn);
  while (d < checkOut) {
    const month = d.getMonth() + 1;
    if (HIGH_SEASON_MONTHS.includes(month)) highNights++;
    else lowNights++;
    d = addDays(d, 1);
  }

  const lines: PriceBreakdown['lines'] = [];

  if (lowNights > 0) {
    lines.push({
      label: OFF_SEASON_LABEL,
      nights: lowNights,
      pricePerNight: apartment.priceOffSeason,
      subtotal: lowNights * apartment.priceOffSeason,
    });
  }

  if (highNights > 0) {
    lines.push({
      label: HIGH_SEASON_LABEL,
      nights: highNights,
      pricePerNight: apartment.priceHighSeason,
      subtotal: highNights * apartment.priceHighSeason,
    });
  }

  const totalPrice = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const deposit = Math.round(totalPrice * DEPOSIT_PERCENT);

  return {
    nights: lowNights + highNights,
    totalPrice,
    deposit,
    lines,
  };
}
