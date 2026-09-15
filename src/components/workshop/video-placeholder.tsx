'use client';

import Script from 'next/script';

/** Cinema8 media id for the VSL. */
export const VSL_MEDIA_ID = process.env.NEXT_PUBLIC_VSL_MEDIA_ID ?? 'oJKx7gbO';

const CINEMA8_PLAYER_SRC = 'https://static-01.cinema8.com/embed/player.js';

/**
 * `<cinema8-player>` is a custom element, so it is typed through a cast rather
 * than by augmenting JSX.IntrinsicElements.
 */
const Cinema8Player = 'cinema8-player' as unknown as React.ComponentType<
  React.HTMLAttributes<HTMLElement> & { 'media-id': string }
>;

/**
 * The VSL: a 16:9 frame with the Cinema8 player filling it.
 *
 * Nothing is layered on top — the player owns its own play and unmute
 * controls, and an overlay above it only swallowed the click.
 */
export function VideoPlaceholder({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-8 w-full max-w-3xl">
      <Script src={CINEMA8_PLAYER_SRC} strategy="afterInteractive" />

      <div className="vsl-frame relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2f343a] bg-[#0f1113] shadow-[0_0_40px_rgba(79,209,47,0.18)]">
        {children ?? (
          <Cinema8Player
            media-id={VSL_MEDIA_ID}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}
