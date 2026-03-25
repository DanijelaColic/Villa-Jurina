import Link from 'next/link';
import Image from 'next/image';
import {
  Waves,
  Mountain,
  MapPin,
  Ship,
  Bike,
  Camera,
  ArrowRight,
  Sun,
  Trees,
} from 'lucide-react';

export const metadata = {
  title: 'Što vidjeti u Drašnicama i okolici | Villa Jurina',
  description:
    'Otkrijte Drašnice i Makarsku rivijeru: Biokovo Skywalk, plaža Zlatni rat, otok Hvar, rafting na Cetini, Split i Dubrovnik. Idealno polazište za nezaboravne izlete smješten 50m od mora.',
};

const attractions = [
  {
    id: 'drasnice',
    icon: Waves,
    eyebrow: 'Lokalna čarolija',
    title: 'Drašnice — autentična dalmatinska uvala',
    image: '/images/Okolica/Drašnice 1.jpeg',
    imageAlt: 'Šljunčana plaža u Drašnicama',
    intro:
      'Malo dalmatinsko selo koje čuva sve što modernom turistu nedostaje: mir, čistoću i autentičnost. Nema gužvi ni buke — samo more, kamen i zvjezdano nebo.',
    items: [
      {
        name: 'Šljunčane plaže i skrivene uvale',
        desc: 'Kristalno čisto more i šljunčane plaže na kojima možete naći vlastiti kutak daleko od vreve. More je ovdje iznimno prozirno — idealano za plivanje, ronjenje i snorkling.',
      },
      {
        name: 'Staro selo Drašnice',
        desc: 'Prošetajte kamenim uličicama autentičnog dalmatinskog sela. Stare kamene kuće, miris lavande i osjećaj da je vrijeme stalo — pravo dalmatinsko iskustvo koje ne možete kupiti.',
      },
      {
        name: 'Crkva sv. Jurja',
        desc: 'Mala crkva s pogledom na more i zaštitnik mjesta. Savršena za mirnu jutarnju šetnju i fotografiju koja govori tisuću riječi.',
      },
      {
        name: 'Šetnica uz more',
        desc: 'Lagana večernja šetnja uz obalu s direktnim pogledom na otok Hvar. Zalazak sunca ovdje je posebno doživljaj koji ćete pamtiti.',
      },
    ],
  },
  {
    id: 'biokovo',
    icon: Mountain,
    eyebrow: 'Prirodni park',
    title: 'Park prirode Biokovo — planina iznad mora',
    image: '/images/Okolica/biokovo.webp',
    imageAlt: 'Pogled s planine Biokovo na more',
    intro:
      'Neposredno iznad Drašnica uzdiže se masiv Biokova, jedan od najimpresivnijih prirodnih parkova Hrvatske. Kontrast planinskog i mediteranskog krajolika ovdje je jedinstven na Jadranu.',
    items: [
      {
        name: 'Skywalk Biokovo',
        desc: 'Staklena viseća platforma iznad litice s pogledom na more s visine od gotovo 1000 metara. Jedna od najatraktivnijih atrakcija u cijeloj Dalmaciji — neobavezna za avanturiste i obavezna za sve ostale.',
      },
      {
        name: 'Planinarske staze i vidikovci',
        desc: 'Desetine označenih staza različitih težina za pješake i planinare. Vidikovci iznad Drašnica pružaju panoramski pogled na cijelu Makarsku rivijeru i otoke — Hvar, Brač i Korčulu.',
      },
      {
        name: 'Botanički vrt i flora',
        desc: 'Biokovo je dom endemskim biljnim vrstama koje ne možete pronaći nigdje drugdje na svijetu. Botanički vrt pri vrhu planine pravo je iznenađenje za ljubitelje prirode.',
      },
    ],
  },
  {
    id: 'okolna-mjesta',
    icon: MapPin,
    eyebrow: 'Makarska rivijera',
    title: 'Okolna mjesta — rivijera na dohvat ruke',
    image: '/images/Okolica/makarska.jpg',
    imageAlt: 'Makarska rivijera — pogled na obalu',
    intro:
      'Drašnice su smještene u srcu Makarske rivijere, okružene živopisnim mjestima koja su svako po nečemu posebno. Sve je na manje od 15 minuta vožnje.',
    items: [
      {
        name: 'Tučepi — elegancija rivijere',
        desc: 'Jedno od najpopularnijih mjesta Makarske rivijere s dugačkom šljunčanom plažom, restoranima i šetnicom. Svega 5 minuta vožnje od Drašnica.',
      },
      {
        name: 'Podgora — mirno i autentično',
        desc: 'Malo ribarsko mjesto s prepoznatljivim Galebovim krilima, simbolom mjesta. Izvrsna riblja restorana i mirna atmosfera izvan glavne sezone.',
      },
      {
        name: 'Makarska — centar rivijere',
        desc: 'Živahni grad s dugačkom rivom, Franjevačkim samostanom i bogatim noćnim životom. 10 minuta vožnje. Tu su i trajekti za Sumartin na Braču.',
      },
      {
        name: 'Igrane — skriveni dragulj',
        desc: 'Tihanje mjesto s jednom od najljepših plaža Makarske rivijere, polupjeskovitom uvalom zaštićenom od vjetra. Pravo lokalno tajno mjesto.',
      },
    ],
  },
  {
    id: 'otoci',
    icon: Ship,
    eyebrow: 'Izleti brodom',
    title: 'Otoci — jednodnevni izleti brodom',
    image: '/images/Okolica/Brac.jpg',
    imageAlt: 'Zlatni rat, Brač — jadranski otoci',
    intro:
      'Jadranski otoci su nadohvat ruke. Iz Drašnica i okolnih luka kreću brodovi prema najboljim otocima Dalmacije — svaki s vlastitim karakterom i pričom.',
    items: [
      {
        name: 'Hvar — kraljica jadranskih otoka',
        desc: 'Najsunčaniji otok u Hrvatskoj s prozirnim uvalama, vinogradima i živahnim starim gradom. Direktni pogled s plaže u Drašnicama. Trajekti i brodske linije dostupni iz obližnjih luka.',
      },
      {
        name: 'Brač — Zlatni rat',
        desc: 'Dom legendarne plaže Zlatni rat, jedne od najprepozvatljivijih plaža na Mediteranu. Jedinstven rt koji mijenja oblik ovisno o struji mora. Obavezno za posjet.',
      },
      {
        name: 'Korčula — grad vina i šuma',
        desc: 'Malo dalje, ali vrijedna putovanja. Stari grad Korčula podsjeća na mali Dubrovnik. Poznata po izvrsnim vinima plavac mali i mošt.',
      },
    ],
  },
  {
    id: 'aktivni',
    icon: Bike,
    eyebrow: 'Adrenalin i priroda',
    title: 'Aktivni odmor — za one koji traže više',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Kayak na moru — aktivni odmor na Jadranu',
    intro:
      'Makarska rivijera nije samo plaža. Tko voli adrenalinska iskustva, planinari, biciklisti i ljubitelji prirode pronaći će ovdje pravo bogatstvo.',
    items: [
      {
        name: 'Kajak i SUP',
        desc: 'Rentirajte kajak ili dasku za stojeće veslanje i istražite obalu iz perspektive mora. Lokalni iznajmljivači nude opremu i vođene ture duž obale.',
      },
      {
        name: 'Ronjenje i snorkling',
        desc: 'Podmorje Makarske rivijere bogato je životom. Lokalni ronilački centri nude tečajeve i vođena ronjenja za sve razine iskustva.',
      },
      {
        name: 'Pješačenje i planinarenje',
        desc: 'Staze od samih Drašnica vode u Biokovo i dalje prema vidikovcima. Neke staze su lagane i prikladne za obitelji, druge su zahtjevne i nagrađuju nevjerojatnim pogledima.',
      },
      {
        name: 'Biciklizam',
        desc: 'Ceste duž rivijere idealne su za bicikliste. Postoje rute različitih težina — od laganih obalnih do zahtjevnih uspona prema Biokovu.',
      },
    ],
  },
  {
    id: 'izleti',
    icon: Camera,
    eyebrow: 'Jednodnevni izleti',
    title: 'Malo dalje — jednodnevni izleti',
    image: '/images/Okolica/Split.jpg',
    imageAlt: 'Stari grad Split — Dioklecijanova palača',
    intro:
      'Drašnice su odlično polazište za jednodnevne izlete do nekih od najljepših gradova i prirodnih atrakcija Dalmacije i Hercegovine.',
    items: [
      {
        name: 'Omiš — adrenalin na Cetini',
        desc: 'Sat vožnje prema sjeveru. Rafting i zipline na rijeci Cetini, gotova tvrđava Mirabela i jedinstveni spoj planine i mora. Idealno za obitelji i avanturiste.',
      },
      {
        name: 'Split — Dioklecijanova palača',
        desc: 'Sat i pol vožnje. Drugi najveći grad Hrvatske s Dioklecijanovom palačom iz 4. stoljeća, živahnom rivom i izvrsnom gastronomijom. Obavezan posjet.',
      },
      {
        name: 'Mostar — most koji spaja',
        desc: 'Dva sata vožnje prema istoku. UNESCO-ova baština, čuveni Stari most nad Neretvom i bogata bosanska kultura. Jedinstveno iskustvo koje proširuje horizonte.',
      },
      {
        name: 'Dubrovnik — grad koji nikad ne razočara',
        desc: 'Dva do tri sata vožnje prema jugu. Biserna kruna Jadrana, stari grad opasan zidinama i jedan od najljepših gradova na svijetu. Za duži jednodnevni izlet.',
      },
    ],
  },
];

