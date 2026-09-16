'use client';

import { Check, ExternalLink, Mail, MessageSquare } from 'lucide-react';

import { CAL_BOOKING_URL, CalEmbed } from './cal-embed';
import { QUIZ_QUESTIONS } from './quiz-questions';
import type { LeadDetails, QuizAnswers } from './types';

/** Kept exported: the fallback link and the preview both point at it. */
export const BOOKING_URL = CAL_BOOKING_URL;

interface BookACallProps {
  lead: LeadDetails;
  answers: QuizAnswers;
  /** Replaces the Cal embed, if the booking tool ever changes. */
  children?: React.ReactNode;
}

/** Reads back the option the visitor picked, by label rather than by value. */
function answerLabel(questionId: string, answers: QuizAnswers): string | null {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  const option = question?.options.find((o) => o.value === answers[questionId]);
  return option?.label ?? null;
}

export function BookACall({ lead, answers, children }: BookACallProps) {
  const goal = answerLabel('goal', answers);

  return (
    <div className="w-full rounded-2xl border border-[#2f343a]/70 bg-[#0f1113]/85 p-6 sm:p-8 shadow-md">
        <div className="mb-5 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#a8f76b] bg-[#4fd12f] shadow-[0_0_28px_rgba(79,209,47,0.35)]">
            <Check className="h-7 w-7 text-black" strokeWidth={3.5} aria-hidden="true" />
          </span>
        </div>

        <h2 className="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          VÄLJ TID FÖR DITT SAMTAL
        </h2>
        {/* Names David: with the event details hidden the embed no longer says
            who they are meeting. */}
        <p className="mb-6 text-center text-xs text-white/60 sm:text-sm">
          Du är med. Välj en tid nedan så lägger du och David upp en plan för dina
          första 90 dagar.
        </p>

        {/* Scheduler. `children` overrides it if the booking tool ever changes. */}
        <div className="mb-3">
          <div className="overflow-hidden rounded-2xl border border-[#2f343a]/60 bg-[#0a0c0d] shadow-[0_0_36px_rgba(79,209,47,0.18)]">
            {children ?? <CalEmbed name={lead.fullName} email={lead.email} />}
          </div>

          {/* Some browsers and extensions block third-party frames outright,
              so there is always a direct way through. */}
          <p className="mt-2.5 text-center text-[11px] text-white/40 sm:text-xs">
            Laddar kalendern inte?{' '}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#a8f76b] underline-offset-4 transition-colors hover:text-[#4fd12f] hover:underline"
            >
              Öppna bokningssidan
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </p>
        </div>

        <dl className="mb-5 grid gap-2 rounded-2xl border border-[#2f343a]/60 bg-black/30 px-4 py-4 text-left">
          {goal ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a8f76b] sm:text-xs">
                Mål
              </dt>
              <dd className="text-right text-xs font-semibold text-white sm:text-sm">{goal}</dd>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a8f76b] sm:text-xs">
              E-post
            </dt>
            <dd className="break-all text-xs font-semibold text-white sm:text-sm">{lead.email}</dd>
          </div>
          {lead.declinedPhone ? null : (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a8f76b] sm:text-xs">
                Telefon
              </dt>
              <dd className="text-xs font-semibold text-white sm:text-sm">{lead.phone}</dd>
            </div>
          )}
        </dl>

        <ul className="mb-5 flex flex-col gap-2.5">
          <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#4fd12f]" aria-hidden="true" />
            Din tillgång till 1-timmeskursen är på väg till {lead.email} — kolla skräpposten om
            den inte dykt upp om ett par minuter.
          </li>
          {lead.declinedPhone ? null : (
            <li className="flex items-start gap-2.5 text-xs font-medium text-white/85 sm:text-sm">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#4fd12f]" aria-hidden="true" />
              Vi skickar en påminnelse via sms innan ditt samtal. Svara STOP när som helst för att
              avsluta.
            </li>
          )}
        </ul>

      <p className="text-center text-sm text-gray-500">
        🔒 Vi värnar om din integritet. Aldrig spam.
      </p>
    </div>
  );
}
