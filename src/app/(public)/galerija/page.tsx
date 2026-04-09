import GalleryClient from './GalleryClient';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'galleryPage.metadata' });
  const path = locale === 'en' ? '/en/galerija' : locale === 'de' ? '/de/galerija' : '/galerija';
  const url = `https://villajurina.com${path}`;

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url,
      images: [{ url: '/images/apartments/harmonia/Harmonia1.jpeg', width: 1200, height: 630 }],
    },
    alternates: { canonical: 'https://villajurina.com/galerija' },
  };
}

export default async function GalerijaPage() {
  const t = await getTranslations('galleryPage');

  return (
    <main className="pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            {t('title')}
          </h1>
          <p className="text-muted leading-relaxed">
            {t('description')}
          </p>
        </div>

        <GalleryClient />
      </div>
    </main>
  );
}
