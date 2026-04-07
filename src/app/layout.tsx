import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const BASE_URL = 'https://villajurina.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Villa Jurina | Drašnice, Makarska rivijera',
    template: '%s | Villa Jurina',
  },
  description:
    'Apartmani s pogledom na more u Drašnicama. 50 m od šljunčane plaže na Makarskoj rivijeri. Rezervirajte online.',
  keywords: [
    'Villa Jurina',
    'apartmani Drašnice',
    'smještaj Makarska rivijera',
    'apartmani more Hrvatska',
    'ljetovanje Drašnice',
    'privatni smještaj Podgora',
  ],
  openGraph: {
    type: 'website',
    locale: 'hr_HR',
    url: BASE_URL,
    siteName: 'Villa Jurina',
    title: 'Villa Jurina | Drašnice, Makarska rivijera',
    description:
      'Apartmani s pogledom na more u Drašnicama. 50 m od šljunčane plaže na Makarskoj rivijeri.',
    images: [
      {
        url: '/images/hero/hero3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Villa Jurina — pogled na more, Drašnice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Jurina | Drašnice, Makarska rivijera',
    description:
      'Apartmani s pogledom na more u Drašnicama. 50 m od šljunčane plaže na Makarskoj rivijeri.',
    images: ['/images/hero/hero3.jpeg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: '/images/Logo_Villa_Jurina.png',
    apple: '/images/Logo_Villa_Jurina.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
