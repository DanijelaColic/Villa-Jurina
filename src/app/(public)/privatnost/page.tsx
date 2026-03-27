import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politika privatnosti',
  description:
    'Politika privatnosti Villa Jurina — kako prikupljamo, koristimo i štitimo vaše osobne podatke sukladno GDPR-u.',
  robots: { index: true },
  alternates: { canonical: 'https://www.villajurina.hr/privatnost' },
};

const LAST_UPDATED = '27. ožujka 2025.';

export default function PrivatnostPage() {
  return (
    <div className="pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-12 lg:py-16">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Pravne informacije
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text mb-4">
            Politika privatnosti
          </h1>
          <p className="text-muted text-sm">Zadnja izmjena: {LAST_UPDATED}</p>
        </div>

        <div className="prose-custom space-y-10 text-muted leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              1. Voditelj obrade
            </h2>
            <p>
              Voditelj obrade osobnih podataka je <strong className="text-text">Villa Jurina</strong>,
              Drašnice 133, 21328 Podgora, Hrvatska.
            </p>
            <p className="mt-2">
              Za sva pitanja vezana uz obradu osobnih podataka možete nas kontaktirati:
            </p>
            <ul className="mt-2 space-y-1 list-none pl-0">
              <li>
                Email:{' '}
                <a href="mailto:villajurina@gmail.com" className="text-secondary hover:underline">
                  villajurina@gmail.com
                </a>
              </li>
              <li>
                Telefon / WhatsApp:{' '}
                <a href="tel:+385916391305" className="text-secondary hover:underline">
                  +385 91 639 1305
                </a>
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              2. Koje podatke prikupljamo
            </h2>
            <p>Prikupljamo sljedeće kategorije osobnih podataka:</p>
            <div className="mt-4 space-y-4">
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">Podaci o rezervaciji</p>
                <p className="text-sm">
                  Ime i prezime, e-mail adresa, broj telefona, odabrani apartman, datum
                  check-in/check-out, broj odraslih i djece, napomene.
                </p>
              </div>
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">Podaci iz kontakt forme</p>
                <p className="text-sm">
                  Ime, e-mail adresa, sadržaj poruke.
                </p>
              </div>
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">Tehnički podaci</p>
                <p className="text-sm">
                  IP adresa, vrsta preglednika i uređaja, stranice koje ste posjetili — za potrebe
                  analize i sigurnosti stranice. Ne koristimo ove podatke za identifikaciju
                  pojedinaca.
                </p>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              3. Svrha i pravna osnova obrade
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-sand">
                    <th className="text-left py-3 pr-4 font-medium text-text">Svrha</th>
                    <th className="text-left py-3 font-medium text-text">Pravna osnova (GDPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  <tr>
                    <td className="py-3 pr-4">Obrada i potvrda rezervacije</td>
                    <td className="py-3">Izvršenje ugovora (čl. 6(1)(b))</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Slanje potvrde i komunikacija o boravku</td>
                    <td className="py-3">Izvršenje ugovora (čl. 6(1)(b))</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Odgovor na upit putem kontakt forme</td>
                    <td className="py-3">Legitimni interes (čl. 6(1)(f))</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Ispunjavanje zakonskih obveza (porezni zapisi)</td>
                    <td className="py-3">Pravna obveza (čl. 6(1)(c))</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Poboljšanje i analitika web stranice</td>
                    <td className="py-3">Legitimni interes (čl. 6(1)(f))</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              4. S kim dijelimo vaše podatke
            </h2>
            <p>
              Vaše osobne podatke ne prodajemo ni trećim stranama ne dajemo u komercijalne svrhe.
              Podatke dijelimo isključivo s pouzdanim pružateljima usluga koji su nam potrebni za
              funkcioniranje rezervacijskog sustava:
            </p>
            <ul className="mt-4 space-y-3 list-none pl-0">
              <li className="flex gap-3">
                <span className="text-secondary font-medium shrink-0">Supabase</span>
                <span className="text-sm">
                  Baza podataka u kojoj se pohranjuju rezervacije (EU infrastruktura).
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-secondary hover:underline"
                  >
                    Politika privatnosti Supabase →
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary font-medium shrink-0">Resend</span>
                <span className="text-sm">
                  Servis za slanje transakcijskih e-mailova (potvrda rezervacije).
                  <a
                    href="https://resend.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-secondary hover:underline"
                  >
                    Politika privatnosti Resend →
                  </a>
                </span>
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              5. Rok čuvanja podataka
            </h2>
            <p>
              Podatke o rezervacijama čuvamo <strong className="text-text">5 godina</strong> od
              datuma odjave, sukladno poreznim i računovodstvenim propisima Republike Hrvatske.
            </p>
            <p className="mt-2">
              Podatke iz kontakt forme koji nisu rezultirali rezervacijom brišemo u roku od{' '}
              <strong className="text-text">12 mjeseci</strong> od primitka upita.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              6. Vaša prava
            </h2>
            <p>Sukladno GDPR-u imate sljedeća prava:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-text">Pravo na pristup</strong> — možete zatražiti kopiju
                osobnih podataka koje obrađujemo o vama.
              </li>
              <li>
                <strong className="text-text">Pravo na ispravak</strong> — možete zatražiti
                ispravak netočnih podataka.
              </li>
              <li>
                <strong className="text-text">Pravo na brisanje</strong> — možete zatražiti brisanje
                podataka, osim ako je čuvanje zakonski obvezno.
              </li>
              <li>
                <strong className="text-text">Pravo na ograničenje obrade</strong> — možete
                privremeno ograničiti obradu svojih podataka.
              </li>
              <li>
                <strong className="text-text">Pravo na prenosivost podataka</strong> — možete
                primiti svoje podatke u strojno čitljivom formatu.
              </li>
              <li>
                <strong className="text-text">Pravo na prigovor</strong> — možete se usprotiviti
                obradi temeljnoj na legitimnom interesu.
              </li>
            </ul>
            <p className="mt-4">
              Za ostvarivanje navedenih prava pišite na{' '}
              <a href="mailto:villajurina@gmail.com" className="text-secondary hover:underline">
                villajurina@gmail.com
              </a>
              . Odgovoriti ćemo u roku od 30 dana.
            </p>
            <p className="mt-2">
              Ako smatrate da vaša prava nisu zaštićena, možete podnijeti pritužbu Agenciji za
              zaštitu osobnih podataka (AZOP):{' '}
              <a
                href="https://azop.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                azop.hr
              </a>
              .
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              7. Kolačići (cookies)
            </h2>
            <p>
              Koristimo kolačiće za poboljšanje iskustva korištenja stranice. Kolačići su male
              tekstualne datoteke koje se pohranjuju na vašem uređaju.
            </p>
            <div className="mt-4 space-y-3">
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">Nužni kolačići</p>
                <p className="text-sm">
                  Potrebni za osnovnu funkcionalnost stranice (vaše postavke privatnosti). Uvijek
                  aktivni — ne mogu se isključiti.
                </p>
              </div>
              <div className="bg-sand-light rounded-xl p-4">
                <p className="font-medium text-text mb-1">Analitički kolačići</p>
                <p className="text-sm">
                  Pomažu nam razumjeti kako posjetitelji koriste stranicu. Aktiviraju se samo uz vašu
                  suglasnost.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Postavke kolačića možete promijeniti u svakom trenutku brisanjem postavke{' '}
              <code className="bg-sand px-1.5 py-0.5 rounded text-xs font-mono">
                villa-jurina-cookies
              </code>{' '}
              iz lokalnog pohrana vašeg preglednika, ili kontaktiranjem.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              8. Sigurnost podataka
            </h2>
            <p>
              Primjenjujemo tehničke i organizacijske mjere za zaštitu vaših osobnih podataka od
              neovlaštenog pristupa, gubitka ili uništenja. Komunikacija s našom stranicom
              zaštićena je SSL enkripcijom (HTTPS). Pristup podacima rezervacija ograničen je
              isključivo na vlasnika objekta.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text mb-4">
              9. Izmjene ove politike
            </h2>
            <p>
              Zadržavamo pravo izmjene ove politike privatnosti. Sve bitne izmjene objavit ćemo na
              ovoj stranici s ažuriranim datumom. Preporučujemo povremenu provjeru.
            </p>
          </section>

          {/* Back link */}
          <div className="pt-6 border-t border-sand">
            <Link href="/" className="text-secondary hover:underline text-sm font-medium">
              ← Natrag na početnu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
