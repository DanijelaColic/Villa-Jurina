'use client';

import { useTranslations } from 'next-intl';

const reviewIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'] as const;
const reviewMeta = {
  r1: { apartment: 'Sky', initials: 'MJ', color: 'bg-blue-100 text-blue-700', rating: 5 },
  r2: { apartment: 'Harmonia', initials: 'OK', color: 'bg-amber-100 text-amber-700', rating: 5 },
  r3: { apartment: 'Arba', initials: 'PA', color: 'bg-green-100 text-green-700', rating: 5 },
  r4: { apartment: 'Luna', initials: 'VR', color: 'bg-rose-100 text-rose-700', rating: 5 },
  r5: { apartment: 'Harmonia', initials: 'FG', color: 'bg-purple-100 text-purple-700', rating: 5 },
  r6: { apartment: 'Arba', initials: 'MT', color: 'bg-teal-100 text-teal-700', rating: 5 },
} as const;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < count ? '#C9A96E' : '#E5E7EB'}
          className="w-4 h-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const reviews = reviewIds.map((id) => ({
    ...reviewMeta[id],
    name: t(`items.${id}.name`),
    origin: t(`items.${id}.origin`),
    text: t(`items.${id}.text`),
  }));
  return (
    <section className="py-20 lg:py-28 bg-sand-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-3">
            {t('title')}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="text-sm text-muted font-medium">{t('rating')}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl border border-sand p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${r.color}`}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-medium text-text text-sm leading-tight">{r.name}</p>
                    <p className="text-xs text-muted">{r.origin}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full shrink-0">
                  {r.apartment}
                </span>
              </div>

              <Stars count={r.rating} />

              {/* Quote */}
              <p className="text-muted text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
