import Image from 'next/image';

import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { Mark, OfferPills } from '@/components/workshop/hero-top';
import { ScrollToOptInButton } from '@/components/workshop/scroll-to-opt-in-button';
import { VideoPlaceholder } from '@/components/workshop/video-placeholder';
import { WorkshopOptIn } from '@/components/workshop/workshop-opt-in';

const SOCIAL_PROOF_AVATARS = [
  '/images/avatar9.avif',
  '/images/avatar10.avif',
  '/images/avatar11.avif',
];

/** Korta avfärdanden i fetstil före den förklarande raden. */
const DISQUALIFIERS = ['Inget lager.', 'Inget tekniskt krångel.', '100% hemifrån.'];

export default function WorkshopVTestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <AnimatedGridPattern className="fixed inset-0 h-full w-full -z-10" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-6 sm:px-8 sm:py-16 lg:px-12">
        {/* `contents` keeps these children in the parent's flex flow. */}
        <div className="contents">
          <OfferPills offer="AI-systemet 2026" />

          <h1 className="hero-headline mb-3 text-balance text-center font-extrabold text-white">
            Så Här Tjänar Nybörjare{' '}
            <span className="headline-accent">18 105 $ Per Månad</span> I{' '}
            <Mark>Återkommande Intäkter</Mark> (i snitt) Med AI 2026
          </h1>

          <p className="hero-sub mb-4 max-w-xl text-balance text-center text-white/45">
            {DISQUALIFIERS.map((line) => (
              <span key={line} className="font-bold text-white/75">
                {line}{' '}
              </span>
            ))}
            <span className="font-medium italic text-white/60">8–10 timmar i veckan.</span> Vi går igenom exakt hur
            du kommer igång på ditt samtal.
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
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-left text-xs font-bold text-[#ceff62] sm:text-sm">
              3 478 nybörjare anmälde sig den här veckan
            </p>
          </div>
        </div>

        <VideoPlaceholder />

        <WorkshopOptIn />

        <div className="mt-12 flex w-full justify-center">
          <ScrollToOptInButton />
        </div>
      </div>
    </div>
  );
}
