/**
 * Bundles the workshop page into one self-contained .html file.
 *
 * The Next.js app needs a server; this does not. Every image is inlined as a
 * data: URI and the funnel/countdown/grid are re-implemented in vanilla JS, so
 * the file can be opened straight from disk to review layout and behaviour.
 */
import { execFile } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

import { SUCCESS_WIN_SLUGS } from './success-win-slugs.mjs';

const execFileAsync = promisify(execFile);

/**
 * `--artifact` emits the Artifact-shaped variant: no doctype/html/head/body
 * wrapper (the host supplies those), plus a badge marking the page as a
 * preview build so a shared link can't be mistaken for the live site.
 */
const ARTIFACT = process.argv.includes('--artifact');

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

/** Inter latin subset emitted by next/font during `next build`. */
const INTER_WOFF2 = '.next/static/media/e4af272ccee01ff0-s.p.woff2';

async function dataUri(rel, mime) {
  const buf = await readFile(path.join(PUBLIC, rel));
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const BENEFITS = ['No inventory', 'No techy stuff', '100% Work from home', '8-10 Hours per week'];

const CHECK_ICON = `<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 shrink-0 text-[#38a3b8]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`;

const CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 shrink-0 ml-1"><path d="m9 18 6-6-6-6"/></svg>`;

const MAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

const TICK = `<svg viewBox="0 0 20 20" fill="currentColor" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#38a3b8]"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`;

const US_FLAG = `<svg viewBox="0 0 24 16" class="h-4 w-6 rounded-[2px]"><rect width="24" height="16" fill="#b22234"/><g fill="#fff"><rect y="1.23" width="24" height="1.23"/><rect y="3.69" width="24" height="1.23"/><rect y="6.15" width="24" height="1.23"/><rect y="8.62" width="24" height="1.23"/><rect y="11.08" width="24" height="1.23"/><rect y="13.54" width="24" height="1.23"/></g><rect width="10" height="8.62" fill="#3c3b6e"/></svg>`;

/** Google Calendar appointment schedule embedded on the booking step. */
const BOOKING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1ghy5mwfxSxcxe-jbhtkhxSiL_AWeu26VMG8rIAXrHLi-k2ZHdMI3zW8SsUfWD4lBhtD4Kvdjc?gv=true';

const CTA_GRADIENT =
  'linear-gradient(to right, rgb(30, 74, 95) 0%, rgb(42, 107, 133) 50%, rgb(56, 163, 184) 100%)';

const ctaButton = (id, extra = '') =>
  `<button type="${id === 'submitBtn' ? 'submit' : 'button'}" id="${id}" class="w-full ${extra} py-3.5 px-4 rounded-xl text-white font-extrabold transition-all duration-200 flex items-center justify-center gap-1 shadow-[0_0_28px_rgba(56,163,184,0.35)] hover:opacity-90 hover:scale-[1.01]" style="background:${CTA_GRADIENT}">
    <span class="flex flex-col items-center leading-tight">
      <span class="text-base sm:text-lg md:text-xl tracking-wide">${id === 'bottomCta' ? 'START THE TEST' : 'BOOK MY CALL'}</span>
      <span class="text-xs sm:text-sm font-semibold opacity-90">WORKSHOP STARTING 8PM EST TONIGHT</span>
    </span>${CHEVRON}
  </button>`;

const countdownBlock = (prefix) => `
  <div class="w-full rounded-2xl border border-[#2a6b85]/60 bg-black/30 px-3 py-4 sm:px-5 text-center">
    <p class="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#9fe4f0] sm:text-sm">Next live training starts in</p>
    <div class="flex justify-center gap-3 sm:gap-4">
      ${['hours', 'minutes', 'seconds']
        .map(
          (unit) => `<div class="flex w-[92px] flex-col items-center bg-gray-100 rounded-lg px-4 py-2 sm:w-[116px] sm:px-6 sm:py-3">
        <span class="tabular-nums text-3xl sm:text-4xl font-bold text-black" data-cd="${prefix}-${unit}">00</span>
        <span class="mt-1 text-[10px] sm:text-xs uppercase text-gray-600">${unit}</span>
      </div>`,
        )
        .join('')}
    </div>
  </div>`;

const PREVIEW_BADGE = `
<div style="position:fixed;left:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:7px;padding:6px 11px;border-radius:9999px;border:1px solid rgba(159,228,240,.35);background:rgba(7,16,19,.92);backdrop-filter:blur(6px);font:600 11px/1.2 Inter,system-ui,sans-serif;color:#9fe4f0;letter-spacing:.04em;">
  <span style="width:7px;height:7px;border-radius:9999px;background:#38a3b8;flex:none;"></span>
  PREVIEW BUILD — NOT THE LIVE SITE
</div>`;

const PRIVACY = `<p class="text-center text-sm text-gray-500">🔒 We respect your privacy. No spam, ever.</p>`;

const QUIZ = [
  {
    id: 'occupation',
    title: 'Which of the following describes you best?',
    description: 'The reason we are asking is so we can best help you accomplish your goals.',
    options: [
      ['A', "I'm a corporate executive, director or manager"],
      ['B', 'I work in a corporate but in a non-managerial role'],
      ['C', "I work a 9-5 job, but it's not corporate"],
      ['D', "I'm a business owner"],
      ['E', "I'm unemployed"],
    ],
  },
  {
    id: 'current-income',
    title: 'How much are you currently earning per month?',
    description: 'This tells us which starting point of the system actually applies to you.',
    options: [
      ['A', 'Less than $2,000'],
      ['B', '$2,000 – $5,000'],
      ['C', '$5,000 – $10,000'],
      ['D', '$10,000 – $25,000'],
      ['E', '$25,000+'],
    ],
  },
  {
    id: 'goal',
    title: 'What are you looking to achieve in the next 12 months?',
    description: 'So we can show you the path that fits the outcome you actually want.',
    options: [
      ['A', 'A first $1,000 – $5,000 per month on the side'],
      ['B', 'Replace my full-time income'],
      ['C', 'Scale past $10,000 per month'],
      ['D', 'Build a business I could sell'],
      ['E', 'Complete financial freedom'],
    ],
  },
  {
    id: 'investment',
    title: 'How much do you have available to invest in yourself and the tools to make it happen?',
    description: 'Covers AI tools, software and coaching — we only recommend what fits your range.',
    options: [
      ['A', 'Under $500'],
      ['B', '$500 – $1,000'],
      ['C', '$1,000 – $3,000'],
      ['D', '$3,000 – $5,000'],
      ['E', '$5,000+'],
    ],
  },
];

async function main() {
  const avatars = await Promise.all(
    ['avatar9.avif', 'avatar10.avif', 'avatar11.avif'].map((f) =>
      dataUri(`images/${f}`, 'image/avif'),
    ),
  );
  const badge = await dataUri('images/aia-assets/charity-badge.avif', 'image/avif');
  const playIcon = await dataUri('images/aia-assets/play-icon.svg', 'image/svg+xml');
  const logo = await dataUri('images/new-logo.png', 'image/png');
  const wins = await Promise.all(
    SUCCESS_WIN_SLUGS.map((slug) => dataUri(`images/success-wins/${slug}.png`, 'image/png')),
  );

  const stepper = ['Test', 'Your Details', 'Book a call']
    .map(
      (label, i) => `
      <div data-step-cell="${i + 1}" class="relative flex min-h-16 flex-col items-center justify-center border-r border-[#2a6b85]/40 px-1.5 py-2 text-center last:border-r-0 sm:min-h-24 sm:px-4 sm:py-3">
        <span data-step-num class="mb-1 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black sm:h-8 sm:w-8 sm:text-sm">${i + 1}</span>
        <span data-step-label class="text-[9px] font-black uppercase leading-tight tracking-wide sm:text-sm">${label}</span>
      </div>`,
    )
    .join('');


  const head = ARTIFACT
    ? `<title>AI Acquisition Workshop</title>`
    : `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Acquisition — Workshop (local preview)</title>`;

  const html = `${head}
<style>/*__TAILWIND__*/</style>
<style>/*__FONT__*/</style>
<style>
  body { background:#000; color:#fff; font-family:Inter,ui-sans-serif,system-ui,sans-serif; margin:0; -webkit-font-smoothing:antialiased; }
  .gridsq { animation: sqfade var(--dur) ease-in-out var(--delay) infinite alternate; }
  @keyframes sqfade { from { opacity:0 } to { opacity:.05 } }
  /* Smart-autoplay overlay: 1920x1080 stage coordinates expressed as
     percentages, with cqw carrying the type and radius proportions. */
  @keyframes vsl-pulse { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
  .vsl-frame { container-type: inline-size; }
  .vsl-pulse { animation: vsl-pulse 1.3333333333333333s infinite; }
  .vsl-card { border-radius:1.6667cqw; border-width:0.0781cqw; }
  .vsl-label { font-size:2.7778cqw; }
  @media (prefers-reduced-motion: reduce) { .vsl-pulse { animation:none } }
  .tier { border-color: rgba(42,107,133,.4); background:#0b0f10; }
  .tier:hover { border-color:#2a6b85; }
  .tier[aria-pressed="true"] { border-color:#38a3b8; background:rgba(18,49,60,.85); box-shadow:0 0 28px rgba(56,163,184,.25); }
  .tier [data-radio] { border-color: rgba(255,255,255,.3); }
  .tier[aria-pressed="true"] [data-radio] { border-color:#9fe4f0; background:#38a3b8; }
  .tier[aria-pressed="true"] [data-radio]::after { content:""; width:7px; height:4px; border-left:2.5px solid #000; border-bottom:2.5px solid #000; transform:rotate(-45deg) translate(1px,-1px); }
  input[type=checkbox]{ appearance:none;-webkit-appearance:none; }
  input[type=checkbox]:checked{ background-image:url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%2338a3b8' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); background-size:100% 100%; background-repeat:no-repeat; }
</style>
${ARTIFACT ? '' : '</head>\n<body class="min-h-screen font-sans antialiased">'}
<div class="flex min-h-screen flex-col relative overflow-hidden">
  <main class="flex-1">
    <div class="min-h-screen flex flex-col bg-black">
      <svg aria-hidden="true" id="grid" class="pointer-events-none fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(750px_circle_at_center,white,transparent)] fixed inset-0 h-full w-full -z-10">
        <defs><pattern id="gp" width="40" height="40" patternUnits="userSpaceOnUse" x="-1" y="-1"><path d="M.5 40V.5H40" fill="none" stroke-dasharray="0"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#gp)"/>
        <svg x="-1" y="-1" class="overflow-visible" id="squares"></svg>
      </svg>

      <div class="mx-auto flex w-full max-w-5xl flex-col items-center px-4 sm:px-8 sm:py-16 lg:px-12 py-10">
        <div class="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[#2a6b85]/70 bg-[#071013]/95 px-3 py-1.5 shadow-sm sm:px-4 sm:py-2">
          <div class="flex shrink-0 -space-x-1.5">
            ${avatars.map((src, i) => `<div class="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-black sm:h-8 sm:w-8" style="z-index:${3 - i}"><img alt="" width="32" height="32" class="h-full w-full object-cover" src="${src}"></div>`).join('')}
          </div>
          <p class="text-left text-xs font-bold text-[#9fe4f0] sm:text-sm">3,478 beginners registered this week</p>
        </div>

        <h1 class="mb-4 text-balance text-center text-xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">How Beginners Are Making $18,105 Per Month In Recurring Income (on average) Using AI In 2026</h1>

        <div class="mb-8 w-full max-w-3xl">
          <div class="vsl-frame relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2a6b85]/70 bg-[#071013] shadow-[0_0_40px_rgba(56,163,184,0.18)]">
            <div id="vslEmpty" class="absolute inset-0 hidden place-items-center">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/25 sm:text-xs">Video placeholder</p>
            </div>
            <button type="button" id="vslOverlay" aria-label="Click to listen" class="absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a3b8]">
              <span class="vsl-pulse absolute inset-0 block">
                <span class="vsl-card absolute block border-solid border-white bg-[rgba(16,136,188,0.75)]" style="left:32.361%;top:19.506%;width:35.278%;height:60.988%"></span>
                <span class="absolute block" style="left:39.931%;top:27.407%;width:20.139%;height:35.802%"><img alt="" class="h-full w-full" src="${playIcon}"></span>
                <span class="vsl-label absolute block text-center font-bold leading-tight text-white" style="left:32.361%;top:70.617%;width:35.278%">Click to listen</span>
              </span>
            </button>
          </div>
        </div>

        <div class="mb-10 mx-auto grid w-fit grid-cols-[auto_auto] justify-items-start gap-x-5 gap-y-2 sm:mx-0 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-6">
          ${BENEFITS.map((b) => `<span class="flex items-start gap-1.5 text-sm font-semibold text-white sm:items-center sm:text-base">${CHECK_ICON}${b}</span>`).join('')}
        </div>

        <div id="workshop-opt-in" class="w-full scroll-mt-4">
          <div class="mx-auto mb-6 max-w-2xl">
            <div class="grid w-full grid-cols-3 overflow-hidden rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/95">${stepper}</div>
          </div>

          <div class="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <!-- STEP 1 - test -->
          <section data-panel="1" class="w-full">
            <div class="w-full overflow-hidden rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 shadow-md">
              <div class="h-1 w-full bg-white/10"><div id="quizBar" class="h-full bg-[#38a3b8] transition-[width] duration-300 ease-out" style="width:0%"></div></div>
              <div class="p-6 sm:p-8">
                <div class="mb-4 flex items-center gap-2">
                  <span id="quizNum" class="flex h-6 w-6 items-center justify-center rounded-md bg-[#38a3b8] text-xs font-black text-black">1</span>
                  <span id="quizCount" class="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 sm:text-xs"></span>
                </div>
                <h2 id="quizTitle" class="text-balance text-lg font-extrabold leading-snug text-white sm:text-2xl"></h2>
                <p id="quizDesc" class="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm"></p>
                <div id="quizOptions" role="radiogroup" class="mt-5 flex flex-col gap-2.5"></div>
                <div class="mt-5">
                  <button type="button" id="quizBack" class="hidden text-xs font-medium text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline sm:text-sm">Back</button>
                </div>
              </div>
            </div>
          </section>

          <!-- STEP 2 - your details -->
          <section data-panel="2" class="w-full hidden">
            <div class="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
              <h2 class="mb-6 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">CLAIM YOUR FREE SPOT NOW</h2>
              <form id="optin" class="flex w-full flex-col gap-3">
                <input id="fullName" required type="text" placeholder="Your Full Name Here..." class="w-full px-3 py-3 rounded-xl border-2 border-[#2a6b85]/30 bg-[#0b0f10] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38a3b8] focus:border-[#38a3b8]">
                <div class="relative">
                  <input id="email" required type="email" placeholder="Your Email Address Here...*" class="w-full py-3 pl-3 pr-11 rounded-xl border-2 border-[#2a6b85]/30 bg-[#0b0f10] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38a3b8] focus:border-[#38a3b8]">${MAIL_ICON}
                </div>
                <div class="relative">
                  <span class="pointer-events-none absolute left-0 top-0 bottom-0 flex w-10 items-center justify-center rounded-l-md border border-r-0 border-[#2a6b85] bg-[#0b0f10]">${US_FLAG}</span>
                  <input id="phone" required type="tel" value="+1" placeholder="Phone Number" class="w-full px-4 py-3 pl-12 rounded-md border border-[#2a6b85] bg-[#0b0f10] text-white font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#38a3b8] focus:border-[#38a3b8]">
                </div>
                <div class="flex items-start gap-3 py-1">
                  <input id="receiveGiftTop" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-[#38a3b8] bg-[#0b0f10] focus:ring-[#38a3b8] focus:ring-2">
                  <label for="receiveGiftTop" class="cursor-pointer text-xs font-medium leading-snug text-white/75 sm:text-sm">🎁 I don't want to share my phone and will miss out on a chance to win a MacBook, iPhone or $1000</label>
                </div>
                <p class="text-[9px] sm:text-[10px] text-gray-500 text-center leading-tight">By providing your phone number, you consent to receive SMS messages about joining the webinar. You may reply STOP at any time to unsubscribe.</p>
                ${ctaButton('submitBtn')}
                <div class="pt-2 text-center">
                  <p class="mx-auto max-w-md text-[10px] font-normal leading-relaxed sm:max-w-none sm:whitespace-nowrap sm:text-[11px] text-white/80">When you attend the event, we will ❤️ donate a meal to someone in need in your name.</p>
                  <img alt="Meal donation badge" width="220" height="110" class="mx-auto mt-2 h-auto w-28 sm:w-36" src="${badge}">
                </div>
                ${PRIVACY}
              </form>
            </div>
          </section>

          <!-- STEP 3 - book a call -->
          <section data-panel="3" class="w-full hidden">
            <div class="w-full rounded-2xl border border-[#2a6b85]/70 bg-[#071013]/85 p-6 sm:p-8 shadow-md">
              <div class="mb-5 flex justify-center">
                <span class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#9fe4f0] bg-[#38a3b8] shadow-[0_0_28px_rgba(56,163,184,0.35)]">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="h-7 w-7 text-black"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </span>
              </div>
              <h2 class="mb-2 text-center text-sm font-bold tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">PICK YOUR CALL TIME</h2>
              <p class="mb-6 text-center text-xs text-white/60 sm:text-sm" id="callLine"></p>
              <div class="mb-3">
                <div class="overflow-hidden rounded-2xl border border-[#2a6b85]/60 bg-white shadow-[0_0_36px_rgba(56,163,184,0.18)]">
                  <iframe src="${BOOKING_URL}" title="Book your call" loading="lazy" class="block h-[680px] w-full border-0 sm:h-[600px]"></iframe>
                </div>
                <p class="mt-2.5 text-center text-[11px] text-white/40 sm:text-xs">Calendar not loading? <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" class="font-semibold text-[#9fe4f0] underline-offset-4 transition-colors hover:text-[#38a3b8] hover:underline">Open the booking page &#8599;</a></p>
              </div>
              <dl class="mb-5 grid gap-2 rounded-2xl border border-[#2a6b85]/60 bg-black/30 px-4 py-4 text-left" id="summary"></dl>
              <div class="mt-3">${PRIVACY}</div>
            </div>
          </section>
          </section>

            ${countdownBlock('cd')}
          </div>
        </div>

        <div class="w-full mt-16">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8 drop-shadow-lg">What People Are Saying</h2>
          <div class="columns-1 sm:columns-2 lg:columns-3 gap-4">
            ${wins.map((src, i) => `<div class="break-inside-avoid mb-4"><img alt="Client result ${i + 1}" width="400" height="300" loading="lazy" class="w-full rounded-lg shadow-md" src="${src}"></div>`).join('')}
          </div>
          <div class="flex justify-center mt-8">${ctaButton('bottomCta', 'max-w-2xl')}</div>
        </div>
      </div>
    </div>
  </main>

  <section id="footer" class="bg-black text-center px-4 py-8 text-xs">
    <div class="container mx-auto max-w-4xl space-y-6">
      <div class="flex justify-center"><img alt="AI Acquisition LLC Logo" width="48" height="48" class="opacity-50" src="${logo}"></div>
      <p class="text-neutral-400">AI Acquisition and all individuals affiliated with this organization assumes no responsibility for the outcome, result, or success of the services, and does not guarantee specific results or outcome. Success depends in part on the time you devote, and your implementation of the guidance, strategies and support received. The strategies, content, articles and all other features are for educational purposes only.</p>
      <p class="text-neutral-400">Though our services and products are tailored for our clients, we cannot give any guarantees or warranties (either express or implied), about results or earning money with the ideas, information, tools and strategies set out in the services. Any testimonials provided are of real-life individuals and businesses and their own personal and individual experiences. These must not be taken as "typical" results and will not be specific to your particular circumstances or actions you choose to take following receipt of the services and products.</p>
      <p class="text-neutral-400">In a survey of over 660 businesses with over 100 responding, business owners averaged $18,105 in monthly revenue after implementing our system.</p>
      <p class="text-neutral-400">Also NOT GOOGLE or FACEBOOK: This site is not a part of the Google website, Google Inc, Facebook/Meta website, or Meta, Inc. Additionally, This site is NOT endorsed by Google or Meta in any way.</p>
      <div class="flex justify-center space-x-8">
        <a class="text-neutral-400 hover:text-[#38a3b8] transition-colors" href="https://www.aiacquisition.com/privacy-policy">Privacy Policy</a>
        <a class="text-neutral-400 hover:text-[#38a3b8] transition-colors" href="https://www.aiacquisition.com/terms-of-service">Terms of Service</a>
        <a class="text-neutral-400 hover:text-[#38a3b8] transition-colors" href="mailto:support@aiarbitrageagency.com">Contact Us</a>
      </div>
      <p class="text-neutral-400">© <span id="year"></span> AI Acquisition LLC. All rights reserved.</p>
    </div>
  </section>
</div>

<script>
(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- animated grid ------------------------------------------------------
  var squares = document.getElementById('squares');
  var cols = Math.ceil(window.innerWidth / 40), rows = Math.ceil(window.innerHeight / 40);
  var frag = document.createDocumentFragment();
  for (var i = 0; i < 200; i++) {
    var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('width', 39); r.setAttribute('height', 39);
    r.setAttribute('x', Math.floor(Math.random() * cols) * 40 + 1);
    r.setAttribute('y', Math.floor(Math.random() * rows) * 40 + 1);
    r.setAttribute('fill', 'currentColor'); r.setAttribute('stroke-width', 0);
    r.setAttribute('class', 'gridsq');
    r.style.setProperty('--dur', (3 + Math.random() * 2).toFixed(2) + 's');
    r.style.setProperty('--delay', (Math.random() * 6).toFixed(2) + 's');
    frag.appendChild(r);
  }
  squares.appendChild(frag);

  // ---- countdown to the next 8PM America/New_York -------------------------
  var fmt = new Intl.DateTimeFormat('en-US', { timeZone:'America/New_York', hour12:false,
    year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
  function parts(d){ var o={}; fmt.formatToParts(d).forEach(function(p){ if(p.type!=='literal') o[p.type]=+p.value; }); o.hour%=24; return o; }
  function offset(d){ var p=parts(d); return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-d.getTime(); }
  function target(now){
    var p=parts(now), wall=Date.UTC(p.year,p.month-1,p.day+(p.hour>=20?1:0),20,0,0);
    var utc=wall-offset(now); return wall-offset(new Date(utc));
  }
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    var now=new Date(), s=Math.max(0, Math.floor((target(now)-now.getTime())/1000));
    var v={ hours:Math.floor(s/3600), minutes:Math.floor(s%3600/60), seconds:s%60 };
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
      c.classList.toggle('bg-[#12313c]/85', active);
      var num = c.querySelector('[data-step-num]'), lab = c.querySelector('[data-step-label]');
      num.className = 'mb-1 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black sm:h-8 sm:w-8 sm:text-sm ' +
        (on ? 'border-[#9fe4f0] bg-[#38a3b8] text-black' : 'border-white/25 text-white/45');
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
    document.getElementById('quizCount').textContent = 'Question ' + (state.qi + 1) + ' of ' + QUIZ.length;
    document.getElementById('quizTitle').innerHTML =
      q.title + '<span class="ml-1 text-[#38a3b8]" aria-label="This question is required.">*</span>';
    document.getElementById('quizDesc').textContent = q.description;
    document.getElementById('quizBar').style.width =
      (((state.qi + (chosen ? 1 : 0)) / QUIZ.length) * 100) + '%';

    document.getElementById('quizOptions').innerHTML = q.options.map(function(o){
      var on = chosen === o[0];
      return '<button type="button" role="radio" aria-checked="' + on + '" data-key="' + o[0] + '" ' +
        'class="flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a3b8] ' +
        (on ? 'border-[#38a3b8] bg-[#12313c]/85 shadow-[0_0_20px_rgba(56,163,184,0.2)]' : 'border-[#2a6b85]/40 bg-[#111c21] hover:border-[#2a6b85] hover:bg-[#16242a]') + '">' +
        '<span aria-hidden="true" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-black ' +
        (on ? 'border-[#9fe4f0] bg-[#38a3b8] text-black' : 'border-white/20 text-white/50') + '">' + o[0] + '</span>' +
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
    phone.required = !e.target.checked;
    phone.disabled = e.target.checked;
    phone.classList.toggle('opacity-40', e.target.checked);
  });

  document.getElementById('optin').addEventListener('submit', function(e){
    e.preventDefault();
    var declined = document.getElementById('receiveGiftTop').checked;
    state.lead = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: declined ? '' : document.getElementById('phone').value,
      declined: declined
    };

    // ---- step 3: book a call ----
    var first = state.lead.fullName.split(' ')[0];
    var goalQ = QUIZ.filter(function(q){ return q.id === 'goal'; })[0];
    var goal = goalQ.options.filter(function(o){ return o[0] === state.answers['goal']; })[0];
    document.getElementById('callLine').textContent =
      (first ? "You're in, " + first + '. ' : "You're in. ") +
      "Pick a slot below and we'll map out your first 90 days.";

    var rows = [];
    if (goal) rows.push(['Goal', goal[1]]);
    rows.push(['Email', state.lead.email]);
    if (!state.lead.declined) rows.push(['Phone', state.lead.phone]);
    rows.push(['Workshop', '8:00 PM EST tonight']);
    document.getElementById('summary').innerHTML = rows.map(function(r){
      return '<div class="flex items-start justify-between gap-3">' +
        '<dt class="text-[10px] font-black uppercase tracking-[0.18em] text-[#9fe4f0] sm:text-xs">' + r[0] + '</dt>' +
        '<dd class="break-all text-xs font-semibold text-white sm:text-sm">' + r[1] + '</dd></div>';
    }).join('');

    goto(3);
  });

  var vsl = document.getElementById('vslOverlay');
  if (vsl) vsl.addEventListener('click', function(){
    vsl.remove();
    var empty = document.getElementById('vslEmpty');
    if (empty) { empty.classList.remove('hidden'); empty.classList.add('grid'); }
  });

  document.getElementById('bottomCta').addEventListener('click', function(){
    document.getElementById('workshop-opt-in').scrollIntoView({ behavior:'smooth', block:'start' });
  });

  render();
})();
</script>
${ARTIFACT ? PREVIEW_BADGE : ''}
${ARTIFACT ? '' : '</body>\n</html>'}`;

  const out = path.join(ROOT, 'preview', ARTIFACT ? 'workshop-v-test.artifact.html' : 'workshop-v-test.html');
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
  theme: { extend: { fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] } } },
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
  const interWoff2 = await readFile(path.join(ROOT, INTER_WOFF2));
  const fontCss = `@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${interWoff2.toString('base64')}) format('woff2');}`;

  const final = html
    .replace('/*__TAILWIND__*/', css)
    .replace('/*__FONT__*/', fontCss);

  await writeFile(out, final);
  await Promise.all([tmpConfig, tmpIn, tmpOut].map((f) => rm(f, { force: true })));

  console.log('Wrote', out, (final.length / 1024 / 1024).toFixed(2), 'MB (self-contained)');
}

main().catch((e) => { console.error(e); process.exit(1); });
