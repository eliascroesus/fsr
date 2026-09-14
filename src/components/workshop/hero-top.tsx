import Image from 'next/image';

/**
 * Värden för förtroenderaden överst.
 *
 * `followers` är avsiktligt null: raden renderas först när ett riktigt tal är
 * satt, så sidan aldrig visar en påhittad siffra.
 */
export const HOST = {
  handle: '@aiacquisition',
  name: 'AI Acquisition',
  followers: null as string | null,
  avatar: '/images/avatar9.avif',
};

/** Generisk verifieringsmarkering. */
function VerifiedMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#38a3b8]">
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6 10.2l2.6 2.6L14 7.4"
        fill="none"
        stroke="#04191f"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ordmärke: två vikter, andra ordet i accentfärg, med en svag gloria. */
function Wordmark() {
  return (
    <span className="brand-wordmark select-none text-lg font-black italic tracking-tight sm:text-2xl">
      <span className="text-white">AI</span>
      <span className="text-[#9fe4f0]">ACQUISITION</span>
    </span>
  );
}

/** Ordmärke till vänster, värd och räckvidd till höger. */
export function BrandRow() {
  return (
    <div className="mb-5 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
      <Wordmark />

      <div className="flex items-center gap-2.5">
        <span className="rounded-full bg-gradient-to-tr from-[#38a3b8] via-[#9fe4f0] to-[#2a6b85] p-[2px]">
          <span className="block overflow-hidden rounded-full ring-2 ring-black">
            <Image
              src={HOST.avatar}
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 object-cover sm:h-12 sm:w-12"
            />
          </span>
        </span>

        <div className="text-left leading-tight">
          <p className="flex items-center gap-1 text-sm font-black text-white sm:text-base">
            {HOST.handle}
            <VerifiedMark />
          </p>
          <p className="text-xs font-medium text-white/45 sm:text-sm">{HOST.name}</p>
          {HOST.followers ? (
            <p className="text-xs font-bold text-[#9fe4f0] sm:text-sm">{HOST.followers} följare</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Två sammanfogade piller: status till vänster, erbjudandet till höger. */
export function OfferPills({ status = 'NY', offer }: { status?: string; offer: string }) {
  return (
    <div className="mb-7 inline-flex items-stretch rounded-full border border-[#2a6b85]/70 bg-[#071013] p-1 shadow-[0_0_28px_rgba(56,163,184,0.18)]">
      <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white sm:px-4 sm:text-xs">
        <span className="status-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#38a3b8]" />
        {status}
      </span>
      <span className="inline-flex items-center rounded-full bg-[#12313c] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#9fe4f0] sm:px-4 sm:text-xs">
        {offer}
      </span>
    </div>
  );
}

/** Understruken nyckelfras i rubriken. */
export function Mark({ children }: { children: React.ReactNode }) {
  return <span className="headline-mark">{children}</span>;
}
