import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from '../booking.config';

export { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE };

export function verifyPassword(input: string): boolean {
  return input === (process.env.ADMIN_PASSWORD ?? '');
}

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN ?? '';
}

/** Provjera u Server Componentima (async, koristi next/headers) */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  const token = getAdminToken();
  return !!token && cookie?.value === token;
}

/** Provjera u API Route Handlerima (sinkrona, iz NextRequest) */
export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
  const token = getAdminToken();
  return !!token && cookie?.value === token;
}
