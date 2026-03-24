'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import {
  MONTHS_HR,
  DAYS_HR,
  startOfToday,
  addDays,
  isSameDay,
  isBeforeDay,
  diffDays,
  isDateBooked,
  getFirstBlockedAfter,
  getMonthGrid,
} from '@/lib/dates';
import type { BookedRange } from '@/lib/supabase';

type DayState =
  | 'past'
  | 'booked'
  | 'check-in'
  | 'check-out'
  | 'in-range'
  | 'hover-range'
  | 'blocked-for-checkout' // nakon prvog zauzetog dana kad biram checkout
  | 'too-close' // checkIn+1 dan (min 2 noći)
  | 'available';

type Props = {
  apartmentSlug: string;
  checkIn: Date | null;
  checkOut: Date | null;
  onCheckInSelect: (date: Date) => void;
  onCheckOutSelect: (date: Date) => void;
  onReset: () => void;
};

export default function BookingCalendar({
  apartmentSlug,
  checkIn,
  checkOut,
  onCheckInSelect,
  onCheckOutSelect,
  onReset,
}: Props) {
  const today = startOfToday();
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  // Koji mjesec prikazujemo (offset od danas)
  const [monthOffset, setMonthOffset] = useState(0);

  // Dohvati zauzete datume kad se promijeni apartman
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/bookings?apartment=${apartmentSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBookedRanges(data);
        else setError('Greška pri učitavanju');
      })
      .catch(() => setError('Greška pri učitavanju slobodnih termina'))
      .finally(() => setLoading(false));
  }, [apartmentSlug]);

  // Resetiraj hover kad se završi selekcija
  useEffect(() => {
    if (checkOut) setHoverDate(null);
  }, [checkOut]);

  // Granica: prvi zauzeti dan nakon odabranog check-in
  const firstBlocked = checkIn && !checkOut
    ? getFirstBlockedAfter(checkIn, bookedRanges)
    : null;

  const getDayState = useCallback(
    (day: Date): DayState => {
      if (isBeforeDay(day, today)) return 'past';
      if (isDateBooked(day, bookedRanges)) return 'booked';

      if (checkIn && isSameDay(day, checkIn)) return 'check-in';
      if (checkOut && isSameDay(day, checkOut)) return 'check-out';

      // Ako je selekcija završena — prikaži raspon
      if (checkIn && checkOut) {
        if (day > checkIn && day < checkOut) return 'in-range';
      }

      // Biram checkout (checkIn set, checkOut nije)
      if (checkIn && !checkOut) {
        // Blokiran za checkout — prošao je zauzeti dan
        if (firstBlocked && !isBeforeDay(day, firstBlocked)) {
          return 'blocked-for-checkout';
        }
        // Premalo noći (samo 1 noć = checkIn+1)
        if (isSameDay(day, addDays(checkIn, 1))) return 'too-close';

        // Prikaz hover raspona
        if (hoverDate && day > checkIn && day < hoverDate) return 'hover-range';
      }

      return 'available';
    },
    [today, bookedRanges, checkIn, checkOut, hoverDate, firstBlocked],
  );

  const handleDayClick = useCallback(
    (day: Date) => {
      const state = getDayState(day);

      // Nedodirljivi dani
      if (state === 'past' || state === 'booked') return;

      // Nije aktivna selekcija checkshouta — postavi novi check-in
      if (!checkIn || checkOut) {
        if (state === 'available' || state === 'blocked-for-checkout') {
          if (state === 'blocked-for-checkout') {
            // Zauzeto za checkout, ali može biti novi check-in
            if (!isDateBooked(day, bookedRanges)) {
              onReset();
              onCheckInSelect(day);
            }
          } else {
            onCheckInSelect(day);
          }
        }
        return;
      }

      // Biram checkout
      if (checkIn && !checkOut) {
        if (state === 'too-close' || state === 'blocked-for-checkout') return;

        if (isSameDay(day, checkIn)) {
          onReset();
          return;
        }

        if (isBeforeDay(day, checkIn)) {
          // Kliknuo je datum prije check-in — resetiraj i postavi novi check-in
          onReset();
          onCheckInSelect(day);
          return;
        }

        const nights = diffDays(day, checkIn);
        if (nights < 2) return;

        onCheckOutSelect(day);
      }
    },
    [getDayState, checkIn, checkOut, bookedRanges, onCheckInSelect, onCheckOutSelect, onReset],
  );

  const handleDayHover = useCallback(
    (day: Date) => {
      if (checkIn && !checkOut) setHoverDate(day);
    },
    [checkIn, checkOut],
  );

  // Generiraj dva vidljiva mjeseca
  const months = [monthOffset, monthOffset + 1].map((offset) => {
    const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return { year: ref.getFullYear(), month: ref.getMonth() };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted text-sm">
        <span className="animate-pulse">Učitavanje kalendara...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500 text-sm">{error}</div>
    );
  }

  return (
    <div>
      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-green-100 border border-green-300 inline-block" />
          Slobodno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-red-100 border border-red-300 inline-block" />
          Zauzeto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-primary inline-block" />
          Odabrano
        </span>
        {!checkIn && (
          <span className="ml-auto text-secondary font-medium">
            Odaberite datum dolaska
          </span>
        )}
        {checkIn && !checkOut && (
          <span className="ml-auto text-secondary font-medium">
            Odaberite datum odlaska (min. 2 noći)
          </span>
        )}
      </div>

      {/* Navigacija */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
          disabled={monthOffset === 0}
          className="p-2 rounded-full hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Prethodni mjesec"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setMonthOffset((o) => o + 2)}
          className="p-2 rounded-full hover:bg-sand transition-colors"
          aria-label="Sljedeći mjesec"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Kalendar — 2 mjeseca */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            getDayState={getDayState}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
          />
        ))}
      </div>

      {/* Reset gumb */}
      {(checkIn || checkOut) && (
        <div className="mt-4 text-center">
          <button
            onClick={onReset}
            className="text-sm text-muted hover:text-primary underline underline-offset-2 transition-colors"
          >
            Poništi odabir
          </button>
        </div>
      )}
    </div>
  );
}

