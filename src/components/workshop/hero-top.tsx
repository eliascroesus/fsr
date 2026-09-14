/** Två sammanfogade piller: status till vänster, erbjudandet till höger. */
export function OfferPills({ status = 'NY', offer }: { status?: string; offer: string }) {
  return (
    <div className="mb-7 inline-flex items-stretch rounded-full border border-[#2f343a] bg-[#0f1113] p-1 shadow-[0_0_28px_rgba(152,221,41,0.18)]">
      <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white sm:px-4 sm:text-xs">
        <span className="status-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#98dd29]" />
        {status}
      </span>
      <span className="inline-flex items-center rounded-full bg-[#1e2a12] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#ceff62] sm:px-4 sm:text-xs">
        {offer}
      </span>
    </div>
  );
}

/** Understruken nyckelfras i rubriken. */
export function Mark({ children }: { children: React.ReactNode }) {
  return <span className="headline-mark">{children}</span>;
}
