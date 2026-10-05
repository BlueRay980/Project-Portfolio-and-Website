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
| 3 | CR27I scoring targets from OpenLAP sweep | **Draft, held back.** |
| 4 | 14-DOF spring rate grid and OAT sensitivity | **Draft, held back.** |
| 5 | EV endurance power-limit study | Published. Full content from the portfolio PDF. |
| 6 | Vehicle speed Kalman filter | Published. Full content from the portfolio PDF. |
| 7 | Team tooling | **Draft, held back.** |
| 8 | Torque maps, suspension, and the 14 DOF model in the lap simulation | Published. Added 2026-10-05, not on the original roster. |

Numbering follows the plan roster. The three drafts sit in `src/data/projects.ts` with `draft: true`
and their plan headline, so the roster is visible in the code, but they do not reach the build.

Project 8 is new. It covers the engine map work, the suspension, and the 14 DOF transient model,
written from the 14DOF and Reforged QSS reference notes and from `OpenLap_Reforged_FULL.m` itself.
Both figures on it come from the quasi-steady run outputs, because no 14 DOF run has ever exported
plots. The correlation numbers quoted in Result are the 14 DOF model's and are text only, not
illustrated, which is deliberate: pairing them with a quasi-steady plot would misattribute them.

If a 14 DOF run is ever exported with plots, a log-against-simulation trace belongs on that page.

## What each draft still needs

**3, CR27I scoring targets.** The only content that exists anywhere is the three numbers from the plan:
CR26I scores 514 points, CR27I minimum 526.8, target 547.8. The problem statement, the sweep setup,
and the limitations are not written down anywhere I could read, and I will not invent them. Needs:
what the sweep varied, why 526.8 is the floor and 547.8 the target, and the score against Cl and mass
plot the plan names as the thumbnail.

**4, 14-DOF spring rate grid and OAT sensitivity.** The OAT half is well documented: the eight-parameter
sweep from -50% to +50%, seven vehicle masses, four events, and the parameter ranking that comes out
identical on all seven (mass, then Cl and lift area tied, then Cd and frontal area tied, then centre of
pressure, then final gear, then horsepower at zero because the car is traction limited at every speed).
That is a strong page on its own, and the horsepower-reads-zero result is the kind of finding that
matches the voice of the duct and radiator pages. The spring rate grid half is not written down. Needs:
a decision on whether to publish the OAT study alone, and if not, the spring rate grid numbers.

**7, Team tooling.** Needs a description of the cost-report taxonomy pipeline that carries no cost
figures and no part costs, plus the OpenLAP IC and EV merge and the wiki bot. Per your instruction this
page stays vague on anything financial.

## Decisions I made, flag any you want changed

- **Home features projects 1, 2, and 5**, because 3 is a draft. The plan said feature 1, 2, and 3.
  Featuring is automatic: the first three published projects, in roster order.
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
