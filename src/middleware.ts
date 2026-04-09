import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const COOKIE_NAME = 'vj_admin';
const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get(COOKIE_NAME);
    const expected = process.env.ADMIN_TOKEN;

    if (!expected || !cookie || cookie.value !== expected) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/admin/login') {
    const cookie = request.cookies.get(COOKIE_NAME);
    const expected = process.env.ADMIN_TOKEN;
    if (expected && cookie?.value === expected) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/admin/:path*'],
};
