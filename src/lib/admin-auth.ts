import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'vj_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dana

export function verifyPassword(input: string): boolean {
  return input === (process.env.ADMIN_PASSWORD ?? '');
}

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN ?? '';
}

// Server component provjera (async, koristi next/headers)
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const token = getAdminToken();
  return !!token && cookie?.value === token;
}

// API route provjera (sinkrona, iz NextRequest)
export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME);
  const token = getAdminToken();
  return !!token && cookie?.value === token;
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
