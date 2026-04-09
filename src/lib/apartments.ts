export type Apartment = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capacity: number;
  capacityNote: string;
  size: number;
  beds: string;
  view: boolean;
  balcony: boolean;
  floors: number;
  priceOffSeason: number; // cijela godina osim srpnja i kolovoza (€/noć)
  priceHighSeason: number; // srpanj + kolovoz (€/noć)
  fullyBooked: boolean; // true za Sky cijelu sezonu
  amenities: string[];
  images: string[]; // putanje do slika u /public/images/apartments/[slug]/
};

export type ApartmentLocale = 'hr' | 'en' | 'de';

export const apartments: Apartment[] = [
  {
    slug: 'sky',
    name: 'Sky',
    tagline: 'Svjetlost, mir i pogled na pučinu.',
    description:
      'SKY je svijetao i elegantan apartman koji odiše svježinom i toplinom. Dizajniran za dvoje — za one koji traže tišinu, jutarnju kavu uz zvuk mora i večeri bez žurbe. Pažljivo uređenje, prirodni materijali i pogled koji oduzima dah čine ga savršenim izborom za parove koji žele pravi odmor od svakodnevice.',
    capacity: 2,
    capacityNote: '2 osobe',
    size: 24,
    beds: '1 bračni krevet',
    view: true,
    balcony: false,
    floors: 1,
    priceOffSeason: 80,
    priceHighSeason: 100,
    fullyBooked: false,
    amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking'],
    images: [
      '/images/apartments/sky/Sky1.jpeg',
      '/images/apartments/sky/Sky2.jpeg',
      '/images/apartments/sky/Sky3.jpeg',
      '/images/apartments/sky/Sky4.jpeg',
    ],
  },
  {
    slug: 'harmonia',
    name: 'Harmonia',
    tagline: 'Prostranstvo i elegancija za cijelu obitelj.',
    description:
      'HARMONIA je prostran i elegantan dvoetažni apartman koji nudi sve što jedna obitelj treba za bezbrižan odmor. Dva balkona s pogledom na more, dovoljno prostora da se svaki član obitelji pronađe, i ona topla atmosfera doma koja se ne može naručiti. Savršen za obitelji koje žele kvalitetno provesti vrijeme zajedno — uz more, daleko od buke, blizu svega važnog.',
    capacity: 6,
    capacityNote: '6 osoba (4+2)',
    size: 70,
    beds: '2 bračna kreveta + pomoćni ležaj',
    view: true,
    balcony: true,
    floors: 2,
    priceOffSeason: 180,
    priceHighSeason: 200,
    fullyBooked: false,
    amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking', '2x Balkon'],
    images: [
      '/images/apartments/harmonia/Harmonia1.jpeg',
      '/images/apartments/harmonia/Harmonia2.jpeg',
      '/images/apartments/harmonia/Harmonia3.jpeg',
      '/images/apartments/harmonia/Harmonia4.jpeg',
      '/images/apartments/harmonia/Harmonia5.jpeg',
      '/images/apartments/harmonia/Harmonia6.jpeg',
      '/images/apartments/harmonia/Harmonia7.jpeg',
    ],
  },
  {
    slug: 'arba',
    name: 'Arba',
    tagline: 'Topao i miran kutak za obitelj.',
    description:
      'ARBA je topao i miran apartman koji dočarava pravu dalmatinsku gostoljubivost. Balkon s pogledom na more, morski povjetarac ujutro i djeca koja se slobodno igraju na dječjem igralištu — sve je na svom mjestu. Praktičan raspored, udobnost i blizina plaže čine ga omiljenim izborom obitelji koje se godinama vraćaju.',
    capacity: 4,
    capacityNote: '4 osobe (2+2)',
    size: 40,
    beds: '1 bračni krevet + pomoćni ležaj',
    view: true,
    balcony: true,
    floors: 1,
    priceOffSeason: 120,
    priceHighSeason: 150,
    fullyBooked: false,
    amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking', 'Balkon'],
    images: [
      '/images/apartments/arba/Arba1.jpeg',
      '/images/apartments/arba/Arba2.jpeg',
      '/images/apartments/arba/Arba3.jpeg',
      '/images/apartments/arba/Arba4.jpeg',
      '/images/apartments/arba/Arba5.jpeg',
      '/images/apartments/arba/Arba6.jpeg',
      '/images/apartments/arba/Arba7.jpeg',
      '/images/apartments/arba/Arba8.jpeg',
    ],
  },
  {
    slug: 'luna',
    name: 'Luna',
    tagline: 'Intiman prostor stvoren za parove.',
    description:
      'LUNA je intiman i profinjen apartman stvoren za one koji traže više od pukog smještaja. Balkon s pogledom na more, večeri uz zvjezdano nebo i jutarnji šum valova — sve to čini LUNU savršenim mjestom za romantični bijeg. Elegantno uređenje, privatnost i neposredna blizina mora stvaraju atmosferu u kojoj se vrijeme usporava na pravi način.',
    capacity: 3,
    capacityNote: '3 osobe (2+1)',
    size: 35,
    beds: '1 bračni krevet + pomoćni ležaj',
    view: true,
    balcony: true,
    floors: 1,
    priceOffSeason: 100,
    priceHighSeason: 120,
    fullyBooked: false,
    amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking', 'Balkon'],
    images: [
      '/images/apartments/luna/Luna1.jpeg',
      '/images/apartments/luna/Luna2.jpeg',
      '/images/apartments/luna/Luna3.jpeg',
      '/images/apartments/luna/Luna4.jpeg',
      '/images/apartments/luna/Luna5.jpeg',
      '/images/apartments/luna/Luna6.jpeg',
    ],
  },
];

