// Single place for the things that appear on more than one page.
// Anything set to null is simply not rendered, so the site never ships a dead link.

export const site = {
  name: 'Matthew Jordan',
  degree: 'Dual B.S. Mechanical and Aerospace Engineering, University of Alabama, May 2028',
  roles: ['Cooling Senior Engineer', 'Systems Engineering Lead'],
  team: 'Crimson Racing',
  teamNote: 'Formula SAE, University of Alabama',
  email: 'MatthewJJordan06@gmail.com',

  // Set this to the LinkedIn profile URL. While it is null the link is hidden
  // rather than rendered broken.
  linkedin: null as string | null,

  // Set this to 'resume.pdf' once a public resume variant (no street address,
  // no phone number) is placed in public/. While it is null the Resume nav item
  // and the home-page button fall back to a plain "available on request" line.
  resumeUrl: null as string | null,

  github: 'https://github.com/BlueRay980',
  repo: 'https://github.com/BlueRay980/Project-Portfolio-and-Website',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];
