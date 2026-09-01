import { SiteFooter } from '@/components/site-footer';
import { MetaPixelNoscript } from '@/components/tracking/meta-pixel';
import { META_PIXELS_ADDITIONAL } from '@/lib/tracking-config';

/**
 * Shared chrome for every webinar funnel page: full-height column, clipped
 * overflow (the fixed grid backdrop bleeds past the viewport), and the footer.
 */
export default function WebinarsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {META_PIXELS_ADDITIONAL[0] ? (
        <MetaPixelNoscript pixelId={META_PIXELS_ADDITIONAL[0]} />
      ) : null}

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}
