# onehublabs.com

**The personal site of Petros Pikionis: services, projects, story and blog, in English, Greek and
German.** A static Astro site with hand-built motion, a content panel that needs no server, and
live PageSpeed results for every project it shows.

Live at [onehublabs.com](https://onehublabs.com).

## Contents
- [What is on it](#what-is-on-it)
- [Engineering highlights](#engineering-highlights)
- [Stack](#stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Deploys](#deploys)
- [Author](#author)

## What is on it

| Page | What it does |
|---|---|
| `/` | A ten-second intro film, the hero, and the services as stacked sheets that each carry their real projects |
| `/services` | Written for someone who does not know the technical name of what they need: four services, how the work goes, timelines, questions as a chat, and a form |
| `/projects` | Every project with its story, its live site in a frame, and its measured PageSpeed scores |
| `/about` | "My story": ten illustrated scenes and three scroll-driven chapters, then a terrain built from my GitHub activity |
| `/blog`, `/contact`, `/privacy` | Posts in Markdown, a brief form with file upload, and the privacy page |
| `/admin` | The content panel |

## Engineering highlights

**Three languages, each its own build.** Every word lives in `src/text/*.json` as
`{ en, el, de }`. Each language is built separately, and the build keeps only its own language of
each word, so a page never ships the other two. Pages declare `hreflang` for every language, and a
script (`scripts/check-words.mjs`) lists any text on a page that is not in the text files.

**A content panel with no backend.** `/admin` edits texts, projects, posts and translations by
talking to GitHub's API directly from the browser with a fine-grained token. A save is one commit
to `main`, refused if someone else changed the same file meanwhile, and the save bar follows the
deploy until the change is live. Images are resized and converted to WebP in the browser.

**Performance measured, not assumed.** `scripts/pagespeed.mjs` runs PageSpeed Insights for every
live project on a phone and a desktop, taking the median of five runs because single runs vary a
lot. The deploy runs it daily. A project's scores are shown on `/projects` only while every one of
them is green; otherwise none are shown, and never a number other than the one measured.

**Motion that does not cost the first paint.** The intro film is a function of time drawn on one
canvas, with no animation library. Everything else is set up in small tasks after the first
picture, sections below the fold are set up only as they come near, and the WebGL ink title is
compiled off the main thread and skipped on devices without a graphics chip. All of it respects
`prefers-reduced-motion`: every drawing is authored in its final state and rests there.

**Scroll-driven storytelling.** The story on `/about` is built from single-line SVG illustrations
that draw themselves, with three chapters where the scroll drives a whole scene: a sunrise over one
horizon, a split-flap departures board, and a watch movement whose gears mesh and turn together.

**Consent before anything loads.** No analytics or ad tag is requested before the visitor agrees.
Tag ids come from the build environment, and a missing id simply leaves that tag, and if there are
none the banner itself, out of the site.

**Readable by machines.** `llms.txt`, `sitemap.xml` and `robots.txt` are generated from the same
data as the pages, and the pages carry a JSON-LD graph (Person, ProfessionalService, WebSite).

## Stack

- **Astro 5**, static output, TypeScript
- **GSAP** with ScrollTrigger for scroll-driven motion; Canvas 2D and WebGL for the intro, the ink
  title, the living backgrounds and the GitHub terrain
- **Markdown content collections** for projects and posts
- **GitHub Pages**, deployed by GitHub Actions
- Three runtime dependencies: `astro`, `gsap` and one font package

## Repository layout

```
src/text/          every word of the site, as { en, el, de }
src/content/       projects and blog posts in Markdown, with translations beside them
src/data/          types and code around the text files, languages, tracking
src/components/    Astro components and the line drawings
src/scripts/       motion, the story, the chapters, the forms, the admin panel
src/pages/         the pages, plus generated llms.txt, sitemap.xml and robots.txt
scripts/           build per language, PageSpeed, GitHub calendar, brand assets, thumbnails
```

`CLAUDE.md` is the detailed map of the codebase.

## Getting started

Requirements: Node 24.

```bash
npm install
npm run dev                    # http://localhost:4321
PUBLIC_LANG=el npm run dev     # the Greek site, at /el/
npm run build                  # every language, in dist/, dist/el/ and dist/de/
node scripts/check-words.mjs   # text on the pages that is not in src/text
```

Optional: `npm run pagespeed` measures the live projects and needs `PSI_KEY`, a Google API key with
the PageSpeed Insights API enabled, in `.env`.

## Deploys

GitHub Actions builds and publishes the site on every push to `main`, and once a day so the
PageSpeed results and the GitHub terrain stay current. The admin panel commits straight to `main`,
so pull before working: `git pull --rebase origin main`.

## Author

Built by **Petros Pikionis**, AI Product Engineer.
[onehublabs.com](https://onehublabs.com) ·
[LinkedIn](https://www.linkedin.com/in/petros-platon-pikionis-4045a782/)
