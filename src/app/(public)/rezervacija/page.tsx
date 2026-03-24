import BookingWidget from '@/components/BookingWidget';

export const metadata = {
  title: 'Rezervacija | Villa Jurina',
  description: 'Rezervirajte apartman online. Provjerite slobodne termine i odaberite datume.',
};

type Props = {
  searchParams: Promise<{ apartman?: string }>;
};

export default async function RezervacijaPage({ searchParams }: Props) {
  const { apartman } = await searchParams;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-14 lg:py-18 bg-sand-light text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Online booking
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            Rezervacija
          </h1>
          <p className="text-muted text-base leading-relaxed">
            Odaberite apartman, provjerite slobodne termine i pošaljite zahtjev.
            Kontaktirat ćemo vas u kratkom roku s potvrdom.
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
            { label: 'Check-in', value: 'od 14:00' },
            { label: 'Check-out', value: 'do 11:00' },
            { label: 'Min. boravak', value: '2 noći' },
            { label: 'Depozit', value: '30%' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted uppercase tracking-widest font-medium mb-1">{label}</p>
              <p className="text-text font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
