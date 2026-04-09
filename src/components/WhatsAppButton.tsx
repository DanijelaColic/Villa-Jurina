'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function WhatsAppButton() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const waText =
    locale === 'en'
      ? 'Hello, I am interested in booking an apartment at Villa Jurina.'
      : locale === 'de'
        ? 'Hallo, ich interessiere mich für eine Apartment-Reservierung in der Villa Jurina.'
        : 'Pozdrav, zanima me rezervacija apartmana u Villa Jurina.';
  const WA_URL = `https://wa.me/385916391305?text=${encodeURIComponent(waText)}`;
  const ariaLabel =
    locale === 'en'
      ? 'Contact us on WhatsApp'
      : locale === 'de'
        ? 'Kontaktieren Sie uns auf WhatsApp'
        : 'Kontaktiraj nas na WhatsAppu';
  const hoverLabel =
    locale === 'en'
      ? 'Write to us on WhatsApp'
      : locale === 'de'
        ? 'Schreiben Sie uns auf WhatsApp'
        : 'Piši nam na WhatsApp';

  // Prikaži gumb tek nakon kratkog scroll-a da ne smeta na first load
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Odmah provjeri u slučaju da je stranica već scrollana
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Icon */}
      <span className="flex items-center justify-center w-14 h-14 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.676 4.783 1.854 6.764L2 30l7.447-1.822A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 25.6a11.55 11.55 0 0 1-5.87-1.597l-.42-.25-4.42 1.082 1.115-4.3-.276-.44A11.555 11.555 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6Zm6.34-8.64c-.348-.174-2.058-1.014-2.377-1.13-.32-.116-.552-.174-.784.174-.232.348-.9 1.13-1.103 1.362-.203.232-.406.26-.754.086-.348-.174-1.469-.541-2.797-1.725-1.034-.922-1.731-2.06-1.934-2.408-.203-.348-.022-.536.152-.71.157-.155.348-.405.522-.608.174-.203.232-.348.348-.58.116-.232.058-.435-.029-.608-.087-.174-.784-1.89-1.074-2.588-.283-.68-.57-.587-.784-.598l-.667-.012c-.232 0-.608.087-.927.435-.32.348-1.218 1.19-1.218 2.9 0 1.71 1.247 3.362 1.42 3.594.174.232 2.453 3.746 5.944 5.252.831.358 1.48.572 1.985.733.834.265 1.593.228 2.193.138.669-.1 2.058-.841 2.348-1.654.29-.813.29-1.51.203-1.655-.086-.145-.318-.232-.667-.406Z" />
        </svg>
      </span>

      {/* Label — pojavljuje se na hover */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pr-0 group-hover:pr-4 text-sm font-medium">
        {hoverLabel}
      </span>
    </a>
  );
}
