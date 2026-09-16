'use client';

import { useEffect, useRef } from 'react';

/** The Cal.com event this books. */
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'fsr-htc/45';
export const CAL_ORIGIN = 'https://app.cal.com';

/** Where the fallback link sends anyone whose browser blocks the embed. */
export const CAL_BOOKING_URL = `https://cal.com/${CAL_LINK}`;

/** Namespaces let several embeds coexist; this page has one. */
const NAMESPACE = 'fsr';
const EMBED_SRC = `${CAL_ORIGIN}/embed/embed.js`;

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: unknown[][];
  config?: { forwardQueryParams?: boolean };
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/**
 * Cal's own loader, from their embed snippet: it queues calls against a stub
 * and injects embed.js once, so `Cal(...)` is callable before the script has
 * finished loading.
 */
function loadCal(): CalApi {
  const w = window;
  if (!w.Cal) {
    const push = (api: CalApi, args: IArguments | unknown[]) => {
      api.q = api.q ?? [];
      api.q.push(Array.from(args) as unknown[]);
    };

    const cal = function (this: unknown, ...args: unknown[]) {
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q ?? [];
        document.head.appendChild(document.createElement('script')).src = EMBED_SRC;
        cal.loaded = true;
      }

      if (args[0] === 'init') {
        const namespace = args[1];
        if (typeof namespace === 'string') {
          const api = function (...inner: unknown[]) {
            push(api, inner);
          } as CalApi;
          api.q = api.q ?? [];
          cal.ns![namespace] = cal.ns![namespace] ?? api;
          push(cal.ns![namespace], args);
          push(cal, ['initNamespace', namespace]);
          return;
        }
      }

      push(cal, args);
    } as CalApi;

    w.Cal = cal;
  }
  return w.Cal;
}

interface CalEmbedProps {
  /** Prefills the booking form so they do not retype what they just gave us. */
  name?: string;
  email?: string;
}

export function CalEmbed({ name, email }: CalEmbedProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const Cal = loadCal();

    Cal('init', NAMESPACE, { origin: CAL_ORIGIN });
    Cal.config = Cal.config ?? {};
    // Carries utm_* from the landing URL through to the booking.
    Cal.config.forwardQueryParams = true;

    const ns = Cal.ns?.[NAMESPACE];
    if (!ns) return;

    ns('inline', {
      elementOrSelector: container.current,
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
      calLink: CAL_LINK,
    });

    // theme is pinned dark: the page is black, and Cal otherwise follows the
    // visitor's OS setting and would render a white panel on half of them.
    ns('ui', {
      theme: 'dark',
      cssVarsPerTheme: { dark: { 'cal-brand': '#50ff00' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, [name, email]);

  return (
    <div
      ref={container}
      id="fsr-cal-inline"
      className="h-[680px] w-full overflow-auto sm:h-[640px]"
    />
  );
}
