'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

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
  const t = useTranslations('bookingConfirmationPage');
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [hub3Barcode, setHub3Barcode] = useState<string | null>(null);
  const [epcQR, setEpcQR] = useState<string | null>(null);

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
        setError(t('errors.missingLink'));
        return;
      }

      try {
        const res = await fetch(endpoint);
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(
            payload?.error ??
              t('errors.cannotOpen'),
          );
        }
        if (!active) return;
        setData(payload as ConfirmationData);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : t('errors.cannotOpen'),
        );
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [endpoint, t]);

  useEffect(() => {
    let active = true;
    async function loadBarcodes() {
      if (!data?.deposit || !data.reference || !data.guestName) return;

      setBarcodeLoading(true);
      try {
        const res = await fetch('/api/generate-barcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: data.deposit,
            guestName: data.guestName,
            reference: data.reference,
          }),
        });
        if (!res.ok) return;
        const payload = await res.json();
        if (!active) return;
        setHub3Barcode(payload.hub3 ?? null);
        setEpcQR(payload.epc ?? null);
      } catch {
        // QR kodovi su pomoćni; potvrda i bez njih ostaje funkcionalna.
      } finally {
        if (active) setBarcodeLoading(false);
      }
    }

    loadBarcodes();
    return () => {
      active = false;
    };
  }, [data?.deposit, data?.reference, data?.guestName]);

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-sand bg-white p-6 sm:p-8">
        <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
          Villa Jurina
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
          {t('title')}
        </h1>

        {loading && (
          <p className="text-muted">
            {t('loading')}
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <p className="text-muted leading-relaxed mb-6">
              {t('description')}
            </p>

            <div className="rounded-xl border border-sand-light bg-sand-light/40 p-5 sm:p-6 mb-6">
              <h2 className="font-semibold text-text mb-4">
                {t('sections.details')}
              </h2>
              <dl className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {t('labels.confirmationNumber')}
                  </dt>
                  <dd className="text-text font-medium">{data.reference}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('labels.guest')}</dt>
                  <dd className="text-text font-medium">{data.guestName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('labels.apartment')}</dt>
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
                  <dt className="text-muted">{t('labels.nights')}</dt>
                  <dd className="text-text font-medium">{data.nights}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {t('labels.pricePerNight')}
                  </dt>
                  <dd className="text-text font-medium">{data.pricePerNight}€</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('labels.total')}</dt>
                  <dd className="text-text font-semibold">{data.totalPrice}€</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('labels.deposit')}</dt>
                  <dd className="text-secondary font-semibold">{data.deposit}€</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-sand-light bg-sand-light/40 p-5 sm:p-6">
              <h2 className="font-semibold text-text mb-4">
                {t('sections.payment')}
              </h2>
              <dl className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('labels.recipient')}</dt>
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
                  <dt className="text-muted">{t('labels.bank')}</dt>
                  <dd className="text-text font-medium">{data.payment.bankName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {t('labels.bankAddress')}
                  </dt>
                  <dd className="text-text font-medium">{data.payment.bankAddress}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {t('labels.paymentDescription')}
                  </dt>
                  <dd className="text-text font-medium">{data.payment.description}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {t('labels.referenceNumber')}
                  </dt>
                  <dd className="text-text font-semibold">{data.reference}</dd>
                </div>
              </dl>
            </div>

            {(barcodeLoading || hub3Barcode || epcQR) && (
              <div className="rounded-xl border border-sand-light bg-sand-light/40 p-5 sm:p-6 mt-6">
                <h2 className="font-semibold text-text mb-4">
                  {t('sections.qr')}
                </h2>
                {barcodeLoading ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted">
                    <Loader2 size={16} className="animate-spin" />
                    {t('qr.generating')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hub3Barcode && (
                      <div className="bg-white border border-sand rounded-lg p-3 text-center">
                        <p className="text-[11px] font-semibold text-text mb-2">
                          {t('qr.hub3Title')}
                        </p>
                        <img
                          src={hub3Barcode}
                          alt={t('qr.hub3Alt')}
                          className="max-w-full h-auto mx-auto"
                        />
                      </div>
                    )}
                    {epcQR && (
                      <div className="bg-white border border-sand rounded-lg p-3 text-center">
                        <p className="text-[11px] font-semibold text-text mb-2">
                          {t('qr.epcTitle')}
                        </p>
                        <img
                          src={epcQR}
                          alt={t('qr.epcAlt')}
                          className="max-w-full h-auto mx-auto"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-6">
          <Link href="/rezervacija" className="text-sm text-primary underline underline-offset-2">
            {t('actions.newBooking')}
          </Link>
        </div>
      </div>
    </main>
  );
}
