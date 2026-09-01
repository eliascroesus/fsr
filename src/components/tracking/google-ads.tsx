'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { GOOGLE_ADS_CONVERSIONS, GOOGLE_ADS_IDS, trackingEnabled } from '@/lib/tracking-config';

/**
 * gtag.js bootstrap plus one <script src> and one `config` per Ads account.
 */
export function LegacyGoogleAdsTags() {
  if (!trackingEnabled || GOOGLE_ADS_IDS.length === 0) return null;

  return (
    <>
      <Script id="google-ads-global-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());`}
      </Script>

      {GOOGLE_ADS_IDS.map((adsId) => (
        <Script
          key={adsId}
          id={`google-ads-src-${adsId}`}
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        />
      ))}

      <Script id="google-ads-legacy-config" strategy="afterInteractive">
        {GOOGLE_ADS_IDS.map((adsId) => `gtag('config', '${adsId}');`).join('\n')}
      </Script>
    </>
  );
}

/**
 * Remarketing page_view per account, plus the route-scoped conversion events
 * that only fire on /thank-you (and explicitly not on /thank-you-copy).
 */
export function LegacyGoogleAdsEvents() {
  const pathname = usePathname();

  if (!trackingEnabled || GOOGLE_ADS_IDS.length === 0) return null;

  const remarketing = GOOGLE_ADS_IDS.map(
    (adsId) => `gtag('event', 'page_view', { 'send_to': '${adsId}' });`,
  ).join('\n');

  const conversions = GOOGLE_ADS_CONVERSIONS.map(
    (c) =>
      `gtag('event', 'conversion', { 'send_to': '${c.send_to}', 'value': ${c.value}, 'currency': '${c.currency}' });`,
  ).join('\n');

  return (
    <>
      <Script id="google-ads-remarketing" strategy="afterInteractive" key={`rm-${pathname}`}>
        {`(function(){
  try {
    ${remarketing}
  } catch (e) {
    console.error('Google Ads remarketing error:', e);
  }
})();`}
      </Script>

      <Script id="google-ads-route-conversions" strategy="afterInteractive" key={`cv-${pathname}`}>
        {`(function(){
  try {
    var path = window.location.pathname || '';
    if (path.indexOf('/thank-you') !== -1 && path.indexOf('/thank-you-copy') === -1) {
      ${conversions}
    }
  } catch (e) {
    // no-op
  }
})();`}
      </Script>
    </>
  );
}

/** YouTube-domain Google Ads tag rendered alongside the provider tree. */
export function GoogleAdsYtDomainTag() {
  if (!trackingEnabled) return null;

  return (
    <Script id="google-ads-yt-domain" strategy="afterInteractive">
      {`(function(){
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('set', 'linker', { 'domains': ['youtube.com', 'www.youtube.com'] });
    }
  } catch (e) {
    // no-op
  }
})();`}
    </Script>
  );
}
