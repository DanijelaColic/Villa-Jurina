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
  priceOffSeason: number; // lipanj + rujan (€/noć)
  priceHighSeason: number; // srpanj + kolovoz (€/noć)
  fullyBooked: boolean; // true za Sky cijelu sezonu
  amenities: string[];
  images: string[]; // putanje do slika u /public/images/apartments/[slug]/
};

export const apartments: Apartment[] = [
  {
    slug: 'sky',
    name: 'Sky',
    tagline: 'Svjetlost, mir i pogled na pučinu.',
    description:
      'SKY je svijetao i elegantan apartman koji odiše svježinom i toplinom. Ugodna atmosfera i pažljivo uređenje čine ga savršenim izborom za parove koji žele započeti dan u miru i udobnosti.',
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
      'HARMONIA je prostran i elegantan obiteljski apartman idealan za opušten i bezbrižan boravak. Pažljivo uređen prostor pruža udobnost, funkcionalnost i osjećaj doma, savršen za obitelji koje žele kvalitetno provesti vrijeme zajedno i stvoriti lijepe uspomene.',
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
      'ARBA je topao i miran obiteljski apartman koji nudi sve potrebno za ugodan boravak. Njegova smirujuća atmosfera i praktičan raspored čine ga savršenim izborom za obitelji koje traže mir, sigurnost i opuštanje.',
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
      'LUNA je intiman i profinjen apartman stvoren za parove. Elegantno uređen prostor pruža mir, privatnost i romantičnu atmosferu, idealnu za opuštajući odmor ili kratki bijeg od svakodnevice.',
    capacity: 4,
    capacityNote: '4 osobe (2+2)',
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

export function getApartment(slug: string): Apartment | undefined {
  return apartments.find((a) => a.slug === slug);
}

export function getAvailableApartments(): Apartment[] {
  return apartments.filter((a) => !a.fullyBooked);
}

export function getPriceForDate(apartment: Apartment, date: Date): number {
  const month = date.getMonth() + 1; // 1-indexed
  if (month === 7 || month === 8) {
    return apartment.priceHighSeason;
  }
  return apartment.priceOffSeason;
}
