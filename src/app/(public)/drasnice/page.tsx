import Image from 'next/image';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import {
  Waves,
  Mountain,
  MapPin,
  Ship,
  Bike,
  Camera,
  ArrowRight,
  Sun,
  Trees,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'drasnicePage.metadata' });
  const title = t('title');
  const description = t('description');
  const url = locale === 'en'
    ? 'https://villajurina.com/en/drasnice'
    : locale === 'de'
      ? 'https://villajurina.com/de/drasnice'
      : 'https://villajurina.com/drasnice';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Villa Jurina`,
      description,
      url,
      images: [{ url: '/images/Okolica/biokovo.webp', width: 1200, height: 630 }],
    },
    alternates: { canonical: 'https://villajurina.com/drasnice' },
  };
}

const attractions = [
  { id: 'drasnice', icon: Waves, image: '/images/Okolica/Drašnice 1.jpeg' },
  { id: 'biokovo', icon: Mountain, image: '/images/Okolica/biokovo.webp' },
  { id: 'okolna-mjesta', icon: MapPin, image: '/images/Okolica/makarska.jpg' },
  { id: 'otoci', icon: Ship, image: '/images/Okolica/Brac.jpg' },
  {
    id: 'aktivni',
    icon: Bike,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },
  { id: 'izleti', icon: Camera, image: '/images/Okolica/Split.jpg' },
] as const;

export default async function DrasnicePage() {
  const locale = await getLocale();
  const t = await getTranslations('drasnicePage');
  const messages = await getMessages({ locale });
  const sectionsById = (messages as Record<string, any>)?.drasnicePage?.attractions?.sections ?? {};
  const localizedAttractions = attractions
    .map((section) => {
      const localized = sectionsById[section.id];
      if (!localized) return null;
      return { ...section, ...localized };
    })
    .filter((section): section is (typeof attractions)[number] & Record<string, any> => Boolean(section));

  return (
    <div className="pt-20">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-36 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1690260152558-552cec19ce70?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t('hero.description')}
          </p>
          <Link
            href="/rezervacija"
            className="inline-block bg-secondary hover:bg-secondary-light text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
          >
            {t('hero.action')}
          </Link>
        </div>
      </section>

      {/* ── UVOD ─────────────────────────────────────────────── */}
      <section className="py-16 bg-sand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            {t('intro.text')}{' '}
            <strong className="text-text">
              {t('intro.highlight')}
            </strong>{' '}
            {t('intro.tail')}
          </p>
        </div>
      </section>

      {/* ── ATRAKCIJE ────────────────────────────────────────── */}
      {localizedAttractions.map((section, sIdx) => {
        const Icon = section.icon;
        const isEven = sIdx % 2 === 0;
        return (
          <section
            key={section.id}
            id={section.id}
            className={`py-20 lg:py-28 ${isEven ? 'bg-white' : 'bg-sand-light'}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section header + image — dva stupca na desktopu */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <Icon size={18} />
                    </div>
                    <p className="text-secondary font-medium tracking-widest text-xs uppercase">
                      {section.eyebrow}
                    </p>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted leading-relaxed text-base">{section.intro}</p>
                </div>
                <div className={`aspect-16/10 relative rounded-2xl overflow-hidden shadow-sm ${sIdx % 2 !== 0 ? 'lg:order-first' : ''}`}>
                  <Image
                    src={section.image}
                    alt={section.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-2xl border border-sand p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-text mb-2">
                          {item.name}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── PRAKTIČNE INFO ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              {t('practical.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
              {t('practical.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Waves,
                title: t('practical.cards.beach.title'),
                desc: t('practical.cards.beach.desc'),
              },
              {
                icon: MapPin,
                title: t('practical.cards.makarska.title'),
                desc: t('practical.cards.makarska.desc'),
              },
              {
                icon: Mountain,
                title: t('practical.cards.biokovo.title'),
                desc: t('practical.cards.biokovo.desc'),
              },
              {
                icon: Sun,
                title: t('practical.cards.hvar.title'),
                desc: t('practical.cards.hvar.desc'),
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-sand-light">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary mx-auto mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <Trees size={36} className="text-secondary" />
          </div>
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            {t('cta.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-white/70 mb-2 text-base leading-relaxed">
            {t('cta.description')}
          </p>
          <p className="text-white/50 text-sm mb-10">
            {t('cta.strip')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervacija"
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-light text-white font-medium px-8 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              {t('cta.actions.checkDates')}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/apartmani"
              className="inline-block border border-white/40 hover:border-white text-white font-medium px-8 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              {t('cta.actions.viewApartments')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
