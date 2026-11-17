/*
 * Waits for the page to be still: no finger on the screen and no scroll for a moment. A ScrollTrigger.refresh()
 * measures the page by scrolling it to the top and back. In the middle of a scroll on a phone that stopped the scroll
 * dead, and an iPhone, whose scroll runs ahead of what the page knows of it, was put back where the finger had been
 * a moment before. For half a second after a refresh the story's snap also snaps whatever the speed, which caught a
 * fling in the middle.
 */

/** How long the page has to go without a scroll to count as still, in ms. */
const QUIET = 160;

let fingers = 0;
let last = 0;
// watched from the start, so a finger already down when a refresh is asked for is known
const opts = { passive: true, capture: true };
addEventListener('touchstart', (e) => { fingers = e.touches.length; }, opts);
addEventListener('touchend', (e) => { fingers = e.touches.length; last = performance.now(); }, opts);
addEventListener('touchcancel', (e) => { fingers = e.touches.length; }, opts);
addEventListener('scroll', () => { last = performance.now(); }, opts);

const waiting = new Set<() => void>();
let timer = 0;
const check = () => {
  timer = 0;
  if (fingers || performance.now() - last < QUIET) { timer = window.setTimeout(check, 100); return; }
  const now = [...waiting];
  waiting.clear();
  now.forEach((fn) => fn());
};

/** Runs `fn` in a task of its own once the page is still; asked for again while it waits, it still runs once. */
export function whenStill(fn: () => void) {
  waiting.add(fn);
  if (!timer) timer = window.setTimeout(check, 0);
}
