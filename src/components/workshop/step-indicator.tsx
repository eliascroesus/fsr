'use client';

import { cn } from '@/lib/utils';

export const WORKSHOP_STEPS = ['Test', 'Your Details', 'Book a call'] as const;

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="mx-auto mb-6 max-w-2xl">
      <div className="grid w-full grid-cols-3 overflow-hidden rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/95">
        {WORKSHOP_STEPS.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <div
              key={label}
              className={cn(
                'relative flex min-h-16 flex-col items-center justify-center border-r border-[#2a6b85]/40 px-1.5 py-2 text-center last:border-r-0 sm:min-h-24 sm:px-4 sm:py-3',
                isActive && 'bg-[#12313c]/85',
              )}
            >
              <span
                className={cn(
                  'mb-1 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black sm:h-8 sm:w-8 sm:text-sm',
                  isActive || isComplete
                    ? 'border-[#9fe4f0] bg-[#38a3b8] text-black'
                    : 'border-white/25 text-white/45',
                )}
              >
                {step}
              </span>
              <span
                className={cn(
                  'text-[9px] font-black uppercase leading-tight tracking-wide sm:text-sm',
                  isActive || isComplete ? 'text-white' : 'text-white/40',
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
