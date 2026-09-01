'use client';

import { useEffect, useState } from 'react';

const WORKSHOP_TIME_ZONE = 'America/New_York';
const WORKSHOP_HOUR = 20; // 8PM EST/EDT

type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: WORKSHOP_TIME_ZONE,
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Read a UTC instant as wall-clock parts in the workshop's time zone. */
function zonedParts(at: Date): Parts {
  const map: Record<string, string> = {};
  for (const { type, value } of partsFormatter.formatToParts(at)) {
    if (type !== 'literal') map[type] = value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    // Intl emits hour 24 for midnight under hour12:false in some engines.
    hour: Number(map.hour) % 24,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

/** Offset in ms between the zone's wall clock and UTC at a given instant. */
function zoneOffsetMs(at: Date): number {
  const p = zonedParts(at);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - at.getTime();
}

/**
 * The next 8PM in New York, as a UTC timestamp. The offset is resolved twice so
 * the result stays correct across a DST boundary.
 */
function nextWorkshopStart(now: Date): number {
  const p = zonedParts(now);
  const rollToTomorrow = p.hour >= WORKSHOP_HOUR;
  const wallClock = Date.UTC(p.year, p.month - 1, p.day + (rollToTomorrow ? 1 : 0), WORKSHOP_HOUR, 0, 0);

  let utc = wallClock - zoneOffsetMs(now);
  utc = wallClock - zoneOffsetMs(new Date(utc));
  return utc;
}

function remainingFrom(now: Date) {
  const diff = Math.max(0, nextWorkshopStart(now) - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

function TimeCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex w-[92px] flex-col items-center bg-gray-100 rounded-lg px-4 py-2 sm:w-[116px] sm:px-6 sm:py-3">
      <span
        suppressHydrationWarning
        className="tabular-nums text-3xl sm:text-4xl font-bold text-black"
      >
        {pad(value)}
      </span>
      <span className="mt-1 text-[10px] sm:text-xs uppercase text-gray-600">{label}</span>
    </div>
  );
}

export function CountdownTimer() {
  // Seeded on the server so the box renders at its final size immediately; the
  // interval takes over on mount (digits carry suppressHydrationWarning).
  const [remaining, setRemaining] = useState(() => remainingFrom(new Date()));

  useEffect(() => {
    const tick = () => setRemaining(remainingFrom(new Date()));
    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-[#2a6b85]/60 bg-black/30 px-3 py-4 sm:px-5 text-center">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#9fe4f0] sm:text-sm">
        Next live training starts in
      </p>
      <div className="flex justify-center gap-3 sm:gap-4">
        <TimeCell value={remaining.hours} label="hours" />
        <TimeCell value={remaining.minutes} label="minutes" />
        <TimeCell value={remaining.seconds} label="seconds" />
      </div>
    </div>
  );
}
