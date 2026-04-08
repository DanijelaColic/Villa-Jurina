'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import BookingCalendar from './BookingCalendar';
import { apartments } from '@/lib/apartments';
import { formatDisplayDate, formatShortDate, formatDate, calculatePrice } from '@/lib/dates';

const AVAILABLE_APARTMENTS = apartments.filter((a) => !a.fullyBooked);

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
};

export default function BookingWidget({ initialSlug }: Props) {
  const defaultSlug = initialSlug && !apartments.find(a => a.slug === initialSlug)?.fullyBooked
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
  const successRef = useRef<HTMLDivElement | null>(null);

  const selectedApartment = apartments.find((a) => a.slug === selectedSlug);
  const priceData = checkIn && checkOut && selectedApartment
    ? calculatePrice(checkIn, checkOut, selectedApartment)
    : null;

  const fetchBarcodes = useCallback(async (amount: number, guestName: string, bookingId: string) => {
    setBarcodeLoading(true);
    try {
      const reference = `REZ-${bookingId.substring(0, 8).toUpperCase()}`;
      const res = await fetch('/api/generate-barcode', {
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
      // Barcodes are optional — uplata bez QR koda je i dalje moguća
    } finally {
      setBarcodeLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  const handleApartmentChange = useCallback((slug: string) => {
    setSelectedSlug(slug);
    handleReset();
  }, [handleReset]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
      // Kad se promijeni broj odraslih, resetiraj djecu ako bi ukupno premašilo kapacitet
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
        `Apartman ${selectedApartment.name} prima maksimalno ${selectedApartment.capacity} ${selectedApartment.capacity === 1 ? 'osobu' : selectedApartment.capacity < 5 ? 'osobe' : 'osoba'}.`,
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/bookings', {
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
      if (!res.ok) throw new Error(data.error ?? 'Greška pri slanju');
      setSuccess(true);
      // Generiraj barcodes u pozadini — ne blokira prikaz success screena
      if (priceData && data.bookingId) {
        fetchBarcodes(priceData.deposit, form.name, data.bookingId);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Greška pri slanju rezervacije');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    // Nakon uspješnog slanja, osiguraj da je potvrda odmah vidljiva korisniku.
    successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [success]);

  // ── Uspješna rezervacija ─────────────────────────────────────────
  if (success) {
    return (
      <div ref={successRef} className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-text mb-3">
          Rezervacija primljena!
        </h2>
        <p className="text-muted leading-relaxed mb-6">
          Hvala, <strong className="text-text">{form.name}</strong>! Potvrdu s detaljima poslali smo
          na <strong className="text-text">{form.email}</strong>. Kontaktirat ćemo vas u kratkom roku.
        </p>
        {priceData && (
          <div className="bg-sand-light rounded-xl p-5 text-left text-sm mb-6">
            <p className="text-muted mb-1">
              <strong className="text-text">Apartman:</strong> {selectedApartment?.name}
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
              <strong className="text-text">Broj noći:</strong>{' '}
              {priceData.nights}
            </p>
            <div className="border-t border-sand mt-3 pt-3 flex justify-between items-center">
              <strong className="text-text">Ukupno:</strong>
              <span className="text-primary font-bold text-lg">{priceData.totalPrice}€</span>
            </div>
            <p className="text-muted mt-2">
              <strong className="text-text">Depozit za uplatu (30%):</strong>{' '}
              <span className="text-secondary font-semibold">{priceData.deposit}€</span>
            </p>
            <p className="mt-3 font-mono text-xs bg-white border border-sand px-3 py-2 rounded-lg">
              IBAN: HR6523900013223724831
            </p>

            {/* ── QR barcodes za uplatu depozita ────────────────────── */}
            {(barcodeLoading || hub3Barcode || epcQR) && (
              <div className="mt-4 pt-4 border-t border-sand">
                <p className="text-xs font-semibold text-text mb-3">
                  Brzo plaćanje QR kodom:
                </p>
                {barcodeLoading ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    Generiranje QR kodova...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hub3Barcode && (
                      <div className="bg-white border border-sand rounded-lg p-3 text-center">
                        <p className="text-[11px] font-semibold text-text mb-2">
                          🇭🇷 Hrvatska banka
                        </p>
                        <img
                          src={hub3Barcode}
                          alt="HUB3 PDF417 barkod za uplatu"
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
                          🌍 EU / međunarodne banke
                        </p>
                        <img
                          src={epcQR}
                          alt="EPC SEPA QR kod za uplatu"
                          className="max-w-full h-auto mx-auto"
                        />
                        <p className="text-[10px] text-muted mt-2">
                          Revolut, N26, Wise, SEPA banke...
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
            setForm({ name: '', email: '', phone: '', adults: '2', children: '0', notes: '', agreeRules: false });
          }}
          className="text-sm text-primary underline underline-offset-2"
        >
          Nova rezervacija
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Odabir apartmana ──────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-text mb-4">
          1. Odaberite apartman
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
            {selectedApartment.view && ' · Pogled na more'}
            {selectedApartment.balcony && ' · Balkon'}
          </p>
        )}
      </section>

      {/* ── Kalendar ─────────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-text">
            2. Odaberite datume
          </h2>
          {checkIn && checkOut && (
            <span className="text-sm text-secondary font-medium">
              {formatShortDate(checkIn)} → {formatShortDate(checkOut)}
              {' '}· {priceData?.nights} noći
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
          />
        </div>
      </section>

      {/* ── Sažetak cijene + Forma (samo kad su datumi odabrani) ──── */}
      {checkIn && checkOut && priceData && selectedApartment && (
        <>
          {/* Price summary */}
          <section className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-text mb-4">
              Sažetak troškova
            </h2>
            <div className="bg-sand-light rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted">
                  {formatDisplayDate(checkIn)} → {formatDisplayDate(checkOut)}
                </span>
                <span className="text-sm text-muted">{priceData.nights} noći</span>
              </div>

              {priceData.lines.map((line) => (
                <div key={line.label} className="flex justify-between text-sm mb-1">
                  <span className="text-muted">
                    {line.nights}× noć ({line.label}) · {line.pricePerNight}€
                  </span>
                  <span className="text-text font-medium">{line.subtotal}€</span>
                </div>
              ))}

              <div className="border-t border-sand mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold text-text">Ukupno</span>
                <span className="font-semibold text-primary text-xl">{priceData.totalPrice}€</span>
              </div>

              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-muted">Depozit za uplatu (30%)</span>
                <span className="font-medium text-secondary">{priceData.deposit}€</span>
              </div>
              <p className="text-xs text-muted mt-1 font-mono">
                IBAN: HR6523900013223724831
              </p>
            </div>
          </section>

          {/* Forma */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-text mb-4">
              3. Vaši podaci
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Ime i prezime <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Ana Horvat"
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
                    placeholder="ana@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Telefon / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="+385 91 234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Odrasli
                  </label>
                  <select
                    name="adults"
                    value={form.adults}
                    onChange={handleFormChange}
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    {Array.from({ length: selectedApartment.capacity }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Djeca
                  </label>
                  <select
                    name="children"
                    value={form.children}
                    onChange={handleFormChange}
                    className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    {Array.from(
                      {
                        length:
                          Math.max(
                            0,
                            selectedApartment.capacity - parseInt(form.adults || '1'),
                          ) + 1,
                      },
                      (_, i) => i,
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1">
                    Max. {selectedApartment.capacity} osoba ukupno
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Napomena (opcionalno)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Posebni zahtjevi, pitanja..."
                />
              </div>

              {/* Pravila */}
              <div className="bg-sand-light rounded-xl p-4 text-xs text-muted space-y-1">
                <p><strong className="text-text">Check-in:</strong> 14:00 – 23:00 &nbsp;|&nbsp; <strong className="text-text">Check-out:</strong> 09:00 – 11:00</p>
                <p><strong className="text-text">Kućni ljubimci:</strong> nisu dozvoljeni &nbsp;|&nbsp; <strong className="text-text">Pušenje:</strong> nije dozvoljeno</p>
                <p><strong className="text-text">Depozit:</strong> 30% od ukupne cijene ({priceData.deposit}€) — uplata unutar 24h potvrđuje rezervaciju</p>
              </div>

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
                  Slažem se s kućnim pravilima i uvjetima rezervacije Villa Jurina.
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
                {submitting ? 'Slanje...' : `Pošalji zahtjev za rezervaciju · ${priceData.totalPrice}€`}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