export default function DrasnicePage() {
  return (
    <div className="pt-20">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-36 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1690260152558-552cec19ce70?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            Drašnice · Makarska rivijera
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            Što vidjeti u Drašnicama i okolici
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Plaže, planine, otoci i gradovi puni povijesti — sve na dohvat ruke iz vaše baze
            na Makarskoj rivijeri.
          </p>
          <Link
            href="/rezervacija"
            className="inline-block bg-secondary hover:bg-secondary-light text-white font-medium px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
          >
            Rezerviraj smještaj u Drašnicama
          </Link>
        </div>
      </section>

      {/* ── UVOD ─────────────────────────────────────────────── */}
      <section className="py-16 bg-sand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            Drašnice su tiho dalmatinsko mjesto na Makarskoj rivijeri — idealno polazište za
            istraživanje jednog od najbogatijih turističkih prostora Hrvatske. Od šljunčanih plaža
            s tirkiznim morem, preko planine Biokovo s legendarnim Skywalkom, do jadranskih otoka
            Hvara i Brača — sve je ovdje na dohvat ruke.{' '}
            <strong className="text-text">
              Villa Jurina smještena je samo 50 metara od plaže
            </strong>{' '}
            i savršena je baza za vaše avanture.
          </p>
        </div>
      </section>

      {/* ── ATRAKCIJE ────────────────────────────────────────── */}
      {attractions.map((section, sIdx) => {
        const Icon = section.icon;
        const isEven = sIdx % 2 === 0;
        return (
          <section
            key={section.id}
            id={section.id}
            className={`py-20 lg:py-28 ${isEven ? 'bg-white' : 'bg-sand-light'}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section header + image — dva stupca na desktopu */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <Icon size={18} />
                    </div>
                    <p className="text-secondary font-medium tracking-widest text-xs uppercase">
                      {section.eyebrow}
                    </p>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted leading-relaxed text-base">{section.intro}</p>
                </div>
                <div className={`aspect-16/10 relative rounded-2xl overflow-hidden shadow-sm ${sIdx % 2 !== 0 ? 'lg:order-first' : ''}`}>
                  <Image
                    src={section.image}
                    alt={section.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-2xl border border-sand p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-text mb-2">
                          {item.name}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── PRAKTIČNE INFO ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
              Korisno znati
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
              Drašnice — vaša baza na rivijeri
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Waves,
                title: '50 m do plaže',
                desc: 'Šljunčana plaža s kristalno čistim morem doslovno iza ugla.',
              },
              {
                icon: MapPin,
                title: '10 min do Makarske',
                desc: 'Centar rivijere s restoranima, barovima i trajektima za otoke.',
              },
              {
                icon: Mountain,
                title: 'Biokovo uz vrata',
                desc: 'Skywalk i planinarske staze dostupni u manje od 30 minuta vožnje.',
              },
              {
                icon: Sun,
                title: 'Hvar u vidokrugu',
                desc: 'Najsunčaniji otok vidi se direktno s plaže — trajekt iz Makarske.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-sand-light">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary mx-auto mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <Trees size={36} className="text-secondary" />
          </div>
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-4">
            Drašnice · Villa Jurina
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Sve ovo čeka vas na dohvat ruke
          </h2>
          <p className="text-white/70 mb-2 text-base leading-relaxed">
            Smjestite se u Villa Jurina — 50 metara od mora, s pogledom koji oduzima dah — i
            istraživajte Makarsku rivijeru, Biokovo i jadranske otoke po svom ritmu.
          </p>
          <p className="text-white/50 text-sm mb-10">
            Minimalni boravak 2 noći · Check-in od 14:00 · Check-out do 11:00
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervacija"
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-light text-white font-medium px-8 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              Provjeri slobodne termine
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/apartmani"
              className="inline-block border border-white/40 hover:border-white text-white font-medium px-8 py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              Pogledaj apartmane
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
