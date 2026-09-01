import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';

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
import { META_PIXEL_PRIMARY } from '@/lib/tracking-config';

// Two next/font families, matching the two `__variable_*` classes the source
// page puts on <body>. `font-sans` resolves to --font-sans in tailwind.config.
const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fontMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'AI Acquisition',
  description: 'Official website for AI Acquisition',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          {children}
        </PHProvider>

        <MetaPixelNoscript pixelId={META_PIXEL_PRIMARY} />
        <LegacyGoogleAdsEvents />
        <LinkedInInsightTags />
        <LinkedInNoscript />
      </body>
    </html>
  );
}