// ── MonthGrid ─────────────────────────────────────────────────────

type MonthGridProps = {
  year: number;
  month: number;
  getDayState: (day: Date) => DayState;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date) => void;
};

function MonthGrid({ year, month, getDayState, onDayClick, onDayHover }: MonthGridProps) {
  const grid = getMonthGrid(year, month);

  return (
    <div>
      {/* Naslov mjeseca */}
      <h3 className="text-center font-serif font-semibold text-text mb-4">
        {MONTHS_HR[month]} {year}
      </h3>

      {/* Zaglavlje dana */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_HR.map((d) => (
          <div key={d} className="text-center text-xs text-muted font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Dani */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {grid.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const state = getDayState(day);
          const isInteractive =
            state === 'available' ||
            state === 'hover-range' ||
            state === 'check-in' ||
            state === 'check-out';

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
              className={clsx(
                'relative h-9 flex items-center justify-center text-sm select-none transition-colors',
                {
                  // Past or blocked-for-checkout
                  'text-gray-300 cursor-not-allowed':
                    state === 'past' || state === 'blocked-for-checkout',
                  // Booked
                  'bg-red-50 text-red-300 cursor-not-allowed line-through': state === 'booked',
                  // Check-in
                  'bg-primary text-white font-semibold rounded-l-full cursor-pointer z-10':
                    state === 'check-in',
                  // Check-out
                  'bg-primary text-white font-semibold rounded-r-full cursor-pointer z-10':
                    state === 'check-out',
                  // In range (confirmed)
                  'bg-primary/15 text-primary': state === 'in-range',
                  // Hover preview range
                  'bg-primary/10 text-primary': state === 'hover-range',
                  // Too close (1 noć)
                  'text-gray-400 cursor-not-allowed': state === 'too-close',
                  // Available
                  'text-text cursor-pointer hover:bg-primary/10 rounded-full': state === 'available',
                  // Pointer
                  'cursor-pointer': isInteractive,
                },
              )}
              title={
                state === 'booked'
                  ? 'Zauzeto'
                  : state === 'too-close'
                    ? 'Minimalni boravak je 2 noći'
                    : undefined
              }
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
