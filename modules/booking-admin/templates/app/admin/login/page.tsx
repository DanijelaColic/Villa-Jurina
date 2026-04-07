/**
 * TEMPLATE: kopiraj kao src/app/admin/login/page.tsx
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 *
 * Ova stranica koristi logo koji je definiran u booking.config.ts (LOGO_PATH).
 * Zamijeni putanju ili ukloni Image komponentu ako ne koristiš logo.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { SITE_NAME, LOGO_PATH } from 'MODULE_ROOT/booking.config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Incorrect password');
      setShakeKey((k) => k + 1);
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {LOGO_PATH && (
            <Image
              src={LOGO_PATH}
              alt={SITE_NAME}
              width={72}
              height={72}
              className="mx-auto mb-4 object-contain"
            />
          )}
          <h1 className="font-serif text-2xl font-semibold text-text">{SITE_NAME}</h1>
          <p className="text-muted text-sm mt-1">Admin panel</p>
        </div>

        <form
          key={shakeKey}
          onSubmit={handleSubmit}
          className={clsx(
            'bg-white rounded-2xl shadow-sm border p-8 transition-colors',
            error ? 'border-red-200' : 'border-sand',
            error && 'animate-shake',
          )}
        >
          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">
              <Lock size={13} className="inline mr-1.5 text-muted" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
                autoFocus
                className={clsx(
                  'w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition-colors',
                  error
                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                    : 'border-sand focus:border-primary',
                )}
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm mb-4">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
