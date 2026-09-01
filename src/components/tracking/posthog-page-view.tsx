'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { POSTHOG_KEY, trackingEnabled } from '@/lib/tracking-config';

/**
 * App-router pageviews. Capturing manually (rather than via capture_pageview)
 * is what makes client-side route changes show up as distinct pageviews.
 */
export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!trackingEnabled || !POSTHOG_KEY || !pathname) return;

    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;

    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
