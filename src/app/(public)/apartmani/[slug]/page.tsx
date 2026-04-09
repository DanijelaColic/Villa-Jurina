import { notFound } from 'next/navigation';
import { Users, Maximize2, Check } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { apartments, getApartment } from '@/lib/apartments';
import ImageGallery from '@/components/ImageGallery';
import { ApartmentJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return apartments.map((apt) => ({ slug: apt.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const apt = getApartment(slug);
  if (!apt) return {};
  const shortDesc = apt.tagline + ` Apartman za ${apt.capacityNote}, ${apt.size} m², Drašnice.`;
  return {
    title: `Apartman ${apt.name}`,
    description: shortDesc,
    openGraph: {
      title: `Apartman ${apt.name} | Villa Jurina`,
      description: shortDesc,
      url: `https://villajurina.com/apartmani/${slug}`,
      images: apt.images[0]
        ? [{ url: apt.images[0], width: 1200, height: 630, alt: `Apartman ${apt.name}` }]
        : [],
    },
    alternates: { canonical: `https://villajurina.com/apartmani/${slug}` },
  };
}

export default async function ApartmanPage({ params }: Props) {
  const locale = await getLocale();
  const t = await getTranslations('apartmentDetailPage');
  const { slug } = await params;
  const apt = getApartment(slug, locale as 'hr' | 'en' | 'de');

  if (!apt) notFound();

  return (
    <div className="pt-20">
      <BreadcrumbJsonLd
        items={[
          { name: 'Početna', url: 'https://villajurina.com' },
          { name: 'Apartmani', url: 'https://villajurina.com/apartmani' },
          { name: `Apartman ${apt.name}`, url: `https://villajurina.com/apartmani/${apt.slug}` },
        ]}
      />
      <ApartmentJsonLd
        name={apt.name}
        description={apt.description}
        slug={apt.slug}
        image={apt.images[0] ?? ''}
        capacity={apt.capacity}
        priceOffSeason={apt.priceOffSeason}
        priceHighSeason={apt.priceHighSeason}
      />

      {/* Gallery */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {apt.images.length > 0 ? (
          <ImageGallery images={apt.images} alt={`Apartman ${apt.name}`} />
        ) : (
          <div className="aspect-16/6 bg-sand rounded-2xl" />
        )}
        {apt.fullyBooked && (
          <div className="mt-3 inline-block bg-text/80 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            Zauzeto — sezona 2025.
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6 flex items-center gap-2">
          <Link href="/apartmani" className="hover:text-primary transition-colors">
            Apartmani
          </Link>
          <span>/</span>
          <span className="text-text">{apt.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-2">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-serif text-4xl font-semibold text-text mb-2">{apt.name}</h1>
            <p className="text-muted text-base mb-8">{apt.tagline}</p>

            <p className="text-text leading-relaxed mb-8">{apt.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted bg-sand px-4 py-2 rounded-full">
                <Users size={15} className="text-secondary" />
                <span>{apt.capacityNote}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted bg-sand px-4 py-2 rounded-full">
                <Maximize2 size={15} className="text-secondary" />
                <span>{apt.size} m²</span>
              </div>
              {apt.floors > 1 && (
                <span className="text-sm bg-sand text-text px-4 py-2 rounded-full">
                  {t('stats.duplex')}
                </span>
              )}
              {apt.view && (
                <span className="text-sm bg-sand text-text px-4 py-2 rounded-full">
                  {t('stats.seaView')}
                </span>
              )}
              {apt.balcony && (
                <span className="text-sm bg-sand text-text px-4 py-2 rounded-full">{t('stats.balcony')}</span>
              )}
            </div>

            {/* Kreveti */}
            <div className="mb-8">
              <h3 className="font-serif text-lg font-semibold text-text mb-3">{t('beds.title')}</h3>
              <p className="text-muted text-sm">{apt.beds}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-text mb-4">{t('amenities.title')}</h3>
              <ul className="grid grid-cols-2 gap-2">
                {apt.amenities.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted">
                    <Check size={15} className="text-secondary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pravila */}
            <div className="mt-8 p-4 bg-sand-light rounded-xl text-sm text-muted space-y-1">
              <p>
                <strong className="text-text">{t('rules.checkInLabel')}</strong> 14:00 – 23:00
              </p>
              <p>
                <strong className="text-text">{t('rules.checkOutLabel')}</strong> 09:00 – 11:00
              </p>
              <p>
                <strong className="text-text">{t('rules.petsLabel')}</strong> {t('rules.petsValue')}
              </p>
              <p>
                <strong className="text-text">{t('rules.smokingLabel')}</strong> {t('rules.smokingValue')}
              </p>
              <p>
                <strong className="text-text">{t('rules.minStayLabel')}</strong> 2 noći
              </p>
              <p>
                <strong className="text-text">{t('rules.depositLabel')}</strong> 30% {t('rules.depositValue')}
              </p>
            </div>
          </div>

          {/* Right: price + CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-sand shadow-sm p-6">
              {!apt.fullyBooked ? (
                <>
                  <p className="text-xs text-muted uppercase tracking-widest font-medium mb-4">
                    {t('price.title')}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">{t('price.offSeason')}</span>
                      <span className="text-primary font-semibold">{apt.priceOffSeason}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">{t('price.highSeason')}</span>
                      <span className="text-primary font-semibold">{apt.priceHighSeason}€</span>
                    </div>
                  </div>
                  <Link
                    href={`/rezervacija?apartman=${apt.slug}`}
                    className="block w-full text-center bg-secondary hover:bg-secondary-light text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
                  >
                    {t('actions.bookThis')}
                  </Link>
                  <p className="text-xs text-muted text-center mt-3">{t('rules.minStay')}</p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-text font-medium mb-2">{t('unavailable.title')}</p>
                  <p className="text-sm text-muted mb-6">
                    {t('unavailable.description')}
                  </p>
                  <Link
                    href="/apartmani"
                    className="block w-full text-center border border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
                  >
                    {t('unavailable.cta')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
