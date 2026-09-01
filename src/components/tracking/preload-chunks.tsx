'use client';

import { Suspense, lazy } from 'react';

const PostHogPageView = lazy(() => import('./posthog-page-view'));

/**
 * Mirrors the source page's `PreloadChunks` wrapper: the pageview tracker reads
 * useSearchParams, so it has to sit behind a Suspense boundary or it opts the
 * whole route into client-side rendering.
 */
export function PreloadChunks({ moduleIds }: { moduleIds?: string[] }) {
  void moduleIds;

  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

export default PreloadChunks;
