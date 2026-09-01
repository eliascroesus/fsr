'use client';

import { useState } from 'react';

import { Confirmation } from './confirmation';
import { OptInForm } from './opt-in-form';
import { StepIndicator } from './step-indicator';
import { TicketSelection } from './ticket-selection';
import type { LeadDetails, TicketTier } from './types';

/** Scrolls the opt-in card back into view on each step change. */
function focusOptIn() {
  document.getElementById('workshop-opt-in')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function WorkshopOptIn() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [tier, setTier] = useState<TicketTier>('vip');

  const handleDetails = (details: LeadDetails) => {
    setLead(details);
    setStep(2);
    focusOptIn();

    // Mirrors the source page's lead event on the primary + scoped pixels.
    window.fbq?.('track', 'Lead');
    window.whop?.track('lead');
  };

  const handleTicket = (selected: TicketTier) => {
    setTier(selected);
    setStep(3);
    focusOptIn();

    window.fbq?.('track', 'CompleteRegistration');
    window.whop?.track('complete_registration', { tier: selected });
  };

  return (
    <div id="workshop-opt-in" className="w-full scroll-mt-4">
      <StepIndicator currentStep={step} />

      {step === 1 || !lead ? (
        <OptInForm onSubmit={handleDetails} />
      ) : step === 2 ? (
        <TicketSelection
          lead={lead}
          onConfirm={handleTicket}
          onBack={() => {
            setStep(1);
            focusOptIn();
          }}
        />
      ) : (
        <Confirmation lead={lead} tier={tier} />
      )}
    </div>
  );
}
