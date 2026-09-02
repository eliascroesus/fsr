'use client';

import { useState } from 'react';

import { BookACall } from './book-a-call';
import { OptInForm } from './opt-in-form';
import { Quiz } from './quiz';
import { StepIndicator } from './step-indicator';
import type { LeadDetails, QuizAnswers } from './types';

/** Scrolls the card back into view on each step change. */
function focusOptIn() {
  document.getElementById('workshop-opt-in')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function WorkshopOptIn() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [lead, setLead] = useState<LeadDetails | null>(null);

  const handleQuiz = (completed: QuizAnswers) => {
    setAnswers(completed);
    setStep(2);
    focusOptIn();

    window.whop?.track('quiz_completed', completed);
  };

  const handleDetails = (details: LeadDetails) => {
    setLead(details);
    setStep(3);
    focusOptIn();

    window.fbq?.('track', 'Lead');
    window.whop?.track('lead');
  };

  return (
    <div id="workshop-opt-in" className="w-full scroll-mt-4">
      <StepIndicator currentStep={step} />

      {step === 1 || !answers ? (
        <Quiz onComplete={handleQuiz} />
      ) : step === 2 || !lead ? (
        <OptInForm onSubmit={handleDetails} />
      ) : (
        <BookACall lead={lead} answers={answers} />
      )}
    </div>
  );
}
