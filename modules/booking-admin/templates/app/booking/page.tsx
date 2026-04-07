/**
 * TEMPLATE: kopiraj kao src/app/(public)/booking/page.tsx (ili željeni URL)
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 *
 * Props `initialSlug` prima ?apartment= iz URL search params.
 * Prilagodi SEO metapodatke za vlastiti projekt.
 */
import type { Metadata } from 'next';
import BookingWidget from 'MODULE_ROOT/components/BookingWidget';
import { SITE_NAME } from 'MODULE_ROOT/booking.config';

export const metadata: Metadata = {
  title: `Book | ${SITE_NAME}`,
  description: `Book your stay at ${SITE_NAME}.`,
};

type Props = {
  searchParams: Promise<{ apartment?: string }>;
};

export default async function BookingPage({ searchParams }: Props) {
  const { apartment } = await searchParams;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold text-text mb-2">Book your stay</h1>
      <p className="text-muted mb-8">
        Select your apartment, choose dates and submit your request.
      </p>
      <BookingWidget initialSlug={apartment} />
    </main>
  );
}
