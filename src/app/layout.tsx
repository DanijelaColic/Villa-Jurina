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

export const metadata: Metadata = {
  title: 'Villa Jurina | Drašnice, Makarska rivijera',
  description:
    'Apartmani s pogledom na more u Drašnicama. 50m od šljunčane plaže, blizu Makarske. Rezervirajte online.',
  keywords: ['Villa Jurina', 'apartmani Drašnice', 'smještaj Makarska', 'apartmani more'],
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
