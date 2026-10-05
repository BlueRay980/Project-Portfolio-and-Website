import type { ImageMetadata } from 'astro';

import ductHero from '../assets/duct-hero.jpg';
import ductShroud from '../assets/duct-shroud-before-layup.jpg';
import ductFinished from '../assets/duct-finished.jpg';
import radiatorPlot from '../assets/radiator-heat-rejection.png';
import evPlot from '../assets/ev-power-limit.png';

export type Role = 'Cooling Senior Engineer' | 'Systems Engineering Lead';
export type Category = 'Cooling' | 'Systems Engineering';

export interface Figure {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export interface CodeExcerpt {
  title: string;
  lang: string;
  code: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  num: number;
  title: string;
  role: Role;
  category: Category;
  /** One line with a number in it. Used on the card and under the page title. */
  headline: string;
  thumb: ImageMetadata | null;
  thumbAlt: string;
  /** Draft pages are excluded from the build. See HANDOFF.md. */
  draft?: boolean;
  repo: string | null;
  problem: string[];
  myRole: string[];
  approach: string[];
  specs?: Spec[];
  code?: CodeExcerpt[];
  figures?: Figure[];
  callout?: { title: string; body: string[] };
  result: string[];
  limitations: string[];
  tools: string[];
}

export const projects: Project[] = [
  {
    slug: 'cooling-duct-cr26',
    num: 1,
    title: 'Cooling duct for CR26',
    role: 'Cooling Senior Engineer',
    category: 'Cooling',
    headline:
      'Carbon fiber and nylon duct with twin puller fans. Heat rejection is set by the fans, not by vehicle speed, which is what lets the sizing model treat air flow as a 400 CFM input.',
    thumb: ductHero,
    thumbAlt:
      'Finished carbon fiber cooling duct on a workbench, aft face toward the camera, with two black puller fans mounted side by side in the flared opening.',
    repo: null,
    problem: [
      'A Formula SAE endurance run spends most of its time at low speed, so there is little ram air available to push through the radiator core. An unducted core makes that worse: air spills around the core rather than through it, so the heat rejected depends on how fast the car happens to be going.',
      'That is a bad property to design around. It makes the cooling margin a function of the driver and the course rather than of the hardware, and it leaves the sizing model with no air flow number it can trust.',
    ],
    myRole: [
      'Design, CAD, layup, and fitment, as Cooling Senior Engineer on Crimson Racing. The duct is my own design and my own part.',
    ],
    approach: [
      'I designed a duct that seals the radiator core perimeter and pulls air through it with two puller fans, so that heat rejection is set by the fans instead of by vehicle speed. That is the point of the part, and it is what makes the sizing model in project 2 able to treat air flow as an independent input rather than something inferred from a speed trace.',
      'The duct is a carbon fiber and nylon assembly. A printed nylon shroud carries the fan mounting geometry and the throat shape, and the carbon fiber skin carries the structure while keeping mass down. The two fans mount in the aft face and draw through the core.',
      'The duct is also a good example of why I ended up in the systems role as well as the cooling one. It is a thermal part, but almost every constraint on it came from another subsystem. The envelope belongs to the chassis and sidepod bodywork, the fan current draw lands on the electrical budget, and the mass sits high and outboard, which the vehicle dynamics group cares about more than I do. Sizing the core in isolation would have produced a part that did not fit.',
    ],
    specs: [
      { label: 'Function', value: 'Seal the radiator perimeter so all fan flow passes through the core' },
      { label: 'Flow', value: 'Twin puller fans in parallel, drawing through the core' },
      { label: 'Materials', value: 'Carbon fiber skin over a printed nylon shroud' },
      { label: 'Constraints', value: 'Sidepod packaging envelope, minimum added mass, serviceable fan access' },
    ],
    figures: [
      {
        src: ductShroud,
        alt: 'Grey 3D-printed nylon shroud standing on a workbench with both puller fans fitted into its aft face, before the carbon fiber layup.',
        caption: 'Printed nylon shroud with both fans fitted, before layup.',
      },
      {
        src: ductFinished,
        alt: 'The same duct after layup, now skinned in black woven carbon fiber, with the two fans visible inside the flared aft opening.',
        caption:
          'Finished duct with the carbon fiber skin. The tapered inlet face seals against the radiator core; the flared aft section houses the fans.',
      },
    ],
    result: [
      'The finished duct seals the core perimeter and carries both fans, so delivered air flow is a design input rather than a consequence of vehicle speed. The sizing model in project 2 runs against a 400 CFM design point because of this part.',
      'The structure is a carbon fiber skin over a printed nylon shroud, which keeps added mass down while still carrying the fan mounting loads.',
    ],
    limitations: [
      'The two fans sit close enough that their shrouds interact. Splitting them into separate throats, or moving to a single larger fan, would cut the recirculation between them.',
      'The bond line between the nylon shroud and the carbon skin is the weak point. A mechanical lap joint would be more repeatable than relying on adhesive alone.',
      'I did not instrument the duct. Adding a pitot rake, or even a single static tap upstream of the core, would let me verify delivered CFM against the fan curve instead of assuming it.',
    ],
    tools: ['SolidWorks', 'GD&T', 'Carbon fiber layup', 'Nylon 3D printing'],
  },

  {
    slug: 'ntu-radiator-sizing',
    num: 2,
    title: 'NTU radiator sizing model and oil down-select',
    role: 'Cooling Senior Engineer',
    category: 'Cooling',
    headline:
      'The oil-side Reynolds number is 42, outside the Gnielinski correlation range. Correcting it drops predicted heat rejection at 400 CFM from 7.8 hp to 2.6 hp.',
    thumb: radiatorPlot,
    thumbAlt:
      'Two line charts. Left: heat rejection against fan air flow, where a corrected curve plateaus near 2.9 hp while the original rises past the 7 hp target. Right: heat rejection against core length at three fan flow rates, all below 4 hp.',
    repo: null,
    problem: [
      'The oil cooler had to be sized against a 7 hp heat rejection target. Getting it wrong in either direction is expensive: too small and the oil runs hot through endurance, too large and the car carries mass and frontal area it does not need.',
    ],
    myRole: [
      'I wrote the model, ran the sweeps, and made the fluid selection, as Cooling Senior Engineer. The correlation validity problem below is one I found in my own model while preparing a portfolio document. I have left it in rather than removing it, because how a model fails is usually more informative than a clean curve, and because the corrected result changes the design conclusion.',
    ],
    approach: [
      'I wrote an effectiveness-NTU model in MATLAB. It builds the core geometry from tube and fin dimensions, computes convection coefficients on both the air and oil sides, applies fin and overall surface efficiency, and returns heat rejected and outlet temperatures. It sweeps core dimensions, air flow, and coolant properties.',
      'A second script runs the same core across a table of candidate oils, so the fluid choice is made against the same model rather than against a datasheet comparison.',
    ],
    code: [
      {
        title: 'Air side: convection, fin efficiency, and overall surface efficiency',
        lang: 'matlab',
        code: [
          'Re_a = (velocity_a .* Thickness_Core) ./ v_a;',
          'Nu_a = .664 * (Re_a .^ .5) * (Pr_a .^ (1/3));   % flat-plate laminar',
          'h_a  = (Nu_a * k_a) / Thickness_Core;',
          '',
          'm              = ((2 * h_a) ./ (k_aluminum .* Fin_Thickness)) .^ 0.5;',
          'Efficiency_Fin = (tanh(m * Lc)) / (m * Lc);',
          'Efficiency_Surface = 1 - (((N_fins*Area_Fin)/Area_Fin_Base) * (1-Efficiency_Fin));',
        ].join('\n'),
      },
      {
        title: 'NTU solution for a crossflow core, both fluids unmixed',
        lang: 'matlab',
        code: [
          'UA  = 1 ./ ((1 ./ (Efficiency_Surface .* h_a .* Total_Air_Area)) ...',
          '          + (1 ./ (h_o .* Total_Area_oil)));',
          'NTU = UA ./ C_min;',
          'E   = 1 - exp((1./Cr) .* (NTU.^0.22) .* (exp(-Cr.*(NTU.^0.78)) - 1));',
          'q_actual = C_min * (T_o_in - T_a_in) .* E;',
        ].join('\n'),
      },
    ],
    figures: [
      {
        src: radiatorPlot,
        alt: 'Two line charts. Left: heat rejection in horsepower against fan air flow in CFM for the 9.53 inch core, with the corrected laminar entry-length curve flattening near 2.9 hp while the original Gnielinski curve rises straight past the 7 hp target line. Right: core length swept from 5 to 15 inches at 300, 500 and 700 CFM, reaching about 3.6 hp at the longest core.',
        caption:
          'Left: heat rejection against fan flow for the 9.53 in core, comparing the original oil-side correlation with the corrected one. Right: core length swept from 5 to 15 in at three fan flow rates, using the corrected model.',
      },
    ],
    callout: {
      title: 'Correlation validity finding',
      body: [
        'The oil side originally used the Gnielinski correlation, which is valid for Reynolds numbers above roughly 3,000. At the design condition the oil-side Reynolds number is 42, because 10W-40 at 60 C is about 45 times more viscous than water.',
        'Outside its range the correlation returns a negative Nusselt number, so the oil-side conductance came out as -1,307 W/K against an air-side value of 701 W/K. Summed as resistances in series, that gave UA = 1,510 W/K, which is larger than either side on its own and therefore impossible. That is the check that caught it.',
        'Replacing the correlation with a laminar thermal entry-length form gives an oil-side conductance of 104 W/K and UA of 90 W/K, and predicted rejection at 400 CFM falls from 7.8 hp to 2.6 hp.',
      ],
    },
    result: [
      'Heat rejection is limited by the oil side, not the air side. Past roughly 400 CFM the curve flattens at about 2.9 hp, so more fan does not solve the problem.',
      'Core length alone does not close it either: at 15 in and 700 CFM the model returns 3.6 hp against the 7 hp target.',
      'The useful levers are the ones that attack the oil-side resistance: more tubes in parallel to raise wetted area, turbulators to break up the laminar boundary layer, or a higher oil flow rate.',
    ],
    limitations: [
      'The air side uses a flat-plate laminar correlation on a finned core, so it understates the true coefficient. That is conservative for sizing, but it is the next thing I would replace.',
      'The model is a steady-state sizing tool. It assumes a single design condition and does not cover warm-up, heat soak after a run, or transient load through an endurance stint.',
      'Delivered air flow is an input, not a measurement. The duct it depends on was never instrumented, so the CFM figures come from the fan curve rather than from the installed part.',
    ],
    tools: ['MATLAB', 'Effectiveness-NTU method', 'Excel'],
  },

  {
    slug: 'ev-endurance-power-limit',
    num: 5,
    title: 'EV endurance power-limit study',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      '36 power-cap strategies scored against a fixed energy budget. The quickest one that finishes runs a 65.58 s lap and lands 53 Wh inside the budget.',
    thumb: evPlot,
    thumbAlt:
      'Scatter plot of lap time against 22-lap energy for 36 power-cap strategies, with a dashed line marking the energy budget and the best feasible strategy circled.',
    repo: null,
    problem: [
      'The electric car has to finish a 22-lap endurance event on a fixed energy budget. Running a higher power cap makes every lap quicker but risks running the pack down before the end, and the penalty for not finishing dwarfs any lap time gained.',
      'The question is which power cap strategy gives the lowest lap time that still fits inside the budget.',
    ],
    myRole: [
      'As Systems Engineering Lead I built the power request logic into our quasi-steady-state lap simulation, defined the strategy set, ran the sweep, and scored it.',
    ],
    approach: [
      'I built the power request logic into the lap simulation so that a cap could be defined as a taper: hold a set power up to a threshold speed, then fall linearly to a lower value at 85 mph. A taper is the useful shape because a flat cap spends energy at speeds where it buys very little lap time.',
      'I then scored 36 taper curves over the Michigan endurance course, logging lap time, energy per lap, and energy-weighted mean motor efficiency for each. Each strategy is defined by three numbers: hold power, taper start speed, and end power.',
    ],
    specs: [
      { label: 'Vehicle', value: 'CR26E, 317.5 kg, RWD, 49% front mass distribution' },
      { label: 'Event', value: 'Michigan EV Endurance, 22 laps' },
      { label: 'Energy budget', value: '4.076 kWh, corresponding to 40% usable state of charge' },
      { label: 'Cases run', value: '36 power cap curves, each defined by hold power, taper start speed, and end power' },
    ],
    figures: [
      {
        src: evPlot,
        alt: 'Two charts. Left: a scatter of lap time against 22-lap energy use for 36 power-cap strategies, where navy points finish inside the 4.076 kWh budget marked by a dashed vertical line and grey points run out of energy before the flag; the best feasible case is circled at 65.58 seconds. Right: lap time against power available at average lap speed, a curve that falls steeply to about 30 kW and then flattens.',
        caption:
          'Left: each point is one power cap strategy. Navy points finish inside the energy budget, grey points run out of energy before the flag. The circled case is the quickest strategy that still finishes. Right: lap time against the power actually available at each strategy average lap speed.',
      },
    ],
    result: [
      'The quickest strategy that finishes is a 20.5 kW hold tapering from 15 m/s to 4 kW, giving a 65.58 s lap at 4.023 kWh over 22 laps, which is 53 Wh inside the budget.',
      'Tapering beats a flat cap. Against a flat 20.5 kW baseline, the selected taper is 0.44 s per lap slower but uses 11.7% less energy, which is what converts a strategy that does not finish into one that does.',
      'Returns fall off sharply. Going from 16 to 36 kW of available power buys 2.8 s of lap time; the next 33 kW buys 0.5 s. Everything above roughly 24 kW is outside the energy budget anyway.',
      'Energy-weighted motor efficiency moves only from 91.5% to 94.1% across the whole set, so the lap time and energy differences come from the cap strategy itself rather than from operating the motor in a better part of its map.',
    ],
    limitations: [
      'This is a quasi-steady-state simulation, so it does not capture transient yaw behavior or driver variation, and it assumes a repeatable racing line every lap.',
      'Pack voltage sag and cell temperature rise over a 22-lap run are not modeled, both of which would tighten the real energy budget.',
      'I would treat the ranking between strategies as more trustworthy than the absolute lap times.',
    ],
    tools: ['MATLAB', 'Quasi-steady-state lap simulation', 'Excel'],
  },

  {
    slug: 'vehicle-speed-kalman-filter',
    num: 6,
    title: 'Vehicle speed Kalman filter',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      'A three-state Kalman filter estimates chassis speed under wheel lock-up and spin, where wheel speed sensors are wrong exactly when the data matters most.',
    thumb: null,
    thumbAlt: '',
    repo: null,
    problem: [
      'Wheel speed sensors are the obvious source for vehicle speed, and they are wrong exactly when the data matters most. Under hard braking the wheels lock and read low; on corner exit they spin and read high. GPS is honest but too slow to resolve a braking event.',
      'Every downstream number that depends on chassis speed, including slip ratio and any tyre work, inherits that error.',
    ],
    myRole: [
      'I designed and implemented the filter as Systems Engineering Lead, working from the logged data the team already had rather than adding sensors.',
    ],
    approach: [
      'I built a three-state Kalman filter that estimates chassis speed, front wheel speed, and rear wheel speed together, using longitudinal acceleration as the control input and treating the wheels as relaxing toward chassis speed with a slip time constant.',
      'Modeling the wheels as separate states rather than averaging them is what makes this work. When a wheel locks, the filter can attribute the disagreement to slip instead of forcing the chassis estimate to follow it.',
      'Measurement updates drop out channel by channel when a sample is missing, so a GPS dropout or a dead sensor degrades the estimate rather than breaking it.',
    ],
    code: [
      {
        title: 'Prediction step: chassis integrates acceleration, wheels relax toward it',
        lang: 'matlab',
        code: [
          'alpha = min(dt/tau, 1);            % slip relaxation, tau = 0.30 s',
          'x_pred(1) = x(1,k-1) + u*dt;                              % chassis',
          'x_pred(2) = x(2,k-1) + u*dt + alpha*(x(1,k-1) - x(2,k-1)); % front',
          'x_pred(3) = x(3,k-1) + u*dt + alpha*(x(1,k-1) - x(3,k-1)); % rear',
          'if u < -0.5                        % wheels decelerate harder than chassis',
          '    x_pred(2) = x_pred(2) + brakeGainF*u*dt;',
          '    x_pred(3) = x_pred(3) + brakeGainR*u*dt;',
          'end',
        ].join('\n'),
      },
      {
        title: 'Measurement update drops unavailable channels instead of failing',
        lang: 'matlab',
        code: [
          'z = [gps(k); wheelF(k); wheelR(k)];   H = eye(3);',
          'valid = isfinite(z);',
          'z = z(valid);   H = H(valid,:);   Rk = R(valid,valid);',
        ].join('\n'),
      },
    ],
    result: [
      'Chassis speed is estimated through lock-up and spin events where the raw wheel speed channels disagree with the car, using a slip relaxation time constant of 0.30 s.',
      'The filter degrades rather than fails. Because the measurement update is rebuilt from whichever channels are finite on a given sample, a GPS dropout or a dead wheel sensor costs accuracy instead of ending the run.',
    ],
    limitations: [
      'This is a linear Kalman filter with a fixed slip time constant. The relaxation constant is one tuned number, not a tyre model, so it does not adapt to surface or temperature.',
      'The brake gain terms switch on a fixed acceleration threshold, which is a blunt way to detect braking and will mis-trigger on rough surfaces.',
      'It estimates longitudinal speed only. There is no lateral state, so it says nothing about sideslip.',
      'It has been run against logged data, not live in the car.',
    ],
    tools: ['MATLAB', 'Kalman filtering', 'MoTeC i2 logging and analysis'],
  },

  // ---------------------------------------------------------------------------
  // Drafts. These three are on the plan roster but there is not enough written
  // source to put a page behind them yet, so they are held back from the build
  // rather than filled with text nobody checked. Headlines below are the ones
  // from the plan. See HANDOFF.md for exactly what each one still needs.
  // ---------------------------------------------------------------------------
  {
    slug: 'cr27i-scoring-targets',
    num: 3,
    title: 'CR27I scoring targets from OpenLAP sweep',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline: 'CR26I scores 514 points. CR27I minimum 526.8, target 547.8.',
    thumb: null,
    thumbAlt: '',
    draft: true,
    repo: null,
    problem: [],
    myRole: [],
    approach: [],
    result: [],
    limitations: [],
    tools: [],
  },
  {
    slug: 'spring-rate-grid-oat',
    num: 4,
    title: '14-DOF spring rate grid and OAT sensitivity study',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline: 'Response surfaces and parameter ranking for CR26I.',
    thumb: null,
    thumbAlt: '',
    draft: true,
    repo: null,
    problem: [],
    myRole: [],
    approach: [],
    result: [],
    limitations: [],
    tools: [],
  },
  {
    slug: 'team-tooling',
    num: 7,
    title: 'Team tooling',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline: 'Cost-report taxonomy pipeline, OpenLAP_Combined IC and EV merge, team wiki bot.',
    thumb: null,
    thumbAlt: '',
    draft: true,
    repo: null,
    problem: [],
    myRole: [],
    approach: [],
    result: [],
    limitations: [],
    tools: [],
  },
];

/** Published projects, in plan roster order. Drafts never reach the build. */
export const published = projects
  .filter((p) => !p.draft)
  .sort((a, b) => a.num - b.num);

/** Roster entries still waiting on content. Used by the build summary, not rendered. */
export const drafts = projects.filter((p) => p.draft).sort((a, b) => a.num - b.num);

/** The home page features the first three published projects. */
export const featured = published.slice(0, 3);

export const categories: Category[] = ['Cooling', 'Systems Engineering'];
