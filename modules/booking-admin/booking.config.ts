/**
 * booking.config.ts — projekt-specifična konfiguracija booking modula
 *
 * UPUTE:
 * 1. Kopiraj ovaj fajl u novi projekt (npr. src/modules/booking-admin/booking.config.ts)
 * 2. Popuni sve vrijednosti za svoj projekt
 * 3. Secrets (IBAN, email, lozinke) stavi u .env.local — ovaj fajl nemoj commitati
 *
 * Sve što se tiče konkretnog projekta dolazi odavde ili iz env varijabli.
 */

import type { Apartment } from './types';

// ── Brand ──────────────────────────────────────────────────────────
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Accommodation';
export const SITE_LOCATION = process.env.NEXT_PUBLIC_SITE_LOCATION ?? '';

/** Putanja do loga u /public/ mapi, koristi se na admin login stranici */
export const LOGO_PATH = process.env.NEXT_PUBLIC_LOGO_PATH ?? '/logo.png';

// ── Kontakt ───────────────────────────────────────────────────────
/** Email vlasniku koji prima obavijesti o novim rezervacijama */
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? '';

/** Prikazuje se gostu u email predlošcima */
export const OWNER_PHONE = process.env.OWNER_PHONE ?? '';

/** WhatsApp link, npr. https://wa.me/385XXXXXXXXX */
export const OWNER_WHATSAPP = process.env.OWNER_WHATSAPP_URL ?? '';

// ── Plaćanje (HUB3 / SEPA QR) ────────────────────────────────────
/** IBAN primatelja — pojavljuje se u QR kodovima i email predlošcima */
export const RECIPIENT_IBAN = process.env.RECIPIENT_IBAN ?? '';

/** Ime/naziv primatelja kako stoji u banci (za HUB3/EPC format) */
export const RECIPIENT_NAME = process.env.RECIPIENT_NAME ?? '';

// ── Poslovni uvjeti ───────────────────────────────────────────────
/** Postotak depozita (0.3 = 30%) */
export const DEPOSIT_PERCENT = 0.3;

/** Minimalni broj noći za javnu rezervaciju */
export const MIN_NIGHTS = 2;

/**
 * Visoka sezona: koje mjesece (1-indexed) se obračunavaju priceHighSeason.
 * Npr. [7, 8] = srpanj i kolovoz.
 */
export const HIGH_SEASON_MONTHS: number[] = [7, 8];

/** Labele za prikaz sezonskih cijena u sažetku */
export const HIGH_SEASON_LABEL = 'July / August';
export const OFF_SEASON_LABEL = 'Other months';

// ── Admin ─────────────────────────────────────────────────────────
/** Ime httpOnly kolačića za admin sesiju */
export const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? 'app_admin';

/** Trajanje admin sesije u sekundama (7 dana) */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Prefiks za ime CSV fajla pri exportu */
export const CSV_EXPORT_PREFIX = process.env.NEXT_PUBLIC_CSV_PREFIX ?? 'rezervacije-';

// ── Checkout URL (nakon uspješne rezervacije) ─────────────────────
/** Ako treba redirect, postavi npr. '/hvala'. Null = ostaje na istoj stranici */
export const BOOKING_SUCCESS_REDIRECT: string | null = null;

// ── Apartmani ─────────────────────────────────────────────────────
/**
 * Lista apartmana.
 * Slug mora biti jedinstven i isti u bazi (apartment_slug kolona).
 *
 * PRIMJER — zamijeni sa stvarnim apartmanima:
 */
export const apartments: Apartment[] = [
  {
    slug: 'apartment-1',
    name: 'Apartment 1',
    tagline: 'Your first apartment tagline.',
    description: 'Full description of Apartment 1.',
    capacity: 2,
    capacityNote: '2 persons',
    size: 30,
    beds: '1 double bed',
    view: true,
    balcony: false,
    floors: 1,
    priceOffSeason: 80,
    priceHighSeason: 110,
    fullyBooked: false,
    amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Parking'],
    images: ['/images/apt1/1.jpg'],
  },
  {
    slug: 'apartment-2',
    name: 'Apartment 2',
    tagline: 'Your second apartment tagline.',
    description: 'Full description of Apartment 2.',
    capacity: 4,
    capacityNote: '4 persons',
    size: 55,
    beds: '2 double beds',
    view: true,
    balcony: true,
    floors: 1,
    priceOffSeason: 120,
    priceHighSeason: 160,
    fullyBooked: false,
    amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Parking', 'Balcony'],
    images: ['/images/apt2/1.jpg'],
  },
];

// ── Helper funkcije ───────────────────────────────────────────────

export function getApartment(slug: string): Apartment | undefined {
  return apartments.find((a) => a.slug === slug);
}

export function getAvailableApartments(): Apartment[] {
  return apartments.filter((a) => !a.fullyBooked);
}

export function getPriceForDate(apartment: Apartment, date: Date): number {
  const month = date.getMonth() + 1;
  return HIGH_SEASON_MONTHS.includes(month)
    ? apartment.priceHighSeason
    : apartment.priceOffSeason;
}
