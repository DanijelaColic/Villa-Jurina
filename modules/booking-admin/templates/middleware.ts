/**
 * TEMPLATE: kopiraj kao src/middleware.ts
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 *
 * Ako već imaš middleware.ts — integriraj logiku ručno.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from 'MODULE_ROOT/booking.config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
    const expected = process.env.ADMIN_TOKEN;

    if (!expected || !cookie || cookie.value !== expected) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/admin/login') {
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
    const expected = process.env.ADMIN_TOKEN;
    if (expected && cookie?.value === expected) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
