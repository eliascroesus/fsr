'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * 16:9 video slot with the smart-autoplay "Click to listen" overlay.
 *
 * The overlay's geometry is a direct port of the platform markup, which lays a
 * 1920x1080 stage out absolutely and scales it to fit. The percentages below
 * are those same coordinates normalised against that stage, so the card, icon
 * and label keep their proportions at any width.
 *
 * Pass `children` (an iframe, a <video>, a player embed) to drop the real
 * thing in — the overlay sits on top of it until it is clicked.
 */
export function VideoPlaceholder({ children }: { children?: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="mb-8 w-full max-w-3xl">
      <div className="vsl-frame relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2a6b85]/70 bg-[#071013] shadow-[0_0_40px_rgba(56,163,184,0.18)]">
        {/* The overlay card is translucent, so the empty-state label only
            appears once the card is out of the way. */}
        {children ??
          (showOverlay ? null : (
            <div className="absolute inset-0 grid place-items-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/25 sm:text-xs">
                Video placeholder
              </p>
            </div>
          ))}

        {showOverlay ? (
          <button
            type="button"
            onClick={() => setShowOverlay(false)}
            aria-label="Click to listen"
            className="absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a3b8] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="vsl-pulse absolute inset-0 block">
              {/* card */}
              <span
                className="vsl-card absolute block border-solid border-white bg-[rgba(16,136,188,0.75)]"
                style={{ left: '32.361%', top: '19.506%', width: '35.278%', height: '60.988%' }}
              />
              {/* play mark */}
              <span
                className="absolute block"
                style={{ left: '39.931%', top: '27.407%', width: '20.139%', height: '35.802%' }}
              >
                <Image
                  src="/images/aia-assets/play-icon.svg"
                  alt=""
                  width={600}
                  height={600}
                  className="h-full w-full"
                  priority
                />
              </span>
              {/* label */}
              <span
                className="vsl-label absolute block text-center font-bold leading-tight text-white"
                style={{ left: '32.361%', top: '70.617%', width: '35.278%' }}
              >
                Click to listen
              </span>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
