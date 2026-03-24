import Link from 'next/link';
import Image from 'next/image';
import { MapPin, UtensilsCrossed, Car, Wifi, Wind, Tv, Coffee, Waves } from 'lucide-react';
import { apartments } from '@/lib/apartments';

const amenities = [
  { icon: Wifi, label: 'Besplatni WiFi' },
  { icon: Wind, label: 'Klima uređaj' },
  { icon: Car, label: 'Besplatni parking' },
  { icon: Tv, label: 'TV' },
  { icon: UtensilsCrossed, label: 'Kuhinja' },
  { icon: Coffee, label: 'Kuhalo za vodu' },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/apartments/arba/Arba1.jpeg"
          alt="Pogled na more s balkona Villa Jurina"
          fill
          className="object-cover object-[center_40%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-secondary font-medium tracking-widest text-sm uppercase mb-4">
            Drašnice · Makarska rivijera
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
            Villa Jurina
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            50 metara od šljunčane plaže. Apartmani s pogledom na more, sagradeni s ljubavlju.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervacija"
              className="bg-secondary hover:bg-secondary-light text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              Rezerviraj smještaj
            </Link>
            <Link
              href="/apartmani"
              className="border border-white/60 hover:border-white text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              Pogledaj apartmane
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs tracking-widest">
          <span>SCROLL</span>
          <div className="w-px h-8 bg-white/30 animate-pulse" />
        </div>
      </section>

      {/* ── PRIČA ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-sand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            Naša priča
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-6">
            Kuća dida Jure
          </h2>
          <div className="space-y-4 text-muted leading-relaxed text-base sm:text-lg">
            <p>
              Kuća dida Jure stoji uz samo more, tamo gdje su kamen i val oduvijek razgovarali.
              Sagradio ju je did Jure vlastitim rukama — polako, strpljivo i s ljubavlju, kao
              što se nekad gradilo: da traje, da diše i da ocuplja generacije.
            </p>
            <p>
              Drašnice su uvijek bile mjesto koje nije tražilo pažnju — tiho, skromno i iskreno.
              Dok su okolna mjesta rasla, Drašnice su čuvale ono najvrednije: autentičnost,
              sporost i blizinu mora koje ovdje nije kulisa, nego svakodnevica.
            </p>
            <p>
              Ovdje se jutra bude uz šum mora, a večeri smiruju pod zvijezdama i miomiris
              lavande. Ova kuća nije nastala kao investicija, nego kao dom. Danas svoja vrata
              otvara svima koji traže mir, jednostavnost i osjećaj da su došli na pravo mjesto.
            </p>
          </div>
        </div>

        {/* Stare fotografije — diskretni horizontalni strip */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-14">
          <div className="grid grid-cols-4 gap-3">
            {[
              { src: '/images/povijest/Povijest1.jpeg', alt: 'Villa Jurina nekad' },
              { src: '/images/povijest/Povijest2.jpeg', alt: 'Drašnice, pogled na more' },
              { src: '/images/povijest/Povijest3.jpeg', alt: 'Gradnja kuće dida Jure' },
              { src: '/images/povijest/Povijest4.jpeg', alt: 'Obitelj Jurina' },
            ].map((img) => (
              <div
                key={img.src}
                className="h-40 sm:h-48 relative overflow-hidden rounded-lg bg-sand"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover sepia-[0.25] hover:sepia-0 transition-all duration-500 scale-105 hover:scale-100"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted/50 mt-4 tracking-wide italic">
            Fotografije iz obiteljskog albuma — sjećanja koja su oblikovala ovaj dom.
          </p>
        </div>
      </section>

      {/* ── APARTMANI ────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              Smještaj
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
              Naši apartmani
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {apartments.map((apt) => (
              <Link
                key={apt.slug}
                href={`/apartmani/${apt.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-sand"
              >
                {/* Apartment cover image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-sand">
                  {apt.images[0] && (
                    <Image
                      src={apt.images[0]}
                      alt={`Apartman ${apt.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  {apt.fullyBooked && (
                    <div className="absolute top-4 left-4 bg-text/80 text-white text-xs font-medium px-3 py-1 rounded-full z-10">
                      Zauzeto — sezona 2025.
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-xl font-semibold text-text group-hover:text-primary transition-colors">
                      {apt.name}
                    </h3>
                    <span className="text-xs text-muted bg-sand px-2.5 py-1 rounded-full shrink-0">
                      {apt.size} m²
                    </span>
                  </div>
                  <p className="text-muted text-sm mb-4">{apt.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">{apt.capacityNote}</span>
                    {!apt.fullyBooked ? (
                      <span className="text-primary font-semibold text-sm">
                        od {apt.priceOffSeason}€
                        <span className="text-muted font-normal"> /noć</span>
                      </span>
                    ) : (
                      <span className="text-muted text-sm">Nije dostupno</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/apartmani"
              className="inline-block border border-primary text-primary hover:bg-primary hover:text-white font-medium px-8 py-3 rounded-full transition-colors text-sm"
            >
              Svi apartmani
            </Link>
          </div>
        </div>
      </section>

      {/* ── POGODNOSTI ───────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-sand-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              Sve što trebate
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">Pogodnosti</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary">
                  <Icon size={22} />
                </div>
                <span className="text-sm text-text font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOKACIJA ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
                Lokacija
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-6">
                Drašnice, Makarska rivijera
              </h2>

              <p className="text-muted text-sm leading-relaxed mb-6">
                Drašnice su jedno od onih mjesta koja se pamte. Mala dalmatinska uvala između
                Makarske i Podgore, zaštićena Biokovom s leđa i otvorena prema pučini ispred.
                Šljunčana plaža je doslovno iza ugla — 50 metara hoda — a more je ovdje
                iznimno čisto i prozirno.
              </p>

              <ul className="space-y-4 text-muted text-sm mb-8">
                <li className="flex items-start gap-3">
                  <Waves size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text">50 m</strong> do šljunčane plaže — kristalno
                    čisto more, mirna uvala, bez gužve
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text">10 min</strong> do Makarske, 5 min do Podgore i
                    Tučepa — sve na dohvat ruke, ali daleko od vreve
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <UtensilsCrossed size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    Restoran u sklopu objekta — dalmatinska kuhinja s pogledom na more
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    Trajekt za <strong className="text-text">otok Hvar</strong> dostupan iz
                    Drašnica — dnevni izlet za nezaboravno iskustvo
                  </span>
                </li>
              </ul>

              <div>
                <p className="text-xs text-muted uppercase tracking-widest font-medium mb-3">
                  Što raditi u okolici
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Ronjenje',
                    'Kajak & SUP',
                    'Izlet na Hvar',
                    'Biokovo Skywalk',
                    'Planinarenje',
                    'Biciklizam',
                    'Gradac',
                    'Tučepi',
                  ].map((activity) => (
                    <span
                      key={activity}
                      className="text-xs bg-sand text-text px-3 py-1.5 rounded-full"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=Soline+116+Drasnice+Croatia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Villa Jurina lokacija"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            Drašnice · Makarska rivijera
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Vaše more čeka
          </h2>
          <p className="text-white/70 mb-2 text-base leading-relaxed">
            Četiri apartmana, jedno more, nebrojene uspomene.
            Rezervirajte danas i osigurajte svoje mjesto u Drašnicama.
          </p>
          <p className="text-white/50 text-sm mb-8">
            Minimalni boravak 2 noći · Check-in od 14:00 · Check-out do 11:00
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervacija"
              className="inline-block bg-secondary hover:bg-secondary-light text-white font-medium px-10 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              Provjeri slobodne termine
            </Link>
            <Link
              href="/kontakt"
              className="inline-block border border-white/40 hover:border-white text-white font-medium px-10 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              Kontaktirajte nas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
