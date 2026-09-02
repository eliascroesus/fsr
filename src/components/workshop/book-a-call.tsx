'use client';

import { Calendar, Check, Mail, MessageSquare } from 'lucide-react';

import { CountdownTimer } from './countdown-timer';
import { QUIZ_QUESTIONS } from './quiz-questions';
import type { LeadDetails, QuizAnswers } from './types';

interface BookACallProps {
  lead: LeadDetails;
  answers: QuizAnswers;
  /** A real scheduler embed (Calendly, Cal.com, …) renders in place of the placeholder. */
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
        <div className="mb-5 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#9fe4f0] bg-[#38a3b8] shadow-[0_0_28px_rgba(56,163,184,0.35)]">
            <Check className="h-7 w-7 text-black" strokeWidth={3.5} aria-hidden="true" />
          </span>
        </div>

        <h2 className="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
          PICK YOUR CALL TIME
        </h2>
        <p className="mb-6 text-center text-xs text-white/60 sm:text-sm">
          {firstName ? `You're in, ${firstName}. ` : "You're in. "}
          Pick a slot below and we&apos;ll map out your first 90 days.
        </p>

        {/* Scheduler slot — pass children to mount the real booking embed. */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#2a6b85]/60 bg-black/30">
          {children ?? (
            <div className="grid min-h-[260px] place-items-center px-4 py-10 text-center sm:min-h-[320px]">
              <div>
                <Calendar
                  className="mx-auto mb-3 h-9 w-9 text-[#38a3b8]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30 sm:text-xs">
                  Booking calendar
                </p>
                <p className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-white/40 sm:text-xs">
                  Drop your Calendly or Cal.com embed in here — it takes the full width of this
                  panel.
                </p>
              </div>
            </div>
          )}
        </div>

        <dl className="mb-5 grid gap-2 rounded-2xl border border-[#2a6b85]/60 bg-black/30 px-4 py-4 text-left">
          {goal ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">
                Goal
              </dt>
              <dd className="text-right text-xs font-semibold text-white sm:text-sm">{goal}</dd>
            </div>
          ) : null}
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
              Workshop
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
        </ul>

        <div className="flex flex-col gap-3">
          <CountdownTimer />
          <p className="text-center text-sm text-gray-500">
            🔒 We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}
