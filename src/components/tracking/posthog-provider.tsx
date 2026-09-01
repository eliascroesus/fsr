'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { POSTHOG_HOST, POSTHOG_KEY, trackingEnabled } from '@/lib/tracking-config';

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!trackingEnabled || !POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // handled explicitly by PostHogPageView
      capture_pageleave: true,
      person_profiles: 'identified_only',
    });
  }, []);

  if (!trackingEnabled || !POSTHOG_KEY) return <>{children}</>;

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
