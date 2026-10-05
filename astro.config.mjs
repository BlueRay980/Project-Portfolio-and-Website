import { defineConfig } from 'astro/config';

// The repo is a project repo, not <username>.github.io, so Pages serves the
// site from a sub-path. `site` + `base` keep every internal link and asset URL
// correct in production without changing anything during local dev.
export default defineConfig({
  site: 'https://blueray980.github.io',
  base: '/Project-Portfolio-and-Website',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: true },
});
