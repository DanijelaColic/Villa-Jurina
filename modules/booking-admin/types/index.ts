// ── Database types ────────────────────────────────────────────────

export type Booking = {
  id: string;
  apartment_slug: string;
  check_in: string;
  check_out: string;
  nights: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  adults: number;
  children: number;
  price_per_night: number;
  total_price: number;
  deposit: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  deposit_paid: boolean;
  created_at: string;
};

export type BookedRange = {
  check_in: string;
  check_out: string;
};

// ── Apartment types ───────────────────────────────────────────────

export type Apartment = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capacity: number;
  capacityNote: string;
  size: number;
  beds: string;
  view: boolean;
  balcony: boolean;
  floors: number;
  priceOffSeason: number;
  priceHighSeason: number;
  /** If true, GET /api/bookings returns a synthetic block for the whole high season */
  fullyBooked: boolean;
  amenities: string[];
  images: string[];
};

// ── Pricing types ─────────────────────────────────────────────────

export type PriceLine = {
  label: string;
  nights: number;
  pricePerNight: number;
  subtotal: number;
};

export type PriceBreakdown = {
  nights: number;
  totalPrice: number;
  deposit: number;
  lines: PriceLine[];
};

// ── Email types ───────────────────────────────────────────────────

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
  bookingId?: string;
};

// ── Toast types ───────────────────────────────────────────────────

export type ToastItem = {
  id: string;
  message: string;
  type: 'success' | 'error';
};
