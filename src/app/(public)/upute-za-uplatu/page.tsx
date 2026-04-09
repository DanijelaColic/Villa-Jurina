import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Upute za uplatu depozita',
  description:
    'Podaci za uplatu depozita za rezervaciju smještaja u Villa Jurina.',
  alternates: { canonical: 'https://villajurina.com/upute-za-uplatu' },
};

export default async function UputeZaUplatuPage() {
  const t = await getTranslations('paymentInstructionsPage');

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-sand bg-white p-6 sm:p-8">
        <p className="text-secondary font-medium tracking-widest text-xs uppercase mb-3">
          Villa Jurina
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-4">
          {t('title')}
        </h1>
        <p className="text-muted leading-relaxed mb-6">
          {t('description')}
        </p>

        <div className="rounded-xl border border-sand-light bg-sand-light/40 p-5 sm:p-6">
          <h2 className="font-semibold text-text mb-4">{t('paymentData')}</h2>
          <dl className="space-y-3 text-sm sm:text-base">
            <div>
              <dt className="text-muted">{t('labels.recipient')}</dt>
              <dd className="text-text font-medium">Antonija Pušić</dd>
            </div>
            <div>
              <dt className="text-muted">IBAN</dt>
              <dd className="text-text font-medium">HR6523900013223724831</dd>
            </div>
            <div>
              <dt className="text-muted">BIC/SWIFT</dt>
              <dd className="text-text font-medium">HPBZHR2X</dd>
            </div>
            <div>
              <dt className="text-muted">{t('labels.bank')}</dt>
              <dd className="text-text font-medium">
                Hrvatska poštanska banka d.d.
              </dd>
            </div>
            <div>
              <dt className="text-muted">{t('labels.bankAddress')}</dt>
              <dd className="text-text font-medium">
                Jurišićeva 4, 10000 Zagreb, Croatia
              </dd>
            </div>
            <div>
              <dt className="text-muted">{t('labels.paymentDescription')}</dt>
              <dd className="text-text font-medium">Rezervacija Villa Jurina</dd>
            </div>
          </dl>
        </div>

        <p className="text-sm text-muted mt-6 leading-relaxed">
          {t('note')}
        </p>
      </div>
    </main>
  );
}
