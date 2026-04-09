'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface FAQItem {
  q: string;
  a: string;
}

const faqKeys = [
  'checkin',
  'minStay',
  'parking',
  'pets',
  'payment',
  'beachDistance',
  'wifi',
  'kitchen',
  'groupBooking',
  'nearby',
] as const;

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FAQ({
  items,
  title,
  subtitle,
}: FAQProps) {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<number | null>(null);
  const translatedItems =
    items ??
    faqKeys.map((key) => ({
      q: t(`items.${key}.q`),
      a: t(`items.${key}.a`),
    }));

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            {t('help')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-3">
            {title ?? t('title')}
          </h2>
          <p className="text-muted">{subtitle ?? t('subtitle')}</p>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-sand">
          {translatedItems.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-medium text-base transition-colors ${isOpen ? 'text-secondary' : 'text-text group-hover:text-secondary'}`}
                  >
                    {item.q}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-sand flex items-center justify-center text-secondary transition-colors group-hover:bg-secondary/10">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
                >
                  <p className="text-muted text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact nudge */}
        <p className="text-center text-sm text-muted mt-10">
          {t('notFound')}{' '}
          <Link href="/kontakt" className="text-secondary hover:underline font-medium">
            {t('contactUs')}
          </Link>{' '}
          {t('orCall')}{' '}
          <a
            href="https://wa.me/385916391305"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline font-medium"
          >
            091 6391 305
          </a>
          .
        </p>
      </div>
    </section>
  );
}
