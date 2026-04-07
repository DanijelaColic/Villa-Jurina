'use client';

import { useState, useCallback } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import BookingCalendar from './BookingCalendar';
import { formatDisplayDate, formatShortDate, formatDate, calculatePrice } from '../lib/dates';
import {
  apartments,
  RECIPIENT_IBAN,
  DEPOSIT_PERCENT,
  MIN_NIGHTS,
} from '../booking.config';

const AVAILABLE_APARTMENTS = apartments.filter((a) => !a.fullyBooked);
const DEPOSIT_PCT_DISPLAY = Math.round(DEPOSIT_PERCENT * 100);

type FormData = {
  name: string;
  email: string;
  phone: string;
  adults: string;
  children: string;
  notes: string;
  agreeRules: boolean;
};

type Props = {
  initialSlug?: string;
  /** API path — default '/api/bookings' */
  bookingsApiPath?: string;
  /** API path — default '/api/generate-barcode' */
  barcodeApiPath?: string;
  /** Custom rules text shown below the form */
  rulesText?: React.ReactNode;
};

export default function BookingWidget({
  initialSlug,
  bookingsApiPath = '/api/bookings',
  barcodeApiPath = '/api/generate-barcode',
  rulesText,
}: Props) {
  const defaultSlug =
    initialSlug && !apartments.find((a) => a.slug === initialSlug)?.fullyBooked
      ? initialSlug
      : AVAILABLE_APARTMENTS[0]?.slug ?? '';

  const [selectedSlug, setSelectedSlug] = useState(defaultSlug);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', adults: '2', children: '0', notes: '', agreeRules: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hub3Barcode, setHub3Barcode] = useState<string | null>(null);
  const [epcQR, setEpcQR] = useState<string | null>(null);
  const [barcodeLoading, setBarcodeLoading] = useState(false);

  const selectedApartment = apartments.find((a) => a.slug === selectedSlug);
  const priceData =
    checkIn && checkOut && selectedApartment
      ? calculatePrice(checkIn, checkOut, selectedApartment)
      : null;

  const fetchBarcodes = useCallback(
    async (amount: number, guestName: string, bookingId: string) => {
      setBarcodeLoading(true);
      try {
        const reference = `REZ-${bookingId.substring(0, 8).toUpperCase()}`;
        const res = await fetch(barcodeApiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, guestName, reference }),
        });
        if (res.ok) {
          const data = await res.json();
          setHub3Barcode(data.hub3 ?? null);
          setEpcQR(data.epc ?? null);
        }
      } catch {
        // Barcodes are optional — payment without QR is still possible
      } finally {
        setBarcodeLoading(false);
      }
    },
    [barcodeApiPath],
  );

  const handleReset = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  const handleApartmentChange = useCallback(
    (slug: string) => {
      setSelectedSlug(slug);
      handleReset();
    },
    [handleReset],
  );

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
      if (name === 'adults' && selectedApartment) {
        const maxChildren = selectedApartment.capacity - parseInt(value || '1');
        if (parseInt(prev.children) > maxChildren) {
          updated.children = String(Math.max(0, maxChildren));
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !priceData || !selectedApartment) return;

    const totalGuests = parseInt(form.adults) + parseInt(form.children);
    if (totalGuests > selectedApartment.capacity) {
      setSubmitError(
        `${selectedApartment.name} accommodates a maximum of ${selectedApartment.capacity} guests.`,
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(bookingsApiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_slug: selectedSlug,
          check_in: formatDate(checkIn),
          check_out: formatDate(checkOut),
          guest_name: form.name,
          guest_email: form.email,
          guest_phone: form.phone,
          adults: parseInt(form.adults),
          children: parseInt(form.children),
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error sending request');
      setSuccess(true);
      if (priceData && data.bookingId) {
        fetchBarcodes(priceData.deposit, form.name, data.bookingId);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error sending booking request');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-text mb-3">
          Booking request received!
        </h2>
        <p className="text-muted leading-relaxed mb-6">
          Thank you, <strong className="text-text">{form.name}</strong>! We sent a confirmation to{' '}
          <strong className="text-text">{form.email}</strong>. We will contact you shortly.
        </p>

        {priceData && (
          <div className="bg-sand-light rounded-xl p-5 text-left text-sm mb-6">
            <p className="text-muted mb-1">
              <strong className="text-text">Apartment:</strong> {selectedApartment?.name}
            </p>
            <p className="text-muted mb-1">
              <strong className="text-text">Check-in:</strong>{' '}
              {checkIn ? formatDisplayDate(checkIn) : ''}
            </p>
            <p className="text-muted mb-1">
              <strong className="text-text">Check-out:</strong>{' '}
              {checkOut ? formatDisplayDate(checkOut) : ''}
            </p>
            <p className="text-muted mb-1">
              <strong className="text-text">Nights:</strong> {priceData.nights}
            </p>
            <div className="border-t border-sand mt-3 pt-3 flex justify-between items-center">
              <strong className="text-text">Total:</strong>
              <span className="text-primary font-bold text-lg">{priceData.totalPrice}€</span>
            </div>
            <p className="text-muted mt-2">
              <strong className="text-text">Deposit ({DEPOSIT_PCT_DISPLAY}%):</strong>{' '}
              <span className="text-secondary font-semibold">{priceData.deposit}€</span>
            </p>

            {/* IBAN — prikazuje se samo ako je konfiguriran */}
            {RECIPIENT_IBAN && (
              <p className="mt-3 font-mono text-xs bg-white border border-sand px-3 py-2 rounded-lg">
                IBAN: {RECIPIENT_IBAN}
              </p>
            )}

            {/* QR barcodes za uplatu depozita */}
            {(barcodeLoading || hub3Barcode || epcQR) && (
              <div className="mt-4 pt-4 border-t border-sand">
                <p className="text-xs font-semibold text-text mb-3">Quick pay with QR code:</p>
                {barcodeLoading ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    Generating QR codes...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hub3Barcode && (
                      <div className="bg-white border border-sand rounded-lg p-3 text-center">
                        <p className="text-[11px] font-semibold text-text mb-2">
                          🇭🇷 Croatian bank
                        </p>
                        <img
                          src={hub3Barcode}
                          alt="HUB3 PDF417 barcode"
                          className="max-w-full h-auto mx-auto"
                        />
                        <p className="text-[10px] text-muted mt-2">
                          m-zaba, m-keks, Erste, OTP, PBZ...
                        </p>
                      </div>
                    )}
                    {epcQR && (
                      <div className="bg-white border border-sand rounded-lg p-3 text-center">
                        <p className="text-[11px] font-semibold text-text mb-2">
                          🌍 EU / international
                        </p>
                        <img
                          src={epcQR}
                          alt="EPC SEPA QR code"
                          className="max-w-full h-auto mx-auto"
                        />
                        <p className="text-[10px] text-muted mt-2">
                          Revolut, N26, Wise, SEPA...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => {
            setSuccess(false);
            setHub3Barcode(null);
            setEpcQR(null);
            handleReset();
            setForm({
              name: '', email: '', phone: '', adults: '2', children: '0', notes: '', agreeRules: false,
            });
          }}
          className="text-sm text-primary underline underline-offset-2"
        >
          New booking
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── 1. Odabir apartmana ───────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-text mb-4">
          1. Select apartment
        </h2>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_APARTMENTS.map((apt) => (
            <button
              key={apt.slug}
              onClick={() => handleApartmentChange(apt.slug)}
              className={clsx(
                'px-5 py-2.5 rounded-full text-sm font-medium border transition-all',
                selectedSlug === apt.slug
                  ? 'bg-primary text-white border-primary'
                  : 'border-sand text-text hover:border-primary hover:text-primary',
              )}
            >
              {apt.name}
              <span className="ml-2 text-xs opacity-70">{apt.capacityNote}</span>
            </button>
          ))}
        </div>
        {selectedApartment && (
          <p className="text-sm text-muted mt-3">
            {selectedApartment.size} m² · {selectedApartment.beds}
            {selectedApartment.view && ' · Sea view'}
            {selectedApartment.balcony && ' · Balcony'}
          </p>
        )}
      </section>

      {/* ── 2. Kalendar ──────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-text">
            2. Select dates
          </h2>
          {checkIn && checkOut && (
            <span className="text-sm text-secondary font-medium">
              {formatShortDate(checkIn)} → {formatShortDate(checkOut)}
              {' '}· {priceData?.nights} nights
            </span>
          )}
        </div>

        <div className="bg-white border border-sand rounded-2xl p-4 sm:p-6">
          <BookingCalendar
            apartmentSlug={selectedSlug}
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInSelect={setCheckIn}
            onCheckOutSelect={setCheckOut}
            onReset={handleReset}
            bookingsApiPath={bookingsApiPath}
            minNights={MIN_NIGHTS}
          />
        </div>
      </section>

      {/* ── 3. Sažetak + forma ───────────────────────────────────── */}
      {checkIn && checkOut && priceData && selectedApartment && (
        <>
          {/* Price summary */}
          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-text mb-4">
              Price summary
            </h2>
            <div className="bg-sand-light rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted">
                  {formatDisplayDate(checkIn)} → {formatDisplayDate(checkOut)}
                </span>
                <span className="text-sm text-muted">{priceData.nights} nights</span>
              </div>

              {priceData.lines.map((line) => (
                <div key={line.label} className="flex justify-between text-sm mb-1">
                  <span className="text-muted">
                    {line.nights}× night ({line.label}) · {line.pricePerNight}€
                  </span>
                  <span className="text-text font-medium">{line.subtotal}€</span>
                </div>
              ))}

              <div className="border-t border-sand mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold text-text">Total</span>
                <span className="font-semibold text-primary text-xl">{priceData.totalPrice}€</span>
              </div>

              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-muted">Deposit ({DEPOSIT_PCT_DISPLAY}%)</span>
                <span className="font-medium text-secondary">{priceData.deposit}€</span>
              </div>

              {RECIPIENT_IBAN && (
                <p className="text-xs text-muted mt-1 font-mono">IBAN: {RECIPIENT_IBAN}</p>
              )}
            </div>
          </section>

          {/* Guest form */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-text mb-4">
              3. Your details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Full name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="jane@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Adults</label>
                  <select
                    name="adults"
                    value={form.adults}
                    onChange={handleFormChange}
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    {Array.from({ length: selectedApartment.capacity }, (_, i) => i + 1).map(
                      (n) => <option key={n} value={n}>{n}</option>,
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Children</label>
                  <select
                    name="children"
                    value={form.children}
                    onChange={handleFormChange}
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    {Array.from(
                      {
                        length:
                          Math.max(0, selectedApartment.capacity - parseInt(form.adults || '1')) +
                          1,
                      },
                      (_, i) => i,
                    ).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <p className="text-xs text-muted mt-1">
                    Max. {selectedApartment.capacity} guests total
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Special requests, questions..."
                />
              </div>

              {/* Pravila — custom ili default */}
              {rulesText ?? (
                <div className="bg-sand-light rounded-xl p-4 text-xs text-muted space-y-1">
                  <p>
                    <strong className="text-text">Check-in:</strong> 14:00 – 23:00
                    &nbsp;|&nbsp;
                    <strong className="text-text">Check-out:</strong> 09:00 – 11:00
                  </p>
                  <p>
                    <strong className="text-text">Deposit:</strong>{' '}
                    {DEPOSIT_PCT_DISPLAY}% of total ({priceData.deposit}€) — payment
                    within 24h confirms your booking
                  </p>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="agreeRules"
                  type="checkbox"
                  checked={form.agreeRules}
                  onChange={handleFormChange}
                  required
                  className="mt-0.5 accent-primary"
                />
                <span className="text-sm text-muted">
                  I agree with the house rules and booking terms.
                  <span className="text-red-400"> *</span>
                </span>
              </label>

              {submitError && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !form.agreeRules}
                className="w-full bg-secondary hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting
                  ? 'Sending...'
                  : `Send booking request · ${priceData.totalPrice}€`}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
