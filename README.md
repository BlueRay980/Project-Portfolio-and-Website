# Project Portfolio and Website

Static portfolio site for Matthew Jordan, built with [Astro](https://astro.build) and served by GitHub Pages.

Live URL once Pages is enabled: **https://blueray980.github.io/Project-Portfolio-and-Website/**

The repo is a project repo rather than `BlueRay980.github.io`, so the site is served from a sub-path.
`astro.config.mjs` sets `site` and `base` to match. Every internal link goes through `src/lib/url.ts`,
so nothing breaks if the repo is ever renamed: change `base` in one place.

## Run it

Requires Node 22.12 or newer (Astro 7).

```bash
npm install
npm run dev      # http://localhost:4321/Project-Portfolio-and-Website
npm run build    # writes dist/
npm run preview  # serves dist/
```

## How the content is organised

Project pages are generated from typed data, not hand-written HTML. That is deliberate: the plan calls
for every project page to use the same six headings in the same order, and generating them from a
shared template is the only way that stays true as pages get added.

| Path | What it is |
| --- | --- |
| `src/data/projects.ts` | Every project, as structured data. This is the file to edit to add or change content. |
| `src/data/site.ts` | Name, degree, roles, contact links, resume link. Anything `null` is not rendered. |
| `src/pages/projects/[slug].astro` | The fixed project template: Problem, My role, Approach, Result, Known limitations, Tools. |
| `src/pages/index.astro` | Home. Features the first three published projects. |
| `src/pages/projects/index.astro` | Card grid with the Cooling / Systems Engineering filter. |
| `src/pages/about.astro` | First-person paragraph, tools table, certifications. |
| `src/assets/` | Photos and plots. Astro converts them to sized WebP at build time. |
| `public/figures/` | Vector figures, served as-is. Referenced by a site-root-relative string rather than an import. |

### Adding a project

Add an entry to the `projects` array in `src/data/projects.ts`. The `Project` interface lists every
field. `problem`, `myRole`, `approach`, `result`, and `limitations` are arrays of strings, one per
paragraph or bullet. Optional extras are `specs` (a two-column table), `code` (short excerpts),
`figures` (image plus alt text plus caption), and `callout` (a highlighted finding).

Set `draft: true` to keep an entry out of the build while it is still being written. Drafts never
reach `dist/`.

### Things that are deliberately switchable

`src/data/site.ts` holds the links that can be turned on and off without touching a page:

- `resumeUrl` points at `resume.pdf` in `public/`. Setting it to null pulls the Resume nav item and
  the home-page button and falls back to an "available on request" line, so there is never a dead link.
- `linkedin` is null, so no LinkedIn link renders. Set it to the profile URL to turn it on.
- Every project's `repo` is null, so no "Source repository" link renders.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and deploys to Pages. It needs
**Settings > Pages > Source** set to **GitHub Actions** once, by hand, before the first run.

## Content provenance

The pages reuse the voice, structure, and numbers from the engineering portfolio PDF. Cost figures,
part costs, and bill-of-materials detail are deliberately excluded from this site.