const apartmentTranslations: Record<
  ApartmentLocale,
  Record<
    string,
    Pick<Apartment, 'tagline' | 'description' | 'capacityNote' | 'beds' | 'amenities'>
  >
> = {
  hr: {
    sky: {
      tagline: 'Svjetlost, mir i pogled na pučinu.',
      description:
        'SKY je svijetao i elegantan apartman koji odiše svježinom i toplinom. Dizajniran za dvoje — za one koji traže tišinu, jutarnju kavu uz zvuk mora i večeri bez žurbe. Pažljivo uređenje, prirodni materijali i pogled koji oduzima dah čine ga savršenim izborom za parove koji žele pravi odmor od svakodnevice.',
      capacityNote: '2 osobe',
      beds: '1 bračni krevet',
      amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking'],
    },
    harmonia: {
      tagline: 'Prostranstvo i elegancija za cijelu obitelj.',
      description:
        'HARMONIA je prostran i elegantan dvoetažni apartman koji nudi sve što jedna obitelj treba za bezbrižan odmor. Dva balkona s pogledom na more, dovoljno prostora da se svaki član obitelji pronađe, i ona topla atmosfera doma koja se ne može naručiti. Savršen za obitelji koje žele kvalitetno provesti vrijeme zajedno — uz more, daleko od buke, blizu svega važnog.',
      capacityNote: '6 osoba (4+2)',
      beds: '2 bračna kreveta + pomoćni ležaj',
      amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking', '2x Balkon'],
    },
    arba: {
      tagline: 'Topao i miran kutak za obitelj.',
      description:
        'ARBA je topao i miran apartman koji dočarava pravu dalmatinsku gostoljubivost. Balkon s pogledom na more, morski povjetarac ujutro i djeca koja se slobodno igraju na dječjem igralištu — sve je na svom mjestu. Praktičan raspored, udobnost i blizina plaže čine ga omiljenim izborom obitelji koje se godinama vraćaju.',
      capacityNote: '4 osobe (2+2)',
      beds: '1 bračni krevet + pomoćni ležaj',
      amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking', 'Balkon'],
    },
    luna: {
      tagline: 'Intiman prostor stvoren za parove.',
      description:
        'LUNA je intiman i profinjen apartman stvoren za one koji traže više od pukog smještaja. Balkon s pogledom na more, večeri uz zvjezdano nebo i jutarnji šum valova — sve to čini LUNU savršenim mjestom za romantični bijeg. Elegantno uređenje, privatnost i neposredna blizina mora stvaraju atmosferu u kojoj se vrijeme usporava na pravi način.',
      capacityNote: '3 osobe (2+1)',
      beds: '1 bračni krevet + pomoćni ležaj',
      amenities: ['WiFi', 'Klima', 'TV', 'Kuhinja', 'Kuhalo za vodu', 'Parking', 'Balkon'],
    },
  },
  en: {
    sky: {
      tagline: 'Light, calm, and an open-sea view.',
      description:
        'SKY is a bright and elegant apartment that radiates freshness and warmth. Designed for two - for those seeking silence, morning coffee with the sound of waves, and unhurried evenings. Thoughtful design, natural materials, and breathtaking views make it a perfect choice for couples wanting a true break from everyday life.',
      capacityNote: '2 guests',
      beds: '1 double bed',
      amenities: ['WiFi', 'Air conditioning', 'TV', 'Kitchen', 'Kettle', 'Parking'],
    },
    harmonia: {
      tagline: 'Space and elegance for the whole family.',
      description:
        'HARMONIA is a spacious and elegant duplex apartment offering everything a family needs for a carefree holiday. Two balconies with sea view, enough space for every family member, and that warm home feeling you cannot order. Perfect for families who want quality time together - by the sea, away from crowds, close to everything important.',
      capacityNote: '6 guests (4+2)',
      beds: '2 double beds + sofa bed',
      amenities: ['WiFi', 'Air conditioning', 'TV', 'Kitchen', 'Kettle', 'Parking', '2x Balcony'],
    },
    arba: {
      tagline: 'A warm and peaceful family corner.',
      description:
        'ARBA is a warm and peaceful apartment reflecting true Dalmatian hospitality. A balcony with sea view, a gentle morning breeze, and children freely playing nearby - everything is in its place. Functional layout, comfort, and beach proximity make it a favorite for families who return year after year.',
      capacityNote: '4 guests (2+2)',
      beds: '1 double bed + sofa bed',
      amenities: ['WiFi', 'Air conditioning', 'TV', 'Kitchen', 'Kettle', 'Parking', 'Balcony'],
    },
    luna: {
      tagline: 'An intimate space made for couples.',
      description:
        'LUNA is an intimate and refined apartment for guests seeking more than just accommodation. A balcony with sea view, evenings under the stars, and the sound of waves in the morning make LUNA an ideal romantic escape. Elegant interior, privacy, and immediate sea proximity create an atmosphere where time slows down in the best way.',
      capacityNote: '3 guests (2+1)',
      beds: '1 double bed + sofa bed',
      amenities: ['WiFi', 'Air conditioning', 'TV', 'Kitchen', 'Kettle', 'Parking', 'Balcony'],
    },
  },
  de: {
    sky: {
      tagline: 'Licht, Ruhe und Blick auf die offene See.',
      description:
        'SKY ist ein helles und elegantes Apartment mit frischer und warmer Atmosphäre. Es ist für zwei Personen konzipiert - für alle, die Ruhe, Morgenkaffee mit Meeresrauschen und entspannte Abende suchen. Sorgfältige Einrichtung, natürliche Materialien und ein atemberaubender Ausblick machen es zur perfekten Wahl für Paare.',
      capacityNote: '2 Gäste',
      beds: '1 Doppelbett',
      amenities: ['WLAN', 'Klimaanlage', 'TV', 'Küche', 'Wasserkocher', 'Parkplatz'],
    },
    harmonia: {
      tagline: 'Großzügigkeit und Eleganz für die ganze Familie.',
      description:
        'HARMONIA ist ein großzügiges und elegantes Duplex-Apartment mit allem, was eine Familie für einen unbeschwerten Urlaub braucht. Zwei Balkone mit Meerblick, viel Platz für alle und diese warme Wohnatmosphäre, die man nicht bestellen kann. Ideal für Familien, die gemeinsam hochwertige Zeit verbringen möchten.',
      capacityNote: '6 Gäste (4+2)',
      beds: '2 Doppelbetten + Schlafsofa',
      amenities: ['WLAN', 'Klimaanlage', 'TV', 'Küche', 'Wasserkocher', 'Parkplatz', '2x Balkon'],
    },
    arba: {
      tagline: 'Eine warme und ruhige Ecke für Familien.',
      description:
        'ARBA ist ein warmes und ruhiges Apartment mit echter dalmatinischer Gastfreundschaft. Balkon mit Meerblick, morgendliche Meeresbrise und frei spielende Kinder - alles ist am richtigen Platz. Praktischer Grundriss, Komfort und Strandnähe machen es zu einer beliebten Wahl für Familien.',
      capacityNote: '4 Gäste (2+2)',
      beds: '1 Doppelbett + Schlafsofa',
      amenities: ['WLAN', 'Klimaanlage', 'TV', 'Küche', 'Wasserkocher', 'Parkplatz', 'Balkon'],
    },
    luna: {
      tagline: 'Ein intimer Raum für Paare.',
      description:
        'LUNA ist ein intimes und stilvolles Apartment für alle, die mehr als nur eine Unterkunft suchen. Balkon mit Meerblick, Abende unter dem Sternenhimmel und morgendliches Wellenrauschen machen LUNA zum perfekten Ort für eine romantische Auszeit. Elegante Einrichtung, Privatsphäre und unmittelbare Meeresnähe schaffen eine besondere Atmosphäre.',
      capacityNote: '3 Gäste (2+1)',
      beds: '1 Doppelbett + Schlafsofa',
      amenities: ['WLAN', 'Klimaanlage', 'TV', 'Küche', 'Wasserkocher', 'Parkplatz', 'Balkon'],
    },
  },
};

function getLocalizedApartment(apartment: Apartment, locale: ApartmentLocale): Apartment {
  const localeMap = apartmentTranslations[locale] ?? apartmentTranslations.hr;
  const translated = localeMap[apartment.slug];
  if (!translated) return apartment;
  return {
    ...apartment,
    ...translated,
  };
}

export function getApartment(slug: string, locale: ApartmentLocale = 'hr'): Apartment | undefined {
  const apartment = apartments.find((a) => a.slug === slug);
  if (!apartment) return undefined;
  return getLocalizedApartment(apartment, locale);
}

export function getApartments(locale: ApartmentLocale = 'hr'): Apartment[] {
  return apartments.map((apartment) => getLocalizedApartment(apartment, locale));
}

export function getAvailableApartments(locale: ApartmentLocale = 'hr'): Apartment[] {
  return getApartments(locale).filter((a) => !a.fullyBooked);
}

export function getPriceForDate(apartment: Apartment, date: Date): number {
  const month = date.getMonth() + 1; // 1-indexed
  if (month === 7 || month === 8) {
    return apartment.priceHighSeason;
  }
  return apartment.priceOffSeason;
}
