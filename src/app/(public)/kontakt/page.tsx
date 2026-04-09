import { MapPin, Phone, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import KontaktForm from './KontaktForm';

export const metadata = {
  title: 'Kontakt',
  description:
    'Kontaktirajte Villa Jurina — WhatsApp, email ili posjetite nas u Drašnicama 133, Podgora.',
  openGraph: {
    title: 'Kontakt | Villa Jurina',
    description: 'Kontaktirajte Villa Jurina — WhatsApp, email ili nas posjetite u Drašnicama.',
    url: 'https://villajurina.com/kontakt',
  },
  alternates: { canonical: 'https://villajurina.com/kontakt' },
};

export default async function KontaktPage() {
  const t = await getTranslations('contactPage');

  return (
    <div className="pt-20">
      <section className="py-16 lg:py-20 bg-sand-light text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            {t('title')}
          </h1>
          <p className="text-muted text-base leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-text mb-6">
              {t('info.title')}
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-text font-medium text-sm">{t('info.address')}</p>
                  <p className="text-muted text-sm">Drašnice 133, Podgora</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-text font-medium text-sm">{t('info.phone')}</p>
                  <a
                    href="https://wa.me/385916391305"
                    className="text-muted hover:text-secondary text-sm transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    091 6391 305
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-text font-medium text-sm">{t('info.email')}</p>
                  <a
                    href="mailto:villajurina@gmail.com"
                    className="text-muted hover:text-secondary text-sm transition-colors"
                  >
                    villajurina@gmail.com
                  </a>
                </div>
              </li>
            </ul>

            {/* Pravila kratko */}
            <div className="mt-10 p-5 bg-sand-light rounded-xl">
              <h3 className="font-serif text-lg font-semibold text-text mb-3">{t('helpful.title')}</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <strong className="text-text">{t('helpful.checkIn')}</strong> 14:00 – 23:00
                </li>
                <li>
                  <strong className="text-text">{t('helpful.checkOut')}</strong> 09:00 – 11:00
                </li>
                <li>
                  <strong className="text-text">{t('helpful.minStay')}</strong> {t('helpful.minStayValue')}
                </li>
                <li>
                  <strong className="text-text">{t('helpful.deposit')}</strong> 30%
                </li>
                <li>
                  <strong className="text-text">{t('helpful.beach')}</strong> 50 m
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-text mb-6">{t('formTitle')}</h2>
            <KontaktForm />
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAPS ───────────────────────────────────── */}
      <section className="pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-5">
            <h2 className="font-serif text-2xl font-semibold text-text mb-1">{t('map.title')}</h2>
            <p className="text-sm text-muted">
              {t('map.description')}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-sand shadow-sm h-80 sm:h-96">
            <iframe
              title="Villa Jurina — lokacija na karti"
              src="https://maps.google.com/maps?q=Drasnice+133+Podgora+Hrvatska&t=m&z=15&output=embed&hl=hr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.google.com/maps?q=Drasnice+133+Podgora+Hrvatska"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-secondary hover:underline font-medium"
          >
            <MapPin size={14} />
            {t('map.open')}
          </a>
        </div>
      </section>
    </div>
  );
}
