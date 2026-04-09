import BookingWidget from '@/components/BookingWidget';
import FAQ from '@/components/FAQ';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Rezervacija',
  description:
    'Rezervirajte apartman u Villa Jurina online. Provjerite slobodne termine i odaberite datume boravka.',
  openGraph: {
    title: 'Rezervacija | Villa Jurina',
    description: 'Rezervirajte apartman uz more u Drašnicama. Provjerite slobodne termine.',
    url: 'https://villajurina.com/rezervacija',
  },
  alternates: { canonical: 'https://villajurina.com/rezervacija' },
};

type Props = {
  searchParams: Promise<{ apartman?: string }>;
};

export default async function RezervacijaPage({ searchParams }: Props) {
  const t = await getTranslations('bookingPage');
  const { apartman } = await searchParams;
  const rezervacijaFAQ = [
    { q: t('faq.items.confirm.q'), a: t('faq.items.confirm.a') },
    { q: t('faq.items.minStay.q'), a: t('faq.items.minStay.a') },
    { q: t('faq.items.cancel.q'), a: t('faq.items.cancel.a') },
    { q: t('faq.items.payment.q'), a: t('faq.items.payment.a') },
    { q: t('faq.items.capacity.q'), a: t('faq.items.capacity.a') },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-14 lg:py-18 bg-sand-light text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            {t('title')}
          </h1>
          <p className="text-muted text-base leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Booking widget */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingWidget initialSlug={apartman} />
        </div>
      </section>

      {/* Info strip */}
      <section className="bg-sand-light py-10 border-t border-sand">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-sm">
          {[
            { label: t('strip.checkInLabel'), value: t('strip.checkInValue') },
            { label: t('strip.checkOutLabel'), value: t('strip.checkOutValue') },
            { label: t('strip.minStayLabel'), value: t('strip.minStayValue') },
            { label: t('strip.depositLabel'), value: t('strip.depositValue') },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted uppercase tracking-widest font-medium mb-1">{label}</p>
              <p className="text-text font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        items={rezervacijaFAQ}
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
      />
    </div>
  );
}
