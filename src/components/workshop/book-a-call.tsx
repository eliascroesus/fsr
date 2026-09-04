'use client';

import { Check, ExternalLink, Mail, MessageSquare } from 'lucide-react';

import { QUIZ_QUESTIONS } from './quiz-questions';
import type { LeadDetails, QuizAnswers } from './types';

/**
 * Google Calendar appointment schedule. Overridable so staging and production
 * can point at different calendars without a code change.
 */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1ghy5mwfxSxcxe-jbhtkhxSiL_AWeu26VMG8rIAXrHLi-k2ZHdMI3zW8SsUfWD4lBhtD4Kvdjc?gv=true';

interface BookACallProps {
  lead: LeadDetails;
  answers: QuizAnswers;
  /** Replaces the Google Calendar embed, if the booking tool ever changes. */
  children?: React.ReactNode;
}

/** Reads back the option the visitor picked, by label rather than by value. */
function answerLabel(questionId: string, answers: QuizAnswers): string | null {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  const option = question?.options.find((o) => o.value === answers[questionId]);
  return option?.label ?? null;
}

export function BookACall({ lead, answers, children }: BookACallProps) {
  const firstName = lead.fullName.split(' ')[0];
  const goal = answerLabel('goal', answers);

  return (
    <div className="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
        <div className="mb-5 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#9fe4f0] bg-[#38a3b8] shadow-[0_0_28px_rgba(56,163,184,0.35)]">
            <Check className="h-7 w-7 text-black" strokeWidth={3.5} aria-hidden="true" />
          </span>
        </div>

        <h2 className="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          VÆLG TIDSPUNKT FOR DIT OPKALD
        </h2>
        <p className="mb-6 text-center text-xs text-white/60 sm:text-sm">
          {firstName ? `Du er med, ${firstName}. ` : 'Du er med. '}
          Vælg et tidspunkt nedenfor, så lægger vi en plan for dine første 90 dage.
        </p>

        {/* Scheduler. `children` overrides it if the booking tool ever changes. */}
        <div className="mb-3">
          <div className="overflow-hidden rounded-2xl border border-[#2a6b85]/60 bg-white shadow-[0_0_36px_rgba(56,163,184,0.18)]">
            {children ?? (
              <iframe
                src={BOOKING_URL}
                title="Book dit opkald"
                loading="lazy"
                className="block h-[680px] w-full border-0 sm:h-[600px]"
              />
            )}
          </div>

          {/* Some browsers and extensions block third-party frames outright,
              so there is always a direct way through. */}
          <p className="mt-2.5 text-center text-[11px] text-white/40 sm:text-xs">
            Kan kalenderen ikke indlæses?{' '}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#9fe4f0] underline-offset-4 transition-colors hover:text-[#38a3b8] hover:underline"
            >
              Åbn bookingsiden
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </p>
        </div>

        <dl className="mb-5 grid gap-2 rounded-2xl border border-[#2a6b85]/60 bg-black/30 px-4 py-4 text-left">
          {goal ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
                Mål
              </dt>
              <dd className="text-right text-xs font-semibold text-white sm:text-sm">{goal}</dd>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
              E-mail
            </dt>
            <dd className="break-all text-xs font-semibold text-white sm:text-sm">{lead.email}</dd>
          </div>
          {lead.declinedPhone ? null : (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
                Telefon
              </dt>
              <dd className="text-xs font-semibold text-white sm:text-sm">{lead.phone}</dd>
            </div>
          )}
          <div className="flex items-start justify-between gap-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
              Workshop
            </dt>
            <dd className="text-xs font-semibold text-white sm:text-sm">Kl. 20.00 EST i aften</dd>
          </div>
        </dl>

        <ul className="mb-5 flex flex-col gap-2.5">
          <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#38a3b8]" aria-hidden="true" />
            Dit link er på vej til {lead.email} — tjek spam, hvis det ikke er kommet om et par
            minutter.
          </li>
          {lead.declinedPhone ? null : (
            <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#38a3b8]" aria-hidden="true" />
              Vi sender dig en SMS-påmindelse, før vi går live. Svar STOP for at afmelde når som
              helst.
            </li>
          )}
        </ul>

      <p className="text-center text-sm text-gray-500">
        🔒 Vi respekterer dit privatliv. Aldrig spam.
      </p>
    </div>
  );
}
