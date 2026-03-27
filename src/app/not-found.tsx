import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stranica nije pronađena',
  description: 'Tražena stranica ne postoji. Vratite se na početnu stranicu Villa Jurina.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-light px-4">
      <div className="text-center max-w-md">
        <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
          Greška 404
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text mb-4">
          Stranica nije pronađena
        </h1>
        <p className="text-muted text-base leading-relaxed mb-8">
          Stranica koju tražite ne postoji ili je premještena. Provjerite URL ili se vratite na
          početnu stranicu.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full transition-colors text-sm"
          >
            Početna stranica
          </Link>
          <Link
            href="/apartmani"
            className="border border-primary text-primary hover:bg-primary hover:text-white font-medium px-8 py-3 rounded-full transition-colors text-sm"
          >
            Pogledaj apartmane
          </Link>
        </div>
      </div>
    </div>
  );
}
