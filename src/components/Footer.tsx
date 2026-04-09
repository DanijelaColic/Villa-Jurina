import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/Logo_Villa_Jurina.png"
                alt="Villa Jurina"
                width={72}
                height={72}
                className="object-contain brightness-0 invert"
              />
              <h3 className="font-serif text-xl font-semibold">Villa Jurina</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t('story')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-white/90 mb-4 tracking-wide text-sm uppercase">
              {t('navigation')}
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/apartmani', label: t('apartments') },
                { href: '/rezervacija', label: t('booking') },
                { href: '/kontakt', label: t('contact') },
                { href: '/privatnost', label: t('privacy') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-secondary text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-white/90 mb-4 tracking-wide text-sm uppercase">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-secondary" />
                <span>Drašnice 133, Podgora</span>
              </li>
              <li>
                <a
                  href="https://wa.me/385916391305"
                  className="flex items-center gap-2 text-white/70 hover:text-secondary text-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone size={16} className="shrink-0 text-secondary" />
                  <span>091 6391 305</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:villajurina@gmail.com"
                  className="flex items-center gap-2 text-white/70 hover:text-secondary text-sm transition-colors"
                >
                  <Mail size={16} className="shrink-0 text-secondary" />
                  <span>villajurina@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-secondary text-sm transition-colors"
                >
                  <Instagram size={16} className="shrink-0 text-secondary" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/40 text-xs">
          <p>
            © {new Date().getFullYear()} Villa Jurina. {t('rights')}
          </p>
          <p>{t('location')}</p>
          <p>
            {t('madeBy')}{' '}
            <a
              href="https://www.enkr.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              enkr.hr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
