const BASE = import.meta.env.BASE_URL;

/**
 * Build an internal URL that is correct both locally and under the GitHub Pages
 * sub-path. Pass a site-root-relative path like '/projects' or '/'.
 */
export function url(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  if (!path.startsWith('/')) path = '/' + path;
  const joined = base + path;
  // Collapse the root case so '/base' + '/' does not become '/base/'.
  return joined.length > 1 && joined.endsWith('/') ? joined.slice(0, -1) : joined;
}
