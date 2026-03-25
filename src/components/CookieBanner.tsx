'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'villa-jurina-cookies';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Obavijest o kolačićima"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-0 sm:bottom-6 sm:left-6 sm:right-auto"
    >
      <div className="bg-white border border-sand shadow-xl rounded-2xl p-5 max-w-sm sm:max-w-md w-full">
        <p className="text-sm font-semibold text-text mb-1">Kolačići 🍪</p>
        <p className="text-xs text-muted leading-relaxed mb-4">
          Koristimo kolačiće za poboljšanje iskustva na stranici (analitika i preference).
          Pročitajte našu{' '}
          <Link href="/privatnost" className="underline hover:text-secondary">
            politiku privatnosti
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 bg-secondary hover:bg-secondary-light text-white text-xs font-medium py-2.5 rounded-full transition-colors"
          >
            Prihvati sve
          </button>
          <button
            onClick={decline}
            className="flex-1 border border-sand hover:border-primary text-text text-xs font-medium py-2.5 rounded-full transition-colors"
          >
            Samo nužni
          </button>
        </div>
      </div>
    </div>
  );
}
