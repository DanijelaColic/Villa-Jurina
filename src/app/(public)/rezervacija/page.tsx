import BookingWidget from '@/components/BookingWidget';
import FAQ from '@/components/FAQ';

const rezervacijaFAQ = [
  {
    q: 'Kako potvrđujem rezervaciju?',
    a: 'Nakon što pošaljete zahtjev, javit ćemo vam se u roku od nekoliko sati s potvrdom dostupnosti i uputama za plaćanje depozita (30%). Rezervacija je aktivna tek po uplati depozita.',
  },
  {
    q: 'Koji je minimalni boravak?',
    a: 'Minimalni boravak je 2 noći. Tijekom visoke sezone (srpanj i kolovoz) minimalni boravak može biti 7 noći.',
  },
  {
    q: 'Mogu li otkazati rezervaciju?',
    a: 'Otkazivanje je moguće uz povrat depozita ako se obavijest dostavi najmanje 30 dana prije dolaska. Za kasnija otkazivanja depozit se ne vraća.',
  },
  {
    q: 'Kako se plaća ostatak iznosa?',
    a: 'Ostatak iznosa plaća se pri dolasku — gotovinom ili bankovnim transferom. Plaćanje karticom nije dostupno.',
  },
  {
    q: 'Mogu li tražiti apartman za određeni broj osoba?',
    a: 'Da. Sky prima do 2, Luna i Arba do 4, a Harmonia do 6 osoba. Za veće grupe moguće je rezervirati više apartmana — kontaktirajte nas za ponudu.',
  },
];

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

      {/* FAQ */}
      <FAQ
        items={rezervacijaFAQ}
        title="Pitanja o rezervaciji"
        subtitle="Sve što trebate znati o procesu rezervacije i boravku."
      />
    </div>
  );
}
