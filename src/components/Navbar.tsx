'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const links = ['/apartmani', '/galerija', '/drasnice', '/rezervacija', '/kontakt'] as const;
const locales = ['hr', 'en', 'de'] as const;
type Locale = (typeof locales)[number];

/**
 * Reads locale directly from the browser URL — always accurate.
 *
 * useLocale() / usePathname() from next-intl both read from
 * NextIntlClientProvider context. That context lives in the root layout,
 * which Next.js preserves (does NOT re-render) during soft navigation between
 * the (public)/ and [locale]/(public)/ route trees. This causes stale locale
 * values: usePathname() keeps the old locale prefix after switching languages,
 * so router.replace() builds a double-prefixed URL like /de/de → 404.
 */
function getLocaleFromPath(rawPath: string): Locale {
  if (rawPath === '/en' || rawPath.startsWith('/en/')) return 'en';
  if (rawPath === '/de' || rawPath.startsWith('/de/')) return 'de';
  return 'hr';
}

/** Returns the pathname without the locale prefix, e.g. /de/galerija → /galerija */
function stripLocalePrefix(rawPath: string): string {
  return rawPath.replace(/^\/(en|de)(\/|$)/, '/') || '/';
}

export default function Navbar() {
  const t = useTranslations('navbar');
  // usePathname from next/navigation is always in sync with the real URL
  const rawPathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeLocale = getLocaleFromPath(rawPathname);
  const localePath = stripLocalePrefix(rawPathname);
  const isHome = localePath === '/' || localePath === '';

  const labels: Record<(typeof links)[number], string> = {
    '/apartmani': t('apartments'),
    '/galerija': t('gallery'),
    '/drasnice': t('surroundings'),
    '/rezervacija': t('booking'),
    '/kontakt': t('contact'),
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  const switchLocale = (loc: Locale) => {
    if (loc === activeLocale) return;
    // Update NEXT_LOCALE cookie BEFORE navigation.
    //
    // With localePrefix:'as-needed', the default locale (hr) has no URL prefix.
    // The next-intl middleware falls back to the NEXT_LOCALE cookie to resolve
    // the locale for prefix-less URLs like '/'. Without updating the cookie first,
    // navigating to '/' while holding a NEXT_LOCALE=de cookie would redirect
    // back to '/de' — making it impossible to switch back to Croatian.
    //
    // Hard navigation (window.location.href) is also required so that the server
    // re-renders the page: this refreshes the NextIntlClientProvider context so
    // all client-component translations (Navbar, FAQ, BookingWidget…) update.
    document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`;

    const query = searchParams.toString();
    const basePath =
      loc === 'hr'
        ? localePath
        : `/${loc}${localePath === '/' ? '' : localePath}`;
    const target = query ? `${basePath}?${query}` : basePath;
    window.location.href = target;
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-sand',
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Logo_Villa_Jurina.png"
            alt="Villa Jurina"
            width={52}
            height={52}
            className={clsx(
              'object-contain transition-all duration-300',
              isTransparent ? 'brightness-0 invert w-12 h-12' : 'w-12 h-12',
            )}
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((href) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'text-sm font-medium tracking-wide transition-colors hover:text-secondary',
                  localePath === href
                    ? 'text-secondary'
                    : isTransparent
                      ? 'text-white'
                      : 'text-text',
                )}
              >
                {labels[href]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/rezervacija"
              className="bg-secondary hover:bg-secondary-light text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
            >
              {t('bookNow')}
            </Link>
          </li>
          <li>
            <div className="flex items-center gap-2" role="group" aria-label={t('languageLabel')}>
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  aria-current={activeLocale === loc ? 'true' : undefined}
                  className={clsx(
                    'text-xs uppercase font-semibold tracking-wider transition-colors cursor-pointer',
                    activeLocale === loc
                      ? 'text-secondary'
                      : isTransparent
                        ? 'text-white/80'
                        : 'text-muted',
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className={clsx(
            'md:hidden p-2 rounded-md transition-colors',
            isTransparent ? 'text-white' : 'text-text',
          )}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('toggleMenu')}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-sand px-4 py-4 flex flex-col gap-4">
          {links.map((href) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                'text-sm font-medium py-2 transition-colors',
                localePath === href ? 'text-secondary' : 'text-text',
              )}
            >
              {labels[href]}
            </Link>
          ))}
          <Link
            href="/rezervacija"
            onClick={() => setMenuOpen(false)}
            className="bg-secondary text-white text-sm font-medium px-5 py-3 rounded-full text-center transition-colors"
          >
            {t('bookNow')}
          </Link>
          <div
            className="flex items-center justify-center gap-4 pt-2"
            role="group"
            aria-label={t('languageLabel')}
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  switchLocale(loc);
                  setMenuOpen(false);
                }}
                aria-current={activeLocale === loc ? 'true' : undefined}
                className={clsx(
                  'text-xs uppercase font-semibold tracking-wider transition-colors cursor-pointer',
                  activeLocale === loc ? 'text-secondary' : 'text-muted',
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
