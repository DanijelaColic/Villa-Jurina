'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type ConfirmationData = {
  id: string;
  reference: string;
  status: string;
  guestName: string;
  apartmentName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  deposit: number;
  payment: {
    recipient: string;
    iban: string;
    bic: string;
    bankName: string;
    bankAddress: string;
    description: string;
  };
};

export default function BookingConfirmationPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ConfirmationData | null>(null);

  const id = params?.id;
  const token = searchParams.get('token');

  const endpoint = useMemo(() => {
    if (!id || !token) return null;
    const query = new URLSearchParams({ token });
    return `/api/bookings/${id}/public?${query.toString()}`;
  }, [id, token]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!endpoint) {
        setLoading(false);
        setError('Nedostaje pristupni link za potvrdu rezervacije.');
        return;
      }

      try {
        const res = await fetch(endpoint);
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload?.error ?? 'Potvrdu rezervacije nije moguće otvoriti.');
        }
        if (!active) return;
        setData(payload as ConfirmationData);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Potvrdu rezervacije nije moguće otvoriti.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-sand bg-white p-6 sm:p-8">
        <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
          Villa Jurina
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
          Potvrda rezervacije
        </h1>

        {loading && (
          <p className="text-muted">Učitavanje potvrde rezervacije...</p>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <p className="text-muted leading-relaxed mb-6">
              Rezervacija vrijedi nakon evidentirane uplate depozita u roku od 24 sata.
            </p>

            <div className="rounded-xl border border-sand-light bg-sand-light/40 p-5 sm:p-6 mb-6">
              <h2 className="font-semibold text-text mb-4">Detalji rezervacije</h2>
              <dl className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Broj potvrde</dt>
                  <dd className="text-text font-medium">{data.reference}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Gost</dt>
                  <dd className="text-text font-medium">{data.guestName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Apartman</dt>
                  <dd className="text-text font-medium">{data.apartmentName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Check-in</dt>
                  <dd className="text-text font-medium">{data.checkIn}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Check-out</dt>
                  <dd className="text-text font-medium">{data.checkOut}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Broj noći</dt>
                  <dd className="text-text font-medium">{data.nights}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Cijena / noć</dt>
                  <dd className="text-text font-medium">{data.pricePerNight}€</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Ukupno</dt>
                  <dd className="text-text font-semibold">{data.totalPrice}€</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Depozit (30%)</dt>
                  <dd className="text-secondary font-semibold">{data.deposit}€</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-sand-light bg-sand-light/40 p-5 sm:p-6">
              <h2 className="font-semibold text-text mb-4">Podaci za uplatu</h2>
              <dl className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Primatelj</dt>
                  <dd className="text-text font-medium">{data.payment.recipient}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">IBAN</dt>
                  <dd className="text-text font-medium">{data.payment.iban}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">BIC/SWIFT</dt>
                  <dd className="text-text font-medium">{data.payment.bic}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Banka</dt>
                  <dd className="text-text font-medium">{data.payment.bankName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Adresa banke</dt>
                  <dd className="text-text font-medium">{data.payment.bankAddress}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Opis plaćanja</dt>
                  <dd className="text-text font-medium">{data.payment.description}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Poziv na broj</dt>
                  <dd className="text-text font-semibold">{data.reference}</dd>
                </div>
              </dl>
            </div>
          </>
        )}

        <div className="mt-6">
          <Link href="/rezervacija" className="text-sm text-primary underline underline-offset-2">
            Nova rezervacija
          </Link>
        </div>
      </div>
    </main>
  );
}
