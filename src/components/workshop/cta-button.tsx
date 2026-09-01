'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

/** The teal gradient used by every primary button on the page. */
export const CTA_GRADIENT =
  'linear-gradient(to right, rgb(30, 74, 95) 0%, rgb(42, 107, 133) 50%, rgb(56, 163, 184) 100%)';

interface CtaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primaryLabel: string;
  secondaryLabel?: string;
}

export function CtaButton({
  primaryLabel,
  secondaryLabel,
  className,
  type = 'button',
  ...props
}: CtaButtonProps) {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={cn(
        'w-full py-3.5 px-4 rounded-xl text-white font-extrabold transition-all duration-200',
        'flex items-center justify-center gap-1',
        'shadow-[0_0_28px_rgba(56,163,184,0.35)] hover:opacity-90 hover:scale-[1.01]',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
        className,
      )}
      style={{ background: CTA_GRADIENT }}
      {...props}
    >
      <span className="flex flex-col items-center leading-tight">
        <span className="text-base sm:text-lg md:text-xl tracking-wide">{primaryLabel}</span>
        {secondaryLabel ? (
          <span className="text-xs sm:text-sm font-semibold opacity-90">{secondaryLabel}</span>
        ) : null}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 ml-1" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
