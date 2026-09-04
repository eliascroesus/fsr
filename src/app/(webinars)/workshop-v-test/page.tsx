import Image from 'next/image';

import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { ScrollToOptInButton } from '@/components/workshop/scroll-to-opt-in-button';
import { TestimonialWall } from '@/components/workshop/testimonial-wall';
import { VideoPlaceholder } from '@/components/workshop/video-placeholder';
import { WorkshopOptIn } from '@/components/workshop/workshop-opt-in';

const SOCIAL_PROOF_AVATARS = [
  '/images/avatar9.avif',
  '/images/avatar10.avif',
  '/images/avatar11.avif',
];

const BENEFITS = [
  'Intet varelager',
  'Intet teknisk',
  '100% hjemmefra',
  '8-10 timer om ugen',
];

/** Heroicons solid `check`, inlined exactly as the source renders it. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-[#38a3b8]">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function WorkshopVTestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <AnimatedGridPattern className="fixed inset-0 h-full w-full -z-10" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 sm:px-8 sm:py-16 lg:px-12 py-10">
        {/* `contents` keeps these children in the parent's flex flow. */}
        <div className="contents">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[#2a6b85]/70 bg-[#071013]/95 px-3 py-1.5 shadow-sm sm:px-4 sm:py-2">
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
            <p className="text-left text-xs font-bold text-[#9fe4f0] sm:text-sm">
              3.478 begyndere tilmeldte sig i denne uge
            </p>
          </div>

          <h1 className="mb-4 text-balance text-center text-xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            Sådan Tjener Begyndere $18.105 Om Måneden I Tilbagevendende Indtægt (i gennemsnit) Med
            AI I 2026
          </h1>

          <VideoPlaceholder />

          <div className="mb-10 mx-auto grid w-fit grid-cols-[auto_auto] justify-items-start gap-x-5 gap-y-2 sm:mx-0 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-6">
            {BENEFITS.map((benefit) => (
              <span
                key={benefit}
                className="flex items-start gap-1.5 text-sm font-semibold text-white sm:items-center sm:text-base"
              >
                <CheckIcon />
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <WorkshopOptIn />

        <div className="w-full mt-16">
          <TestimonialWall />

          <div className="flex justify-center mt-8">
            <ScrollToOptInButton />
          </div>
        </div>
      </div>
    </div>
  );
}
