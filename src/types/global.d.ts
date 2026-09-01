export {};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
    whop?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
      setScope: (...scopes: string[]) => void;
    };
    funnelytics?: {
      init?: (funnel: string, autoTrack: boolean, deferred: unknown[]) => void;
      events: {
        trigger: (name: string, attributes?: unknown, cb?: unknown, opts?: unknown) => void;
      };
    };
  }
}
