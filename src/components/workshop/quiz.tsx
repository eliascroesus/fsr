'use client';

import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { QUIZ_QUESTIONS } from './quiz-questions';
import type { QuizAnswers } from './types';

/** Time the selected state stays on screen before the next question slides in. */
const ADVANCE_DELAY_MS = 280;

/**
 * One qualifying question per screen.
 *
 * Picking an option — by click or by its letter key — moves straight on to the
 * next question, so there is no confirm button; the short delay is there so the
 * choice is visibly registered before the question changes.
 */
export function Quiz({ onComplete }: { onComplete: (answers: QuizAnswers) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  // Non-null while an advance is queued; also blocks double-taps.
  const [advancing, setAdvancing] = useState(false);

  const question = QUIZ_QUESTIONS[index];
  const selected = answers[question.id];
  const isLast = index === QUIZ_QUESTIONS.length - 1;

  const choose = useCallback(
    (value: string) => {
      if (advancing) return;
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
      setAdvancing(true);
    },
    [advancing, question.id],
  );

  useEffect(() => {
    if (!advancing) return;

    const timer = window.setTimeout(() => {
      setAdvancing(false);
      if (isLast) {
        onComplete(answers);
      } else {
        setIndex((i) => i + 1);
      }
    }, ADVANCE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [advancing, isLast, answers, onComplete]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const match = question.options.find(
        (option) => option.key.toLowerCase() === event.key.toLowerCase(),
      );
      if (match) {
        event.preventDefault();
        choose(match.value);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [question.options, choose]);

  const progress = ((index + (selected ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 shadow-md">
      <div className="h-1 w-full bg-white/10">
        <div
          className="h-full bg-[#38a3b8] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span
            aria-label={`Question ${index + 1} of ${QUIZ_QUESTIONS.length}`}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-[#38a3b8] text-xs font-black text-black"
          >
            {index + 1}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 sm:text-xs">
            Question {index + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <h2 className="text-balance text-lg font-extrabold leading-snug text-white sm:text-2xl">
          {question.title}
          <span aria-label="This question is required." className="ml-1 text-[#38a3b8]">
            *
          </span>
        </h2>

        {question.description ? (
          <p className="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm">
            {question.description}
          </p>
        ) : null}

        <div role="radiogroup" aria-label={question.title} className="mt-5 flex flex-col gap-2.5">
          {question.options.map((option) => {
            const isChosen = selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isChosen}
                onClick={() => choose(option.value)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a3b8]',
                  isChosen
                    ? 'border-[#38a3b8] bg-[#12313c]/85 shadow-[0_0_20px_rgba(56,163,184,0.2)]'
                    : 'border-[#2a6b85]/40 bg-[#111c21] hover:border-[#2a6b85] hover:bg-[#16242a]',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-black',
                    isChosen
                      ? 'border-[#9fe4f0] bg-[#38a3b8] text-black'
                      : 'border-white/20 text-white/50',
                  )}
                >
                  {option.key}
                </span>
                <span className="text-sm font-semibold text-white sm:text-base">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {index > 0 ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIndex((i) => i - 1)}
              className="text-xs font-medium text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline sm:text-sm"
            >
              Back
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
