'use client';

import Script from 'next/script';
import {
  CONVERT_SRC,
  FATHOM_SITE_PRIMARY,
  FATHOM_SITE_SECONDARY,
  FUNNELYTICS_FUNNEL_ID,
  HYROS_TAGS,
  LINKEDIN_PARTNER_ID,
  PROMPTWATCH_PROJECT_ID,
  WHOP_SCOPE,
  trackingEnabled,
} from '@/lib/tracking-config';

/**
 * Funnelytics. Loaded beforeInteractive with a local queue so that any
 * `funnelytics.events.trigger(...)` call made before the CDN script resolves is
 * replayed into `init` once it lands.
 */
export function FunnelyticsTag() {
  if (!trackingEnabled) return null;

  return (
    <Script id="funnelytics-tracking" strategy="beforeInteractive">
      {`(function(funnel) {
  var deferredEvents = [];
  window.funnelytics = {
    events: {
      trigger: function (name, attributes, callback, opts) {
        deferredEvents.push({name: name, attributes: attributes, callback: callback, opts: opts});
      }
    }
  };
  var insert = document.getElementsByTagName('script')[0],
      script = document.createElement('script');
  script.addEventListener('load', function() {
    window.funnelytics.init(funnel, false, deferredEvents);
  });
  script.src = 'https://cdn.funnelytics.io/track-v3.js';
  script.type = 'text/javascript';
  script.async = true;
  insert.parentNode.insertBefore(script, insert);
})('${FUNNELYTICS_FUNNEL_ID}');`}
    </Script>
  );
}

/** Convert Experiments — plain async <script> in <head>, no wrapper. */
export function ConvertExperimentsTag() {
  if (!trackingEnabled) return null;
  // eslint-disable-next-line @next/next/no-sync-scripts
  return <script src={CONVERT_SRC} async />;
}

/** PromptWatch ingest client. */
export function PromptWatchTag() {
  if (!trackingEnabled) return null;

  return (
    <Script id="promptwatch-tracking" strategy="beforeInteractive">
      {`(function() {
  var script = document.createElement('script');
  script.setAttribute('data-project-id', '${PROMPTWATCH_PROJECT_ID}');
  script.src = 'https://ingest.promptwatch.com/js/client.min.js';
  document.head.appendChild(script);
})();`}
    </Script>
  );
}

/**
 * Whop attribution. The stub queues calls until s.js loads, sets the business
 * scope and records the initial page view. Form fields opt in with
 * `data-whop-tracked="email" | "phone"`.
 */
export function WhopTag() {
  if (!trackingEnabled) return null;

  return (
    <Script id="whop-tracking" strategy="beforeInteractive">
      {`!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("${WHOP_SCOPE}");whop.track("page");`}
    </Script>
  );
}

/** Hyros universal scripts — one per call-tracking host. */
export function HyrosTracking() {
  if (!trackingEnabled) return null;

  return (
    <>
      {HYROS_TAGS.map(({ id, host, hash }) => (
        <Script key={id} id={id} strategy="afterInteractive">
          {`var head = document.head;
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "${host}/v1/lst/universal-script?ph=${hash}&tag=!clicked&ref_url=" + encodeURIComponent(window.location.href);
head.appendChild(script);`}
        </Script>
      ))}
    </>
  );
}

/** Fathom Analytics — the page runs two sites, one tagged, one injected. */
export function FathomTags() {
  if (!trackingEnabled) return null;

  return (
    <>
      <Script
        id="fathom-script"
        strategy="afterInteractive"
        src="https://cdn.usefathom.com/script.js"
        data-site={FATHOM_SITE_PRIMARY}
        defer
      />
      <Script id="fathom-script-bf" strategy="afterInteractive">
        {`(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.usefathom.com/script.js';
  script.setAttribute('data-site', '${FATHOM_SITE_SECONDARY}');
  script.async = true;
  document.head.appendChild(script);
})();`}
      </Script>
    </>
  );
}

/** LinkedIn Insight tag: partner id, then the loader. */
export function LinkedInInsightTags() {
  if (!trackingEnabled) return null;

  return (
    <>
      <Script id="linkedin-partner-id" strategy="afterInteractive">
        {`_linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);`}
      </Script>
      <Script id="linkedin-insight" strategy="afterInteractive">
        {`(function(l) {
  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
  window.lintrk.q=[]}
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);})(window.lintrk);`}
      </Script>
    </>
  );
}

export function LinkedInNoscript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        alt=""
        src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
      />
    </noscript>
  );
}
