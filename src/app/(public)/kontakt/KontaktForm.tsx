'use client';

import { useState } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function KontaktForm() {
  const t = useTranslations('contactForm');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('errors.submit'));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.message'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <Check size={28} className="text-green-600" />
        </div>
        <div>
          <p className="font-serif text-xl font-semibold text-text mb-1">{t('success.title')}</p>
          <p className="text-muted text-sm">{t('success.description')}</p>
        </div>
        <button
          onClick={() => { setSuccess(false); setForm({ name: '', email: '', message: '' }); }}
          className="text-sm text-primary underline underline-offset-2"
        >
          {t('success.newMessage')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('fields.name')}</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
          placeholder={t('placeholders.name')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('fields.email')}</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
          placeholder={t('placeholders.email')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('fields.message')}</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder={t('placeholders.message')}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-secondary hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? t('submit.sending') : t('submit.send')}
      </button>
    </form>
  );
}
