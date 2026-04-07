/**
 * TEMPLATE: kopiraj kao src/app/api/admin/login/route.ts
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPassword,
  getAdminToken,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from 'MODULE_ROOT/lib/admin-auth';

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}
