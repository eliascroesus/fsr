'use client';

import { CtaButton } from './cta-button';

/** Bottom-of-page CTA — jumps back up to the opt-in card. */
export function ScrollToOptInButton() {
  return (
    <CtaButton
      className="max-w-2xl"
      primaryLabel="STARTA TESTET"
      secondaryLabel="WORKSHOPPEN BÖRJAR KL. 20 EST I KVÄLL"
      onClick={() =>
        document
          .getElementById('workshop-opt-in')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    />
  );
}
