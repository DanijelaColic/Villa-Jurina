'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { href: '/apartmani', label: 'Apartmani' },
  { href: '/galerija', label: 'Galerija' },
  { href: '/drasnice', label: 'Okolica' },
  { href: '/rezervacija', label: 'Rezervacija' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

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
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'text-sm font-medium tracking-wide transition-colors hover:text-secondary',
                  pathname === href ? 'text-secondary' : isTransparent ? 'text-white' : 'text-text',
                )}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/rezervacija"
              className="bg-secondary hover:bg-secondary-light text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
            >
              Rezerviraj
            </Link>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className={clsx(
            'md:hidden p-2 rounded-md transition-colors',
            isTransparent ? 'text-white' : 'text-text',
          )}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-sand px-4 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                'text-sm font-medium py-2 transition-colors',
                pathname === href ? 'text-secondary' : 'text-text',
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/rezervacija"
            onClick={() => setMenuOpen(false)}
            className="bg-secondary text-white text-sm font-medium px-5 py-3 rounded-full text-center transition-colors"
          >
            Rezerviraj
          </Link>
        </div>
      )}
    </header>
  );
}
