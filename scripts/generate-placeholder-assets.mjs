/**
 * Generates stand-in artwork at every image path the page references.
 *
 * The real assets were not reachable from the build environment, so these
 * placeholders exist purely to keep layout, aspect ratios and the next/image
 * srcSet identical. Drop the production files over the top — same paths, same
 * dimensions — and nothing else has to change.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import { SUCCESS_WIN_SLUGS } from './success-win-slugs.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMAGES = path.join(ROOT, 'public', 'images');

const INK = '#071013';
const LINE = '#2a6b85';
const ACCENT = '#38a3b8';
const LIGHT = '#9fe4f0';

const svg = (markup) => Buffer.from(markup);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/** Circular avatar with initials on a brand-tinted disc. */
function avatarSvg(size, label, hue) {
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue} 45% 32%)"/>
      <stop offset="100%" stop-color="hsl(${hue} 55% 18%)"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.17}" fill="${LIGHT}" opacity="0.85"/>
  <ellipse cx="${size / 2}" cy="${size * 0.92}" rx="${size * 0.29}" ry="${size * 0.26}" fill="${LIGHT}" opacity="0.85"/>
  <text x="50%" y="${size * 0.42}" text-anchor="middle" font-family="sans-serif"
        font-size="${size * 0.16}" font-weight="700" fill="${INK}">${esc(label)}</text>
</svg>`);
}

/** 220x110 charity badge lockup. */
function charityBadgeSvg() {
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="220">
  <rect width="440" height="220" rx="18" fill="${INK}" stroke="${LINE}" stroke-width="4"/>
  <text x="50%" y="76" text-anchor="middle" font-family="sans-serif" font-size="34"
        font-weight="800" fill="${LIGHT}">1 MEAL</text>
  <text x="50%" y="118" text-anchor="middle" font-family="sans-serif" font-size="24"
        font-weight="600" fill="#ffffff">DONATED</text>
  <text x="50%" y="160" text-anchor="middle" font-family="sans-serif" font-size="19"
        fill="${ACCENT}">on your behalf</text>
</svg>`);
}

/** Square mark used in the footer at 48x48. */
function logoSvg(size) {
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${INK}" stroke="${ACCENT}" stroke-width="${size * 0.05}"/>
  <text x="50%" y="${size * 0.66}" text-anchor="middle" font-family="sans-serif"
        font-size="${size * 0.42}" font-weight="800" fill="${LIGHT}">AI</text>
</svg>`);
}

/**
 * 400x300 stand-in for a testimonial screenshot. Rows of varying width read as
 * a chat bubble at thumbnail size, so the masonry keeps its real texture.
 */
function winSvg(index, slug) {
  const name = slug
    .replace(/^win-\d+-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const rows = [0.82, 0.66, 0.74, 0.45]
    .map(
      (w, i) =>
        `<rect x="24" y="${146 + i * 26}" width="${Math.round(352 * w)}" height="13" rx="6" fill="#ffffff" opacity="${0.22 - i * 0.03}"/>`,
    )
    .join('');

  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
  <rect width="400" height="300" fill="${INK}"/>
  <rect x="1.5" y="1.5" width="397" height="297" rx="10" fill="none" stroke="${LINE}" stroke-width="3"/>
  <circle cx="46" cy="52" r="20" fill="${ACCENT}" opacity="0.85"/>
  <text x="46" y="59" text-anchor="middle" font-family="sans-serif" font-size="18"
        font-weight="800" fill="${INK}">${esc(name.charAt(0))}</text>
  <text x="78" y="48" font-family="sans-serif" font-size="17" font-weight="700"
        fill="#ffffff">${esc(name)}</text>
  <text x="78" y="70" font-family="sans-serif" font-size="13" fill="${ACCENT}">client win #${index}</text>
  <rect x="24" y="98" width="352" height="30" rx="8" fill="${ACCENT}" opacity="0.16"/>
  <text x="38" y="118" font-family="sans-serif" font-size="15" font-weight="700"
        fill="${LIGHT}">placeholder screenshot</text>
  ${rows}
</svg>`);
}

/** ICO wrapper around a single embedded PNG frame. */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

async function main() {
  await ensureDir(IMAGES);
  await ensureDir(path.join(IMAGES, 'aia-assets'));
  await ensureDir(path.join(IMAGES, 'success-wins'));

  // Social-proof avatars (rendered at 32x32, sourced at 128 for 2x).
  const avatars = [
    { file: 'avatar9.avif', label: 'JR', hue: 196 },
    { file: 'avatar10.avif', label: 'MK', hue: 210 },
    { file: 'avatar11.avif', label: 'TS', hue: 184 },
  ];

  for (const { file, label, hue } of avatars) {
    await sharp(avatarSvg(128, label, hue)).avif({ quality: 60 }).toFile(path.join(IMAGES, file));
  }

  await sharp(charityBadgeSvg())
    .avif({ quality: 60 })
    .toFile(path.join(IMAGES, 'aia-assets', 'charity-badge.avif'));

  await sharp(logoSvg(96)).png().toFile(path.join(IMAGES, 'new-logo.png'));

  for (const [i, slug] of SUCCESS_WIN_SLUGS.entries()) {
    await sharp(winSvg(i + 1, slug))
      .png({ compressionLevel: 9 })
      .toFile(path.join(IMAGES, 'success-wins', `${slug}.png`));
  }

  const faviconPng = await sharp(logoSvg(64)).resize(64, 64).png().toBuffer();
  await writeFile(path.join(ROOT, 'public', 'favicon.ico'), icoFromPng(faviconPng, 64));

  console.log(
    `Generated ${avatars.length} avatars, charity badge, logo, favicon and ${SUCCESS_WIN_SLUGS.length} success wins.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
