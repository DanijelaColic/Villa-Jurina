'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Category = 'sve' | 'arba' | 'harmonia' | 'luna' | 'okolica';

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<Category, 'sve'>;
}

const images: GalleryImage[] = [
  // Arba — cover first; krevetić last; no Drašnice
  { src: '/images/apartments/arba/arba7.jpeg', alt: 'Apartman Arba — balkon s pogledom', category: 'arba' },
  { src: '/images/apartments/arba/arba1.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba2.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba3.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba4.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba5.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba6.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba8.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba9.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/arba10.jpeg', alt: 'Apartman Arba', category: 'arba' },
  { src: '/images/apartments/arba/krevetic.jpeg', alt: 'Krevetić za bebe — dostupan na upit', category: 'arba' },
  // Harmonia
  { src: '/images/apartments/harmonia/harmonia2.jpeg', alt: 'Apartman Harmonia — balkon s morem', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia1.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia7.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia3.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia4.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia5.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia6.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia8.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia9.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia10.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia11.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia12.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia13.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia14.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia15.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia16.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/harmonia17.jpeg', alt: 'Apartman Harmonia', category: 'harmonia' },
  { src: '/images/apartments/harmonia/krevetic.jpeg', alt: 'Krevetić za bebe — dostupan na upit', category: 'harmonia' },
  // Luna
  { src: '/images/apartments/luna/luna1.jpeg', alt: 'Apartman Luna — pogled na more', category: 'luna' },
  { src: '/images/apartments/luna/luna6.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna2.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna3.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna4.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna5.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna7.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna8.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna9.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/luna10.jpeg', alt: 'Apartman Luna', category: 'luna' },
  { src: '/images/apartments/luna/krevetic.jpeg', alt: 'Krevetić za bebe — dostupan na upit', category: 'luna' },
  // Okolica & Vila (Drašnice samo ovdje, ne kao cover apartmana)
  { src: '/images/apartments/arba/Drašnice 1.jpeg', alt: 'Drašnice — pogled na more', category: 'okolica' },
  { src: '/images/apartments/arba/Drašnice 2.jpeg', alt: 'Drašnice — plaža', category: 'okolica' },
  { src: '/images/Okolica/Drašnice 1.jpeg', alt: 'Drašnice — uvala', category: 'okolica' },
  { src: '/images/Okolica/biokovo.webp', alt: 'Park prirode Biokovo', category: 'okolica' },
  { src: '/images/Okolica/makarska.jpg', alt: 'Makarska rivijera', category: 'okolica' },
  { src: '/images/Okolica/Brac.jpg', alt: 'Zlatni rat, Brač', category: 'okolica' },
  { src: '/images/Okolica/Split.jpg', alt: 'Stari grad Split', category: 'okolica' },
  { src: '/images/povijest/Povijest1.jpeg', alt: 'Villa Jurina — vila', category: 'okolica' },
  { src: '/images/povijest/Povijest2.jpeg', alt: 'Villa Jurina — eksterijer', category: 'okolica' },
  { src: '/images/povijest/Povijest3.jpeg', alt: 'Villa Jurina — okoliš', category: 'okolica' },
  { src: '/images/povijest/Povijest4.jpeg', alt: 'Villa Jurina — pogled', category: 'okolica' },
];

const categories: { id: Category; label: string }[] = [
  { id: 'sve', label: 'Sve' },
  { id: 'arba', label: 'Arba' },
  { id: 'harmonia', label: 'Harmonia' },
  { id: 'luna', label: 'Luna' },
  { id: 'okolica', label: 'Okolica & Vila' },
];

export default function GalleryClient() {
  const t = useTranslations('galleryClient');
  const [active, setActive] = useState<Category>('sve');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const allLabel = t('categories.all');
  const surroundingsLabel = t('categories.surroundings');

  const filtered = active === 'sve' ? images : images.filter((img) => img.category === active);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
              active === id
                ? 'bg-secondary text-white border-secondary'
                : 'bg-white text-text border-sand hover:border-secondary hover:text-secondary'
            }`}
          >
            {id === 'sve' ? allLabel : id === 'okolica' ? surroundingsLabel : label}
            {id !== 'sve' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({images.filter((img) => img.category === id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {filtered.map((img, idx) => (
          <button
            key={img.src}
            onClick={() => openLightbox(idx)}
            className="block w-full relative overflow-hidden rounded-xl group cursor-zoom-in"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={600}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            onClick={closeLightbox}
            aria-label={t('lightbox.close')}
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
            {lightbox + 1} / {filtered.length}
          </p>

          {/* Prev */}
          <button
            className="absolute left-3 sm:left-6 text-white/80 hover:text-white p-3 z-10 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label={t('lightbox.previous')}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16 sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
              sizes="(max-width: 1280px) 100vw, 1200px"
              priority
            />
            <p className="text-center text-white/50 text-sm mt-3">{filtered[lightbox].alt}</p>
          </div>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-6 text-white/80 hover:text-white p-3 z-10 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label={t('lightbox.next')}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
