'use client';

import { CtaButton } from './cta-button';

/** Bottom-of-page CTA — jumps back up to the opt-in card. */
export function ScrollToOptInButton() {
  return (
    <CtaButton
      className="max-w-2xl"
      primaryLabel="SE OM DU PASSAR – STARTA TESTET"
      secondaryLabel="4 FRÅGOR · 60 SEKUNDER · GRATIS 1-TIMMESKURS"
      onClick={() =>
        document
          .getElementById('workshop-opt-in')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    />
  );
}
