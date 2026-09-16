import Image from 'next/image';

import { Mark } from '@/components/workshop/hero-top';
import { CLOSING_MEDIA_ID, VideoPlaceholder } from '@/components/workshop/video-placeholder';
import { WorkshopOptIn } from '@/components/workshop/workshop-opt-in';

/** Drop square photos over these three paths to change the faces. */
const SOCIAL_PROOF_AVATARS = [
  '/images/social-proof/1.png',
  '/images/social-proof/2.webp',
  '/images/social-proof/3.png',
];

/** Korta avfärdanden i fetstil före den förklarande raden. */
const DISQUALIFIERS = ['Ingen egen produkt.', 'Inga annonser.', 'Jobba hemifrån.'];

export default function WorkshopVTestPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      <div className="hero-backdrop" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-6 pt-6 sm:px-8 sm:pb-16 lg:px-12">
        {/* `contents` keeps these children in the parent's flex flow. */}
        <div className="contents">
          <h1 className="hero-headline mb-3 text-balance text-center font-extrabold text-white">
            Bli placerad på ett{' '}
            <span className="headline-accent">$10,000 offer på 90 dagar</span>{' '}
            och lär dig{' '}
            <Mark>online sales</Mark>…{' '}
            <em className="italic">
              annars får du <Mark>full återbetalning</Mark>
            </em>
          </h1>

          <p className="hero-sub mb-4 max-w-xl text-balance text-center text-white/45">
            {DISQUALIFIERS.map((line) => (
              <span key={line} className="font-bold text-white/75">
                {line}{' '}
              </span>
            ))}
            <span className="font-medium italic text-white/60">Ingen säljerfarenhet krävs.</span> På samtalet visar vi exakt
            var just du ska börja.
          </p>

          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#2f343a]/70 bg-[#0f1113]/95 px-3 py-1.5 shadow-sm sm:px-4 sm:py-2">
            <div className="flex shrink-0 -space-x-1.5">
              {SOCIAL_PROOF_AVATARS.map((src, i) => (
                <div
                  key={src}
                  className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-black sm:h-8 sm:w-8"
                  style={{ zIndex: SOCIAL_PROOF_AVATARS.length - i }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-left text-xs font-bold text-[#a8f76b] sm:text-sm">
              178 nybörjare anmälde sig den här veckan
            </p>
          </div>
        </div>

        <VideoPlaceholder />

        <WorkshopOptIn />

        {/* Closing video. Vertical source, so it gets a 9:16 frame at phone
            width rather than a letterboxed 16:9 one, and it waits to be played. */}
        <div className="mt-12 flex w-full justify-center">
          <VideoPlaceholder
            mediaId={CLOSING_MEDIA_ID}
            orientation="portrait"
            autoplay={false}
            className="w-full max-w-[340px]"
          />
        </div>
      </div>
    </div>
  );
}
