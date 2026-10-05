# Handoff: what is done, what is not

Written 2026-10-05. This tracks the gap between the plan in `Portfolio_Website_Plan.pdf` and what is
actually in the repo, so nothing silently ships half finished.

## Built and verified

- Astro 7 site, builds clean, 8 pages, zero npm audit findings.
- Sub-path routing for a project repo (`/Project-Portfolio-and-Website/`), verified in the built HTML.
- Home, Projects (with a working Cooling / Systems Engineering filter), About, 404, and four project pages.
- Fixed six-heading project template, verified in the rendered page: Problem, My role, Approach,
  Result, Known limitations, Tools.
- Checked at 375 px wide: no horizontal page overflow, nav fits, cards stack.
- Every image carries real alt text written from looking at the image.
- No runtime JavaScript except the projects filter, which is progressive enhancement. With JS off,
  every card is visible.

## Published projects, against the plan roster

| # | Plan roster entry | Status |
| --- | --- | --- |
| 1 | Cooling duct for CR26 | Published. Full content from the portfolio PDF. |
| 2 | NTU radiator sizing and oil down-select | Published. Full content, including the correlation callout. |
| 3 | Aerodynamic design space against competition points | Published 2026-10-05. Retitled; see below. |
| 4 | One-at-a-time parameter sensitivity study | Published 2026-10-05. Scoped to the OAT study only; the spring rate grid is not part of it. |
| 5 | EV endurance power-limit study | Published. Full content from the portfolio PDF. |
| 6 | Vehicle speed Kalman filter | Published. Full content from the portfolio PDF. |
| 7 | Team tooling | Published 2026-10-05. |
| 8 | Torque maps, suspension, and the 14 DOF model in the lap simulation | Published. Added 2026-10-05, not on the original roster. |

Numbering follows the plan roster. **The whole roster is written as of 2026-10-05, so there are no
drafts left.** The `draft: true` flag and the filter behind it stay in `src/data/projects.ts`, because
the next page someone starts should be held out of the build the same way rather than shipped half
written.

Project 8 is new. It covers the engine map work, the suspension, and the 14 DOF transient model,
written from the 14DOF and Reforged QSS reference notes and from `OpenLap_Reforged_FULL.m` itself.
Both figures on it come from the quasi-steady run outputs, because no 14 DOF run has ever exported
plots. The correlation numbers quoted in Result are the 14 DOF model's and are text only, not
illustrated, which is deliberate: pairing them with a quasi-steady plot would misattribute them.

If a 14 DOF run is ever exported with plots, a log-against-simulation trace belongs on that page.

## Project 3 is retitled, and the plan's three numbers are not on it

The plan's roster entry was "CR27I scoring targets from OpenLAP sweep", headlined **CR26I scores 514
points, CR27I minimum 526.8, target 547.8**.

**Those three numbers could not be sourced and are therefore not on the page.** They appear in the plan
PDF and nowhere else: not in any sweep workbook, not in `02 - FSAE`, not anywhere on this machine. The
closest real figure is 510.89, the best total in the fast-autocross workbook, which is near 514 but is
a different quantity. Publishing a scoring target under your name without a source behind it is the one
thing a page like this cannot afford, so the page is built from what the workbooks actually contain.

If those three numbers came from somewhere real, point me at it and the page can carry them as targets
against the design space it already plots. Until then the page is titled for what it demonstrates.

What it is built from: `FSAE Sweep Results\Cl to Cd Point predictions past 5 years .xlsx` and
`... Fast Autox Slow Endurance.xlsx`. 357 grid points each, read directly. This also matches what
`02 - FSAE\Design Review.md` asks the design review to cover: "Show why chose specific Cl and Cd for
the car. Explain Design spaces."

## Project 7 and the cost constraint

Written to your instruction that cost stays vague. The page names no money figure, no supplier, no
part cost, and no bill-of-materials line counts. It describes the pipeline as carrying no cost data by
design, which is both true and the honest selling point.

Two things I deliberately left off that page:

- **The specific part names** that collided in the deduplication work. They are good illustrations and
  they are also a public list of this team's components, which is squarely inside what leadership
  approval covers.
- **The reason the publishing gate exists.** The source note records specific personal documents that
  reached a public page before the gate was built. That is a real incident involving real people, it
  reflects on the team rather than on the engineering, and putting it on a public portfolio to
  illustrate a lesson would repeat the original mistake. The page says the sites are public and
  unauthenticated and leaves it there.

## Decisions I made, flag any you want changed

- **Home features projects 1, 2, and 3**, which is what the plan asked for, now that 3 exists.
  Featuring is automatic: the first three published projects, in roster order.
- **Project 4 is scoped to the OAT study alone**, on Matthew's instruction 2026-10-05. The title drops
  the "14-DOF spring rate grid" half of the plan's roster entry, because that work is not written down
  anywhere. If the spring rate grid is ever written up it wants its own page rather than an edit here.
- **The chart on project 4 is drawn, not exported.** The sweep writes Excel workbooks and no plots at
  all, so the tornado chart is an inline SVG in `public/figures/oat-sensitivity.svg` built from the
  -50% and +50% rows of `Sensitivity_CR26I_293_41_.xlsx` (Michigan Endurance IC 2026, baseline
  129.2263 s). Every value on it was read out of that workbook, not retyped from a note. The caption
  says it was drawn from the output workbook so nobody mistakes it for a model export. Regenerate it
  by hand if the sweep is re-run; there is no build step that keeps it in sync.
