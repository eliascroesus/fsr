# Deploying the lander

The app is a Next.js 15 (App Router) project. All three routes prerender as
static HTML, but it is **not** a static export — `next/image` optimisation and
the server components still need a Next.js runtime. So deploy it as a Next.js
app, not as a folder of HTML.

---

## Vercel via GitHub

Vercel builds Next.js with no configuration — no build command, no output
directory, no plugin. There is no `vercel.json` in this repo and none is
needed. Importing the repo at [vercel.com/new](https://vercel.com/new) and
pressing Deploy is the whole setup.

### Environment variables

Set these under **Settings ▸ Environment Variables**. None of them is required
for the site to build and render; each one switches on a piece of behaviour.

| Variable | Environments | What it does |
| --- | --- | --- |
| `SHEETS_WEBHOOK_URL` | Production | Lead rows reach the sheet. Unset, the funnel runs and records nothing. |
| `SHEETS_WEBHOOK_TOKEN` | Production | Must match `TOKEN` in the Apps Script. |
| `NEXT_PUBLIC_ENABLE_TRACKING` | **Preview**, **Development** → `false` | Keeps preview deploys out of the real analytics properties. |
| `NEXT_PUBLIC_CAL_LINK` | all | Overrides the Cal.com event (`user/event`). |
| `NEXT_PUBLIC_VSL_MEDIA_ID`, `NEXT_PUBLIC_CLOSING_MEDIA_ID` | all | Override the two Cinema8 videos. |
| `NEXT_PUBLIC_META_PIXEL_PRIMARY`, `NEXT_PUBLIC_FUNNELYTICS_FUNNEL_ID`, … | Production | See "Tracking IDs" below — these have inherited defaults. |

Two things bite people here:

- **Scope matters.** A variable added only to Production does nothing on a
  preview deploy, and vice versa. Vercel asks per environment.
- **`NEXT_PUBLIC_*` is compiled into the bundle at build time.** Changing one
  has no effect on a deployment that already exists — redeploy after editing.

### Node version

`engines.node` in `package.json` pins Node 22, which is what Vercel reads.
`.nvmrc` is there for local shells and is not what decides the build.

### Deploys

Pushing to `main` deploys to production. Every other branch and pull request
gets its own preview URL. There is nothing to trigger by hand.

---

## Tracking IDs

`src/lib/tracking-config.ts` still carries the Meta Pixel, Funnelytics, Google
Ads, Fathom and LinkedIn IDs that came from the page this project was first
built against. **They are somebody else's.** Left as they are, a live FSR site
reports its traffic into another company's analytics, and FSR gets none of it.

Before spending on ads, either set the `NEXT_PUBLIC_*` override for each tag
you actually use, or set `NEXT_PUBLIC_ENABLE_TRACKING=false` in Production to
switch the lot off until you have your own.

---

## Troubleshooting

**"No Production Deployment" after importing the repo**
Vercel deploys on push. Connecting the repo does not build what is already
there — push a commit to `main`, or use **Deployments ▸ ⋯ ▸ Redeploy**.

**Build fails on `sharp` / image optimisation**
Confirm the build is on Node 22. `engines.node` in `package.json` sets it;
a Project Settings override takes precedence over that.

**Environment variable change had no effect**
`NEXT_PUBLIC_*` values are compiled into the bundle, and a variable scoped to
the wrong environment is not read at all. Check the scope, then redeploy.

**Leads stop reaching the sheet**
`/api/lead` logs the reason under **Logs**, filtered to that function. A 502
there means the Apps Script refused or was unreachable; `forbidden` in its
response means the two token values disagree.

**The video or calendar is blank**
Both are third-party embeds — Cinema8 and Cal.com. Open the browser console
and look for CSP or X-Frame-Options errors; those come from the provider's
settings, not from this app.

**The countdown shows the wrong time**
It counts to the end of the visitor's own local day, by design. It is not
pinned to a timezone.
