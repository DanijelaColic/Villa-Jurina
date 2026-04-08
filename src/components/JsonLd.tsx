/**
 * Structured data (JSON-LD) komponente za schema.org markup.
 * Poboljšavaju prikaz u Google rezultatima (rich snippets).
 */
import { getSiteUrl } from '@/lib/siteUrl';

const BASE_URL = getSiteUrl();

/** FAQPage — Google može prikazati FAQ odgovore direktno u search rezultatima */
export function FAQJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** BreadcrumbList — prikazuje putanju u Google rezultatima (npr. Villa Jurina > Apartmani > Sky) */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** LodgingBusiness — prikazuje se na homepageu */
export function LodgingBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Villa Jurina',
    url: BASE_URL,
    logo: `${BASE_URL}/images/Logo_Villa_Jurina.png`,
    image: `${BASE_URL}/images/apartments/arba/Arba1.jpeg`,
    description:
      'Apartmani s pogledom na more u Drašnicama na Makarskoj rivijeri. 50 metara od šljunčane plaže.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Drašnice 133',
      addressLocality: 'Podgora',
      addressRegion: 'Splitsko-dalmatinska županija',
      postalCode: '21328',
      addressCountry: 'HR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.1527,
      longitude: 17.0614,
    },
    telephone: '+385916391305',
    email: 'villajurina@gmail.com',
    priceRange: '€€',
    checkinTime: '14:00',
    checkoutTime: '11:00',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
    ],
    starRating: {
      '@type': 'Rating',
      ratingValue: '5',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Apartment — prikazuje se na stranici pojedinog apartmana */
export function ApartmentJsonLd({
  name,
  description,
  slug,
  image,
  capacity,
  priceOffSeason,
  priceHighSeason,
}: {
  name: string;
  description: string;
  slug: string;
  image: string;
  capacity: number;
  priceOffSeason: number;
  priceHighSeason: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: `Apartman ${name} — Villa Jurina`,
    description,
    url: `${BASE_URL}/apartmani/${slug}`,
    image: `${BASE_URL}${image}`,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: capacity,
    },
    containedInPlace: {
      '@type': 'LodgingBusiness',
      name: 'Villa Jurina',
      url: BASE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Drašnice 133',
        addressLocality: 'Podgora',
        addressCountry: 'HR',
      },
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Izvan sezone',
        price: priceOffSeason,
        priceCurrency: 'EUR',
        description: 'Cijena po noći izvan sezone (sve osim srpnja i kolovoza)',
      },
      {
        '@type': 'Offer',
        name: 'Visoka sezona',
        price: priceHighSeason,
        priceCurrency: 'EUR',
        description: 'Cijena po noći — srpanj i kolovoz',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
