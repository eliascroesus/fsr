'use client';

import { CtaButton } from './cta-button';

/** Bottom-of-page CTA — jumps back up to the opt-in card. */
export function ScrollToOptInButton() {
  return (
    <CtaButton
      className="max-w-2xl"
      primaryLabel="START THE TEST"
      secondaryLabel="WORKSHOP STARTING 8PM EST TONIGHT"
      onClick={() =>
        document
          .getElementById('workshop-opt-in')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    />
  );
}
