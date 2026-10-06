import type { ImageMetadata } from 'astro';

import ductHero from '../assets/duct-hero.jpg';
import ductShroud from '../assets/duct-shroud-before-layup.jpg';
import ductFinished from '../assets/duct-finished.jpg';
import radiatorPlot from '../assets/radiator-heat-rejection.png';
import evPlot from '../assets/ev-power-limit.png';
import torqueMap from '../assets/engine-torque-map.png';
import wheelLoads from '../assets/wheel-loads.png';

export type Role = 'Cooling Senior Engineer' | 'Systems Engineering Lead';
export type Category = 'Cooling' | 'Systems Engineering';

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
    callout: {
      title: 'These numbers predate a correction to the simulation, and I have left them up rather than quietly restating them',
      body: [
        'In October 2026 I found three defects in the quasi-steady model this study ran on. Vertical load was adding weight and downforce instead of subtracting, so downforce was reducing tyre load rather than increasing it. Drag and rolling resistance were being subtracted where the coefficients are stored negative, so both were adding thrust instead of taking it away. And the acceleration traction limit was built from the raw tyre coefficients without the grip scaling factor, so tuning grip moved corner speeds and braking but left the acceleration cap untouched.',
        'All three are fixed. None of the numbers on this page have been regenerated yet.',
        'What I expect to move, and what I do not: this study is a ranking of 36 strategies against each other under one fixed energy budget, and all 36 were scored by the same model with the same defects. A ranking is far more robust to a systematic error than the absolute figures are. The lap times were almost certainly optimistic, because the car was being given thrust it did not have, so the energy figures are the ones I would trust least.',
        'The honest status is that the shape of the conclusion stands and the numbers are pending a re-run. I would rather say that than take the page down or silently swap figures nobody has checked.',
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
      'I would treat the ranking between strategies as more trustworthy than the absolute lap times. That was true before the correction above and it is more true after it.',
      'The figures on this page come from the pre-correction model. They have not been regenerated, and the callout above says exactly which three defects were in play.',
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
      'Lift and drag swept across a scored design space. After correcting three defects in the solver, the optimum moved to the corner: as much downforce as the range allows, and the least drag.',
    thumb: '/figures/aero-points-space.svg',
    thumbAlt:
      'Grid of total competition points over lift and drag coefficients, rising toward the corner with the most downforce and least drag.',
    repo: null,
    problem: [
      'The aerodynamics group wants more downforce. Downforce costs drag, and drag costs acceleration and top speed. Asking which wins in lap time does not settle it, because a Formula SAE car is not scored on lap time. It is scored across four dynamic events with different point weightings, and each is scored relative to the rest of the field.',
      'So the question is what a count of downforce is worth in points rather than in seconds, and the design review needed the answer in that form.',
    ],
    myRole: [
      'I own the sweep and the solver underneath it. In October 2026 I found three defects in that solver, fixed them, and re-ran this study. The before and after is the substance of this page, because the correction changed the recommendation.',
    ],
    approach: [
      'The sweep varies lift and drag coefficient across the range the aero package could plausibly reach, runs all four dynamic events at every grid point, converts each event time to points using the competition scoring formulas, and sums them.',
      'The first version of this study put the optimum inside the range, at a middling downforce level. That result was wrong, and the reason sat in the lap solver rather than in the sweep.',
      'Three defects, all in the acceleration path. Vertical load was adding weight and downforce instead of subtracting, so downforce reduced tyre load rather than increasing it. Rolling resistance was subtracted where the coefficient is stored negative, so it added thrust. And the tyre longitudinal limit was never applied at all: the solver computed it, then discarded it, so acceleration was capped only by engine force minus drag.',
      'The third one is why the downforce answer came out wrong. If the tyre limit never binds, extra grip buys nothing, and downforce enters the model almost entirely through the drag that comes with it.',
    ],
    specs: [
      { label: 'Design space', value: 'Cl -5.0 to -3.0, Cd -1.8 to -1.0, 25 grid points' },
      { label: 'Vehicle', value: 'CR26I at 293.41 kg' },
      { label: 'Events', value: 'Acceleration, skidpad, autocross, endurance' },
      { label: 'Solver state', value: 'Post-correction and untuned, with no grip calibration applied' },
    ],
    figures: [
      {
        src: '/figures/aero-points-space.svg',
        alt: 'A five by five grid of total competition points over lift coefficient from -3.0 to -5.0 and drag coefficient from -1.8 to -1.0. Values rise steadily from 175.5 at the least downforce and most drag corner to 192.6 at the most downforce and least drag corner, which is outlined in red. Each cell also shows its autocross time, between 53.3 and 54.2 seconds.',
        caption:
          'The corrected design space. The best point sits at the corner of the swept range, so the sweep bounds the answer rather than locating a peak inside it. Endurance scores zero at all 25 points, for the reason given under Known limitations, so these totals cover three of the four events.',
      },
    ],
    callout: {
      title: 'The tyre limit was computed and then thrown away, and that is what made downforce look worthless',
      body: [
        'The solver built a full grip envelope, including the pure-longitudinal tyre acceleration limit at every speed. In the branch that actually ran the lap, that limit was never read. Acceleration came out as engine force minus drag, with nothing capping it at what the tyres could transmit.',
        'A car that can always put its power down does not care how much vertical load it has. So downforce reached the result almost entirely as a drag penalty, and the sweep duly reported that past a moderate level, more downforce made the car slower.',
        'With the limit applied, the corrected model reports the car as traction-limited for 73 to 95% of a lap depending on the course. That is the regime where downforce pays, and the optimum moves accordingly.',
        'The same conclusion arrived independently from the other direction. The one-at-a-time sensitivity study, on a separate codebase, found horsepower worth exactly zero seconds for the same underlying reason: this car is traction-limited almost everywhere. Two models, two solvers, one answer.',
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
      'Endurance scores zero at all 25 points. The corrected, untuned model runs the endurance distance in 2186 to 2213 s against a 1410 s reference time, so the event saturates at the bottom of its scoring range and contributes nothing. The totals here therefore cover three of four events and are not comparable with the pre-correction figures.',
      'That gap is the honest cost of the fix. Removing the phantom thrust and applying the tyre limit made the car substantially slower, and every grip calibration constant fitted to the old model is now invalid. The model needs re-tuning against logged laps before any score it produces can be read as a competition score.',
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
      'As Systems Engineering Lead I own this tool and the numbers that come out of it. I wrote the multi-vehicle sweep, found and fixed the three defects below, and ran the campaign. The defects are mine, and two of them had already produced results that the team had been reading.',
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
      title: 'The workbook said more downforce makes the car slower, and the solver was right all along',
      body: [
        'The first version of this sweep produced a result the whole team would have acted on: adding downforce made the car slower. It was wrong, and nothing in the output looked wrong.',
        'The sweep scale for the two coefficients was being inverted in one place and not in the other, so the column reporting what value had been used disagreed with the value actually fed to the solver. The row labelled +50% lift coefficient was reporting a number from a run that had used the opposite end of the sweep. The solver was never wrong; the label was.',
        'What made it survive review is that lift coefficient and lift area scale the identical product, so the two sheets came out as exact mirror images of each other to four decimals. A clean, symmetric, entirely plausible pair of curves pointing the wrong way.',
        'Two more defects sat underneath it. Vertical load was adding weight and downforce instead of subtracting, and rolling resistance was being subtracted where it should have been added, which together produced a constant phantom forward acceleration of 0.628 m/s-squared at every speed. Separately, the acceleration path never applied the tyre longitudinal limit at all: the car was being allowed 2 to 4.8 g where the tyre delivers 0.6 to 0.9 g.',
        'The check that now proves the fix is the one that exposed it. Lift coefficient and lift area agree row for row instead of mirroring, and so do drag coefficient and frontal area. That agreement is visible in the chart above, which is why those two are not plotted twice.',
      ],
    },
    result: [
      'On Michigan Endurance IC 2026 the 293.41 kg car runs a 129.23 s baseline. Halving mass is worth 13.16 s and adding 50% costs 6.80 s, which is roughly three times the next parameter and settles that mass is where the effort goes.',
      'The ranking is identical on all seven mass cases: mass, then lift coefficient and lift area, then final gear reduction, then drag coefficient and frontal area, then centre of pressure, then horsepower. A ranking that survives a 27 kg change in the car is a property of the car rather than of one configuration.',
      'More downforce is worth 4.64 s on this course. Taking Cl from its baseline -3.68 to -5.52 drops the lap from 129.23 s to 124.59 s, and the sweep is monotonic the whole way: -2.76 gives 131.62 s, -4.60 gives 126.88 s. Worth stating plainly because the sign convention is the trap on this car. Cl is stored negative, so the sweep step called +50% is more downforce, not less, and a reader who takes it the other way concludes the model has downforce backwards.',
      'Every column is monotonic across the whole mass range with no kinks. That is itself a check on the fix, because a surviving sign error would show up as a discontinuity somewhere in the sweep.',
      'Downforce pays most on the light car, and so does mass. Halving lift coefficient costs 5.120 s at 279.82 kg but only 4.578 s at 307 kg, while mass sensitivity falls over the same range from -13.457 s to -12.899 s. Both trends point the same way: the light end of the range is where aerodynamic work is worth most.',
      'Horsepower reads exactly 0.000 in both directions, on every vehicle, and that is a correct result rather than a bug. The car is traction limited at every speed on this course, so in a point-mass model a power change cannot move the lap. Gearing behaves the same way and for the same reason: taller gearing changes nothing, while shorter gearing costs 2.24 s by capping speed on the long straights.',
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
      'As Systems Engineering Lead I built the transient model, replaced the single torque curve with the 2-D engine map path, added the suspension, and ran the correlation campaign against logged laps. The torque map correction below is a defect I found in my own driveline maths.',
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
        title: 'The correction: the workbook map is gear torque, not crank torque',
        lang: 'matlab',
        code: [
          '% The EngineSpecs 2-D map is "Gear Torque" = crank torque * a constant gear',
          '% factor, but the driveline below multiplies en_torque_curve by',
          '% primary/gearbox/final as if it were CRANK torque, so the engine was',
          '% over-torqued ~3x, and the fuel path compared a CRANK torque demand',
          '% against the GEAR-torque map. Rescale the map to true crank torque.',
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
          'The 2-D engine map the acceleration limit is taken from, after the gear-torque correction. Peak crank torque lands near 49 Nm, which is the number the correction was validated against.',
      },
      {
        src: wheelLoads,
        alt: 'Four panels of wheel load data over one Endurance lap: individual loads at all four corners against distance, front and rear axle loads with the total, front load share against distance scattering either side of 50 percent, and a track map coloured by total wheel load.',
        caption:
          'Load at all four corners over one Endurance lap. This is the output a point-mass model cannot produce: the total load trace drops where the car is light over crests and the front share swings either side of 50% through braking and corner exit.',
      },
    ],
    callout: {
      title: 'The engine was over-torqued by about three times, and the workbook column name is why',
      body: [
        'The vehicle workbook stores two torque columns, gear torque and brake torque. The 2-D map was built from the gear torque column, which is crank torque already multiplied by a constant gear factor. The driveline code then multiplied it again by primary, gearbox, and final drive ratios, as though it were crank torque.',
        'The result was an engine roughly three times too strong, and a fuel path that was comparing a crank torque demand against a gear torque map, so the two were inconsistent as well as wrong. Nothing errored. The car simply accelerated harder than it could.',
        'The fix takes the gear factor from the workbook itself rather than hard-coding it: the two columns are read, their ratio is taken row by row, and the median is used, which comes out at 2.9946. Rescaling the map puts peak crank torque near 36.8 lb-ft, about 49 Nm, matching the published engine spec. That is the check that confirmed it.',
        'It is worth saying what this cost: the correction moves acceleration, top speed, engine load, and the whole fuel path, so every sweep result predating it shifts and the fuel correction factor had to be recalibrated.',
      ],
    },
    result: [
      'On the Endurance lap the transient model runs 141.39 s against a logged 142.22 s, 0.6% fast. Band-limited at 40 m the correlation is R-squared 0.994 on speed, 0.885 on longitudinal G, 0.965 on lateral G, and 0.969 on yaw rate.',
      'The suspension model checks out independently: simulated roll gradient is 0.499 deg/g against 0.506 measured on the car. That number is a result of the spring, damper and anti-roll bar rates, not an input, so it is a real test of the suspension model.',
      'Held to one identical tune across four more events, the model lands +0.4% on Autocross 2026, +1.9% on Autocross 2025, +2.7% on Boneyard 2025, and +3.9% on Endurance 2025.',
      'The correlation campaign produced a finding worth more than the lap times: lateral agreement is governed by whether the track file was built from the same log being replayed. Running the same car, same tune, and same log against two different track files for one event gave 152.71 s with no lateral signal against 143.70 s at R-squared 0.836. A 9 s lap-time error and the entire lateral correlation came from a 100 m track-length error and nothing else.',
      'The quasi-steady model in the same family was corrected in October 2026 and now predicts, untuned, 45.59 s on Michigan Autocross against a logged 42.28 s, and 130.81 s on Michigan Endurance against a logged 142.22 s. The two miss in opposite directions, which is the clearest evidence that one grip constant was never going to fit both events: it was absorbing a model error rather than describing a tyre.',
      'That correction included a seam defect worth stating on its own. The solver was joining open courses end to end, which corrupted three points at the wrap. Fixing it moved the autocross lap time by 0.035 s and dropped peak longitudinal deceleration from -3.35 g to -0.933 g. A defect that ruins every peak statistic while costing almost nothing in lap time is exactly the kind that survives unnoticed, and it is why I check dynamics rather than lap time when validating a change.',
      'The model and its data layer are ported to Python with numpy, scipy and openpyxl, reproducing the reference lap to every digit over 70,695 integration steps. A separate check rebuilds 17 derived quantities, including wheel loads, camber, slip and damper motion, from the reference run states and matches at float64 round-off, which tests the force model independently of the integrator.',
    ],
    limitations: [
      'In log replay the speed profile is imposed, so the speed correlation is high by construction and should not be read as a prediction. The lateral and yaw figures are the ones that mean something.',
      'The gear selector picks gear from a speed lookup with no hysteresis, so it chatters. The model changes gear 36 to 58 times a lap where the real car changes 13 to 18. Adding a dwell time is the fix and it is not done.',
      'No single shift point fits the courses. Logged time in first gear ranges from 4.8% to 50.1% depending on the course, so a global shift-rpm array is wrong somewhere by construction. It should come from the per-event driver preset, which already carries a measured value.',
      'The engine map rpm axis ends at 14500 and torque is held flat above it, so any operating point past that is extrapolating.',
      'The electric car cannot run this model. Its workbook has torque curve, motor efficiency and power limit data but no suspension sheet at all, so the suspension model has nothing to build from.',
      'Three of the older track files are 9 to 10.5 m out of registration with the logs they are compared against, which is why their lateral correlation collapses. The fix is to rebuild those tracks from their own logs, not to tune the car.',
      'The grip constant in the quasi-steady model remains a per-event lap-time calibration, not a tyre property. Treat tuned constants as specific to one solver on one event.',
      'Every grip constant fitted to the quasi-steady model before the October 2026 correction is invalid, because they were tuned against a solver that was over-accelerating. Any lap time it quotes now is an untuned prediction rather than a calibrated match, and a re-tune is outstanding.',
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
      'A taxonomy pipeline that generates 596 wiki pages, one lap simulation covering both cars, and a documentation agent whose publishing rules were corrected by running them over 13,808 files.',
    thumb: null,
    thumbAlt: '',
    repo: null,
    problem: [
      'A Formula SAE team turns over every year and the car does not. The knowledge that matters, why a part is the shape it is and what was already tried, leaves with whoever worked it out. New members then spend their first months rediscovering decisions that were made and never written down, and the same mistakes get made on a three-year cycle.',
      'The tooling problem underneath it is that the team had the information already, scattered across a shared drive, parts workbooks, and design reports. It was not missing. It was unfindable, and nobody was going to hand-write a thousand pages to fix that.',
    ],
    myRole: [
      'I built these as Systems Engineering Lead, because the integration role is where the cost of undocumented decisions actually lands. The failures described below are mine, found in my own tools.',
    ],
    approach: [
      'The first piece is a pipeline that turns the team parts workbook into the structure of the wiki. It reads the workbook and generates the part, subsystem, and subteam entries the site is built from, so the workbook is the single source and the generated files are disposable. Hand edits to the generated side are overwritten on the next run, which is deliberate: two sources of truth is the failure this was built to avoid. It carries no cost or supplier data, by design.',
      'The second is keeping one lap simulation rather than one per powertrain. The combustion and electric paths live in the same script, with the combustion side running the engine and fuel maps and the electric side running its torque curve, motor and battery efficiency, and power limit. Two separate models drift apart and then disagree, and nobody can tell which one is wrong.',
      'The third is the documentation agent. It generates a page for every part, subsystem, and subteam in the taxonomy, and a thing nobody has written up still gets a page: the page carries what the workbook knows and then a block naming each field still missing, using the template prompt for that field. Five hundred pages that each ask a specific question are worth more than five hundred that say nothing.',
      'Because both wiki sites are public and unauthenticated, what the agent is allowed to read is the thing standing between the shared drive and a public page. That gate has two layers: an absolute list of folders never to open, checked first, and a weighted score over the remaining folder names with three outcomes, read, refuse, or hold for a human. A folder under a refused folder stays refused, and a name matching nothing inherits its nearest scored ancestor.',
    ],
    callout: {
      title: 'Engineering and personal vocabulary overlap far more than a term list assumes',
      body: [
        'The publishing rules looked sound written down. Every one of the corrections below came from running them against the real shared drive, and none from reading them.',
        'A rule meant to catch CVs refused constant-velocity drivetrain parts across four cars, and caught no actual CV. A profanity rule refused twelve genuine engineering folders, two of them finite element studies. A single ordinary word in the token list refused 421 folders, most of them sync-conflict CAD. A name detector read a job title as a person. Nine rules changed and three were dropped outright because the run priced them.',
        'Underneath that sat a worse one, a process bug rather than a rule. The scorer self test was loading a fallback vocabulary instead of the real subsystem list, so it passed green while several real terms behaved differently in production. It was found only by generating the rule workbook from the code that actually runs, rather than maintaining the document separately. The self test now refuses to run against the fallback at all.',
        'The lesson generalises past this tool. A keyword blocklist written from imagination encodes what you expect the vocabulary to be, and an engineering shared drive is exactly where that expectation is wrong.',
      ],
    },
    result: [
      'Verified by a real end-to-end run rather than by reading the code: five sources in, 611 notes and 617 site pages out, with nothing left unresolved. 596 of those pages are the generated taxonomy, covering 553 parts, 36 subsystems, and 7 subteams.',
      'The publishing gate was measured rather than argued. A names-only dry run over the live shared drive walked 13,808 files without opening one of them or writing anything back, refusing 1,355 and holding 142 across 223 folders for a human decision.',
      'The deduplication guard is the part I would defend hardest. Folding both case and punctuation caught 10 duplicate entries where folding case alone caught 6. A first attempt that reused the prose glossary to merge entries folded four more pairs and every one was wrong, because three of them were an assembly and its own children. The guard that makes it safe is structural: two names can only be the same thing if no single car carries both, which is a fact in the workbook rather than a judgement call. Nine further pairs are flagged on every run and deliberately left unmerged, because a parenthetical is not reliably an alias.',
      'The rules document cannot drift from the rules that run, because it is generated by importing the scorer and calling it. That is what exposed the self-test bug above.',
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

export const categories: Category[] = ['Cooling', 'Systems Engineering'];
