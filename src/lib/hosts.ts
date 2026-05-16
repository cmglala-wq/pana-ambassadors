// Single source of truth for host detection.
// Admin site is the only place that:
//   - calls /api/* Pages Functions
//   - is protected by CF Access (Google login + Allow team)
//   - shows the Admin Console as default landing
// Public site is read-only mock for embajadores (no live data, no CF Access).

export const ADMIN_HOSTS = [
  'pana-ambassadors-admin.pages.dev',
  'admin.pana-ambassadors.pages.dev'
];

export function isAdminHost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  if (h === 'localhost' || h.endsWith('.localhost')) {
    // Dev: allow ?admin=1 to simulate admin mode
    return new URLSearchParams(window.location.search).get('admin') === '1';
  }
  return ADMIN_HOSTS.includes(h) || h.includes('-admin.pages.dev') || h.startsWith('admin.');
}

export const ADMIN_URL = 'https://pana-ambassadors-admin.pages.dev';
