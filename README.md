# AI Acquisition — `/workshop-v-test` replica

A 1:1 rebuild of the `www.aiacquisitionmethod.com/workshop-v-test` opt-in funnel
page as a fresh Next.js 15 App Router project, reconstructed from the page's
rendered DOM.

```bash
npm install
npm run assets:placeholders   # only needed if public/images is empty
npm run dev                   # http://localhost:3000/workshop-v-test
```

### Just want to look at it?

`preview/workshop-v-test.html` is a single self-contained file — open it in any
browser, no server, no network. All three funnel steps, the live countdown and
the animated backdrop work; images, CSS and the Inter font are inlined.
Regenerate it after changing the app with:

```bash
npm run build      # needed once, the preview lifts Inter from .next
npm run preview             # -> preview/workshop-v-test.html (open from disk)
npm run preview -- --artifact   # -> preview/workshop-v-test.artifact.html
```

The `--artifact` variant is the same page shaped for publishing as a Claude
Artifact (no doctype/head/body wrapper, plus a "preview build" badge so a
shared link is never mistaken for the live site).

## What's here

| Piece | File |
| --- | --- |
| Root layout, fonts, all third-party tags | `src/app/layout.tsx` |
| Funnel chrome (`main` + footer) | `src/app/(webinars)/layout.tsx` |
| The page | `src/app/(webinars)/workshop-v-test/page.tsx` |
| Animated grid backdrop | `src/components/magicui/animated-grid-pattern.tsx` |
| 3-step opt-in flow | `src/components/workshop/` |
| Footer | `src/components/site-footer.tsx` |
| Tag IDs, in one place | `src/lib/tracking-config.ts` |

Every colour is the source's own arbitrary value — `#071013` card ink,
`#0b0f10` field ink, `#12313c` active step, `#2a6b85` borders, `#38a3b8`
accent, `#9fe4f0` highlight text — with the CTA gradient
`linear-gradient(to right, #1e4a5f 0%, #2a6b85 50%, #38a3b8 100%)` and the
`0 0 28px rgba(56,163,184,0.35)` glow. They are also exposed as `brand.*`
colours in `tailwind.config.ts`.

### Reproduced behaviour

- **Animated grid backdrop** — 40×40 tiled pattern, `maxOpacity` 0.05, squares
  that re-roll position after each fade cycle, radial mask, fixed at `-z-10`.
- **3-step funnel** — Test → Your Details → Book a call, with the stepper
  reflecting state and the card scrolling back into view on each step.
- **The test** — four qualifying questions asked one screen at a time
  (occupation, current income, 12-month goal, budget). Options carry letter
  keys, so a question can be answered with the keyboard and Enter moves on.
  Questions live in `src/components/workshop/quiz-questions.ts`.
- **Phone field** — `react-phone-input-2`, US default, `+1` seeded. The
  "I don't want to share my phone" checkbox is an inverted opt-out: ticking it
  drops the `required` constraint on the phone field.
- **Countdown** — counts to the next 8PM in `America/New_York`, resolving the
  zone offset twice so it stays correct across a DST boundary. Digits carry
  `suppressHydrationWarning` since server and client tick a second apart.
- **Testimonial wall** — 60 screenshots in a `columns-1 / sm:columns-2 /
  lg:columns-3` CSS masonry with `break-inside-avoid`.
- **Tracking** — Funnelytics, Meta Pixel (1 primary + 3 `trackSingle`
  secondaries), Convert Experiments, PromptWatch, Whop, Google Ads (3 accounts,
  remarketing + the `/thank-you`-scoped conversions), Fathom (2 sites), Hyros
  (2 hosts), LinkedIn Insight, Vercel Speed Insights and PostHog — each with the
  same load strategy (`beforeInteractive` / `afterInteractive`) as the original,
  plus the `<noscript>` beacons.

## Things to check before this goes live

The live site was unreachable from the build environment (its host is blocked by
the network egress policy), so the following were reconstructed from the DOM
rather than read off the original. They are the only places this differs from a
byte-for-byte copy.

1. **Images are generated placeholders.** `npm run assets:placeholders` writes
   stand-ins at every path the page references, at the right dimensions, so the
   layout and `next/image` `srcSet` are identical. Drop the real files over the
   top — same paths, same names — and nothing else changes:
   - `public/images/avatar9.avif`, `avatar10.avif`, `avatar11.avif`
   - `public/images/aia-assets/charity-badge.avif`
   - `public/images/new-logo.png`, `public/favicon.ico`
   - `public/images/success-wins/win-001-…` through `win-060-…` (`.png`)

2. **Question copy is placeholder.** Question 1's options came from the
   reference form; questions 2-4 were written to brief and live in
   `quiz-questions.ts` — swap in production copy there. The booking step embeds
   the real Google Calendar appointment schedule (`NEXT_PUBLIC_BOOKING_URL`
   overrides it); `<BookACall>` still takes children if the booking tool ever
   changes.

3. **Fonts.** The original loads two `next/font` families through
   `--font-sans` / a second variable; the specific families were not
   identifiable from the markup. This uses Inter + Roboto Mono. Only Inter is
   visible on this page (everything uses `font-sans`).

4. **Footer theme tokens.** The footer uses shadcn's `bg-background` /
   `text-muted-foreground` / `hover:text-primary`. Since the original
   stylesheet was unreachable, `:root` in `globals.css` is set dark to match the
   black page, with `--primary` mapped to the brand teal. A commented light
   variant sits directly below it if the original footer renders white.

5. **Nothing is wired to a backend.** Submitting advances the step and fires the
   `Lead` pixel event; quiz answers are held in component state only. Point both
   at the real CRM/webhook endpoint.

Tracking tags are disabled in development so local work doesn't pollute the real
analytics properties. Set `NEXT_PUBLIC_ENABLE_TRACKING=true` to force them on.
See `.env.example`.
