'use client';

import { useEffect, useState } from 'react';

/**
 * The offer closes at the end of the visitor's own day, so the deadline is
 * real wherever they are rather than pinned to one city's clock.
 */
function deadlineFrom(now: Date): number {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime();
}

function remainingFrom(now: Date) {
  const totalSeconds = Math.max(0, Math.floor((deadlineFrom(now) - now.getTime()) / 1000));

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
    <div className="w-full rounded-2xl border border-[#2f343a]/60 bg-black/30 px-3 py-4 sm:px-5 text-center">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#ceff62] sm:text-sm">
        Möjligheten stänger om
      </p>
      <div className="flex justify-center gap-3 sm:gap-4">
        <TimeCell value={remaining.hours} label="timmar" />
        <TimeCell value={remaining.minutes} label="minuter" />
        <TimeCell value={remaining.seconds} label="sekunder" />
      </div>
    </div>
  );
}
