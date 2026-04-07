// Centralized payment recipient details used by barcode utilities.
// ENV values have priority; fallbacks keep existing payment flow working.
export const RECIPIENT_IBAN = process.env.RECIPIENT_IBAN ?? 'HR6523900013223724831';

export const RECIPIENT_NAME = process.env.RECIPIENT_NAME ?? 'Villa Jurina';
