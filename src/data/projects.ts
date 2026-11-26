import type { ImageMetadata } from 'astro';

import ductHero from '../assets/duct-hero.jpg';
import ductShroud from '../assets/duct-shroud-before-layup.jpg';
import ductFinished from '../assets/duct-finished.jpg';
import radiatorPlot from '../assets/radiator-heat-rejection.png';
import evPlot from '../assets/ev-power-limit.png';
import torqueMap from '../assets/engine-torque-map.png';
import wheelLoads from '../assets/wheel-loads.png';
import wingSection from '../assets/wing-cross-section.png';
import wingBuckling from '../assets/wing-buckling-vs-yield.png';
import wingStress from '../assets/wing-fea-stress.png';
import wingDeflection from '../assets/wing-fea-deflection.png';
import simsuiteLapOverview from '../assets/simsuite-lap-overview.png';
import simsuiteSweep from '../assets/simsuite-sweep-surface.png';

export type Role = 'Cooling Senior Engineer' | 'Systems Engineering Lead' | 'AEM 341 course project';
export type Category = 'Cooling' | 'Systems Engineering' | 'Aerospace Structures';

/**
 * An imported raster asset, which Astro resizes and converts to WebP, or a
 * site-root-relative path under public/ for vector figures that should be
 * served as-is. Pass the latter through `url()` at render time.
 */
export type ImageSource = ImageMetadata | string;

export interface Figure {
  src: ImageSource;
  alt: string;
  caption?: string;
}

export interface CodeExcerpt {
  title: string;
  lang: string;
  code: string;
}

