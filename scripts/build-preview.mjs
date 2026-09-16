/**
 * Bundles the workshop page into one self-contained .html file.
 *
 * The Next.js app needs a server; this does not. Every image is inlined as a
 * data: URI and the funnel/countdown/grid are re-implemented in vanilla JS, so
 * the file can be opened straight from disk to review layout and behaviour.
 */
import { execFile } from 'node:child_process';
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

import sharp from 'sharp';


const execFileAsync = promisify(execFile);

/**
 * `--artifact` emits the Artifact-shaped variant: no doctype/html/head/body
 * wrapper (the host supplies those), plus a badge marking the page as a
 * preview build so a shared link can't be mistaken for the live site.
 */
const ARTIFACT = process.argv.includes('--artifact');

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

/**
 * Sans latin subset emitted by next/font during `next build`. The filename is
 * content-hashed, so it is resolved by scanning rather than pinned — the mono
 * face is the smaller of the two preloaded subsets.
 */
async function findSansSubset() {
  const dir = path.join(ROOT, '.next/static/media');
  const files = (await readdir(dir)).filter((f) => f.endsWith('-s.p.woff2'));
  if (files.length === 0) throw new Error('No font subset found — run `next build` first.');

  const sized = await Promise.all(
    files.map(async (f) => ({ f, size: (await stat(path.join(dir, f))).size })),
  );
  sized.sort((a, b) => b.size - a.size);
  return path.join(dir, sized[0].f);
}

