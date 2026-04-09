import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'notFoundPage' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false },
  };
}

export default async function NotFound() {
  const t = await getTranslations('notFoundPage');

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-light px-4">
      <div className="text-center max-w-md">
        <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
          {t('eyebrow')}
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text mb-4">
          {t('title')}
        </h1>
        <p className="text-muted text-base leading-relaxed mb-8">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full transition-colors text-sm"
          >
            {t('actions.home')}
          </Link>
          <Link
            href="/apartmani"
            className="border border-primary text-primary hover:bg-primary hover:text-white font-medium px-8 py-3 rounded-full transition-colors text-sm"
          >
            {t('actions.apartments')}
          </Link>
        </div>
      </div>
    </div>
  );
}
