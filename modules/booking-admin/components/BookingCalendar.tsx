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
} from '../lib/dates';
import type { BookedRange } from '../types';

type DayState =
  | 'past'
  | 'booked'
  | 'check-in'
  | 'check-out'
  | 'in-range'
  | 'hover-range'
  | 'blocked-for-checkout'
  | 'too-close'
  | 'available';

type Props = {
  apartmentSlug: string;
  checkIn: Date | null;
  checkOut: Date | null;
  onCheckInSelect: (date: Date) => void;
  onCheckOutSelect: (date: Date) => void;
  onReset: () => void;
  /** API path — default '/api/bookings' */
  bookingsApiPath?: string;
  /** Minimalni broj noći — uzima se iz MIN_NIGHTS config, ali može se override-ati */
  minNights?: number;
};

export default function BookingCalendar({
  apartmentSlug,
  checkIn,
  checkOut,
  onCheckInSelect,
  onCheckOutSelect,
  onReset,
  bookingsApiPath = '/api/bookings',
  minNights = 2,
}: Props) {
  const today = startOfToday();
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${bookingsApiPath}?apartment=${apartmentSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBookedRanges(data);
        else setError('Error loading availability');
      })
      .catch(() => setError('Error loading available dates'))
      .finally(() => setLoading(false));
  }, [apartmentSlug, bookingsApiPath]);

  useEffect(() => {
    if (checkOut) setHoverDate(null);
  }, [checkOut]);

  const firstBlocked = checkIn && !checkOut
    ? getFirstBlockedAfter(checkIn, bookedRanges)
    : null;

  const getDayState = useCallback(
    (day: Date): DayState => {
      if (isBeforeDay(day, today)) return 'past';
      if (isDateBooked(day, bookedRanges)) return 'booked';

      if (checkIn && isSameDay(day, checkIn)) return 'check-in';
      if (checkOut && isSameDay(day, checkOut)) return 'check-out';

      if (checkIn && checkOut) {
        if (day > checkIn && day < checkOut) return 'in-range';
      }

      if (checkIn && !checkOut) {
        if (firstBlocked && !isBeforeDay(day, firstBlocked)) {
          return 'blocked-for-checkout';
        }
        if (isSameDay(day, addDays(checkIn, minNights - 1))) return 'too-close';
        if (hoverDate && day > checkIn && day < hoverDate) return 'hover-range';
      }

      return 'available';
    },
    [today, bookedRanges, checkIn, checkOut, hoverDate, firstBlocked, minNights],
  );

  const handleDayClick = useCallback(
    (day: Date) => {
      const state = getDayState(day);

      if (state === 'past' || state === 'booked') return;

      if (!checkIn || checkOut) {
        if (state === 'available' || state === 'blocked-for-checkout') {
          if (state === 'blocked-for-checkout') {
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

      if (checkIn && !checkOut) {
        if (state === 'too-close' || state === 'blocked-for-checkout') return;

        if (isSameDay(day, checkIn)) {
          onReset();
          return;
        }

        if (isBeforeDay(day, checkIn)) {
          onReset();
          onCheckInSelect(day);
          return;
        }

        const nights = diffDays(day, checkIn);
        if (nights < minNights) return;

        onCheckOutSelect(day);
      }
    },
    [getDayState, checkIn, checkOut, bookedRanges, onCheckInSelect, onCheckOutSelect, onReset, minNights],
  );

  const handleDayHover = useCallback(
    (day: Date) => {
      if (checkIn && !checkOut) setHoverDate(day);
    },
    [checkIn, checkOut],
  );

  const months = [monthOffset, monthOffset + 1].map((offset) => {
    const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return { year: ref.getFullYear(), month: ref.getMonth() };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted text-sm">
        <span className="animate-pulse">Loading calendar...</span>
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div>
      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-green-100 border border-green-300 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-red-100 border border-red-300 inline-block" />
          Unavailable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-primary inline-block" />
          Selected
        </span>
        {!checkIn && (
          <span className="ml-auto text-secondary font-medium">Select check-in date</span>
        )}
        {checkIn && !checkOut && (
          <span className="ml-auto text-secondary font-medium">
            Select check-out (min. {minNights} nights)
          </span>
        )}
      </div>

      {/* Navigacija */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
          disabled={monthOffset === 0}
          className="p-2 rounded-full hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setMonthOffset((o) => o + 2)}
          className="p-2 rounded-full hover:bg-sand transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dva kalendarska mjeseca */}
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

      {(checkIn || checkOut) && (
        <div className="mt-4 text-center">
          <button
            onClick={onReset}
            className="text-sm text-muted hover:text-primary underline underline-offset-2 transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}

// ── MonthGrid ──────────────────────────────────────────────────────

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
      <h3 className="text-center font-serif font-semibold text-text mb-4">
        {MONTHS_HR[month]} {year}
      </h3>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_HR.map((d) => (
          <div key={d} className="text-center text-xs text-muted font-medium py-1">
            {d}
          </div>
        ))}
      </div>

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
                  'text-gray-300 cursor-not-allowed':
                    state === 'past' || state === 'blocked-for-checkout',
                  'bg-red-50 text-red-300 cursor-not-allowed line-through': state === 'booked',
                  'bg-primary text-white font-semibold rounded-l-full cursor-pointer z-10':
                    state === 'check-in',
                  'bg-primary text-white font-semibold rounded-r-full cursor-pointer z-10':
                    state === 'check-out',
                  'bg-primary/15 text-primary': state === 'in-range',
                  'bg-primary/10 text-primary': state === 'hover-range',
                  'text-gray-400 cursor-not-allowed': state === 'too-close',
                  'text-text cursor-pointer hover:bg-primary/10 rounded-full': state === 'available',
                  'cursor-pointer': isInteractive,
                },
              )}
              title={
                state === 'booked'
                  ? 'Unavailable'
                  : state === 'too-close'
                    ? `Minimum stay is ${2} nights`
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
