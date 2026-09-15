'use client';

import { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

/** Cinema8 media id for the VSL. */
export const VSL_MEDIA_ID = process.env.NEXT_PUBLIC_VSL_MEDIA_ID ?? 'zJANjqaO';

const CINEMA8_PLAYER_SRC = 'https://static-01.cinema8.com/embed/player.js';

/**
 * `<cinema8-player>` is a custom element, so it is typed through a cast rather
 * than by augmenting JSX.IntrinsicElements.
 */
const Cinema8Player = 'cinema8-player' as unknown as React.ComponentType<
  React.HTMLAttributes<HTMLElement> & { 'media-id': string }
>;

/**
 * 16:9 VSL slot with the smart-autoplay "Klicka för att lyssna" overlay.
 *
 * The overlay's geometry is a direct port of the platform markup, which lays a
 * 1920x1080 stage out absolutely and scales it to fit. The percentages below
 * are those same coordinates normalised against that stage, so the card, icon
 * and label keep their proportions at any width.
 *
 * It covers the player until clicked, which is what lets playback start with
 * sound — browsers only allow that off a user gesture.
 */
export function VideoPlaceholder({ children }: { children?: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="mb-8 w-full max-w-3xl">
      <Script src={CINEMA8_PLAYER_SRC} strategy="afterInteractive" />

      <div className="vsl-frame relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2f343a] bg-[#0f1113] shadow-[0_0_40px_rgba(152,221,41,0.18)]">
        {children ?? (
          <Cinema8Player
            media-id={VSL_MEDIA_ID}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        )}

        {showOverlay ? (
          <button
            type="button"
            onClick={() => setShowOverlay(false)}
            aria-label="Klicka för att lyssna"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#98dd29] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="vsl-pulse absolute inset-0 block">
              {/* card */}
              <span
                className="vsl-card absolute block border-solid border-white bg-[rgba(101,163,13,0.78)]"
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
                Klicka för att lyssna
              </span>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
