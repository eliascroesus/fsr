'use client';

import Script from 'next/script';
import { META_PIXELS_ADDITIONAL, META_PIXEL_PRIMARY, trackingEnabled } from '@/lib/tracking-config';

const FBQ_BOOTSTRAP = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');`;

/** Primary pixel: bootstrap + init + a plain PageView. Rendered in <head>. */
export function MetaPixelPrimary() {
  if (!trackingEnabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`${FBQ_BOOTSTRAP}
fbq('init', '${META_PIXEL_PRIMARY}');
fbq('track', 'PageView');`}
    </Script>
  );
}

/**
 * Secondary pixels. `trackSingle` scopes the PageView to one pixel id so the
 * extra accounts do not double-count against the primary one.
 */
export function MetaPixelsAdditional() {
  if (!trackingEnabled) return null;

  return (
    <>
      {META_PIXELS_ADDITIONAL.map((pixelId) => (
        <Script key={pixelId} id={`facebook-pixel-${pixelId}`} strategy="afterInteractive">
          {`(function() {
  var pixelId = '${pixelId}';
  ${FBQ_BOOTSTRAP}
  fbq('init', pixelId);
  fbq('trackSingle', pixelId, 'PageView');
})();`}
        </Script>
      ))}
    </>
  );
}

/** <noscript> fallback beacons, one per pixel. */
export function MetaPixelNoscript({ pixelId }: { pixelId: string }) {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        alt=""
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
