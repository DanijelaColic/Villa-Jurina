import Link from 'next/link';
import Image from 'next/image';
import { Users, Maximize2 } from 'lucide-react';
import { apartments } from '@/lib/apartments';

export const metadata = {
  title: 'Apartmani',
  description:
    'Četiri apartmana s pogledom na more u Drašnicama — Sky, Luna, Arba i Harmonia. Idealni za parove i obitelji.',
  openGraph: {
    title: 'Apartmani | Villa Jurina',
    description:
      'Četiri apartmana s pogledom na more u Drašnicama — Sky, Luna, Arba i Harmonia.',
    url: 'https://villajurina.com/apartmani',
    images: [{ url: '/images/apartments/arba/Arba1.jpeg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://villajurina.com/apartmani' },
};

export default function ApartmaniPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 lg:py-20 bg-sand-light text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Smještaj
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            Apartmani
          </h1>
          <p className="text-muted text-base leading-relaxed">
            Četiri pažljivo uređena apartmana s pogledom na more, svaki s vlastitim karakterom i
            atmosferom. Renovirani 2025. godine.
          </p>
        </div>
      </section>

      {/* Apartments list */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {apartments.map((apt, index) => (
            <div
              key={apt.slug}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <Link
                href={`/apartmani/${apt.slug}`}
                className={`aspect-4/3 rounded-2xl relative overflow-hidden bg-sand block group ${
                  index % 2 !== 0 ? 'lg:order-2' : ''
                }`}
              >
                {apt.images[0] && (
                  <Image
                    src={apt.images[0]}
                    alt={`Apartman ${apt.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                {apt.fullyBooked && (
                  <div className="absolute top-4 left-4 bg-text/80 text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
                    Zauzeto — sezona 2025.
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className={index % 2 !== 0 ? 'lg:order-1' : ''}>
                <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-2">
                  Apartman
                </p>
                <h2 className="font-serif text-3xl font-semibold text-text mb-2">{apt.name}</h2>
                <p className="text-muted text-base mb-6 leading-relaxed">{apt.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Users size={16} className="text-secondary" />
                    <span>{apt.capacityNote}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Maximize2 size={16} className="text-secondary" />
                    <span>{apt.size} m²</span>
                  </div>
                  {apt.floors > 1 && (
                    <span className="text-xs bg-sand text-text px-3 py-1 rounded-full">
                      Dvoetažni
                    </span>
                  )}
                  {apt.view && (
                    <span className="text-xs bg-sand text-text px-3 py-1 rounded-full">
                      Pogled na more
                    </span>
                  )}
                  {apt.balcony && (
                    <span className="text-xs bg-sand text-text px-3 py-1 rounded-full">
                      Balkon
                    </span>
                  )}
                </div>

                {/* Price */}
                {!apt.fullyBooked ? (
                  <div className="mb-6 p-4 bg-sand-light rounded-xl">
                    <p className="text-xs text-muted uppercase tracking-widest font-medium mb-2">
                      Cijena po noći
                    </p>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-muted mb-0.5">Izvan sezone</p>
                        <p className="text-primary font-semibold text-lg">{apt.priceOffSeason}€</p>
                      </div>
                      <div className="w-px bg-sand" />
                      <div>
                        <p className="text-xs text-muted mb-0.5">Srpanj / Kolovoz</p>
                        <p className="text-primary font-semibold text-lg">{apt.priceHighSeason}€</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-sand-light rounded-xl text-muted text-sm">
                    Apartman nije dostupan za rezervaciju u sezoni 2025.
                  </div>
                )}

                <div className="flex gap-3">
                  <Link
                    href={`/apartmani/${apt.slug}`}
                    className="border border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
                  >
                    Više detalja
                  </Link>
                  {!apt.fullyBooked && (
                    <Link
                      href={`/rezervacija?apartman=${apt.slug}`}
                      className="bg-secondary hover:bg-secondary-light text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
                    >
                      Rezerviraj
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
