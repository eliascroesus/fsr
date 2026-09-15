'use client';

import Script from 'next/script';

/** Cinema8 media id for the VSL above the fold. */
export const VSL_MEDIA_ID = process.env.NEXT_PUBLIC_VSL_MEDIA_ID ?? 'oJKx7gbO';

/** Cinema8 media id for the vertical closing video at the foot of the page. */
export const CLOSING_MEDIA_ID = process.env.NEXT_PUBLIC_CLOSING_MEDIA_ID ?? 'mJdb4E5D';

const CINEMA8_PLAYER_SRC = 'https://static-01.cinema8.com/embed/player.js';

/**
 * `<cinema8-player>` is a custom element, so it is typed through a cast rather
 * than by augmenting JSX.IntrinsicElements.
 */
const Cinema8Player = 'cinema8-player' as unknown as React.ComponentType<
  React.HTMLAttributes<HTMLElement> & { 'media-id': string; autoplay?: string }
>;

interface VideoPlaceholderProps {
  mediaId?: string;
  /**
   * Portrait renders a 9:16 frame at phone width, so a vertical source fills
   * it instead of sitting letterboxed between two black bars.
   */
  orientation?: 'landscape' | 'portrait';
  autoplay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A Cinema8 player in a bordered frame.
 *
 * Nothing is layered on top — the player owns its own play and unmute
 * controls, and an overlay above it only swallowed the click.
 */
export function VideoPlaceholder({
  mediaId = VSL_MEDIA_ID,
  orientation = 'landscape',
  autoplay = true,
  className = 'mb-8 w-full max-w-3xl',
  children,
}: VideoPlaceholderProps) {
  const portrait = orientation === 'portrait';

  return (
    <div className={className}>
      <Script src={CINEMA8_PLAYER_SRC} strategy="afterInteractive" />

      <div
        className={`vsl-frame relative w-full overflow-hidden rounded-2xl border border-[#2f343a] bg-[#0f1113] shadow-[0_0_40px_rgba(79,209,47,0.18)] ${
          portrait ? 'aspect-[9/16]' : 'aspect-video'
        }`}
      >
        {children ?? (
          <Cinema8Player
            media-id={mediaId}
            autoplay={autoplay ? undefined : 'false'}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}
