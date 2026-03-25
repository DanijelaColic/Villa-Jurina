const reviews = [
  {
    name: 'Markus & Julia B.',
    origin: 'Beč, Austrija',
    apartment: 'Sky',
    initials: 'MJ',
    color: 'bg-blue-100 text-blue-700',
    rating: 5,
    text: 'Savršen bijeg za dvoje. Pogled s terase na otvoreno more bio je nevjerojetan — jutarnja kava uz zvuk valova i Hvar u daljini. Apartman je bio čist, moderan i imao je sve što nam je trebalo. Plaža je doslovno 50 metara — nismo trebali auto cijeli tjedan.',
  },
  {
    name: 'Obitelj Kovač',
    origin: 'Zagreb, Hrvatska',
    apartment: 'Harmonia',
    initials: 'OK',
    color: 'bg-amber-100 text-amber-700',
    rating: 5,
    text: 'Harmonia je bila savršena za nas petero. Dva balkona, pogled na more s oba, dovoljno prostora da djeca imaju svoju sobu, a mi svoju tišinu. Domaćini su bili izuzetno ljubazni i uvijek dostupni. Vraćamo se sigurno — ovo je naš novi omiljeni odmor.',
  },
  {
    name: 'Pieter & Anke V.',
    origin: 'Amsterdam, Nizozemska',
    apartment: 'Arba',
    initials: 'PA',
    color: 'bg-green-100 text-green-700',
    rating: 5,
    text: 'Pronašli smo pravo skriveno mjesto! Drašnice su tako mirne i autentične — bez turističkih gužvi. Djeca su obožavala plažu i igralište, a mi smo konačno imali pravi odmor. Izlet na Biokovo Skywalk bio je nezaboravan. Apartman Arba — sve preporučujemo!',
  },
  {
    name: 'Valentina R.',
    origin: 'Milano, Italija',
    apartment: 'Luna',
    initials: 'VR',
    color: 'bg-rose-100 text-rose-700',
    rating: 5,
    text: 'Luna je romantičan apartman koji nadilazi očekivanja. Balkon s pogledom na more, uređenje s ukusom, miran položaj — idealno za par koji želi pravi odmor. More je savršeno čisto. Makarska je 10 minuta vožnje, ali iskreno — nismo ni htjeli odlaziti iz Drašnica.',
  },
  {
    name: 'Familie Gruber',
    origin: 'München, Njemačka',
    apartment: 'Harmonia',
    initials: 'FG',
    color: 'bg-purple-100 text-purple-700',
    rating: 5,
    text: 'Zweimal waren wir schon hier — und kommen wieder. Die Lage ist perfekt: ruhig, direkt am Meer, toller Ausblick auf Hvar. Die Wohnung Harmonia ist sehr geräumig und stilvoll eingerichtet. Die Gastgeber sind immer hilfsbereit. Biokovo Skywalk ist ein Muss!',
  },
  {
    name: 'Maja in Tomaž P.',
    origin: 'Ljubljana, Slovenija',
    apartment: 'Arba',
    initials: 'MT',
    color: 'bg-teal-100 text-teal-700',
    rating: 5,
    text: 'Odlična lokacija, tih apartman s prekrasnim pogledom. Rado bi izpostavila izjemno prijazne gostiteljice — vedno so bile pripravljene pomagati. Plaža je korak stran, Makarska 10 minut, Biokovo pa takoj za hišo. Čudovit teden, ki ga bomo dolgo ohranili v spominu.',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < count ? '#C9A96E' : '#E5E7EB'}
          className="w-4 h-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-sand-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
            Što kažu gosti
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-3">
            Recenzije
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="text-sm text-muted font-medium">5.0 — svi gosti preporučuju</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl border border-sand p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${r.color}`}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-medium text-text text-sm leading-tight">{r.name}</p>
                    <p className="text-xs text-muted">{r.origin}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full shrink-0">
                  {r.apartment}
                </span>
              </div>

              <Stars count={r.rating} />

              {/* Quote */}
              <p className="text-muted text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
