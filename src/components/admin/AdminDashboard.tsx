'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, Plus, Check, X, Banknote, Trash2,
  ChevronDown, ChevronUp, Filter, RefreshCw, Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { apartments } from '@/lib/apartments';
import { formatDisplayDate, parseLocalDate } from '@/lib/dates';
import type { Booking } from '@/lib/supabase';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Na čekanju',
  confirmed: 'Potvrđeno',
  cancelled: 'Otkazano',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700 line-through',
};

const APT_NAMES = Object.fromEntries(apartments.map((a) => [a.slug, a.name]));

type SortKey = 'check_in' | 'created_at' | 'total_price';

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterApt, setFilterApt] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('check_in');
  const [sortAsc, setSortAsc] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/bookings');
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    document.cookie = 'vj_admin=; Max-Age=0; path=/';
    router.push('/admin/login');
    router.refresh();
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    setActionLoading(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    await fetchBookings();
    setActionLoading(null);
  };

  const deleteBooking = async (id: string, name: string) => {
    if (!confirm(`Obriši rezervaciju gosta ${name}?`)) return;
    setActionLoading(id);
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    await fetchBookings();
    setActionLoading(null);
  };

  // Filter + sort
  const filtered = bookings
    .filter((b) => (!filterApt || b.apartment_slug === filterApt))
    .filter((b) => (!filterStatus || b.status === filterStatus))
    .sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });

  // Stats
  const stats = {
    total: bookings.filter((b) => b.status !== 'cancelled').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    revenue: bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((s, b) => s + b.total_price, 0),
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-primary text-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-lg font-semibold">Villa Jurina</h1>
          <span className="text-white/50 text-sm hidden sm:inline">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="text-white/70 hover:text-white p-1.5 rounded-full transition-colors"
            title="Osvježi"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-light text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nova rezervacija</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white flex items-center gap-1.5 text-sm transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Odjava</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Ukupno rezervacija', value: stats.total, color: 'text-primary' },
            { label: 'Na čekanju', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Potvrđeno', value: stats.confirmed, color: 'text-green-600' },
            { label: 'Prihod', value: `${stats.revenue}€`, color: 'text-secondary' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={clsx('text-2xl font-bold', color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <select
            value={filterApt}
            onChange={(e) => setFilterApt(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Svi apartmani</option>
            {apartments.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Svi statusi</option>
            <option value="pending">Na čekanju</option>
            <option value="confirmed">Potvrđeno</option>
            <option value="cancelled">Otkazano</option>
          </select>
          <span className="text-sm text-gray-400 ml-auto">
            {filtered.length} / {bookings.length} rezervacija
          </span>
        </div>

        {/* Bookings table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Učitavanje...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-1">Nema rezervacija</p>
              <p className="text-sm">Dodajte prvu rezervaciju klikom na &quot;Nova rezervacija&quot;</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Apartman
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Gost
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide cursor-pointer hover:text-primary select-none"
                      onClick={() => toggleSort('check_in')}
                    >
                      <span className="flex items-center gap-1">
                        Check-in <SortIcon k="check_in" />
                      </span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Check-out
                    </th>
                    <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Noći
                    </th>
                    <th
                      className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide cursor-pointer hover:text-primary select-none"
                      onClick={() => toggleSort('total_price')}
                    >
                      <span className="flex items-center justify-end gap-1">
                        Ukupno <SortIcon k="total_price" />
                      </span>
                    </th>
                    <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Depozit
                    </th>
                    <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((booking) => (
                    <>
                      <tr
                        key={booking.id}
                        className={clsx(
                          'hover:bg-gray-50 transition-colors',
                          booking.status === 'cancelled' && 'opacity-50',
                        )}
                      >
                        <td className="px-4 py-3 font-medium text-primary">
                          {APT_NAMES[booking.apartment_slug] ?? booking.apartment_slug}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{booking.guest_name}</p>
                          <p className="text-xs text-gray-400">{booking.guest_email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDisplayDate(parseLocalDate(booking.check_in))}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDisplayDate(parseLocalDate(booking.check_out))}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{booking.nights}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {booking.total_price}€
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => updateBooking(booking.id, { deposit_paid: !booking.deposit_paid })}
                            disabled={actionLoading === booking.id}
                            className={clsx(
                              'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
                              booking.deposit_paid
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                            )}
                          >
                            <Banknote size={12} />
                            {booking.deposit_paid ? 'Plaćen' : 'Nije'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', STATUS_COLORS[booking.status])}>
                            {STATUS_LABELS[booking.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateBooking(booking.id, { status: 'confirmed' })}
                                disabled={actionLoading === booking.id}
                                title="Potvrdi rezervaciju"
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                              >
                                <Check size={15} />
                              </button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <button
                                onClick={() => updateBooking(booking.id, { status: 'cancelled' })}
                                disabled={actionLoading === booking.id}
                                title="Otkaži rezervaciju"
                                className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                              >
                                <X size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                              title="Detalji"
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronDown size={15} className={clsx('transition-transform', expandedId === booking.id && 'rotate-180')} />
                            </button>
                            <button
                              onClick={() => deleteBooking(booking.id, booking.guest_name)}
                              disabled={actionLoading === booking.id}
                              title="Obriši"
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded details */}
                      {expandedId === booking.id && (
                        <tr key={`${booking.id}-expanded`} className="bg-blue-50/30">
                          <td colSpan={9} className="px-4 py-3">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Telefon</p>
                                <p className="text-gray-700">{booking.guest_phone ?? '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Gosti</p>
                                <p className="text-gray-700">{booking.adults} odraslih, {booking.children} djece</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Depozit iznos</p>
                                <p className="text-gray-700">{booking.deposit}€</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Kreirano</p>
                                <p className="text-gray-700">{new Date(booking.created_at).toLocaleDateString('hr-HR')}</p>
                              </div>
                              {booking.notes && (
                                <div className="col-span-2 sm:col-span-4">
                                  <p className="text-xs text-gray-400 mb-0.5">Napomena</p>
                                  <p className="text-gray-700">{booking.notes}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add booking modal */}
      {showAddForm && (
        <AddBookingModal
          onClose={() => setShowAddForm(false)}
          onSuccess={() => { setShowAddForm(false); fetchBookings(); }}
        />
      )}
    </div>
  );
}

// ── Add Booking Modal ────────────────────────────────────────────

type ModalProps = { onClose: () => void; onSuccess: () => void };

function AddBookingModal({ onClose, onSuccess }: ModalProps) {
  const [form, setForm] = useState({
    apartment_slug: apartments.find((a) => !a.fullyBooked)?.slug ?? '',
    check_in: '', check_out: '',
    guest_name: '', guest_email: '', guest_phone: '',
    adults: '2', children: '0',
    status: 'confirmed', deposit_paid: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, adults: parseInt(form.adults), children: parseInt(form.children) }),
    });
    if (res.ok) onSuccess();
    else {
      const d = await res.json();
      setError(d.error ?? 'Greška');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-gray-900">Nova rezervacija</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Apartman</label>
              <select name="apartment_slug" value={form.apartment_slug} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                {apartments.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check-in *</label>
              <input type="date" name="check_in" value={form.check_in} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check-out *</label>
              <input type="date" name="check_out" value={form.check_out} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Ime i prezime *</label>
              <input type="text" name="guest_name" value={form.guest_name} onChange={handleChange} required placeholder="Ana Horvat"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" name="guest_email" value={form.guest_email} onChange={handleChange} placeholder="ana@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
              <input type="tel" name="guest_phone" value={form.guest_phone} onChange={handleChange} placeholder="+385..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Odrasli</label>
              <input type="number" name="adults" value={form.adults} onChange={handleChange} min="1" max="10"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Djeca</label>
              <input type="number" name="children" value={form.children} onChange={handleChange} min="0" max="10"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                <option value="confirmed">Potvrđeno</option>
                <option value="pending">Na čekanju</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" name="deposit_paid" id="deposit_paid" checked={form.deposit_paid}
                onChange={handleChange} className="accent-primary" />
              <label htmlFor="deposit_paid" className="text-sm text-gray-700 cursor-pointer">Depozit plaćen</label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Napomena</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors">
              Odustani
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-light text-white py-2.5 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Spremi rezervaciju
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
