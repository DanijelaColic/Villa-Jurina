'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const faqItems: FAQItem[] = [
  {
    q: 'Kad je check-in i check-out?',
    a: 'Check-in je od 14:00, check-out do 11:00. Ako dolazite ranije ili odlazite kasnije, javite nam se unaprijed — nastojimo izaći u susret kada je to moguće.',
  },
  {
    q: 'Koji je minimalni boravak?',
    a: 'Minimalni boravak je 2 noći tijekom cijele godine.',
  },
  {
    q: 'Je li parking besplatan?',
    a: 'Da, besplatni parking za sve goste dostupan je neposredno uz vilu. Nema dodatnih troškova.',
  },
  {
    q: 'Smiju li se dovoditi kućni ljubimci?',
    a: 'Ljubimci su dobrodošli uz prethodni dogovor. Molimo da nas obavijestite pri rezervaciji kako bismo osigurali odgovarajući smještaj.',
  },
  {
    q: 'Kako plaćam rezervaciju?',
    a: 'Rezervacija se potvrđuje uplatom depozita od 30% ukupnog iznosa. Ostatak se plaća pri dolasku — gotovinom ili bankovnim transferom. Plaćanje karticom nije dostupno.',
  },
  {
    q: 'Koliko je daleko plaža?',
    a: 'Šljunčana plaža u Drašnicama je 50 metara od vile — doslovno iza ugla. More je iznimno čisto i prozirno, s laganim ulaskom.',
  },
  {
    q: 'Je li WiFi uključen?',
    a: 'Da, brzi bežični internet dostupan je besplatno u svim apartmanima.',
  },
  {
    q: 'Imam li pristup kuhinji?',
    a: 'Svi apartmani imaju potpuno opremljenu kuhinju s hladnjakom, mikrovalnom, kuhalom za vodu i svom potrebnom opremom za kuhanje.',
  },
  {
    q: 'Mogu li rezervirati više apartmana za grupu?',
    a: 'Naravno — vila ima 4 apartmana i idealna je za veće obitelji ili grupe prijatelja. Kontaktirajte nas direktno za grupnu rezervaciju i posebnu ponudu.',
  },
  {
    q: 'Što je u blizini vile?',
    a: 'U neposrednoj blizini je plaža, restoran s dalmatinskom kuhinjom i dječje igralište. Makarska je 10 minuta vožnje, Biokovo Skywalk 30 minuta, a trajekti za Hvar i Brač kreću iz Makarske.',
  },
];

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FAQ({
  items = faqItems,
  title = 'Često postavljana pitanja',
  subtitle = 'Sve što trebate znati prije dolaska.',
}: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Pomoć
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-3">{title}</h2>
          <p className="text-muted">{subtitle}</p>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-sand">
          {items.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-medium text-base transition-colors ${isOpen ? 'text-secondary' : 'text-text group-hover:text-secondary'}`}
                  >
                    {item.q}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-sand flex items-center justify-center text-secondary transition-colors group-hover:bg-secondary/10">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
                >
                  <p className="text-muted text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact nudge */}
        <p className="text-center text-sm text-muted mt-10">
          Niste pronašli odgovor?{' '}
          <a href="/kontakt" className="text-secondary hover:underline font-medium">
            Kontaktirajte nas
          </a>{' '}
          ili nas nazovite na{' '}
          <a
            href="https://wa.me/385916391305"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline font-medium"
          >
            091 6391 305
          </a>
          .
        </p>
      </div>
    </section>
  );
}
