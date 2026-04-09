import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'Politika privatnosti',
  description:
    'Politika privatnosti Villa Jurina — kako prikupljamo, koristimo i štitimo vaše osobne podatke sukladno GDPR-u.',
  robots: { index: true },
  alternates: { canonical: 'https://villajurina.com/privatnost' },
};

const LAST_UPDATED = '27. ožujka 2025.';
type PrivacyContent = {
  controller: { title: string; lead: string; contactIntro: string; email: string; phone: string };
  dataCollected: { title: string; intro: string; cards: { title: string; body: string }[] };
  legalBasis: { title: string; tableHeaders: [string, string]; rows: [string, string][] };
  sharing: { title: string; intro: string; providers: { name: string; desc: string; policy: string }[] };
  retention: { title: string; booking: string; contact: string };
  rights: {
    title: string;
    intro: string;
    items: { title: string; desc: string }[];
    exercise: string;
    azop: string;
  };
  cookies: {
    title: string;
    intro: string;
    essential: { title: string; body: string };
    analytics: { title: string; body: string };
    settings: string;
  };
  security: { title: string; body: string };
  updates: { title: string; body: string };
};

export default async function PrivatnostPage() {
  const locale = await getLocale();
  const t = await getTranslations('privacyPage');
  const messages = await getMessages({ locale });
  const c = (messages as Record<string, any>)?.privacyPage?.content as PrivacyContent;

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-12 lg:py-16">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            {t('title')}
          </h1>
          <p className="text-muted text-sm">
            {t('lastUpdated')} {LAST_UPDATED}
          </p>
        </div>

        <div className="prose-custom space-y-10 text-muted leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.controller.title}
            </h2>
            <p>{c.sections.controller.lead}</p>
            <p className="mt-2">
              {c.sections.controller.contactIntro}
            </p>
            <ul className="mt-2 space-y-1 list-none pl-0">
              <li>
                {c.sections.controller.email}:{' '}
                <a href="mailto:villajurina@gmail.com" className="text-secondary hover:underline">
                  villajurina@gmail.com
                </a>
              </li>
              <li>
                {c.sections.controller.phone}:{' '}
                <a href="tel:+385916391305" className="text-secondary hover:underline">
                  +385 91 639 1305
                </a>
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.dataCollected.title}
            </h2>
            <p>{c.sections.dataCollected.intro}</p>
            <div className="mt-4 space-y-4">
              {c.sections.dataCollected.cards.map((card) => (
                <div key={card.title} className="bg-sand-light rounded-xl p-4">
                  <p className="font-medium text-text mb-1">{card.title}</p>
                  <p className="text-sm">{card.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.legalBasis.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-sand">
                    <th className="text-left py-3 pr-4 font-medium text-text">
                      {c.sections.legalBasis.tableHeaders[0]}
                    </th>
                    <th className="text-left py-3 font-medium text-text">
                      {c.sections.legalBasis.tableHeaders[1]}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {c.sections.legalBasis.rows.map(([purpose, basis]) => (
                    <tr key={purpose}>
                      <td className="py-3 pr-4">{purpose}</td>
                      <td className="py-3">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.sharing.title}
            </h2>
            <p>{c.sections.sharing.intro}</p>
            <ul className="mt-4 space-y-3 list-none pl-0">
              {c.sections.sharing.providers.map((provider) => (
                <li key={provider.name} className="flex gap-3">
                  <span className="text-secondary font-medium shrink-0">{provider.name}</span>
                  <span className="text-sm">
                    {provider.desc}
                    <a
                      href={provider.name === 'Supabase' ? 'https://supabase.com/privacy' : 'https://resend.com/privacy'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-secondary hover:underline"
                    >
                      {provider.policy}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.retention.title}
            </h2>
            <p>{c.sections.retention.booking}</p>
            <p className="mt-2">{c.sections.retention.contact}</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.rights.title}
            </h2>
            <p>{c.sections.rights.intro}</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              {c.sections.rights.items.map((item) => (
                <li key={item.title}>
                  <strong className="text-text">{item.title}</strong> — {item.desc}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              {c.sections.rights.exercise}
            </p>
            <p className="mt-2">
              {c.sections.rights.azop}{' '}
              <a
                href="https://azop.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                azop.hr
              </a>
              .
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.cookies.title}
            </h2>
            <p>{c.sections.cookies.intro}</p>
            <div className="mt-4 space-y-3">
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">{c.sections.cookies.essential.title}</p>
                <p className="text-sm">{c.sections.cookies.essential.body}</p>
              </div>
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">{c.sections.cookies.analytics.title}</p>
                <p className="text-sm">{c.sections.cookies.analytics.body}</p>
              </div>
            </div>
            <p className="mt-4 text-sm">{c.sections.cookies.settings}</p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.security.title}
            </h2>
            <p>{c.sections.security.body}</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              {c.sections.updates.title}
            </h2>
            <p>{c.sections.updates.body}</p>
          </section>

          {/* Back link */}
          <div className="pt-6 border-t border-sand">
            <Link href="/" className="text-secondary hover:underline text-sm font-medium">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
