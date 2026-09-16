import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';

import { SiteFooter } from '@/components/site-footer';
import { PHProvider } from '@/components/tracking/posthog-provider';
import { PreloadChunks } from '@/components/tracking/preload-chunks';
import {
  MetaPixelNoscript,
  MetaPixelPrimary,
  MetaPixelsAdditional,
} from '@/components/tracking/meta-pixel';
import {
  GoogleAdsYtDomainTag,
  LegacyGoogleAdsEvents,
  LegacyGoogleAdsTags,
} from '@/components/tracking/google-ads';
import {
  ConvertExperimentsTag,
  FathomTags,
  FunnelyticsTag,
  HyrosTracking,
  LinkedInInsightTags,
  LinkedInNoscript,
  PromptWatchTag,
  WhopTag,
} from '@/components/tracking/third-party-tags';
import { META_PIXEL_PRIMARY, META_PIXELS_ADDITIONAL } from '@/lib/tracking-config';

// Two next/font families, matching the two `__variable_*` classes the source
// page puts on <body>. `font-sans` resolves to --font-sans in tailwind.config.
const fontSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'FSR - Learn High Ticket Sales',
  description: 'Officiell webbplats för FSR',
  // Declared here rather than through src/app/icon.*, so one source of truth
  // emits the tags instead of the file convention adding a second set.
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <FunnelyticsTag />
        <MetaPixelPrimary />
        <LegacyGoogleAdsTags />
        <ConvertExperimentsTag />
        <PromptWatchTag />
        <WhopTag />
      </head>
      <body
        suppressHydrationWarning
        className={`min-h-screen font-sans antialiased ${fontSans.variable} ${fontMono.variable}`}
      >
        <PHProvider>
          <PreloadChunks moduleIds={['app/layout.tsx -> ./posthogpageview']} />
          <MetaPixelsAdditional />
          <GoogleAdsYtDomainTag />
          <HyrosTracking />
          <FathomTags />
          <SpeedInsights />

          {/* Page chrome: full-height column, clipped overflow (the hero
              backdrop bleeds past the viewport), and the footer. Lived in the
              route group that the lander's move to the root removed. */}
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            {META_PIXELS_ADDITIONAL[0] ? (
              <MetaPixelNoscript pixelId={META_PIXELS_ADDITIONAL[0]} />
            ) : null}

            <main className="flex-1">{children}</main>

            <SiteFooter />
          </div>
        </PHProvider>

        <MetaPixelNoscript pixelId={META_PIXEL_PRIMARY} />
        <LegacyGoogleAdsEvents />
        <LinkedInInsightTags />
        <LinkedInNoscript />
      </body>
    </html>
  );
}
