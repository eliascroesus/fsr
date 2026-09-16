# Deploying the lander

The app is a Next.js 15 (App Router) project. All three routes prerender as
static HTML, but it is **not** a static export — `next/image` optimisation and
the server components still need a Next.js runtime. So deploy it as a Next.js
app, not as a folder of HTML.

---

## Option A — Netlify via GitHub (recommended)

This gives you automatic deploys on every push and a preview URL per pull
request.

### 1. Push the branch

```bash
git push -u origin claude/aiam-website-replica-he7vw1
```

Merge it into `main` when you're ready for that to be the production branch.

### 2. Create the site

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project**
2. Choose **GitHub**, authorise Netlify, pick `eliascroesus/fsr`
3. Netlify reads `netlify.toml` from the repo, so the build settings fill in
   automatically:

   | Setting | Value |
   | --- | --- |
   | Build command | `npm run build` |
   | Publish directory | `.next` |
   | Node version | `22` |

   Leave them as detected. Don't change the publish directory to `out` or
   `dist` — the Next.js Runtime expects `.next`.

4. Set the **production branch** to whichever branch you want live
   (Site configuration → Build & deploy → Branches).

### 3. Set environment variables

**Before** the first deploy, add the variables you need under
Site configuration → Environment variables. See the table below.

> **This matters:** every `NEXT_PUBLIC_*` value is baked into the JavaScript
> bundle **at build time**. Changing one in the Netlify UI does nothing until
> you trigger a new deploy. There is no "restart to pick up env changes".

### 4. Deploy

**Deploy site**. First build takes ~2–3 minutes. You get a URL like
`random-name-123.netlify.app`.

---

## Option B — Netlify CLI

Useful for a one-off deploy without wiring up Git.

```bash
npm install -g netlify-cli
netlify login

# from the repo root
netlify init          # creates the site and links this directory
netlify env:set NEXT_PUBLIC_VSL_MEDIA_ID zJANjqaO
netlify deploy --build --prod
```

`netlify deploy --build` without `--prod` gives you a draft URL to check first.

---

## Environment variables

None are strictly required — every one has a working default in the code. Set
them when you want to override.

| Variable | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_VSL_MEDIA_ID` | `zJANjqaO` | Cinema8 media id for the hero video |
| `NEXT_PUBLIC_CAL_LINK` | the Cal.com event, as `user/event` | The booking embed on step 3 |
| `NEXT_PUBLIC_ENABLE_TRACKING` | on in production, off in dev | Master switch for every pixel |
| `NEXT_PUBLIC_META_PIXEL_PRIMARY` | `1214987610625014` | Main Meta pixel |
| `NEXT_PUBLIC_META_PIXELS_ADDITIONAL` | 3 further ids | Secondary Meta pixels |
| `NEXT_PUBLIC_GOOGLE_ADS_IDS` | 3 `AW-` accounts | Google Ads tags |
| `NEXT_PUBLIC_FATHOM_SITE_PRIMARY` / `_SECONDARY` | 2 site ids | Fathom Analytics |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | `7055674` | LinkedIn Insight |
| `NEXT_PUBLIC_FUNNELYTICS_FUNNEL_ID` | funnel uuid | Funnelytics |
| `NEXT_PUBLIC_WHOP_SCOPE` | `biz_…` | Whop attribution |
| `NEXT_PUBLIC_PROMPTWATCH_PROJECT_ID` | project uuid | PromptWatch |
| `NEXT_PUBLIC_CONVERT_SRC` | script url | Convert Experiments |
| `NEXT_PUBLIC_POSTHOG_KEY` | *(empty)* | PostHog stays inert until set |

The full list with defaults lives in `src/lib/tracking-config.ts`.

**Tracking fires for real in production.** `netlify.toml` already forces
`NEXT_PUBLIC_ENABLE_TRACKING=false` on Deploy Previews and branch deploys, so
only the production deploy sends data. Set it to `false` in the production
context too if you want to go live dark first.

---

## Custom domain

1. Site configuration → **Domain management** → **Add a domain**
2. Enter the domain and follow the DNS instructions:
   - **Netlify DNS** — point your registrar's nameservers at Netlify. Simplest,
     and certificates renew themselves.
   - **External DNS** — add a `CNAME` for `www` pointing at your
     `*.netlify.app` hostname, and an `ALIAS`/`ANAME` (or Netlify's load
     balancer IP) for the apex.
3. HTTPS provisions automatically via Let's Encrypt once DNS resolves —
   usually minutes, occasionally up to an hour.
4. Pick a primary domain so the other redirects to it rather than serving
   duplicate content.

---

## Before you send traffic

Things in the repo that are still placeholders or unresolved:

- [ ] **The three social-proof faces are generated placeholders.** Drop square
      photos over `public/images/social-proof/1.jpg`, `2.jpg` and `3.jpg` —
      same names, same folder — and the pill picks them up.
- [ ] **Check the two videos actually play.** The Cinema8 host is unreachable
      from the environment this was built in, so playback was never exercised.
      Load the deployed URL and confirm both the hero VSL and the vertical
      closing video render.
- [ ] **Check the booking calendar renders** on the real domain. Some Google
      Calendar schedules restrict which origins may embed them.
- [ ] **Connect the sheet.** Without `SHEETS_WEBHOOK_URL` and
      `SHEETS_WEBHOOK_TOKEN` the funnel runs and records nothing. Set both
      before spending on ads — see `docs/SHEETS.md`.
- [ ] **Nothing sends the promised course.** The CTA promises a free 1-hour
      course; no mail is sent. Hook that up to whatever reads the sheet.
- [ ] **The legal pages do not exist.** The footer links `/integritetspolicy`
      and `/anvandarvillkor`, and `support@fsr.se` is a placeholder address.

---

## Vercel instead

Vercel builds Next.js with no configuration at all, since it's their framework.
If Netlify gives you trouble, it is a genuinely shorter path:

```bash
npm install -g vercel
vercel          # preview deploy
vercel --prod   # production
```

Or import the repo at [vercel.com/new](https://vercel.com/new). The same
environment variables apply, with the same build-time caveat. `netlify.toml` is
ignored by Vercel, so leaving it in the repo costs nothing.

---

## Troubleshooting

**Build fails on `sharp` / image optimisation**
Netlify's Next.js Runtime bundles what it needs. If you see a sharp error,
confirm `NODE_VERSION` is `22` — the `.nvmrc` and `netlify.toml` both set it.

**Page loads but styles are missing**
Usually a wrong publish directory. It must be `.next`, not `out`.

**Environment variable change had no effect**
`NEXT_PUBLIC_*` values are compiled into the bundle. Trigger a redeploy
(Deploys → Trigger deploy → Clear cache and deploy site).

**The video or calendar is blank**
Both are third-party embeds. Open the browser console and look for CSP or
X-Frame-Options errors — those come from the provider's settings, not from
this app.

**The countdown shows the wrong time**
It counts to the end of the visitor's own local day, by design. It is not
pinned to a timezone.