/** A file served from public/, linked under the Tools list. */
export interface ProjectDocument {
  label: string;
  /** Site-root-relative path, passed through `url()` at render time. */
  href: string;
  note?: string;
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
  thumb: ImageSource | null;
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
  documents?: ProjectDocument[];
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
      'Heat rejection on this core is set by the oil side, not the air side. An oil-side Reynolds number of 42 puts the flow deep in the laminar regime, and the curve flattens at about 2.9 hp past 400 CFM.',
    thumb: radiatorPlot,
    thumbAlt:
      'Two line charts. Left: heat rejection against fan air flow, where the laminar entry-length curve plateaus near 2.9 hp while the turbulent correlation rises past the 7 hp target. Right: heat rejection against core length at three fan flow rates, all below 4 hp.',
    repo: null,
    problem: [
      'The oil cooler had to be sized against a 7 hp heat rejection target. Getting it wrong in either direction is expensive: too small and the oil runs hot through endurance, too large and the car carries mass and frontal area it does not need.',
    ],
    myRole: [
      'I wrote the model, ran the sweeps, and made the fluid selection, as Cooling Senior Engineer. The validity check below is part of the model rather than an afterthought: it is the test the conductance numbers have to pass before any sizing conclusion is drawn from them.',
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
        alt: 'Two line charts. Left: heat rejection in horsepower against fan air flow in CFM for the 9.53 inch core, with the laminar entry-length curve flattening near 2.9 hp while the turbulent correlation curve rises straight past the 7 hp target line. Right: core length swept from 5 to 15 inches at 300, 500 and 700 CFM, reaching about 3.6 hp at the longest core.',
        caption:
          'Left: heat rejection against fan flow for the 9.53 in core, comparing a turbulent correlation against the laminar entry-length form valid at this Reynolds number. The gap between the two curves is what the validity check is worth. Right: core length swept from 5 to 15 in at three fan flow rates.',
      },
    ],
    callout: {
      title: 'Why the oil side is the limit, and the check that proves it',
      body: [
        '10W-40 at 60 C is about 45 times more viscous than water, which puts the oil-side Reynolds number at 42 at the design condition. That is laminar by a wide margin, and far below the roughly 3,000 where the standard turbulent correlations hold, so the oil side is modelled with a laminar thermal entry-length form chosen for that regime.',
        'It gives an oil-side conductance of 104 W/K against an air-side 701 W/K, and an overall UA of 90 W/K. The oil side carries seven times the thermal resistance of the air side, which is the whole design conclusion in one number.',
        'Two conductances in series have to sum to a UA smaller than either one on its own. Every correlation in this model is held to that bound before its result is read, which is what makes an out-of-range correlation visible immediately instead of merely plausible.',
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
    callout: {
      title: 'A taper, not a flat cap, is what turns a strategy that does not finish into one that does',
      body: [
        'A flat power cap spends its energy at the top of the speed range, where it buys very little lap time: the car is pushing against drag that rises with the square of speed for a few tenths. So a strategy here is defined as a taper instead, holding a set power up to a threshold speed and then falling linearly to a lower value at 85 mph.',
        'Against a flat 20.5 kW baseline, the selected taper gives up 0.44 s per lap and takes back 11.7% of the energy. Over 22 laps that is the difference between finishing and not, and the penalty for not finishing dwarfs every tenth the flat cap was buying.',
        'Scoring all 36 strategies through one model on one course is what makes them comparable to each other. The output is a ranking under a fixed energy budget, which is the form the strategy decision actually needed.',
      ],
    },
    result: [
      'The quickest strategy that finishes is a 20.5 kW hold tapering from 15 m/s to 4 kW, giving a 65.58 s lap at 4.023 kWh over 22 laps, which is 53 Wh inside the budget.',
      'Tapering beats a flat cap. Against a flat 20.5 kW baseline, the selected taper is 0.44 s per lap slower but uses 11.7% less energy, which is what converts a strategy that does not finish into one that does.',
      'Returns fall off sharply. Going from 16 to 36 kW of available power buys 2.8 s of lap time; the next 33 kW buys 0.5 s. Everything above roughly 24 kW is outside the energy budget anyway.',
      'Energy-weighted motor efficiency moves only from 91.5% to 94.1% across the whole set, so the lap time and energy differences come from the cap strategy itself rather than from operating the motor in a better part of its map.',
    ],
    limitations: [
      'This is a quasi-steady-state simulation, so it does not capture transient yaw behavior or driver variation, and it assumes a repeatable racing line every lap.',
      'Pack voltage sag and cell temperature rise over a 22-lap run are not modeled, both of which would tighten the real energy budget.',
      'I would treat the ranking between strategies as more trustworthy than the absolute lap times. The 36 strategies are scored against each other by one model on one course, which is what a ranking is good for; the absolute figures carry every assumption that model makes.',
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

  {
    slug: 'aero-design-space-points',
    num: 3,
    title: 'Aerodynamic design space against competition points',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      'Lift and drag swept across a scored design space, with all four dynamic events converted to competition points. Downforce is worth 12.4 points across the range against 4.8 for drag, so the answer is as much downforce as the package can reach, and the least drag with it.',
    thumb: '/figures/aero-points-space.svg',
    thumbAlt:
      'Grid of total competition points over lift and drag coefficients, rising toward the corner with the most downforce and least drag.',
    repo: null,
    problem: [
      'The aerodynamics group wants more downforce. Downforce costs drag, and drag costs acceleration and top speed. Asking which wins in lap time does not settle it, because a Formula SAE car is not scored on lap time. It is scored across four dynamic events with different point weightings, and each is scored relative to the rest of the field.',
      'So the question is what a count of downforce is worth in points rather than in seconds, and the design review needed the answer in that form.',
    ],
    myRole: [
      'As Systems Engineering Lead I own both the sweep and the lap solver underneath it. I built the points conversion, ran the design space, and took the result to the design review as the answer to why this car runs the lift and drag figures it does.',
    ],
    approach: [
      'The sweep varies lift and drag coefficient across the range the aero package could plausibly reach, runs all four dynamic events at every grid point, converts each event time to points using the competition scoring formulas, and sums them.',
      'The solver builds a full grip envelope first, including the pure-longitudinal tyre acceleration limit at every speed, and the lap is run against it. That matters more on this car than it sounds: it is traction limited for 73 to 95% of a lap depending on the course, so vertical load is what binds acceleration, and a count of downforce converts into lap time through grip rather than only costing drag.',
      'Reading the answer in points rather than seconds is the other half of the method. Each event has its own scoring formula and its own reference time, so the same tenth is worth a different amount depending on where it is found, and only the summed points answer the question the design review was asking.',
    ],
    specs: [
      { label: 'Design space', value: 'Cl -5.0 to -3.0, Cd -1.8 to -1.0, 25 grid points' },
      { label: 'Vehicle', value: 'CR26I at 293.41 kg' },
      { label: 'Events', value: 'Acceleration, skidpad, autocross, endurance' },
      { label: 'Solver state', value: 'Untuned, with no grip calibration applied' },
    ],
    figures: [
      {
        src: '/figures/aero-points-space.svg',
        alt: 'A five by five grid of total competition points over lift coefficient from -3.0 to -5.0 and drag coefficient from -1.8 to -1.0. Values rise steadily from 175.5 at the least downforce and most drag corner to 192.6 at the most downforce and least drag corner, which is outlined in red. Each cell also shows its autocross time, between 53.3 and 54.2 seconds.',
        caption:
          'Total competition points across the swept design space. The best point sits at the corner of the swept range, so the sweep bounds the answer rather than locating a peak inside it. Endurance scores zero at all 25 points, for the reason given under Known limitations, so these totals cover three of the four events.',
      },
    ],
    callout: {
      title: 'This car is traction limited almost everywhere, which is why downforce is the lever and power is not',
      body: [
        'The model reports the car at its tyre longitudinal limit for 73 to 95% of a lap, depending on the course. In that regime acceleration is set by what the tyres can transmit, not by what the engine can make, so the way to buy lap time is to raise the vertical load on the tyres.',
        'That is what puts downforce ahead of drag by better than two to one across this design space, and it is why the recommendation out of this study is to take the downforce and pay the drag rather than trim the package for top speed.',
        'The same conclusion arrives independently from the other direction. The one-at-a-time sensitivity study runs on a separate codebase and finds horsepower worth exactly zero seconds, for exactly this reason. Two models, two solvers, one answer, which is the only kind of cross-check worth much.',
      ],
    },
    result: [
      'The best configuration is the most downforce and the least drag in the swept range, Cl -5.0 and Cd -1.0, at 192.6 points. The worst is the opposite corner, Cl -3.0 and Cd -1.8, at 175.5. The spread across the whole space is 17.1 points.',
      'Both extremes land on the boundary of the sweep, which is a result about the sweep as much as about the car. It says go as far as the range allows, not that an optimum was found inside it.',
      'Less drag wins at every downforce level, and more downforce wins at every drag level. At Cl -5.0, going from Cd -1.8 to -1.0 is worth 4.8 points. At Cd -1.0, going from Cl -3.0 to -5.0 is worth 12.4. Downforce is the stronger of the two levers across this space.',
      'Acceleration and skidpad respond cleanly and monotonically. Acceleration runs from 4.336 s down to 4.194 s and skidpad from 4.985 s down to 4.868 s across the space, and those two carry most of the trend.',
      'Autocross does not behave monotonically, moving between 53.285 s and 54.200 s with no clean ordering in lift coefficient. That is solver noise in the apex solution rather than a real effect, and it is a reason to read the overall gradient rather than any single grid point.',
    ],
    limitations: [
      'Endurance scores zero at all 25 points. The untuned model runs the endurance distance in 2186 to 2213 s against a 1410 s reference time, so the event saturates at the bottom of its scoring range and contributes nothing. The totals here therefore cover three of the four events.',
      'The solver carries no grip calibration in this run. It needs tuning against logged laps before any total it produces can be read as a competition score, which is why this study is read as a gradient across the design space rather than as a points prediction.',
      'The optimum sits on the boundary of the swept range, so this study bounds the answer rather than locating it. A wider range, or the drag polar the aero package can actually reach, is what would find a real optimum.',
      'The sweep treats every grid point as achievable. A real aero package cannot pick arbitrary downforce at arbitrary drag, so the corner may not be a buildable configuration.',
      'The scoring reference times are assumptions about the rest of the field rather than measurements, and every point total is conditional on them.',
      'This is a quasi-steady point-mass model: no transient weight transfer, no suspension, no driver variation. Endurance is modelled as a clean run with no fuel limit, tyre degradation, traffic or penalties.',
    ],
    tools: ['MATLAB', 'Quasi-steady lap simulation', 'Python (openpyxl)', 'Excel'],
  },

  {
    slug: 'oat-sensitivity-study',
    num: 4,
    title: 'One-at-a-time parameter sensitivity study',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      'Eight vehicle parameters swept from -50% to +50% across seven mass cases. Horsepower moves the lap by exactly zero, and that is the correct answer.',
    thumb: '/figures/oat-sensitivity.svg',
    thumbAlt:
      'Tornado chart of lap time sensitivity for six vehicle parameters, with mass by far the largest, more downforce making the car faster, and horsepower at exactly zero.',
    repo: null,
    problem: [
      'Every subteam wants to know what their change is worth in lap time. Aero wants to know what a count of downforce buys, the chassis group wants to know what a kilogram costs, and powertrain wants to know whether chasing horsepower is worth the weight that comes with it. Answering those one at a time, by argument, produces a different answer every time somebody asks.',
      'What was needed was one sweep that puts all of them on the same axis, run on the same car over the same course, so the arguments become a ranking instead of opinions.',
    ],
    myRole: [
      'As Systems Engineering Lead I own this tool and the numbers that come out of it. I wrote the multi-vehicle sweep, built the self-consistency checks it is held to, and ran the campaign across four events and seven cars.',
    ],
    approach: [
      'The sweep builds a grip envelope for the car, runs a quasi-steady lap, and then varies one parameter at a time from -50% to +50% in 1% steps while holding everything else fixed. One at a time is the right method here because the question is a ranking, and a full factorial over eight parameters would cost far more runs to answer a question nobody asked.',
      'It runs the whole sweep for every vehicle workbook in a folder, so the same eight parameters are swept across a range of car masses, and writes one workbook per vehicle plus a cross-vehicle comparison. Running seven masses rather than one is what turns a single ranking into a trend: it shows whether the ranking is a property of the car or of the particular mass it happened to be at.',
      'The eight parameters are mass, lift coefficient and lift area, drag coefficient and frontal area, centre of pressure, final gear reduction, and horsepower. Lift coefficient and lift area are swept separately on purpose even though they enter the physics as one product, because their agreement is a check on the sweep itself.',
    ],
    specs: [
      { label: 'Model', value: 'Quasi-steady point mass with a grip envelope and a live engine map' },
      { label: 'Parameters', value: '8, swept one at a time from -50% to +50% in 1% steps' },
      { label: 'Vehicles', value: '7 mass cases, 279.82 kg to 307 kg' },
      { label: 'Course shown', value: 'Michigan Endurance IC 2026' },
      { label: 'Campaign', value: '4 events, 7 vehicles, 22,624 solver runs, zero failures' },
    ],
    figures: [
      {
        src: '/figures/oat-sensitivity.svg',
        alt: 'Tornado chart of change in lap time for six parameters on the 293.41 kg car over Michigan Endurance IC 2026, baseline 129.23 seconds. Each bar is labelled with the parameter value that run used. Mass is by far the largest: halved to 146.7 kg it is 13.158 seconds faster, raised to 440.1 kg it is 6.798 seconds slower. Lift coefficient is next: at Cl -1.84, which is less downforce, the car is 4.837 seconds slower, and at Cl -5.52, which is more downforce, it is 4.641 seconds faster. Final gear reduction costs 2.244 seconds when shortened and nothing when lengthened. Drag coefficient and centre of pressure are each under one second. Horsepower is exactly zero in both directions.',
        caption:
          'Lap time sensitivity for the 293.41 kg car over Michigan Endurance IC 2026. Cl and Cd are stored negative in the vehicle workbook, so +50% on Cl means Cl -5.52, which is more downforce, and the lap drops 4.64 s. Every bar carries the value that run actually used, because a percentage alone is ambiguous on a quantity stored negative. Drawn from the sweep output workbook; the sweep itself writes Excel, not plots. Lift area and frontal area are left off because they land on the lift and drag coefficient numbers to every digit, which is the point made below.',
      },
    ],
    callout: {
      title: 'The sweep is built to check itself, which is what makes its ranking worth acting on',
      body: [
        'Lift coefficient and lift area scale the identical product in the physics, and so do drag coefficient and frontal area. Sweeping each pair separately is therefore redundant by design, and the redundancy is the point: the two members of a pair have to agree row for row, and if they do not, something between the sweep scale and the solver input is wrong.',
        'They agree to every digit across both pairs, which is why only one of each is plotted above. Anyone wanting to audit this sweep can start there rather than taking the ranking on trust.',
        'The second check is monotonicity. Every parameter column runs smoothly across the full -50% to +50% range with no kinks, on all seven mass cases, and the ranking comes out identical on all seven. A sign or scaling error anywhere in the chain shows up as a discontinuity or a reordering, so a clean sweep on seven cars is a much stronger statement than a clean sweep on one.',
        'The campaign is 22,624 solver runs across four events and seven vehicles with zero failures. That is what makes the ranking a property of the car rather than of one configuration that happened to converge.',
      ],
    },
    result: [
      'On Michigan Endurance IC 2026 the 293.41 kg car runs a 129.23 s baseline. Halving mass is worth 13.16 s and adding 50% costs 6.80 s, which is roughly three times the next parameter and settles that mass is where the effort goes.',
      'The ranking is identical on all seven mass cases: mass, then lift coefficient and lift area, then final gear reduction, then drag coefficient and frontal area, then centre of pressure, then horsepower. A ranking that survives a 27 kg change in the car is a property of the car rather than of one configuration.',
      'More downforce is worth 4.64 s on this course. Taking Cl from its baseline -3.68 to -5.52 drops the lap from 129.23 s to 124.59 s, and the sweep is monotonic the whole way: -2.76 gives 131.62 s, -4.60 gives 126.88 s. Worth stating plainly because the sign convention is the trap on this car. Cl is stored negative, so the sweep step called +50% is more downforce, not less, and a reader who takes it the other way concludes the model has downforce backwards.',
      'Every column is monotonic across the whole mass range with no kinks, which is the consistency check the campaign is held to before any ranking is read off it.',
      'Downforce pays most on the light car, and so does mass. Halving lift coefficient costs 5.120 s at 279.82 kg but only 4.578 s at 307 kg, while mass sensitivity falls over the same range from -13.457 s to -12.899 s. Both trends point the same way: the light end of the range is where aerodynamic work is worth most.',
      'Horsepower reads exactly 0.000 in both directions, on every vehicle, and that is a real result rather than a modelling artefact. The car is traction limited at every speed on this course, so in a point-mass model a power change cannot move the lap. Gearing behaves the same way and for the same reason: taller gearing changes nothing, while shorter gearing costs 2.24 s by capping speed on the long straights.',
      'Extending the campaign to four events needed two of them rebuilt before they would run at all. The solver works from corner apexes, and a skidpad is a constant-radius circle with no local curvature maximum, so its apex list came back genuinely empty. Acceleration has no course at all. Skidpad was fixed with data rather than code, by writing one apex per arc, and acceleration got a dedicated straight-line solver.',
    ],
    limitations: [
      'This is a quasi-steady point mass. It has no transient weight transfer, no suspension, and no driver variation, so it ranks parameters rather than predicting lap times.',
      'The grip envelope has no longitudinal load transfer. On a 75 m acceleration run the missing rearward transfer is 468 N against a 1495 N static rear load, 31% of it, which is why acceleration has to be calibrated to a grip factor of 1.074 where the other events sit between 0.64 and 0.86. Adding that term is the one model change this campaign argues for.',
      'Calibration constants do not transport. Taking the tuned grip pair from this solver into another quasi-steady model of the same car on the same course reads 1.29 s slow, so these are per-solver, per-event lap-time constants and nothing more.',
      'One of the four events is calibrated against average race pace rather than a clean lap, because its target comes from a full race distance that carries traffic, penalties, and out and in laps. Its grip constant is not comparable with the other three and should not be read as a tyre property.',
      'Skidpad only resolves to about plus or minus 0.003 s. The smoothing window spans both curvature sign changes on a short closed course, so time against grip jitters non-monotonically at that level. That is roughness rather than convergence, and the search cannot do better.',
      'Because the sweep varies one parameter at a time, it cannot see interactions. Mass and downforce clearly interact here, which is visible only because seven mass cases were run; any two parameters that trade against each other would be invisible within a single sweep.',
    ],
    tools: ['MATLAB', 'Quasi-steady lap simulation', 'Python (openpyxl)', 'Excel'],
  },

  {
    slug: 'lapsim-torque-maps-suspension-14dof',
    num: 8,
    title: 'Torque maps, suspension, and the 14 DOF model in the lap simulation',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      'A 2-D engine map, a suspended 14 degree-of-freedom car, and a correlation campaign against logged laps. The transient model lands within 0.6% of the logged Endurance lap at lateral R-squared 0.965.',
    thumb: torqueMap,
    thumbAlt:
      'Three-dimensional surface plot of engine torque against engine speed and engine load, rising to about 49 Nm.',
    repo: null,
    problem: [
      'The team ran a quasi-steady point-mass lap simulation. It solves corner speeds from a grip envelope and marches forward and backward to a lap time, and for ranking aero or mass changes that is enough. For anything else it is not. A point mass has no suspension, so it cannot answer a spring rate question, cannot produce a damper trace, and cannot show load moving across the car. Its engine was a single wide-open-throttle torque curve, so it could not say where in the engine map the car was actually operating, and therefore could not predict fuel use or efficiency-event scoring.',
      'That gap showed up in how the model had to be tuned. Calibrating the quasi-steady model to five logged laps of the same car needed a grip constant spanning 0.690 to 0.891, a 29% range. A tyre does not change by 29% between sessions. That number was absorbing everything the model did not represent.',
    ],
    myRole: [
      'As Systems Engineering Lead I built the transient model, replaced the single torque curve with the 2-D engine map path, added the suspension, and ran the correlation campaign against logged laps and against the roll gradient measured on the car.',
    ],
    approach: [
      'The transient model carries fourteen degrees of freedom: six for the sprung mass, four unsprung vertical, and four wheel spins. It integrates with RK4 at a 2 ms step, steers with a closed-loop Stanley path follower, and holds speed with a PI controller. It runs in three target modes: predictive, log replay for correlation against a measured lap, and replay of a driver preset built from that driver telemetry.',
      'The suspension is what makes the other two useful. Because the car has sprung and unsprung masses and real wheel rates, load transfer and roll fall out of the simulation rather than being assumed. Roll gradient becomes a result that can be checked against the car instead of an input.',
      'For the engine I replaced the wide-open-throttle torque curve with the 2-D map from the vehicle workbook, indexed on engine speed and engine load, so the acceleration limit comes from the operating point the car is actually at. Fuel flow and efficiency maps sit on the same axes and feed the fuel model, which is what lets the simulation predict efficiency-event scoring rather than lap time alone.',
    ],
    specs: [
      { label: 'States', value: '6 sprung-mass DOF, 4 unsprung vertical, 4 wheel spins' },
      { label: 'Integration', value: 'RK4 at a 2 ms fixed step' },
      { label: 'Control', value: 'Closed-loop Stanley path follower, PI speed controller' },
      { label: 'Target modes', value: 'Predictive, logged-lap replay, driver preset replay' },
      { label: 'Engine', value: '2-D torque, fuel flow and efficiency maps on engine speed and load' },
    ],
    code: [
      {
        title: 'Rescaling the workbook map to true crank torque, with the factor read from the data',
        lang: 'matlab',
        code: [
          '% The EngineSpecs 2-D map stores "Gear Torque": crank torque already',
          '% multiplied by a constant gear factor. The driveline below applies',
          '% primary/gearbox/final itself, so rescale the map to true crank',
          '% torque first. The factor comes from the ratio of the two torque',
          '% columns in the workbook, not from a hard-coded constant.',
          'gb_ratio = engine_gear_brake_ratio(filename);',
          'veh.engine_map.torque = veh.engine_map.torque / gb_ratio;',
          'veh.engine_gear_factor = gb_ratio;',
        ].join('\n'),
      },
      {
        title: 'Acceleration limit taken from the live map operating point',
        lang: 'matlab',
        code: [
          'gear_sel = round(interp1(veh.vehicle_speed, veh.gear, v, \'nearest\', \'extrap\'));',
          'rpm = veh.ratio_final * veh.ratio_gearbox(gear_sel) * veh.ratio_primary ...',
          '      * v / veh.tyre_radius * 60/(2*pi);',
          'rpm = min(max(rpm, veh.engine_map.rpmAxis(1)), veh.engine_map.rpmAxis(end));',
          '',
          'tq_Nm = engineTorque(rpm, pedal, \'Map\', veh.engine_map, \'Units\', \'Nm\');',
          'wheel_tq = tq_Nm * veh.ratio_primary * veh.ratio_gearbox(gear_sel) * veh.ratio_final ...',
          '           * veh.n_primary * veh.n_gearbox * veh.n_final;',
          'Fx = wheel_tq / veh.tyre_radius;',
        ].join('\n'),
      },
    ],
    figures: [
      {
        src: torqueMap,
        alt: 'Three-dimensional surface plot titled CR26I Torque Map from EngineSpecs, with engine load in kilopascals on one horizontal axis from 20 to 100, engine speed in rpm on the other from 4000 to 14000, and torque in newton metres rising from near zero at low load to about 49 at high load and mid engine speed.',
        caption:
          'The 2-D engine map the acceleration limit is taken from, rescaled to true crank torque. Peak crank torque lands near 49 Nm, matching the published engine spec, which is the check the map is validated against.',
      },
      {
        src: wheelLoads,
        alt: 'Four panels of wheel load data over one Endurance lap: individual loads at all four corners against distance, front and rear axle loads with the total, front load share against distance scattering either side of 50 percent, and a track map coloured by total wheel load.',
        caption:
          'Load at all four corners over one Endurance lap. This is the output a point-mass model cannot produce: the total load trace drops where the car is light over crests and the front share swings either side of 50% through braking and corner exit.',
      },
    ],
    callout: {
      title: 'The suspension model is tested against a number it was never given',
      body: [
        'Roll gradient is the cleanest test available on a car like this, because it is not an input anywhere in the model. It falls out of the spring rates, the damper rates, the anti-roll bar rates and the geometry, all of which are entered independently. If the suspension model is built wrong, roll gradient is where it shows.',
        'The model returns 0.499 deg/g against 0.506 measured on the car, a 1.4% miss on a quantity nothing was fitted to. That is a real test of the suspension rather than a restatement of its inputs.',
        'The lap-level correlation sits on the same footing. Against a logged Endurance lap the model runs 141.39 s to a measured 142.22 s, 0.6% fast, and band-limited at 40 m the correlation is R-squared 0.994 on speed, 0.885 on longitudinal G, 0.965 on lateral G and 0.969 on yaw rate. Held to one identical tune, it lands within 0.4 to 3.9% across four further events.',
        'Validating on dynamics rather than on lap time is deliberate. Lap time is a single number and a great many wrong models can hit it; a matched lateral trace and a matched roll gradient are far harder to hit by accident.',
      ],
    },
    result: [
      'On the Endurance lap the transient model runs 141.39 s against a logged 142.22 s, 0.6% fast. Band-limited at 40 m the correlation is R-squared 0.994 on speed, 0.885 on longitudinal G, 0.965 on lateral G, and 0.969 on yaw rate.',
      'The suspension model checks out independently: simulated roll gradient is 0.499 deg/g against 0.506 measured on the car. That number is a result of the spring, damper and anti-roll bar rates, not an input, so it is a real test of the suspension model.',
      'Held to one identical tune across four more events, the model lands +0.4% on Autocross 2026, +1.9% on Autocross 2025, +2.7% on Boneyard 2025, and +3.9% on Endurance 2025.',
      'The correlation campaign produced a finding worth more than the lap times: lateral agreement is governed by whether the track file was built from the same log being replayed. Running the same car, same tune, and same log against two different track files for one event gave 152.71 s with no lateral signal against 143.70 s at R-squared 0.836. A 9 s lap-time error and the entire lateral correlation came from a 100 m track-length error and nothing else.',
      'Untuned, the quasi-steady model in the same family predicts 45.59 s on Michigan Autocross against a logged 42.28 s, and 130.81 s on Michigan Endurance against a logged 142.22 s. The two miss in opposite directions, which is the clearest evidence available that one grip constant was never going to fit both events, and it is the argument for a transient model that carries the suspension explicitly instead.',
      'The model and its data layer are ported to Python with numpy, scipy and openpyxl, reproducing the reference lap to every digit over 70,695 integration steps. A separate check rebuilds 17 derived quantities, including wheel loads, camber, slip and damper motion, from the reference run states and matches at float64 round-off, which tests the force model independently of the integrator.',
    ],
    limitations: [
      'In log replay the speed profile is imposed, so the speed correlation is high by construction and should not be read as a prediction. The lateral and yaw figures are the ones that mean something.',
      'The gear selector picks gear from a speed lookup with no hysteresis, so it chatters. The model changes gear 36 to 58 times a lap where the real car changes 13 to 18. Adding a dwell time is the fix and it is not done.',
      'No single shift point fits the courses. Logged time in first gear ranges from 4.8% to 50.1% depending on the course, so a global shift-rpm array is wrong somewhere by construction. It should come from the per-event driver preset, which already carries a measured value.',
      'The engine map rpm axis ends at 14500 and torque is held flat above it, so any operating point past that is extrapolating.',
      'The electric car cannot run this model. Its workbook has torque curve, motor efficiency and power limit data but no suspension sheet at all, so the suspension model has nothing to build from.',
      'Three of the older track files are 9 to 10.5 m out of registration with the logs they are compared against, which is why their lateral correlation collapses. The fix is to rebuild those tracks from their own logs, not to tune the car.',
      'The grip constant in the quasi-steady model is a per-event lap-time calibration, not a tyre property. It does not transport between events, and it does not transport between solvers either: the aero design space study is a different script and needs calibrating in its own right.',
    ],
    tools: ['MATLAB', 'Python (numpy, scipy, openpyxl)', 'MoTeC i2 logging and analysis', 'Excel'],
  },

  {
    slug: 'team-tooling',
    num: 7,
    title: 'Team tooling',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      'A taxonomy pipeline that generates 596 wiki pages, one lap simulation covering both cars, and a documentation agent whose publishing gate was measured against 13,808 real files before it was trusted.',
    thumb: null,
    thumbAlt: '',
    repo: null,
    problem: [
      'A Formula SAE team turns over every year and the car does not. The knowledge that matters, why a part is the shape it is and what was already tried, leaves with whoever worked it out. New members then spend their first months rediscovering decisions that were made and never written down, and the same mistakes get made on a three-year cycle.',
      'The tooling problem underneath it is that the team had the information already, scattered across a shared drive, parts workbooks, and design reports. It was not missing. It was unfindable, and nobody was going to hand-write a thousand pages to fix that.',
    ],
    myRole: [
      'I built these as Systems Engineering Lead, because the integration role is where the cost of undocumented decisions actually lands. I own the pipeline, the shared lap simulation, and the publishing gate the documentation agent runs behind.',
    ],
    approach: [
      'The first piece is a pipeline that turns the team parts workbook into the structure of the wiki. It reads the workbook and generates the part, subsystem, and subteam entries the site is built from, so the workbook is the single source and the generated files are disposable. Hand edits to the generated side are overwritten on the next run, which is deliberate: two sources of truth is the failure this was built to avoid. It carries no cost or supplier data, by design.',
      'The second is keeping one lap simulation rather than one per powertrain. The combustion and electric paths live in the same script, with the combustion side running the engine and fuel maps and the electric side running its torque curve, motor and battery efficiency, and power limit. Two separate models drift apart and then disagree, and nobody can tell which one is wrong.',
      'The third is the documentation agent. It generates a page for every part, subsystem, and subteam in the taxonomy, and a thing nobody has written up still gets a page: the page carries what the workbook knows and then a block naming each field still missing, using the template prompt for that field. Five hundred pages that each ask a specific question are worth more than five hundred that say nothing.',
      'Because both wiki sites are public and unauthenticated, what the agent is allowed to read is the thing standing between the shared drive and a public page. That gate has two layers: an absolute list of folders never to open, checked first, and a weighted score over the remaining folder names with three outcomes, read, refuse, or hold for a human. A folder under a refused folder stays refused, and a name matching nothing inherits its nearest scored ancestor.',
    ],
    callout: {
      title: 'A publishing gate is only worth what it measures, so this one was priced against the real shared drive',
      body: [
        'Both team wiki sites are public and unauthenticated, so what the agent is allowed to read is the only thing standing between a shared drive and a public page. That makes the gate the part of this system worth engineering hardest.',
        'It is built in two layers, cheapest and most certain first. An absolute list of folders never to open is checked before anything else. What survives that goes to a weighted score over folder names with three outcomes rather than two: read, refuse, or hold for a human. Three outcomes is the design decision that matters, because a binary gate forces every ambiguous folder into one of two wrong answers.',
        'Inheritance makes it safe under a deep tree. Anything beneath a refused folder stays refused, and a name matching no rule takes the decision of its nearest scored ancestor, so a folder cannot become readable by sitting somewhere unexpected.',
        'It is tuned by measurement, not by argument. A names-only dry run walks the live shared drive without opening a single file or writing anything back, and reports what each rule would decide. Engineering and personal vocabulary overlap far more than any term list assumes, so every rule is priced against 13,808 real files before it gates anything, and the rules document is generated by importing the scorer and calling it, which is what keeps the specification and the running behaviour in step.',
      ],
    },
    result: [
      'Verified by a real end-to-end run rather than by reading the code: five sources in, 611 notes and 617 site pages out, with nothing left unresolved. 596 of those pages are the generated taxonomy, covering 553 parts, 36 subsystems, and 7 subteams.',
      'The publishing gate was measured rather than argued. A names-only dry run over the live shared drive walked 13,808 files without opening one of them or writing anything back, refusing 1,355 and holding 142 across 223 folders for a human decision.',
      'The deduplication guard is the part I would defend hardest. Folding both case and punctuation catches 10 duplicate entries where folding case alone catches 6, and what makes the merge safe is that the test is structural rather than linguistic: two names can only be the same thing if no single car carries both, which is a fact in the workbook rather than a judgement call. A name-similarity merge would have folded an assembly into its own children; this one cannot. Nine further pairs are flagged on every run and deliberately left unmerged, because a parenthetical is not reliably an alias.',
      'The rules document cannot drift from the rules that run, because it is generated by importing the scorer and calling it rather than maintained alongside it.',
    ],
    limitations: [
      'The publishing rule set is a specification and a report generator, not a gate wired into the pipeline. It tells you what would be refused; it does not yet do the refusing.',
      'The pattern list is a first draft. Every pattern needs its own run against the real corpus and a false-positive review before it gates a publish, and a pattern that fires on anything in the known-good list needs narrowing rather than an override.',
      'A folder name that matches nothing inherits the decision of its nearest scored ancestor, so where a folder sits changes whether it is read. That is the intended behaviour and it also means a reorganisation of the shared drive can silently change the read set.',
      'Some genuine engineering files are still refused because of the folder they happen to sit under, and course-related folders split inconsistently depending on whether a subsystem term happens to fire in the name. Both are open, and both are judgement calls rather than bugs.',
      'The deduplication guard refuses to guess. It merges only what the structure proves is the same thing and flags the rest, so a human still has to settle the ambiguous cases by editing the workbook.',
      'The shared lap simulation only shares the quasi-steady path. The electric car cannot run the transient model at all, because its vehicle workbook carries no suspension data.',
    ],
    tools: ['Python', 'YAML', 'Excel', 'MATLAB', 'Git'],
  },

  {
    slug: 'naca-2412-wing-structure',
    num: 9,
    title: 'Multi-cell aluminum wing structure (NACA 2412)',
    role: 'AEM 341 course project',
    category: 'Aerospace Structures',
    headline:
      'Thickening the skin from 0.35 to 3.5 mm moves the governing failure from skin buckling at 41 N of lift to first yield at 10,094 N per wing, and FEA tip deflection lands within 3.1% of the hand calculation.',
    thumb: wingStress,
    thumbAlt:
      'SolidWorks FEA von Mises stress plot of the wing semi-span, clamped at the root and loaded upward. Stress is highest in green and orange near the root and fades to blue toward the tip.',
    repo: null,
    problem: [
      'The AEM 341 design project is a small aircraft, and the wing has to carry the lift the aircraft needs without yielding, buckling, or twisting, while staying light enough to be worth flying. The wing is a NACA 2412 section, 250 mm chord and 600 mm semi-span, in aluminum 6061-T6.',
      'The question is not only how strong the wing is, but which failure mode reaches it first. A thin skin that looks strong enough in bending can still buckle long before it yields, and a wing that is strong enough structurally may stall before it can ever be loaded to that point.',
    ],
    myRole: [
      'I designed and validated the wing structure for the team aircraft: the section layout and iterations in SolidWorks, the hand calculations for bending, multi-cell torsion and buckling, and the FEA check against them.',
    ],
    approach: [
      'The design went through four iterations. The first adapted a Formula SAE style spar, which was heavy and lacked torsional stiffness. The second, a thin-skinned section with three spar webs, was stiffer in torsion but its skin buckled at low load. The third added ribs, which pushed the mass to about 15 kg per wing. The fourth kept the three-web layout without ribs and thickened the skin so that it carries load without buckling.',
      'I treated the final section as a thin-walled, four-cell beam. The midline was split into short segments to get the area, centroid and second moments, including the product of inertia, which is non-zero because the airfoil is cambered, so the unsymmetric bending formula is the one that applies. Those properties were checked against SolidWorks mass properties: Iy, which governs lift bending, agrees to 0.2%.',
      "For torsion I solved the four-cell shear flow equations with equal twist in every cell, which gives the torsion constant, the critical wall, and the shear centre at 36.7% chord. Lift was distributed along the span with Schrenk's approximation and applied at the quarter chord, so the root carries both a bending moment and a torque about the shear centre. Bending and torsion were then combined with von Mises at every point on the skin.",
      'Buckling is not on the course formula sheet, but it decided the skin thickness. I treated each upper-skin panel between spars as a simply supported flat plate and repeated the full section calculation for skin thicknesses from 0.1 to 100 times the original, to find where the buckling and yield curves cross.',
    ],
    specs: [
      { label: 'Section', value: 'NACA 2412, 250 mm chord, 600 mm semi-span, rectangular planform' },
      { label: 'Structure', value: '3.5 mm skin, three spar webs (0.67, 1.28, 1.56 mm), four cells, no ribs' },
      { label: 'Material', value: 'Aluminum 6061-T6, first yield at 276 MPa' },
      { label: 'Root bending limit', value: '2,803 N·m' },
      { label: 'Root torque limit', value: '2,508 N·m, set by the 1.56 mm spar 3 web' },
      { label: 'Maximum lift per wing', value: '10,094 N (6,729 N with a 1.5 factor of safety)' },
      { label: 'Structural load factor', value: 'n = 20,188 / W, with W in newtons' },
      { label: 'Mass per semi-span', value: '2,828 g calculated, 2,863 g in SolidWorks' },
    ],
    figures: [
      {
        src: wingSection,
        alt: 'Idealized NACA 2412 cross-section, 250 mm long, divided into four cells by three vertical spar webs at about 55, 121 and 185 mm, labelled t = 0.67, 1.28 and 1.56 mm. The shear centre is marked at 91.8 mm, the centroid at 118.4 mm, and a dotted line marks the quarter chord.',
        caption:
          'Idealized section: four cells, three spar webs, the shear centre at 91.8 mm and the centroid at 118.4 mm from the leading edge. Lift at the quarter chord sits ahead of the shear centre, so it twists the wing nose up.',
      },
      {
        src: wingBuckling,
        alt: 'Log-log chart of lift per semi-span wing at failure against skin thickness. The buckling curve rises steeply and crosses the flatter first-yield curve at about 2.16 mm. The original 0.35 mm skin sits far below the crossing, and the 3.5 mm design skin sits above it, where yield governs and buckling is about 2.6 times higher.',
        caption:
          'Buckling load grows with the square of skin thickness and yield load grows much more slowly, so the two cross at about 2.16 mm. At the original 0.35 mm the skin buckles at 41 N of lift per wing, 2.6% of its yield load. At 3.5 mm yield governs and buckling is 2.6 times further away.',
      },
      {
        src: wingStress,
        alt: 'SolidWorks von Mises stress plot of the wing, fixed at the root and loaded upward. Stress is highest along the upper skin near the root and fades to blue toward the tip. The maximum label reads 345.9 MPa at the root leading edge, against a 275 MPa yield strength marker on the colour bar.',
        caption:
          'SolidWorks FEA, von Mises stress at the maximum-lift load case. The stress field is highest on the upper skin near the root, where the hand calculation puts the critical point. The 345.9 MPa peak sits on the clamped root edge, a fixture stress concentration the beam model deliberately leaves out.',
      },
      {
        src: wingDeflection,
        alt: 'SolidWorks displacement plot of the same wing, rising smoothly from zero at the clamped root in blue to a maximum of 24.75 mm at the tip in red.',
        caption: 'Tip deflection from FEA is 24.75 mm against 24 mm from the hand calculation, a 3.1% difference.',
      },
    ],
    callout: {
      title: 'The thickness was chosen by where the failure modes cross, not by a strength margin alone',
      body: [
        'With the original 0.35 mm skin the wing was strong enough in bending on paper, at about 1,570 N of lift per wing, but the upper skin buckled at 41 N. The spars are plain webs with no caps or stringers, so a buckled skin has nowhere to shed its load.',
        'Sweeping skin thickness across three orders of magnitude showed the crossover at about 2.16 mm. At 3.5 mm the wing yields before it buckles, with buckling 2.6 times further away. Comparing the structural limit with the most lift the airfoil can make at its maximum lift coefficient also shows the wing stalls before it yields at any speed below 271 m/s, so in practice the load factor is limited by aerodynamics rather than by the structure.',
      ],
    },
    result: [
      'The root section carries 2,803 N·m in bending and 2,508 N·m in pure torque before first yield. Under the Schrenk lift distribution bending governs, and adding torsion lowers the combined limit by less than 0.2%.',
      'Each semi-span carries 10,094 N of lift at first yield, or 6,729 N with a 1.5 factor of safety, which gives a structural load factor of 20,188 / W for an aircraft of weight W.',
      'The hand-calculated section properties match SolidWorks to within 0.2% on Iy and 0.1% on area, and the FEA tip deflection matches the hand calculation to within 3.1%.',
    ],
    limitations: [
      'The 3.5 mm skin is heavy: 2,828 g per semi-span against 416 g for the original. Buckling stops governing at about 2.16 mm, so a thinner skin with stringers or spar caps would likely reach the same strength for much less mass.',
      'Spar 3 is now the weakest wall in torsion, because at 1.56 mm it is thinner than the skin. Thickening it would raise the torque limit toward about 4,000 N·m. Torsion does not govern the load factor, so I left it.',
      'The buckling check treats each skin panel as a flat plate, which is conservative because curvature raises the buckling stress. The trailing edge, where the skins merge, is outside the thin-wall model.',
      'The analysis neglects drag, chordwise bending, self-weight, inertia relief and stress concentrations at the root. The FEA peak at the clamped root edge is exactly that concentration, and a real root fitting would need its own analysis.',
    ],
    tools: ['SolidWorks', 'SolidWorks Simulation (FEA)', 'Thin-walled beam theory', 'Multi-cell torsion', 'Plate buckling'],
    documents: [
      { label: 'Full structural analysis report', href: '/files/aem341-wing-structural-analysis.pdf', note: 'PDF, 8 pages' },
      { label: 'Project presentation', href: '/files/aem341-wing-presentation.pdf', note: 'PDF, 13 slides' },
    ],
  },

  {
    slug: 'sim-suite-reforged',
    num: 10,
    title: 'Sim Suite Reforged: the team lap simulation as a desktop app',
    role: 'Systems Engineering Lead',
    category: 'Systems Engineering',
    headline:
      'The team MATLAB lap simulations rebuilt as a Windows app any member can install, with no MATLAB. Every model is held to frozen MATLAB runs: quasi-steady lap times match within 1e-13 s, and a 14 DOF lap runs in about 1 s against 34 s in MATLAB.',
    thumb: simsuiteLapOverview,
    thumbAlt:
      'The Sim Suite Reforged main window in a MoTeC i2 style layout: a run list on the left, stacked speed, throttle, brake and gear traces against distance in the middle, a track map on the right, and a channel list down the right edge.',
    repo: null,
    problem: [
      'The lap simulations in projects 3, 4, 5 and 8 were MATLAB scripts. Running one meant a MATLAB licence, the right folder layout, and knowing which variables to edit at the top of which script, so in practice the simulation answered questions only for the few people who wrote it. Everyone else on the team asked them.',
      'The scripts had also drifted apart. Three separate quasi-steady solvers had grown up in three scripts, each with its own lap solver, and on the same car they returned different autocross times. A design question could get a different answer depending on which script somebody happened to open.',
    ],
    myRole: [
      'As Systems Engineering Lead I own the app: its architecture, the port from MATLAB to Python, the test suite that holds the port to the original models, the installer, and the releases members run. Members file bug reports from inside the app, and those land in a team folder I work through.',
    ],
    approach: [
      'The first step was to choose one quasi-steady solver as the baseline and wrap it, and the 14 DOF model, as pure functions behind a common adapter: describe its settings, validate them, run, and return one common run object. Everything else in the app, the editors, the plots, the exports and the sweeps, talks to that adapter rather than to a model, which is what lets a new model drop in without touching the window.',
      'Before any model was ported, its MATLAB output was frozen. Capture scripts run the original MATLAB code and save lap times, every channel, the solver intermediates, the vehicle builds and the random-number streams as golden fixtures. A Python piece replaces a MATLAB piece only once it matches those fixtures, so the port is judged against the models the team already trusted rather than against itself.',
      'The Python side is numpy, scipy and openpyxl for the models, numba to compile the 14 DOF time loop, and PySide6 with pyqtgraph for a window laid out like MoTeC i2, the tool the team already reads logged data in. A run can be overlaid on another, a variance channel shows where time is gained or lost, and a run exports to MoTeC .ld files that open in i2 beside a logged lap.',
      'On top of single laps the app runs designed studies: full factorial grids, Latin hypercubes, central composite and one-at-a-time designs over any vehicle field or run setting, scored either as a lap or as all four dynamic events converted to competition points. Points run in parallel worker processes, a stopped sweep keeps every finished point and resumes, and the same studies are reachable from a local HTTP API so scripts can drive them.',
      'Every release is built and checked by one script: it runs the full test suite, freezes the app with PyInstaller, checks the frozen copy against the MATLAB laps again, then installs, upgrades and uninstalls it silently and checks it once more. A release cannot ship with a red test.',
    ],
    specs: [
      { label: 'Models', value: 'Quasi-steady point mass (combustion and electric), 14 DOF transient with an MF6.1 tyre, accel and skidpad events' },
      { label: 'Studies', value: 'Grid, Latin hypercube, central composite, one at a time; lap or competition points; parallel and resumable' },
      { label: 'Tools in the app', value: 'Vehicle builder, track builder from a logged lap, grip auto-tune, math channels, driver presets' },
      { label: 'Exports', value: 'CSV, Excel, text report, MoTeC i2 .ld and .ldx' },
      { label: 'Code', value: 'About 26,000 lines of Python, 394 tests held to frozen MATLAB runs' },
      { label: 'Delivery', value: '90 MB per-user Windows installer; no MATLAB, MATLAB Runtime or Python needed' },
      { label: 'Version', value: '1.5.2' },
    ],
    figures: [
      {
        src: simsuiteLapOverview,
        alt: 'The Lap Overview tab with two Michigan Autox 2026 runs of CR26I overlaid. Stacked traces against distance show the variance between the runs, speed, throttle, brake pressure and gear, with a track map coloured by speed on the right and a cursor values table along the bottom.',
        caption:
          'Lap Overview, two runs of the same car overlaid. The top trace is the variance channel, the time one run gains on the other along the lap, and the table below reads every plotted channel at the shared cursor. The layout follows MoTeC i2 on purpose, so a simulated lap reads the way a logged one does.',
      },
      {
        src: simsuiteSweep,
        alt: 'The Sweeps tab. On the left, a full factorial design over total mass and downforce coefficient, with the parallel worker count and a time estimate. On the right, a response surface of lap time over mass and downforce coefficient, from 44.22 s at low mass and high downforce to 45.52 s at high mass and low downforce, above a sortable results table.',
        caption:
          'A designed sweep over mass and downforce coefficient on Michigan Autox 2026, with the response surface and the sortable results table. Any point opens as an ordinary run, so a surprising cell can be inspected channel by channel rather than taken on trust.',
      },
    ],
    callout: {
      title: 'The port is judged against the models the team already trusted, not against itself',
      body: [
        'A rewrite that is only tested against its own output can drift from the original and still pass. So every model was frozen in MATLAB first, and the Python version had to reproduce it before it replaced anything.',
        'The quasi-steady lap matches MATLAB within 1e-13 s and every channel within 1e-7. All six 14 DOF cases, from log replay to the measured MF6.1 tyre, take the same step count and the same lap time, with every channel within 1e-12. The electric car matches its state of charge bit for bit at all 24,992 points of a 22-lap endurance run. The CSV, text and MoTeC exports are byte-identical to the MATLAB app for the same run, and the .ld files were opened and plotted in MoTeC i2 Pro itself.',
        'Even the random parts are pinned. The Latin hypercube design matches MATLAB point for point, because numpy and MATLAB share the same Mersenne Twister with the same default seed. That is what lets a sweep run in the app be compared directly with one run in MATLAB a year earlier.',
      ],
    },
    result: [
      'Seven members have installed the app and run it with no issues, where the MATLAB version had four users. It installs from one per-user setup file, with no administrator rights and no MATLAB, and has gone through six versions since the launch version members first received.',
      'Speed changed what the models are used for. A 14 DOF lap integrates in about 1 s against 34 s in MATLAB, a quasi-steady autocross lap solves in under half a second, and sweep workers start in about 2 s rather than the 20 a MATLAB Runtime worker took. A competition-points sweep scores all four dynamic events at about 2 s a point, which makes a design study a lunch-break job rather than an overnight one.',
      'The quasi-steady model is calibrated to the measured CR26I times from Michigan 2026, so other cars in a design study get the same per-event correction the real car needed.',
      'The grip auto-tune turned up a model finding rather than a number. Tuned against a logged endurance lap, the quasi-steady model is about 1.2 m/s too fast at the corner minima and 1 to 1.7 m/s too slow on the straights at any grip, so grip cannot fix both, and the error is in the straight-line model: power, drag or gearing. The tuner now reports that as a warning instead of returning a grip value that quietly absorbs it.',
      'Scripts and chat tools can run laps and sweeps through a local HTTP API. It answers this computer only: it listens on the loopback address, refuses requests that name another host so a web page cannot reach it through DNS rebinding, and accepts only JSON bodies.',
    ],
    limitations: [
      'The quasi-steady calibration is one flat time factor per event. The autocross factor is 6.1%, and a flat factor assumes the model error stays the same as the car changes, which is unlikely where the error comes from grip or transient behaviour. Tuning grip against a logged lap would carry over better.',
      'The installer is not code-signed, so Windows SmartScreen warns on the first run. Engine heat, tyre temperature and wheel speed models are waiting on logged data.',
    ],
    tools: ['Python (numpy, scipy, numba, openpyxl)', 'PySide6 and pyqtgraph', 'MATLAB', 'PyInstaller and Inno Setup', 'MoTeC i2', 'Git'],
  },

];

/**
 * Published projects, in plan roster order. The whole roster is written as of
 * 2026-10-05, so `drafts` is empty; the flag and the filter stay because the
 * next page to be started should be held back the same way rather than shipped
 * half written.
 */
export const published = projects
  .filter((p) => !p.draft)
  .sort((a, b) => a.num - b.num);

/** Roster entries still waiting on content. Not rendered anywhere. */
export const drafts = projects.filter((p) => p.draft).sort((a, b) => a.num - b.num);

/** The home page features the first three published projects. */
export const featured = published.slice(0, 3);

export const categories: Category[] = ['Cooling', 'Systems Engineering', 'Aerospace Structures'];
