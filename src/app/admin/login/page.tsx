'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError(data.error ?? 'Greška pri prijavi');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/images/Logo_Villa_Jurina.png"
            alt="Villa Jurina"
            width={72}
            height={72}
            className="mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl font-semibold text-text">Villa Jurina</h1>
          <p className="text-muted text-sm mt-1">Admin panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-sand p-8"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium text-text mb-2">
              <Lock size={14} className="inline mr-1.5 text-muted" />
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-60 text-white font-medium py-3 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Prijava...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  );
}
