import type { NextRequest } from 'next/server';

export type AppLocale = 'hr' | 'en' | 'de';

export function getRequestLocale(request: NextRequest): AppLocale {
  const pathLocale = request.nextUrl.pathname.split('/')[1];
  if (pathLocale === 'en' || pathLocale === 'de' || pathLocale === 'hr') {
    return pathLocale;
  }

  const languageHeader = request.headers.get('accept-language')?.toLowerCase() ?? '';
  if (languageHeader.includes('de')) return 'de';
  if (languageHeader.includes('en')) return 'en';
  return 'hr';
}
