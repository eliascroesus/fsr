'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CountdownTimer } from './countdown-timer';
import { CtaButton } from './cta-button';
import type { LeadDetails, TicketOption, TicketTier } from './types';

/**
 * NOTE: the source page only ships step 1 in its server-rendered markup — steps
 * 2 and 3 are produced client-side after submit, so their exact copy could not
 * be captured. This tier list reproduces the standard structure of the funnel
 * (free general admission vs. paid VIP upgrade) in the page's own design
 * language. Swap the copy/prices here to match production.
 */
export const TICKET_OPTIONS: readonly TicketOption[] = [
  {
    id: 'general',
    name: 'General Admission',
    price: 'FREE',
    priceNote: 'No card required',
    tagline: 'Watch the live workshop with everyone else.',
    perks: [
      'Live access to the full workshop',
      'Live Q&A with the room',
      'Email reminder before we go live',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    price: '$27',
    priceNote: 'One-time — usually $197',
    tagline: 'Everything in General, plus the assets we build on the call.',
    badge: 'MOST POPULAR',
    perks: [
      'Everything in General Admission',
      'Lifetime replay of the workshop',
      'The AI Acquisition prompt & template pack',
      'Priority Q&A — your questions answered first',
      'Private VIP-only implementation session',
    ],
  },
] as const;

interface TicketSelectionProps {
  lead: LeadDetails;
  onConfirm: (tier: TicketTier) => void;
  onBack: () => void;
}

export function TicketSelection({ lead, onConfirm, onBack }: TicketSelectionProps) {
  const [selected, setSelected] = useState<TicketTier>('vip');

  const firstName = lead.fullName.split(' ')[0];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
        <h2 className="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          CHOOSE YOUR TICKET
        </h2>
        <p className="mb-6 text-center text-xs text-white/60 sm:text-sm">
          {firstName ? `Almost done, ${firstName}. ` : 'Almost done. '}
          Your spot is held for the next 10 minutes.
        </p>

        <div className="flex flex-col gap-3">
          {TICKET_OPTIONS.map((option) => {
            const isSelected = option.id === selected;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(option.id)}
                className={cn(
                  'relative w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 sm:p-5',
                  isSelected
                    ? 'border-[#38a3b8] bg-[#12313c]/85 shadow-[0_0_28px_rgba(56,163,184,0.25)]'
                    : 'border-[#2a6b85]/40 bg-[#0b0f10] hover:border-[#2a6b85]',
                )}
              >
                {option.badge ? (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-[#38a3b8] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-black sm:text-[10px]">
                    {option.badge}
                  </span>
                ) : null}

                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      isSelected ? 'border-[#9fe4f0] bg-[#38a3b8]' : 'border-white/30',
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3 text-black" strokeWidth={3.5} /> : null}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-base font-extrabold text-white sm:text-lg">
                        {option.name}
                      </span>
                      <span className="text-lg font-extrabold text-[#9fe4f0] sm:text-xl">
                        {option.price}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-white/55 sm:text-sm">{option.tagline}</p>
                    <p className="text-[10px] uppercase tracking-wide text-white/40 sm:text-[11px]">
                      {option.priceNote}
                    </p>

                    <ul className="mt-3 flex flex-col gap-1.5">
                      {option.perks.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-start gap-1.5 text-xs font-medium text-white/85 sm:text-sm"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#38a3b8]"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <CtaButton
            primaryLabel="CONFIRM MY SPOT"
            secondaryLabel="WORKSHOP STARTING 8PM EST TONIGHT"
            onClick={() => onConfirm(selected)}
          />

          <button
            type="button"
            onClick={onBack}
            className="mx-auto text-xs font-medium text-white/50 underline-offset-4 transition-colors hover:text-white/80 hover:underline sm:text-sm"
          >
            Back to your details
          </button>

          <CountdownTimer />

          <p className="text-center text-sm text-gray-500">
            🔒 We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}
