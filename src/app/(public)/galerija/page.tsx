import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Galerija',
  description:
    'Fotografije apartmana Arba, Harmonia, Luna i Sky te okolice Drašnica i Makarske rivijere.',
  openGraph: {
    title: 'Galerija | Villa Jurina',
    description: 'Fotografije apartmana i okolice Drašnica na Makarskoj rivijeri.',
    url: 'https://www.villajurina.hr/galerija',
    images: [{ url: '/images/apartments/harmonia/Harmonia1.jpeg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.villajurina.hr/galerija' },
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
