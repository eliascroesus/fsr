/**
 * Every third-party tag the source page loads, in one place.
 *
 * IDs default to the values embedded in the live page so the replica behaves
 * identically, but each one can be overridden with an environment variable.
 *
 * Tags are disabled in development by default so local work does not pollute
 * the real analytics properties. Set NEXT_PUBLIC_ENABLE_TRACKING=true to force
 * them on anywhere, or =false to force them off in production.
 */

const flag = process.env.NEXT_PUBLIC_ENABLE_TRACKING;

export const trackingEnabled =
  flag === 'true' ? true : flag === 'false' ? false : process.env.NODE_ENV === 'production';

/** Funnelytics funnel id — loaded beforeInteractive with a deferred event queue. */
export const FUNNELYTICS_FUNNEL_ID =
  process.env.NEXT_PUBLIC_FUNNELYTICS_FUNNEL_ID ?? '22e285bc-11eb-431d-a2b9-8000947eb856';

/** Primary Meta pixel — initialised with fbq('init') + fbq('track','PageView'). */
export const META_PIXEL_PRIMARY =
  process.env.NEXT_PUBLIC_META_PIXEL_PRIMARY ?? '1214987610625014';

/**
 * Additional Meta pixels. These use `trackSingle` so each one records its own
 * PageView without double-counting against the primary pixel.
 */
export const META_PIXELS_ADDITIONAL = (
  process.env.NEXT_PUBLIC_META_PIXELS_ADDITIONAL ??
  '591396520170427,4538563966466837,598839576507435'
)
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

/** Convert Experiments A/B testing snippet. */
export const CONVERT_SRC =
  process.env.NEXT_PUBLIC_CONVERT_SRC ??
  '//cdn-4.convertexperiments.com/v1/js/1004313-100416962.js?environment=production';

/** PromptWatch project id. */
export const PROMPTWATCH_PROJECT_ID =
  process.env.NEXT_PUBLIC_PROMPTWATCH_PROJECT_ID ?? 'da9f5200-b959-4515-ad44-e87a87c97470';

/** Whop attribution scope (biz_...). */
export const WHOP_SCOPE = process.env.NEXT_PUBLIC_WHOP_SCOPE ?? 'biz_cYbSD9u2sjnZHl';

/** Google Ads conversion accounts. Each gets its own gtag.js tag + config. */
export const GOOGLE_ADS_IDS = (
  process.env.NEXT_PUBLIC_GOOGLE_ADS_IDS ??
  'AW-11108370062,AW-17439693759,AW-17527017214'
)
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

/** Conversions fired on /thank-you (but not /thank-you-copy). */
export const GOOGLE_ADS_CONVERSIONS: ReadonlyArray<{
  send_to: string;
  value: number;
  currency: string;
}> = [
  { send_to: 'AW-17439693759/AtFKCKHe7oEbEL-38vtA', value: 150, currency: 'USD' },
  { send_to: 'AW-17527017214/FCtTCJj-hJkbEP6dxKVB', value: 100, currency: 'USD' },
];

/** Fathom Analytics sites — the page loads two. */
export const FATHOM_SITE_PRIMARY = process.env.NEXT_PUBLIC_FATHOM_SITE_PRIMARY ?? 'XMQOAJRN';
export const FATHOM_SITE_SECONDARY = process.env.NEXT_PUBLIC_FATHOM_SITE_SECONDARY ?? 'AWMQMGIC';

/** LinkedIn Insight partner id. */
export const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? '7055674';

/** Hyros universal scripts — the page loads two separate call-tracking hosts. */
export const HYROS_TAGS: ReadonlyArray<{ id: string; host: string; hash: string }> = [
  {
    id: 'hyros-webinars-init',
    host: 'https://216518.t.hyros.com',
    hash: '320ee292ec9f3c46b497ccf2bf468efc8fb179050704e1228d28566f8750dfd1',
  },
  {
    id: 'hyros-init',
    host: 'https://h.thegrowthpartner.io',
    hash: '7a27436c4e8b00705a43d3099145a79acf90a631f407604e40743e0697f02fce',
  },
];

/** PostHog. */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
