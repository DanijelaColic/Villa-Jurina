import { MapPin, Phone, Mail } from 'lucide-react';
import KontaktForm from './KontaktForm';

export const metadata = {
  title: 'Kontakt',
  description:
    'Kontaktirajte Villa Jurina — WhatsApp, email ili posjetite nas u Drašnicama 133, Podgora.',
  openGraph: {
    title: 'Kontakt | Villa Jurina',
    description: 'Kontaktirajte Villa Jurina — WhatsApp, email ili nas posjetite u Drašnicama.',
    url: 'https://www.villajurina.hr/kontakt',
  },
  alternates: { canonical: 'https://www.villajurina.hr/kontakt' },
};

export default function KontaktPage() {
  return (
    <div className="pt-20">
      <section className="py-16 lg:py-20 bg-sand-light text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Dođite nam
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">Kontakt</h1>
          <p className="text-muted text-base leading-relaxed">
            Tu smo za sva vaša pitanja — javite se putem WhatsAppa, emaila ili nas posjetite.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-text mb-6">
              Informacije za kontakt
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-text font-medium text-sm">Adresa</p>
                  <p className="text-muted text-sm">Drašnice 133, Podgora</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-text font-medium text-sm">WhatsApp / Telefon</p>
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
                  <p className="text-text font-medium text-sm">E-mail</p>
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
              <h3 className="font-serif text-lg font-semibold text-text mb-3">Korisne info</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <strong className="text-text">Check-in:</strong> 14:00 – 23:00
                </li>
                <li>
                  <strong className="text-text">Check-out:</strong> 09:00 – 11:00
                </li>
                <li>
                  <strong className="text-text">Min. boravak:</strong> 2 noći
                </li>
                <li>
                  <strong className="text-text">Depozit:</strong> 30%
                </li>
                <li>
                  <strong className="text-text">Plaža:</strong> 50 m
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-text mb-6">Pišite nam</h2>
            <KontaktForm />
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAPS ───────────────────────────────────── */}
      <section className="pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-5">
            <h2 className="font-serif text-2xl font-semibold text-text mb-1">Kako nas pronaći</h2>
            <p className="text-sm text-muted">
              Drašnice 133, Podgora — 50 metara od šljunčane plaže, između Makarske i Podgore.
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
            Otvori u Google Mapsu
          </a>
        </div>
      </section>
    </div>
  );
}
