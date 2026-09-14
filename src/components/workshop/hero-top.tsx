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
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#a3e635]">
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6 10.2l2.6 2.6L14 7.4"
        fill="none"
        stroke="#0f1113"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Värd och räckvidd, centrerat överst. */
export function BrandRow() {
  return (
    <div className="mb-6 flex w-full items-center justify-center">
      <div className="flex items-center gap-2.5">
        <span className="rounded-full bg-gradient-to-tr from-[#84cc16] via-[#c9f776] to-[#4d7c0f] p-[2px]">
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
            <p className="text-xs font-bold text-[#c9f776] sm:text-sm">{HOST.followers} följare</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Två sammanfogade piller: status till vänster, erbjudandet till höger. */
export function OfferPills({ status = 'NY', offer }: { status?: string; offer: string }) {
  return (
    <div className="mb-7 inline-flex items-stretch rounded-full border border-[#2f343a] bg-[#0f1113] p-1 shadow-[0_0_28px_rgba(163,230,53,0.18)]">
      <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white sm:px-4 sm:text-xs">
        <span className="status-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#a3e635]" />
        {status}
      </span>
      <span className="inline-flex items-center rounded-full bg-[#1e2a12] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#c9f776] sm:px-4 sm:text-xs">
        {offer}
      </span>
    </div>
  );
}

/** Understruken nyckelfras i rubriken. */
export function Mark({ children }: { children: React.ReactNode }) {
  return <span className="headline-mark">{children}</span>;
}
