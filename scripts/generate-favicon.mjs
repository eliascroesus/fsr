/**
 * Generates the FSR favicon set from one vector source.
 *
 * The wordmark is drawn as rectangles and a polygon rather than as <text>, so
 * it rasterises identically on any machine — text would depend on whichever
 * fonts happen to be installed where this runs.
 *
 * Run: node scripts/generate-favicon.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

/** Brand gradient, same stops as `.headline-accent`, run on the diagonal. */
const LIGHT = '#a8f76b';
const GREEN = '#4fd12f';
/** The page's darkest ink, so the letters match the CTA button's text. */
const INK = '#0a0c0d';

/*
 * 512 canvas, wordmark spanning 64..448 on a 36 stem — heavy enough to hold at
 * 16px. Drawn as strokes rather than filled rectangles so the S gets real
 * curves and the R a proper bowl and leg, in keeping with Geist on the page;
 * butt caps keep the terminals flat the way a geometric sans cuts them.
 */
const MARK = `
  <path d="M82,178 V334"/>
  <path d="M64,196 H176"/>
  <path d="M64,256 H162"/>

  <path d="M291,214 C291,202 277,196 256,196 C232,196 219,205 219,221
           C219,237 234,247 258,252 C282,257 294,266 294,282
           C294,300 277,316 256,316 C234,316 220,307 219,295"/>

  <path d="M354,178 V334"/>
  <path d="M354,196 H396 C420,196 430,208 430,226 C430,244 420,256 396,256 H354"/>
  <path d="M390,256 L430,334"/>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${LIGHT}"/>
      <stop offset="1" stop-color="${GREEN}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <g fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="butt"
     stroke-linejoin="round">${MARK}</g>
</svg>
`;

/**
 * ICO directory wrapping PNG payloads. Every browser that matters reads
 * PNG-in-ICO, and it keeps the file a fraction of the BMP equivalent's size.
 */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0); // 0 encodes 256
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const png = (size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

const icoSizes = [16, 32, 48];
const ico = buildIco(
  await Promise.all(icoSizes.map(async (size) => ({ size, data: await png(size) }))),
);

await fs.mkdir(PUBLIC, { recursive: true });
await fs.writeFile(path.join(PUBLIC, 'favicon.ico'), ico);
await fs.writeFile(path.join(PUBLIC, 'favicon.svg'), svg);
await fs.writeFile(path.join(PUBLIC, 'icon-192.png'), await png(192));
await fs.writeFile(path.join(PUBLIC, 'icon-512.png'), await png(512));
await fs.writeFile(path.join(PUBLIC, 'apple-touch-icon.png'), await png(180));

console.log('favicon.ico', ico.length, 'bytes —', icoSizes.join('/'));
console.log('plus favicon.svg, icon-192.png, icon-512.png, apple-touch-icon.png');
