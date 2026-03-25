import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Galerija | Villa Jurina — Drašnice',
  description:
    'Pogledajte fotografije apartmana Arba, Harmonia, Luna i Sky te okolice Drašnica i Makarske rivijere.',
};

export default function GalerijaPage() {
  return (
    <main className="pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Villa Jurina · Drašnice
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            Galerija
          </h1>
          <p className="text-muted leading-relaxed">
            Pregledajte fotografije naših apartmana, pogleda na more i okolice Drašnica i Makarske
            rivijere.
          </p>
        </div>

        <GalleryClient />
      </div>
    </main>
  );
}
