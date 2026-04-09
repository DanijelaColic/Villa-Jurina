import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import './globals.css';
import { getSiteUrl } from '@/lib/siteUrl';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const BASE_URL = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'siteMetadata' });
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: '%s | Villa Jurina',
    },
    description,
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
      locale: locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'hr_HR',
      url: BASE_URL,
      siteName: 'Villa Jurina',
      title,
      description,
      images: [
        {
          url: '/images/hero/hero3.jpeg',
          width: 1200,
          height: 630,
          alt: t('openGraphAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
