'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useTranslations, useLocale } from 'next-intl';
import {
  startOfToday,
  addDays,
  isSameDay,
  isBeforeDay,
  diffDays,
  isDateBooked,
  getFirstBlockedAfter,
  getMonthGrid,
} from '@/lib/dates';
import { getApartment, getPriceForDate } from '@/lib/apartments';
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
  const t = useTranslations('bookingCalendar');
  const locale = useLocale();
  const today = startOfToday();
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  // Koji mjesec prikazujemo (offset od danas)
  const [monthOffset, setMonthOffset] = useState(0);

  // Dohvati zauzete datume kad se promijeni apartman
  useEffect(() => {
    if (!apartmentSlug) {
      setLoading(false);
      setBookedRanges([]);
      setError(t('errors.noApartment'));
      return;
    }

    setLoading(true);
    setError(null);
    const q = new URLSearchParams({ apartment: apartmentSlug });
    fetch(`/api/bookings?${q.toString()}`)
      .then(async (r) => {
        const data: unknown = await r.json();
        if (Array.isArray(data)) {
          setBookedRanges(data);
          return;
        }
        const message =
          typeof (data as { error?: string })?.error === 'string'
            ? (data as { error: string }).error
            : t('errors.loadFailed');
        setError(message);
      })
      .catch(() => setError(t('errors.loadFailed')))
      .finally(() => setLoading(false));
  }, [apartmentSlug, t]);

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
        <span className="animate-pulse">{t('loading')}</span>
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
          {t('legend.available')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-red-100 border border-red-300 inline-block" />
          {t('legend.booked')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-primary inline-block" />
          {t('legend.selected')}
        </span>
        {!checkIn && (
          <span className="ml-auto text-secondary font-medium">
            {t('instructions.selectCheckIn')}
          </span>
        )}
        {checkIn && !checkOut && (
          <span className="ml-auto text-secondary font-medium">
            {t('instructions.selectCheckOut')}
          </span>
        )}
      </div>

      {/* Navigacija */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
          disabled={monthOffset === 0}
          className="p-2 rounded-full hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={t('aria.prevMonth')}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setMonthOffset((o) => o + 2)}
          className="p-2 rounded-full hover:bg-sand transition-colors"
          aria-label={t('aria.nextMonth')}
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
            locale={locale}
            apartmentSlug={apartmentSlug}
            getDayState={getDayState}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            tooltipBooked={t('tooltips.booked')}
            tooltipMinStay={t('tooltips.minStay')}
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
            {t('actions.reset')}
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
  locale: string;
  apartmentSlug: string;
  getDayState: (day: Date) => DayState;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date) => void;
  tooltipBooked: string;
  tooltipMinStay: string;
};

function MonthGrid({
  year,
  month,
  locale,
  apartmentSlug,
  getDayState,
  onDayClick,
  onDayHover,
  tooltipBooked,
  tooltipMinStay,
}: MonthGridProps) {
  const grid = getMonthGrid(year, month);
  const apartment = getApartment(apartmentSlug);

  // Nazivi mjeseca i dana — automatski na ispravnom jeziku bez prijevodnih ključeva
  const monthName = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: 'long' }).format(
        new Date(year, month, 1),
      ),
    [locale, year, month],
  );

  // Ponedjeljak = 1, ..., Nedjelja = 0 — prilagodi prikaz na Pon–Ned redoslijed
  const dayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // Referentni tjedan koji počinje ponedjeljkom (2. sij. 2023. = pon)
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2023, 0, 2 + i)),
    );
  }, [locale]);

  return (
    <div>
      {/* Naslov mjeseca */}
      <h3 className="text-center font-serif font-semibold text-text mb-4 capitalize">
        {monthName} {year}
      </h3>

      {/* Zaglavlje dana */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d) => (
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
          const dayPrice = apartment ? getPriceForDate(apartment, day) : null;
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
                'relative h-11 flex flex-col items-center justify-center text-sm select-none transition-colors',
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
                  ? tooltipBooked
                  : state === 'too-close'
                    ? tooltipMinStay
                    : undefined
              }
            >
              <span>{day.getDate()}</span>
              {dayPrice !== null && (
                <span
                  className={clsx('text-[10px] leading-none', {
                    'text-white/90': state === 'check-in' || state === 'check-out',
                    'text-primary/80': state === 'in-range' || state === 'hover-range',
                    'text-red-300': state === 'booked',
                    'text-gray-300': state === 'past' || state === 'blocked-for-checkout',
                    'text-gray-400': state === 'too-close',
                    'text-muted': state === 'available',
                  })}
                >
                  {dayPrice}€
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
