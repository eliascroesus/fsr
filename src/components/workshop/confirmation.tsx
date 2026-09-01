'use client';

import { Calendar, Check, Mail, MessageSquare } from 'lucide-react';

import { CountdownTimer } from './countdown-timer';
import { TICKET_OPTIONS } from './ticket-selection';
import type { LeadDetails, TicketTier } from './types';

/**
 * NOTE: like step 2, the confirmation screen is rendered client-side after
 * submit on the source page, so its exact copy was not in the captured markup.
 * This reproduces the standard structure in the page's design language.
 */
interface ConfirmationProps {
  lead: LeadDetails;
  tier: TicketTier;
}

/** Builds a Google Calendar link for tonight's 8PM EST session. */
function calendarUrl(): string {
  const start = new Date();
  start.setUTCHours(start.getUTCHours() + 1, 0, 0, 0);
  const end = new Date(start.getTime() + 90 * 60 * 1000);

  const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'AI Acquisition — Live Workshop',
    dates: `${stamp(start)}/${stamp(end)}`,
    details: 'Your seat is confirmed. Join a few minutes early — we start on time.',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function Confirmation({ lead, tier }: ConfirmationProps) {
  const ticket = TICKET_OPTIONS.find((option) => option.id === tier) ?? TICKET_OPTIONS[0];
  const firstName = lead.fullName.split(' ')[0];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
        <div className="mb-5 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#9fe4f0] bg-[#38a3b8] shadow-[0_0_28px_rgba(56,163,184,0.35)]">
            <Check className="h-7 w-7 text-black" strokeWidth={3.5} aria-hidden="true" />
          </span>
        </div>

        <h2 className="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          YOU&apos;RE REGISTERED
        </h2>
        <p className="mb-6 text-center text-xs text-white/60 sm:text-sm">
          {firstName ? `See you tonight, ${firstName}. ` : 'See you tonight. '}
          Your {ticket.name} seat is confirmed.
        </p>

        <dl className="mb-5 grid gap-2 rounded-2xl border border-[#2a6b85]/60 bg-black/30 px-4 py-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
              Ticket
            </dt>
            <dd className="text-xs font-semibold text-white sm:text-sm">
              {ticket.name} — {ticket.price}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
              Email
            </dt>
            <dd className="break-all text-xs font-semibold text-white sm:text-sm">{lead.email}</dd>
          </div>
          {lead.declinedPhone ? null : (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
                Phone
              </dt>
              <dd className="text-xs font-semibold text-white sm:text-sm">{lead.phone}</dd>
            </div>
          )}
          <div className="flex items-start justify-between gap-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
              Starts
            </dt>
            <dd className="text-xs font-semibold text-white sm:text-sm">8:00 PM EST tonight</dd>
          </div>
        </dl>

        <ul className="mb-5 flex flex-col gap-2.5">
          <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#38a3b8]" aria-hidden="true" />
            Your join link is on its way to {lead.email} — check spam if it hasn&apos;t landed in a
            couple of minutes.
          </li>
          {lead.declinedPhone ? null : (
            <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#38a3b8]" aria-hidden="true" />
              We&apos;ll text you a reminder before we go live. Reply STOP to opt out any time.
            </li>
          )}
          <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#38a3b8]" aria-hidden="true" />
            Block the time now so nothing else takes the slot.
          </li>
        </ul>

        <a
          href={calendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#2a6b85] bg-[#0b0f10] px-4 py-3.5 text-sm font-extrabold tracking-wide text-white transition-all duration-200 hover:border-[#38a3b8] hover:opacity-90 sm:text-base"
        >
          <Calendar className="h-5 w-5 shrink-0" aria-hidden="true" />
          ADD TO CALENDAR
        </a>

        <div className="mt-3 flex flex-col gap-3">
          <CountdownTimer />
          <p className="text-center text-sm text-gray-500">
            🔒 We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}