- **The chart on project 3 is also drawn, not exported**, from the two Cl-against-Cd workbooks. Each
  panel carries its own colour scale, because a shared scale washed the first panel out to the point of
  being unreadable; the caption says so, so nobody compares the two panels by shade. The circled optima
  and the quoted numbers are the comparable things.
- **Project 7 has no figure.** The wiki agent and the taxonomy pipeline produce pages and logs, not
  plots, and a schematic I drew of a pipeline I did not diagram originally would be decoration rather
  than evidence. Its card falls back to the title placeholder, same as the Kalman filter page.
- **matplotlib is not installed on the build machine**, which is why the chart is hand-written SVG
  rather than a generated PNG. That turned out better: it stays sharp at any size and costs 7 kB.
- **Resume is a nav link straight to the PDF, not a wrapper page**, matching "direct PDF link, not an
  embedded viewer". Right now `resumeUrl` is null so the link is hidden entirely and the home page
  reads "Resume available on request" instead of shipping a dead link.
- **No phone number and no street address on the site.** The checklist only names the street address,
  but a phone number on a public page collects spam. The portfolio PDF still carries both; this is a
  site-only choice. Say if you want the phone back.
- **Fan brand name dropped.** The source PDF names the fan manufacturer. The site says "twin puller
  fans". This follows your instruction to leave parts vague.
- **FAA Part 107 moved out of the tools table** into its own Certifications section, so it does not
  appear twice on the About page. The three remaining table rows are verbatim from the PDF.
- **Project 6 is the Kalman filter only.** The source PDF groups it with the engine fuel flow model.
  The plan roster lists only the filter, so the engine model and its fuel map plot are not on the site.
  That plot is good evidence and would carry its own page if you want one.
- **"Kalman filter" everywhere, not EKF.** The plan asked for a single label. The filter is linear, so
  KF is the correct one.
- **Astro 7, not 5.** Astro 5 carries a critical advisory set including a base-path stripping bug that
  would land directly on this site's sub-path setup. The workflow pins Node 22, which Astro 7 requires.

## The resume

`OneDrive/Desktop/Resume/Matthew Jordan Resume .pdf` was supplied on 2026-10-05 and is published at
`public/resume.pdf`, served at `/Project-Portfolio-and-Website/resume.pdf`. Its content also feeds the
About page: education, GPA, Dean's List, the honor societies, the expanded tools table, the UAV work
and the ELDS treasurer role.

Published as-is on Matthew's instruction, 2026-10-05, including the phone number and the city, state
and ZIP it carries. There is no street address on it, so the plan's checklist item is satisfied as
written. Worth knowing: a phone number on a public page gets scraped, and replacing the file later
does not un-index what was already crawled.

**One thing is still inconsistent and it is visible to a recruiter.** The resume says "Systems
Engineer Lead" and "Cooling Systems Engineer". The site says "Cooling Senior Engineer" and "Systems
Engineering Lead", which is what the plan asks for verbatim. Anyone opening both sees two different
titles for the same two jobs. Fixing it means editing either the resume or the plan's locked titles,
so it is a decision rather than a cleanup.

## Look and feel

Palette, set 2026-10-05 from the supplied swatches:

| token | hex | used for |
|---|---|---|
| Blackened Pearl | `#4d4b50` | footer, and the base the hero scrim is built from |
| Wisteria | `#a198af` | borders, heading bars, chips, rules, the card placeholder gradient |
| Whisper White | `#ede6db` | page background |

**Wisteria is 2.22:1 on Whisper White, so it never carries text.** `--accent`
(`#575166`) is Wisteria darkened to 6.11:1 and does the work Wisteria cannot:
links, role tags, callout rules, active filter pills. `--ink` (`#322f36`) is
Blackened Pearl darkened for long-form reading at 10.62:1.

Every text element was measured in the browser with alpha properly composited
against its painted background. All pass WCAG AA: body and prose 10.62, h2
10.62, callout title 7.54, callout body 9.34, headline 5.69, chips 6.96,
figcaption 5.00, footer 5.79, links 6.11.

The CR26I campus photo is the home hero background, behind a gradient scrim.
It is served as WebP at two widths through `getImage`, 141 kB wide and 45 kB
at phone size, rather than the 473 kB original. The scrim goes left-to-right
on desktop so the car stays visible on the right, and nearly uniform under
48rem because text wraps the full width on a phone and would otherwise end
each line on the bright side.

**The charts were deliberately left navy and crimson.** Four of the six figures
are MATLAB exports that cannot be recoloured without re-running the models, so
matching the two hand-drawn SVGs to the site palette would make the figure set
less consistent, not more.

## Before the link goes on a resume

Still open from the plan's own checklist:

- [ ] **Team leadership approval to publish.** Project 3 would put CR27I scoring targets on a public
      page. Nothing is published yet, so this is still ahead of the decision, not behind it.
- [x] Publish the resume. Done 2026-10-05, as-is, per the section above.
- [ ] Reconcile the role titles between the resume and the site.
- [ ] Add the LinkedIn URL to `src/data/site.ts`.
- [ ] Decide whether the MATLAB source goes in this repo or in separate per-project repos, then set
      each project's `repo` field. Nothing links to code right now.
- [ ] If the MATLAB source is published: delete the "this is fire" comment and the unused sweep vectors
      `a` through `j` in `oil_radiator_Analysis.m`; fix "Break" to "Brake" in `SKFspeedmodel.m` (four
      places); fix the comment spellings insure, Disapation, Effectivness, tubulent, Hydruaulic.
- [ ] Enable Pages: **Settings > Pages > Source > GitHub Actions**. The workflow cannot do this itself.
- [ ] Click every link on the live site, including repo links, in a private window.
