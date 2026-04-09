import Image from 'next/image';
import { MapPin, UtensilsCrossed, Car, Wifi, Wind, Tv, Coffee, Waves } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { getApartments } from '@/lib/apartments';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import { LodgingBusinessJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { Link } from '@/i18n/navigation';

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations('homePage');
  const apartments = getApartments(locale as 'hr' | 'en' | 'de');
  const amenities = [
    { icon: Wifi, label: t('amenities.items.wifi') },
    { icon: Wind, label: t('amenities.items.airConditioning') },
    { icon: Car, label: t('amenities.items.freeParking') },
    { icon: Tv, label: 'TV' },
    { icon: UtensilsCrossed, label: t('amenities.items.kitchen') },
    { icon: Coffee, label: t('amenities.items.kettle') },
  ];

  return (
    <>
      <LodgingBusinessJsonLd />
      <FAQJsonLd
        items={[
          {
            q: t('faqJsonLd.checkIn.q'),
            a: t('faqJsonLd.checkIn.a'),
          },
          {
            q: t('faqJsonLd.beachDistance.q'),
            a: t('faqJsonLd.beachDistance.a'),
          },
          {
            q: t('faqJsonLd.parking.q'),
            a: t('faqJsonLd.parking.a'),
          },
          {
            q: t('faqJsonLd.minStay.q'),
            a: t('faqJsonLd.minStay.a'),
          },
          {
            q: t('faqJsonLd.pets.q'),
            a: t('faqJsonLd.pets.a'),
          },
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero/hero3.jpeg"
          alt={t('hero.imageAlt')}
          fill
          className="object-cover object-[center_40%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-secondary font-medium tracking-widest text-sm uppercase mb-4">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
            Villa Jurina
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervacija"
              className="bg-secondary hover:bg-secondary-light text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              {t('hero.actions.book')}
            </Link>
            <Link
              href="/apartmani"
              className="border border-white/60 hover:border-white text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              {t('hero.actions.viewApartments')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs tracking-widest">
          <span>{t('hero.scroll')}</span>
          <div className="w-px h-8 bg-white/30 animate-pulse" />
        </div>
      </section>

      {/* ── PRIČA ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-sand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            {t('story.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-6">
            {t('story.title')}
          </h2>
          <div className="space-y-4 text-muted leading-relaxed text-base sm:text-lg">
            <p>{t('story.paragraphs.first')}</p>
            <p>{t('story.paragraphs.second')}</p>
            <p>{t('story.paragraphs.third')}</p>
          </div>
        </div>

        {/* Stare fotografije — diskretni horizontalni strip */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-14">
          <div className="grid grid-cols-4 gap-3">
            {[
              { src: '/images/povijest/Povijest1.jpeg', alt: t('story.gallery.oldVillaAlt') },
              { src: '/images/povijest/Povijest2.jpeg', alt: t('story.gallery.seaViewAlt') },
              { src: '/images/povijest/Povijest3.jpeg', alt: t('story.gallery.houseBuildAlt') },
              { src: '/images/povijest/Povijest4.jpeg', alt: t('story.gallery.familyAlt') },
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
            {t('story.gallery.caption')}
          </p>
        </div>
      </section>

      {/* ── APARTMANI ────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              {t('apartments.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
              {t('apartments.title')}
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
                <div className="aspect-4/3 relative overflow-hidden bg-sand">
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
                      {t('apartments.badges.fullyBooked')}
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
                        {t('apartments.price.from')} {apt.priceOffSeason}€
                        <span className="text-muted font-normal">
                          {' '}/{t('apartments.price.perNight')}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted text-sm">
                        {t('apartments.price.unavailable')}
                      </span>
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
              {t('apartments.actions.allApartments')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── POGODNOSTI ───────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-sand-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              {t('amenities.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
              {t('amenities.title')}
            </h2>
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

      {/* ── GALERIJA PREVIEW ─────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              {t('galleryPreview.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
              {t('galleryPreview.title')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              {t('galleryPreview.description')}
            </p>
          </div>

          {/* 6-thumbnail preview grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-8">
            {[
              { src: '/images/apartments/arba/Arba1.jpeg', alt: t('galleryPreview.images.arbaAlt') },
              {
                src: '/images/apartments/harmonia/Harmonia1.jpeg',
                alt: t('galleryPreview.images.harmoniaAlt'),
              },
              { src: '/images/apartments/luna/Luna1.jpeg', alt: t('galleryPreview.images.lunaAlt') },
              { src: '/images/apartments/sky/Sky1.jpeg', alt: t('galleryPreview.images.skyAlt') },
              { src: '/images/Okolica/Drašnice 1.jpeg', alt: t('galleryPreview.images.beachAlt') },
              { src: '/images/Okolica/biokovo.webp', alt: t('galleryPreview.images.biokovoAlt') },
            ].map((img) => (
              <div key={img.src} className="aspect-4/3 relative overflow-hidden rounded-xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/galerija"
              className="inline-flex items-center gap-2 border border-secondary text-secondary hover:bg-secondary hover:text-white font-medium px-7 py-3 rounded-full transition-colors text-sm"
            >
              {t('galleryPreview.actions.viewAllPhotos')}
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── LOKACIJA ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
                {t('location.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-6">
                {t('location.title')}
              </h2>

              <p className="text-muted text-sm leading-relaxed mb-6">
                {t('location.description')}
              </p>

              <ul className="space-y-4 text-muted text-sm mb-8">
                <li className="flex items-start gap-3">
                  <Waves size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text">{t('location.points.beachDistanceStrong')}</strong>{' '}
                    {t('location.points.beachDistanceText')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text">{t('location.points.nearbyTownsStrong')}</strong>{' '}
                    {t('location.points.nearbyTownsText')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <UtensilsCrossed size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>{t('location.points.restaurant')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>
                    {t('location.points.hvarPrefix')}{' '}
                    <strong className="text-text">{t('location.points.hvarStrong')}</strong>{' '}
                    {t('location.points.hvarSuffix')}
                  </span>
                </li>
              </ul>

              <div>
                <p className="text-xs text-muted uppercase tracking-widest font-medium mb-3">
                  {t('location.activities.title')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    t('location.activities.items.diving'),
                    t('location.activities.items.kayakSup'),
                    t('location.activities.items.hvarTrip'),
                    t('location.activities.items.biokovoSkywalk'),
                    t('location.activities.items.hiking'),
                    t('location.activities.items.cycling'),
                    t('location.activities.items.gradac'),
                    t('location.activities.items.tucepi'),
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
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=Drasnice+133+Podgora+Croatia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('location.mapTitle')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── OKOLICA PROMO ────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-sand-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
                {t('surroundings.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
                {t('surroundings.title')}
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                {t('surroundings.description')}
              </p>
              <Link
                href="/drasnice"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-7 py-3 rounded-full transition-colors text-sm"
              >
                {t('surroundings.actions.whatToSee')}
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('surroundings.cards.biokovo.label'), sub: t('surroundings.cards.biokovo.sub') },
                { label: t('surroundings.cards.hvar.label'), sub: t('surroundings.cards.hvar.sub') },
                {
                  label: t('surroundings.cards.zlatniRat.label'),
                  sub: t('surroundings.cards.zlatniRat.sub'),
                },
                { label: t('surroundings.cards.split.label'), sub: t('surroundings.cards.split.sub') },
              ].map(({ label, sub }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-sand text-center">
                  <p className="font-serif font-semibold text-text text-base mb-1">{label}</p>
                  <p className="text-xs text-secondary font-medium">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <FAQ />

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            {t('cta.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-white/70 mb-2 text-base leading-relaxed">
            {t('cta.description')}
          </p>
          <p className="text-white/50 text-sm mb-8">
            {t('cta.strip')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervacija"
              className="inline-block bg-secondary hover:bg-secondary-light text-white font-medium px-10 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              {t('cta.actions.checkDates')}
            </Link>
            <Link
              href="/kontakt"
              className="inline-block border border-white/40 hover:border-white text-white font-medium px-10 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              {t('cta.actions.contact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