async function dataUri(rel, mime) {
  const buf = await readFile(path.join(PUBLIC, rel));
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const PAGE_TITLE = 'FSR - Learn High Ticket Sales';

const DISQUALIFIERS = ['Ingen egen produkt.', 'Inga annonser.', 'Jobba hemifrån.'];


const CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 shrink-0 ml-1"><path d="m9 18 6-6-6-6"/></svg>`;

const MAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

const TICK = `<svg viewBox="0 0 20 20" fill="currentColor" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4fd12f]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`;

const SE_FLAG = `<svg viewBox="0 0 24 16" class="h-4 w-6 rounded-[2px]"><rect width="24" height="16" fill="#006aa7"/><rect y="6.5" width="24" height="3" fill="#fecc02"/><rect x="7" width="3" height="16" fill="#fecc02"/></svg>`;

/** Cinema8 media ids for the two players, and the player script. */
const VSL_MEDIA_ID = 'oJKx7gbO';
const CLOSING_MEDIA_ID = 'mJdb4E5D';
const CINEMA8_PLAYER_SRC = 'https://static-01.cinema8.com/embed/player.js';

/**
 * The real player everywhere, and a notice in the artifact build — that
 * viewer's CSP admits scripts only from a short allowlist, which this host is
 * not on, so the element would mount and stay blank.
 */
const VSL_BODY = ARTIFACT
  ? `<div class="absolute inset-0 grid place-items-center px-6 text-center">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30 sm:text-xs">VSL</p>
        <p class="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-white/40 sm:text-xs">Videon spelas upp här på sidan. Den här förhandsvisningen kan inte ladda spelaren, eftersom visningen blockerar externa skript.</p>
      </div>
    </div>`
  : `<cinema8-player media-id="${VSL_MEDIA_ID}" style="position:absolute;top:0;left:0;width:100%;height:100%"></cinema8-player>`;

/** The closing video, same story — vertical source, so it gets a 9:16 frame. */
const CLOSING_BODY = ARTIFACT
  ? `<div class="absolute inset-0 grid place-items-center px-6 text-center">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30 sm:text-xs">Video</p>
        <p class="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-white/40 sm:text-xs">Videon spelas upp här på sidan. Den här förhandsvisningen kan inte ladda spelaren, eftersom visningen blockerar externa skript.</p>
      </div>
    </div>`
  : `<cinema8-player media-id="${CLOSING_MEDIA_ID}" autoplay="false" style="position:absolute;top:0;left:0;width:100%;height:100%"></cinema8-player>`;

/** Google Calendar appointment schedule embedded on the booking step. */
const BOOKING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1ghy5mwfxSxcxe-jbhtkhxSiL_AWeu26VMG8rIAXrHLi-k2ZHdMI3zW8SsUfWD4lBhtD4Kvdjc?gv=true';

const CTA_GRADIENT =
  'linear-gradient(to right, rgb(74, 180, 56) 0%, rgb(95, 214, 62) 50%, rgb(168, 247, 107) 100%)';

const ctaButton = (id, extra = '') =>
  `<button type="submit" id="${id}" class="w-full ${extra} py-3.5 px-4 rounded-xl text-black font-extrabold transition-all duration-200 flex items-center justify-center gap-1 shadow-[0_0_28px_rgba(79,209,47,0.35)] hover:opacity-90 hover:scale-[1.01]" style="background:${CTA_GRADIENT}">
    <span class="flex flex-col items-center leading-tight">
      <span class="text-base sm:text-lg md:text-xl tracking-wide">BOKA ETT SAMTAL</span>
      <span class="text-xs sm:text-sm font-semibold opacity-90">FÅ GRATIS TILLGÅNG TILL VÅR 1-TIMMESKURS</span>
    </span>${CHEVRON}
  </button>`;

// The key drives the data-cd lookup in tick(); only the label is translated.
// Keeping them separate is what stops a translation from breaking the timer.
const COUNTDOWN_UNITS = [
  ['hours', 'timmar'],
  ['minutes', 'minuter'],
  ['seconds', 'sekunder'],
];

const countdownBlock = (prefix) => `
  <div class="w-full rounded-2xl border border-[#2f343a]/60 bg-black/30 px-3 py-4 sm:px-5 text-center">
    <p class="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#a8f76b] sm:text-sm">Möjligheten stänger om</p>
    <div class="flex justify-center gap-3 sm:gap-4">
      ${COUNTDOWN_UNITS
        .map(
          ([key, label]) => `<div class="flex w-[92px] flex-col items-center bg-gray-100 rounded-lg px-4 py-2 sm:w-[116px] sm:px-6 sm:py-3">
        <span class="tabular-nums text-3xl sm:text-4xl font-bold text-black" data-cd="${prefix}-${key}">00</span>
        <span class="mt-1 text-[10px] sm:text-xs uppercase text-gray-600">${label}</span>
      </div>`,
        )
        .join('')}
    </div>
  </div>`;

const PREVIEW_BADGE = `
<div style="position:fixed;left:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:7px;padding:6px 11px;border-radius:9999px;border:1px solid rgba(168,247,107,.35);background:rgba(15,17,19,.92);backdrop-filter:blur(6px);font:600 11px/1.2 Geist,system-ui,sans-serif;color:#a8f76b;letter-spacing:.04em;">
  <span style="width:7px;height:7px;border-radius:9999px;background:#4fd12f;flex:none;"></span>
  FÖRHANDSVISNING — INTE DEN RIKTIGA SIDAN
</div>`;

const SCHEDULER_FRAME = `
  <div class="overflow-hidden rounded-2xl border border-[#2f343a]/60 bg-white shadow-[0_0_36px_rgba(79,209,47,0.18)]">
    <iframe src="${BOOKING_URL}" title="Boka ditt samtal" loading="lazy" class="block h-[680px] w-full border-0 sm:h-[600px]"></iframe>
  </div>
  <p class="mt-2.5 text-center text-[11px] text-white/40 sm:text-xs">Laddar kalendern inte? <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" class="font-semibold text-[#a8f76b] underline-offset-4 transition-colors hover:text-[#4fd12f] hover:underline">Öppna bokningssidan &#8599;</a></p>`;

/**
 * The Artifact viewer's CSP admits no third-party frames, so the embed would
 * render as a dead white box there. The published preview links out instead,
 * and says why.
 */
const SCHEDULER_LINK = `
  <div class="rounded-2xl border border-[#2f343a]/60 bg-black/30 px-5 py-9 text-center shadow-[0_0_36px_rgba(79,209,47,0.12)]">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 h-10 w-10 text-[#4fd12f]"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
    <p class="text-sm font-extrabold tracking-wide text-white sm:text-base">Bokning via Google Kalender</p>
    <p class="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-white/45 sm:text-xs">Den riktiga kalendern är inbäddad här på sidan. Den här förhandsvisningen länkar vidare i stället, eftersom visningen blockerar inbäddade ramar.</p>
    <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-extrabold tracking-wide text-black shadow-[0_0_28px_rgba(79,209,47,0.35)] transition-all duration-200 hover:opacity-90 sm:text-base" style="background:${CTA_GRADIENT}">Öppna bokningssidan &#8599;</a>
  </div>`;

const SCHEDULER_BLOCK = ARTIFACT ? SCHEDULER_LINK : SCHEDULER_FRAME;

const PRIVACY = `<p class="text-center text-sm text-gray-500">🔒 Vi värnar om din integritet. Aldrig spam.</p>`;

const QUIZ = [
  {
    id: 'occupation',
    title: 'Vad beskriver dig bäst?',
    description: 'Vi frågar för att kunna hjälpa dig att nå dina mål på bästa sätt.',
    options: [
      ['A', 'Jag har ett jobb'],
      ['B', 'Jag driver eget företag'],
      ['C', 'Jag är student'],
      ['D', 'Jag är arbetslös'],
    ],
  },
  {
    id: 'current-income',
    title: 'Hur mycket tjänar du i månaden just nu?',
    description: 'Det visar oss vilken startpunkt i systemet som passar dig.',
    options: [
      ['A', '0 kr'],
      ['B', '0–5 000 kr'],
      ['C', '5 000–10 000 kr'],
      ['D', '20 000 kr+'],
    ],
  },
  {
    id: 'goal',
    title: 'Var vill du vara om 6 månader?',
    description: 'Svara på vad du faktiskt siktar på — inte på vad du tror är rimligt.',
    options: [
      ['A', 'Mina första 10 000 kr i månaden'],
      ['B', '25 000 kr i månaden'],
      ['C', 'Passera 50 000 kr i månaden'],
      ['D', 'Passera 100 000 kr i månaden'],
    ],
  },
  {
    id: 'investment',
    title: 'Föreställ dig att det är om 3 månader och du redan stänger affärer — hur mycket är du beredd att investera för att komma dit?',
    description: 'Det gäller utbildning, verktyg och coachning. Välj bara ett belopp du faktiskt har tillgång till i dag.',
    options: [
      ['A', 'Under 5 000 kr'],
      ['B', '5 000–15 000 kr'],
      ['C', '15 000–30 000 kr'],
      ['D', '30 000–50 000 kr'],
      ['E', '50 000 kr+'],
    ],
  },
];

async function main() {
  const avatars = await Promise.all(
    // Resized before inlining. The real photos are up to 1900px square, and
    // the page renders them at 28 — inlining them whole put 1MB of data URI
    // into a file whose whole point is being quick to open.
    ['1.png', '2.webp', '3.png'].map(async (f) => {
      const webp = await sharp(path.join(PUBLIC, 'images', 'social-proof', f))
        .resize(64, 64, { fit: 'cover' })
        .webp({ quality: 82 })
        .toBuffer();
      return `data:image/webp;base64,${webp.toString('base64')}`;
    }),
  );

  const stepper = ['Snabbtest', 'Dina uppgifter', 'Boka samtal']
    .map(
      (label, i) => `
      <div data-step-cell="${i + 1}" class="relative flex min-h-16 flex-col items-center justify-center border-r border-[#2f343a]/40 px-1.5 py-2 text-center last:border-r-0 sm:min-h-24 sm:px-4 sm:py-3">
        <span data-step-num class="mb-1 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black sm:h-8 sm:w-8 sm:text-sm">${i + 1}</span>
        <span data-step-label class="text-[9px] font-black uppercase leading-tight tracking-wide sm:text-sm">${label}</span>
      </div>`,
    )
    .join('');


  // Inlined, like every other asset here, so the file stands alone.
  const favicon = await dataUri('favicon.svg', 'image/svg+xml');

  const head = ARTIFACT
    ? `<title>${PAGE_TITLE}</title>
<link rel="icon" type="image/svg+xml" href="${favicon}">`
    : `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${PAGE_TITLE}</title>
<link rel="icon" type="image/svg+xml" href="${favicon}">`;

  const html = `${head}
<style>/*__TAILWIND__*/</style>
<style>/*__FONT__*/</style>
<style>
  body { background:#000; color:#fff; font-family:Geist,ui-sans-serif,system-ui,sans-serif; margin:0; -webkit-font-smoothing:antialiased; }
  /* Smart-autoplay overlay: 1920x1080 stage coordinates expressed as
     percentages, with cqw carrying the type and radius proportions. */
  /* Hero backdrop — mirrors the same rules in globals.css. */
  .hero-backdrop { position:absolute; inset:0 0 auto 0; height:clamp(660px,112vh,1180px); pointer-events:none; z-index:0; }
  .hero-backdrop::before, .hero-backdrop::after { content:''; position:absolute; inset:0; }
  .hero-backdrop::before {
    background-image:
      linear-gradient(to right, rgba(255,255,255,.085) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.085) 1px, transparent 1px);
    background-size:56px 56px;
    -webkit-mask-image: linear-gradient(to bottom,#000 0%,#000 62%,rgba(0,0,0,.55) 84%,transparent 100%);
    mask-image: linear-gradient(to bottom,#000 0%,#000 62%,rgba(0,0,0,.55) 84%,transparent 100%);
  }
  .hero-backdrop::after { background: radial-gradient(64% 40% at 50% 0%, rgba(79,209,47,.13) 0%, transparent 70%); }
  .vsl-frame { container-type: inline-size; }
  /* Hero top — mirrors the same rules in globals.css. */
  .brand-wordmark { text-shadow: 0 0 18px rgba(79,209,47,.45), 0 0 44px rgba(79,209,47,.2); }
  .hero-headline { font-size: clamp(1.6rem, 0.95rem + 3.1vw, 3.5rem); line-height:1.06; letter-spacing:0; }
  .hero-sub { font-size: clamp(0.8125rem, 0.73rem + 0.4vw, 1.0625rem); line-height:1.5; }
  .headline-accent {
    background-image: linear-gradient(180deg, #a8f76b 0%, #4fd12f 100%);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
    filter: drop-shadow(0 0 8px rgba(79,209,47,.32)) drop-shadow(0 0 24px rgba(79,209,47,.18));
  }
  .headline-mark {
    text-decoration-line: underline;
    text-decoration-color: #4fd12f;
    text-decoration-thickness: 0.072em;
    text-underline-offset: 0.16em;
  }
  .tier { border-color: rgba(42,107,133,.4); background:#0a0c0d; }
  .tier:hover { border-color:#2f343a; }
  .tier[aria-pressed="true"] { border-color:#4fd12f; background:rgba(18,49,60,.85); box-shadow:0 0 28px rgba(79,209,47,.25); }
  .tier [data-radio] { border-color: rgba(255,255,255,.3); }
  .tier[aria-pressed="true"] [data-radio] { border-color:#a8f76b; background:#4fd12f; }
  .tier[aria-pressed="true"] [data-radio]::after { content:""; width:7px; height:4px; border-left:2.5px solid #000; border-bottom:2.5px solid #000; transform:rotate(-45deg) translate(1px,-1px); }
  input[type=checkbox]{ appearance:none;-webkit-appearance:none; }
  input[type=checkbox]:checked{ background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%2338a3b8' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); background-size:100% 100%; background-repeat:no-repeat; }
</style>
${ARTIFACT ? '' : '</head>\n<body class="min-h-screen font-sans antialiased">'}
<div class="flex min-h-screen flex-col relative overflow-hidden">
  <main class="flex-1">
    <div class="relative min-h-screen flex flex-col bg-black">
      <div class="hero-backdrop" aria-hidden="true"></div>

      <div class="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-6 pt-6 sm:px-8 sm:pb-16 lg:px-12">
        <h1 class="hero-headline mb-3 text-balance text-center font-extrabold text-white">Bli placerad på ett <span class="headline-accent">$10,000 offer på 90 dagar</span> och lär dig <span class="headline-mark">online sales</span>… <em class="italic">annars får du <span class="headline-mark">full återbetalning</span></em></h1>

        <p class="hero-sub mb-4 max-w-xl text-balance text-center text-white/45">${DISQUALIFIERS.map((d) => `<span class="font-bold text-white/75">${d} </span>`).join('')}<span class="font-medium italic text-white/60">Ingen säljerfarenhet krävs.</span> På samtalet visar vi exakt var just du ska börja.</p>

        <div class="mb-8 inline-flex max-w-full items-center gap-2 rounded-full border border-[#2f343a]/70 bg-[#0f1113]/95 px-3 py-1.5 shadow-sm sm:px-4 sm:py-2">
          <div class="flex shrink-0 -space-x-1.5">
            ${avatars.map((src, i) => `<div class="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-black sm:h-8 sm:w-8" style="z-index:${3 - i}"><img alt="" width="64" height="64" class="h-full w-full object-cover" src="${src}"></div>`).join('')}
          </div>
          <p class="text-left text-xs font-bold text-[#a8f76b] sm:text-sm">178 nybörjare anmälde sig den här veckan</p>
        </div>

        <div class="mb-8 w-full max-w-3xl">
          <div class="vsl-frame relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2f343a]/70 bg-[#0f1113] shadow-[0_0_40px_rgba(79,209,47,0.18)]">
            ${VSL_BODY}
          </div>
        </div>


        <div id="workshop-opt-in" class="w-full scroll-mt-4">
          <div class="mx-auto mb-6 max-w-2xl">
            <div class="grid w-full grid-cols-3 overflow-hidden rounded-2xl border border-[#2f343a]/70 bg-[#0f1113]/95">${stepper}</div>
          </div>

          <div class="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <!-- STEP 1 - test -->
          <section data-panel="1" class="w-full">
            <div class="w-full overflow-hidden rounded-2xl border border-[#2f343a]/70 bg-[#0f1113]/85 shadow-md">
              <div class="h-1 w-full bg-white/10"><div id="quizBar" class="h-full bg-[#4fd12f] transition-[width] duration-300 ease-out" style="width:0%"></div></div>
              <div class="p-6 sm:p-8">
                <div class="mb-4 flex items-center gap-2">
                  <span id="quizNum" class="flex h-6 w-6 items-center justify-center rounded-md bg-[#4fd12f] text-xs font-black text-black">1</span>
                  <span id="quizCount" class="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 sm:text-xs"></span>
                </div>
                <h2 id="quizTitle" class="text-balance text-lg font-extrabold leading-snug text-white sm:text-2xl"></h2>
                <p id="quizDesc" class="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm"></p>
                <div id="quizOptions" role="radiogroup" class="mt-5 flex flex-col gap-2.5"></div>
                <div class="mt-5">
                  <button type="button" id="quizBack" class="hidden text-xs font-medium text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline sm:text-sm">Tillbaka</button>
                </div>
              </div>
            </div>
          </section>

          <!-- STEP 2 - your details -->
          <section data-panel="2" class="w-full hidden">
            <div class="w-full rounded-2xl border border-[#2f343a]/70 bg-[#0f1113]/85 p-6 sm:p-8 shadow-md">
              <h2 class="mb-6 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">VART SKICKAR VI DIN TILLGÅNG?</h2>
              <form id="optin" class="flex w-full flex-col gap-3">
                <input id="fullName" required type="text" placeholder="Ditt fullständiga namn här..." class="w-full px-3 py-3 rounded-xl border-2 border-[#2f343a]/30 bg-[#0a0c0d] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4fd12f] focus:border-[#4fd12f]">
                <div class="relative">
                  <input id="email" required type="email" placeholder="Din e-postadress här...*" class="w-full py-3 pl-3 pr-11 rounded-xl border-2 border-[#2f343a]/30 bg-[#0a0c0d] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4fd12f] focus:border-[#4fd12f]">${MAIL_ICON}
                </div>
                <div class="relative">
                  <span class="pointer-events-none absolute left-0 top-0 bottom-0 flex w-10 items-center justify-center rounded-l-md border border-r-0 border-[#2f343a] bg-[#0a0c0d]">${SE_FLAG}</span>
                  <input id="phone" required type="tel" value="+46" placeholder="Telefonnummer" class="w-full px-4 py-3 pl-12 rounded-md border border-[#2f343a] bg-[#0a0c0d] text-white font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4fd12f] focus:border-[#4fd12f]">
                </div>
                <div class="flex items-start gap-3 py-1">
                  <input id="receiveGiftTop" type="checkbox" checked class="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-[#4fd12f] bg-[#0a0c0d] focus:ring-[#4fd12f] focus:ring-2">
                  <label for="receiveGiftTop" class="cursor-pointer text-xs font-medium leading-snug text-white/75 sm:text-sm">🎁 Ja tack! Skicka min gratis VIP-gåva och en påminnelse om mitt samtal</label>
                </div>
                <p class="text-[9px] sm:text-[10px] text-gray-500 text-center leading-tight">Genom att ange ditt telefonnummer godkänner du att vi skickar sms om ditt samtal. Svara STOP när som helst för att avsluta.</p>
                ${ctaButton('submitBtn')}
                ${PRIVACY}
              </form>
            </div>
          </section>

          <!-- STEP 3 - book a call -->
          <section data-panel="3" class="w-full hidden">
            <div class="w-full rounded-2xl border border-[#2f343a]/70 bg-[#0f1113]/85 p-6 sm:p-8 shadow-md">
              <div class="mb-5 flex justify-center">
                <span class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#a8f76b] bg-[#4fd12f] shadow-[0_0_28px_rgba(79,209,47,0.35)]">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="h-7 w-7 text-black"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </span>
              </div>
              <h2 class="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">VÄLJ TID FÖR DITT SAMTAL</h2>
              <p class="mb-6 text-center text-xs text-white/60 sm:text-sm" id="callLine"></p>
              <div class="mb-3">${SCHEDULER_BLOCK}</div>
              <dl class="mb-5 grid gap-2 rounded-2xl border border-[#2f343a]/60 bg-black/30 px-4 py-4 text-left" id="summary"></dl>
              <div class="mt-3">${PRIVACY}</div>
            </div>
          </section>
          </section>

            ${countdownBlock('cd')}
          </div>
        </div>

        <div class="mt-12 flex w-full justify-center">
          <div class="w-full max-w-[340px]">
            <div class="vsl-frame relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[#2f343a]/70 bg-[#0f1113] shadow-[0_0_40px_rgba(79,209,47,0.18)]">
              ${CLOSING_BODY}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <section id="footer" class="bg-black text-center px-4 py-8 text-xs">
    <div class="container mx-auto max-w-4xl space-y-6">
      <p class="text-neutral-400">FSR och alla personer som är knutna till företaget tar inget ansvar för utfallet, resultatet eller framgången av tjänsterna, och garanterar inga specifika resultat. Hur det går beror bland annat på hur mycket tid du lägger ner och på hur du tillämpar den vägledning och det stöd du får. Innehållet och alla övriga funktioner är uteslutande i utbildningssyfte.</p>
      <p class="text-neutral-400">Vi kan inte lämna några garantier eller utfästelser, varken uttryckliga eller underförstådda, om resultat eller om att tjäna pengar på de metoder, den information och de strategier som ingår. Försäljning av högprisprodukter kräver eget arbete, och resultaten varierar från person till person.</p>
      <p class="text-neutral-400">Eventuella omdömen kommer från verkliga personer och beskriver deras egna individuella upplevelser. De ska inte uppfattas som typiska resultat och kommer inte att vara specifika för just dina förhållanden eller de åtgärder du väljer att vidta.</p>
      <p class="text-neutral-400">Den här sidan är inte en del av Googles webbplats, Google Inc, Facebook/Metas webbplats eller Meta, Inc. Sidan är inte heller på något sätt godkänd av Google eller Meta.</p>
      <div class="flex justify-center space-x-8">
        <a class="text-neutral-400 hover:text-[#4fd12f] transition-colors" href="/integritetspolicy">Integritetspolicy</a>
        <a class="text-neutral-400 hover:text-[#4fd12f] transition-colors" href="/anvandarvillkor">Användarvillkor</a>
        <a class="text-neutral-400 hover:text-[#4fd12f] transition-colors" href="mailto:support@fsr.se">Kontakta oss</a>
      </div>
      <p class="text-neutral-400">© <span id="year"></span> FSR. Med ensamrätt.</p>
    </div>
  </section>
</div>

<script>
(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- countdown: the offer closes at the end of the visitor's own day ----
  function deadline(now){ var d = new Date(now); d.setHours(24,0,0,0); return d.getTime(); }
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    var now = new Date();
    var s = Math.max(0, Math.floor((deadline(now) - now.getTime()) / 1000));
    var v = { hours: Math.floor(s/3600), minutes: Math.floor(s%3600/60), seconds: s%60 };
    document.querySelectorAll('[data-cd]').forEach(function(el){
      el.textContent = pad(v[el.getAttribute('data-cd').split('-')[1]]);
    });
  }
  tick(); setInterval(tick, 1000);

  // ---- funnel -------------------------------------------------------------
  // QUIZ is a build-time constant, so it has to be serialised into the page
  // for the browser to read.
  var QUIZ = ${JSON.stringify(QUIZ)};
  var state = { step:1, qi:0, answers:{}, lead:null, advancing:false };
  var panels = document.querySelectorAll('[data-panel]');
  var cells  = document.querySelectorAll('[data-step-cell]');

  function render(){
    panels.forEach(function(p){ p.classList.toggle('hidden', +p.dataset.panel !== state.step); });
    cells.forEach(function(c){
      var n = +c.dataset.stepCell, on = n <= state.step, active = n === state.step;
      c.classList.toggle('bg-[#1e2a12]/85', active);
      var num = c.querySelector('[data-step-num]'), lab = c.querySelector('[data-step-label]');
      num.className = 'mb-1 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black sm:h-8 sm:w-8 sm:text-sm ' +
        (on ? 'border-[#a8f76b] bg-[#4fd12f] text-black' : 'border-white/25 text-white/45');
      lab.className = 'text-[9px] font-black uppercase leading-tight tracking-wide sm:text-sm ' + (on ? 'text-white' : 'text-white/40');
    });
  }

  function goto(step){
    state.step = step; render();
    document.getElementById('workshop-opt-in').scrollIntoView({ behavior:'smooth', block:'start' });
  }

  // ---- step 1: the test ---------------------------------------------------
  var backBtn = document.getElementById('quizBack');
  var ADVANCE_DELAY_MS = 280;

  function renderQuestion(){
    var q = QUIZ[state.qi], chosen = state.answers[q.id];
    document.getElementById('quizNum').textContent = state.qi + 1;
    document.getElementById('quizCount').textContent = 'Fråga ' + (state.qi + 1) + ' av ' + QUIZ.length;
    document.getElementById('quizTitle').innerHTML =
      q.title + '<span class="ml-1 text-[#4fd12f]" aria-label="Den här frågan är obligatorisk.">*</span>';
    document.getElementById('quizDesc').textContent = q.description;
    document.getElementById('quizBar').style.width =
      (((state.qi + (chosen ? 1 : 0)) / QUIZ.length) * 100) + '%';

    document.getElementById('quizOptions').innerHTML = q.options.map(function(o){
      var on = chosen === o[0];
      return '<button type="button" role="radio" aria-checked="' + on + '" data-key="' + o[0] + '" ' +
        'class="flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fd12f] ' +
        (on ? 'border-[#4fd12f] bg-[#1e2a12]/85 shadow-[0_0_20px_rgba(79,209,47,0.2)]' : 'border-[#2f343a]/40 bg-[#15181c] hover:border-[#2f343a] hover:bg-[#1b1f24]') + '">' +
        '<span aria-hidden="true" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-black ' +
        (on ? 'border-[#a8f76b] bg-[#4fd12f] text-black' : 'border-white/20 text-white/50') + '">' + o[0] + '</span>' +
        '<span class="text-sm font-semibold text-white sm:text-base">' + o[1] + '</span></button>';
    }).join('');

    Array.prototype.forEach.call(document.getElementById('quizOptions').children, function(btn){
      btn.addEventListener('click', function(){ choose(btn.dataset.key); });
    });

    backBtn.classList.toggle('hidden', state.qi === 0);
  }

  // Picking an option moves straight on; the short delay lets the selected
  // state paint first, and state.advancing blocks double-taps.
  function choose(key){
    if (state.advancing) return;
    state.advancing = true;
    state.answers[QUIZ[state.qi].id] = key;
    renderQuestion();

    setTimeout(function(){
      state.advancing = false;
      if (state.qi === QUIZ.length - 1) { goto(2); return; }
      state.qi++; renderQuestion();
    }, ADVANCE_DELAY_MS);
  }

  /*
   * The real page POSTs this to /api/lead, which forwards it to the sheet.
   * This file has no server, so it logs the payload instead — the shape is the
   * same, which makes it useful for checking what a lead row will contain.
   */
  function trackLead(event){
    var answers = {};
    QUIZ.forEach(function(q){
      var key = state.answers[q.id];
      if (!key) return;
      var opt = q.options.filter(function(o){ return o[0] === key; })[0];
      if (opt) answers[q.id] = opt[1];
    });
    console.log('[lead] ' + event, {
      event: event,
      answers: answers,
      lead: state.lead || null,
      pageUrl: location.href,
      referrer: document.referrer || ''
    });
  }

  backBtn.addEventListener('click', function(){ if (state.qi > 0) { state.qi--; renderQuestion(); } });

  // Letter keys pick an option, and so advance too.
  window.addEventListener('keydown', function(e){
    if (state.step !== 1) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
    var hit = QUIZ[state.qi].options.filter(function(o){
      return o[0].toLowerCase() === e.key.toLowerCase();
    })[0];
    if (hit) { e.preventDefault(); choose(hit[0]); }
  });

  renderQuestion();

  // ---- step 2: details ----------------------------------------------------
  document.getElementById('receiveGiftTop').addEventListener('change', function(e){
    var phone = document.getElementById('phone');
    phone.required = e.target.checked;
    phone.disabled = !e.target.checked;
    phone.classList.toggle('opacity-40', !e.target.checked);
  });

  document.getElementById('optin').addEventListener('submit', function(e){
    e.preventDefault();
    var declined = !document.getElementById('receiveGiftTop').checked;
    state.lead = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: declined ? '' : document.getElementById('phone').value,
      declined: declined
    };
    trackLead('details_submitted');

    // ---- step 3: book a call ----
    var first = state.lead.fullName.split(' ')[0];
    var goalQ = QUIZ.filter(function(q){ return q.id === 'goal'; })[0];
    var goal = goalQ.options.filter(function(o){ return o[0] === state.answers['goal']; })[0];
    document.getElementById('callLine').textContent =
      (first ? 'Du är med, ' + first + '. ' : 'Du är med. ') +
      'Välj en tid nedan så lägger vi upp en plan för dina första 90 dagar.';

    var rows = [];
    if (goal) rows.push(['Mål', goal[1]]);
    rows.push(['E-post', state.lead.email]);
    if (!state.lead.declined) rows.push(['Telefon', state.lead.phone]);
        document.getElementById('summary').innerHTML = rows.map(function(r){
      return '<div class="flex items-start justify-between gap-3">' +
        '<dt class="text-[10px] font-black uppercase tracking-[0.18em] text-[#a8f76b] sm:text-xs">' + r[0] + '</dt>' +
        '<dd class="break-all text-xs font-semibold text-white sm:text-sm">' + r[1] + '</dd></div>';
    }).join('');

    goto(3);
  });

  render();
})();
</script>
${ARTIFACT ? PREVIEW_BADGE : `<script src="${CINEMA8_PLAYER_SRC}" async></script>`}
${ARTIFACT ? '' : ''}
${ARTIFACT ? '' : '</body>\n</html>'}`;

  const out = path.join(ROOT, 'preview', ARTIFACT ? 'lander.artifact.html' : 'lander.html');
  await writeFile(out, html);

  // Compile only the utilities this file actually uses, then inline them, so
  // the preview needs no CDN and no network at all.
  const tmpConfig = path.join(ROOT, 'preview', '.tw.config.cjs');
  const tmpIn = path.join(ROOT, 'preview', '.tw.in.css');
  const tmpOut = path.join(ROOT, 'preview', '.tw.out.css');

  await writeFile(
    tmpConfig,
    `module.exports = {
  content: [${JSON.stringify(out)}],
  theme: { extend: { fontFamily: { sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'] } } },
  plugins: [],
};`,
  );
  await writeFile(tmpIn, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');

  await execFileAsync('npx', ['tailwindcss', '-c', tmpConfig, '-i', tmpIn, '-o', tmpOut, '--minify'], {
    cwd: ROOT,
    maxBuffer: 32 * 1024 * 1024,
  });

  const css = await readFile(tmpOut, 'utf8');

  // Inter latin subset, lifted from the Next.js build output so the preview
  // renders in exactly the face the app ships.
  const sansWoff2 = await readFile(await findSansSubset());
  const fontCss = `@font-face{font-family:'Geist';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${sansWoff2.toString('base64')}) format('woff2');}`;

  const final = html
    .replace('/*__TAILWIND__*/', css)
    .replace('/*__FONT__*/', fontCss);

  await writeFile(out, final);
  await Promise.all([tmpConfig, tmpIn, tmpOut].map((f) => rm(f, { force: true })));

  console.log('Wrote', out, (final.length / 1024 / 1024).toFixed(2), 'MB (self-contained)');
}

main().catch((e) => { console.error(e); process.exit(1); });
