// What a link to the site shows when it is shared (Base.astro names both in every page's head):
//   public/og.png   the share card, 1200 × 630, on the hero's dark ground: the header's lockup, the motto in
//                   capitals as the intro says it, the name and role, the address, and the portrait
//   public/og.mp4   the same card arriving (about six seconds), for the few places that play og:video
//                   (most show the picture: LinkedIn, WhatsApp, Facebook, X, iMessage)
//
//   npm run share              the picture
//   npm run share -- --video   the picture and the video (needs ffmpeg on the PATH; about a minute)
//
// One page makes both. Every part is written as it ends; its keyframes only say where it comes from, and the
// video is that page stopped at each frame's moment (`animation-play-state: paused`, the delay moved back by t).
// Every word comes from src/text/site.json. The pictures are taken by a Chromium browser on this machine
// (CHROME_PATH, or Chrome or Edge where they install). `npm run brand` runs the picture after a logo change.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { symbolBox as S, wordBox as W, parts, letters } from '../src/data/logo.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/text/site.json'), 'utf8'));
// the hero's ground and the header's colours there (global.css `:root`), the arc in the logo's cobalt
const C = { night: '#0a0b0a', fg: '#f4f6f2', muted: '#8f948b', accent: '#4d7cff', accentInk: '#7a9bff', ivory: '#f8f4e6', cobalt: '#2d49ad' };
const WIDTH = 1200, HEIGHT = 630, FPS = 25, SETTLED = 3.6, LENGTH = 6;
const r1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// the header's lockup: the symbol 44 wide, a gap of 10, the wordmark 80 wide, centred beside it (as in brand.mjs)
const k = S.w / 44, wk = (80 * k) / W.w, wTop = (S.h - W.h * wk) / 2, hW = S.w + 10 * k + W.w * wk;
const lockup =
  `<svg class="logo a" style="--d:.15s" viewBox="0 0 ${r1(hW)} ${S.h}" role="img" aria-label="onehub">` +
  `<path fill="${C.cobalt}" d="${parts.arc}"/><g fill="${C.ivory}"><path d="${parts.top}"/><path d="${parts.left}"/><path d="${parts.right}"/></g>` +
  `<g transform="translate(${r1(S.w + 10 * k)} ${r1(wTop)}) scale(${wk.toFixed(5)})" fill="${C.ivory}" fill-rule="evenodd">${letters.map((l) => `<path d="${l.d}"/>`).join('')}</g></svg>`;

const font = (weight) =>
  pathToFileURL(path.join(root, `node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-${weight}-normal.woff2`)).href;
// the motto's sentences, one to a line, the last in the accent: "Design. Build. Automate. Scale fast."
const words = site.brand.motto.en.match(/[^.]+\./g).map((w) => w.trim());
const address = 'onehublabs.com';

// t = null: the card as it ends (og.png); a number: the card at that second of its arrival (a frame of og.mp4)
function card(t) {
  const moving = t !== null;
  const lines = words.map((w, i) =>
    `<span class="a${i === words.length - 1 ? ' last' : ''}" style="--d:${(0.55 + i * 0.38).toFixed(2)}s">${esc(w)}</span>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: SG; font-weight: 400; src: url(${font(400)}) format('woff2'); }
@font-face { font-family: SG; font-weight: 500; src: url(${font(500)}) format('woff2'); }
@font-face { font-family: SG; font-weight: 700; src: url(${font(700)}) format('woff2'); }
html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${C.night}; color: ${C.fg}; font-family: SG, sans-serif; }
body { --t: ${moving ? t.toFixed(3) : 0}s; }
.logo, h1, .bar, .who, .at, .photo { position: absolute; margin: 0; }
.logo { left: 64px; top: 50px; height: 54px; }
h1 { left: 62px; top: 128px; font-size: 77px; line-height: 0.97; font-weight: 700; letter-spacing: -0.035em; text-transform: uppercase; }
h1 span { display: block; }
h1 .last { color: ${C.accent}; }
.bar { left: 64px; top: 452px; width: 64px; height: 5px; border-radius: 3px; background: ${C.accent}; transform-origin: left; }
.who { left: 64px; top: 478px; font-size: 27px; font-weight: 500; white-space: nowrap; }
.who b { font-weight: 400; color: ${C.muted}; }
.at { left: 64px; top: 546px; font-size: 20px; font-weight: 500; color: ${C.accentInk}; letter-spacing: 0.01em; }
.photo { right: 64px; top: 54px; width: 392px; height: 522px; border-radius: 26px; overflow: hidden; }
.photo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; }
@keyframes rise { from { opacity: 0; transform: translateY(34px); } }
@keyframes grow { from { transform: scaleX(0); } }
@keyframes wipe { from { clip-path: inset(100% 0 0 0 round 26px); } to { clip-path: inset(0 0 0 0 round 26px); } }
@keyframes settle { from { transform: scale(1.12); } }
${moving ? `
.a { animation: rise .7s cubic-bezier(.2,.7,.2,1) both paused; animation-delay: calc(var(--d) - var(--t)); }
.bar.a { animation-name: grow; animation-duration: .6s; }
.photo.a { animation-name: wipe; animation-duration: 1.1s; animation-timing-function: cubic-bezier(.6,0,.2,1); }
.photo img { animation: settle 2.2s cubic-bezier(.2,.7,.2,1) both paused; animation-delay: calc(.9s - var(--t)); }` : ''}
</style></head><body>
${lockup}
<h1>${lines}</h1>
<div class="bar a" style="--d:2.2s"></div>
<p class="who a" style="--d:2.4s">${esc(site.person.name.en)} <b>&nbsp;·&nbsp; ${esc(site.person.role.en)}</b></p>
<p class="at a" style="--d:2.7s">${esc(address)}</p>
<div class="photo a" style="--d:.9s"><img src="${pathToFileURL(path.join(root, 'public', site.person.photo)).href}" alt=""></div>
</body></html>`;
}

function browser() {
  const found = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].find((p) => p && fs.existsSync(p));
  if (!found) throw new Error('No Chromium browser found: set CHROME_PATH to one.');
  return found;
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ohl-share-'));
function shoot(html, out) {
  const page = path.join(tmp, 'page.html');
  fs.writeFileSync(page, html);
  execFileSync(browser(), [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${path.join(tmp, 'profile')}`,
    ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []), // a container's root user can't start the sandbox
    '--force-device-scale-factor=1', `--window-size=${WIDTH},${HEIGHT}`, '--virtual-time-budget=2000',
    `--screenshot=${out}`, pathToFileURL(page).href,
  ], { stdio: 'ignore' });
}

try {
  shoot(card(null), path.join(root, 'public/og.png'));
  console.log('public/og.png');

  if (process.argv.includes('--video')) {
    const frames = Math.round(SETTLED * FPS);
    for (let i = 0; i <= frames; i++) {
      shoot(card(i / FPS), path.join(tmp, `f${String(i).padStart(4, '0')}.png`));
      if (i % FPS === 0) console.log(`  frame ${i} of ${frames}`);
    }
    // the last frame is held to the film's length; yuv420p and faststart so every player starts it at once
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'),
      '-vf', `tpad=stop_mode=clone:stop_duration=${(LENGTH - SETTLED).toFixed(2)},format=yuv420p`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart', '-an',
      path.join(root, 'public/og.mp4')], { stdio: 'inherit' });
    console.log('public/og.mp4');
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
