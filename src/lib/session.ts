import { AMBASSADORS, type Ambassador } from '../data/ambassadors';

const DEMO_KEY = 'pana_amb_demo_user';
const ADMIN_KEY = 'pana_amb_admin';

export type SessionUser = {
  email: string;
  name: string;
  photo: string;
  ambassadorId: string;
  isAdmin: boolean;
  source: 'access' | 'demo';
};

export async function loadAccessIdentity(): Promise<{ email?: string; name?: string } | null> {
  try {
    const r = await fetch('/cdn-cgi/access/get-identity', { credentials: 'include' });
    if (!r.ok) return null;
    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    return await r.json();
  } catch { return null; }
}

export function getDemoUser(): { email: string; name: string; ambassadorId: string } | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function setDemoUser(u: { email: string; name: string; ambassadorId: string }) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(u));
}

export function clearDemoUser() {
  localStorage.removeItem(DEMO_KEY);
}

export function isAdmin(): boolean {
  return localStorage.getItem(ADMIN_KEY) === '1';
}

export function setAdmin(v: boolean) {
  if (v) localStorage.setItem(ADMIN_KEY, '1');
  else localStorage.removeItem(ADMIN_KEY);
}

export async function resolveSession(): Promise<SessionUser | null> {
  const access = await loadAccessIdentity();
  if (access?.email) {
    const amb = AMBASSADORS.find(a => a.email.toLowerCase() === access.email!.toLowerCase()) || AMBASSADORS[0];
    return {
      email: access.email,
      name: access.name || amb.name,
      photo: amb.photo,
      ambassadorId: amb.id,
      isAdmin: isAdmin() || access.email.endsWith('@getpana.app'),
      source: 'access'
    };
  }
  const demo = getDemoUser();
  if (demo) {
    const amb = AMBASSADORS.find(a => a.id === demo.ambassadorId) || AMBASSADORS[0];
    return {
      email: demo.email,
      name: demo.name,
      photo: amb.photo,
      ambassadorId: amb.id,
      isAdmin: isAdmin(),
      source: 'demo'
    };
  }
  return null;
}

export function getCurrentAmbassador(session: SessionUser): Ambassador {
  return AMBASSADORS.find(a => a.id === session.ambassadorId) || AMBASSADORS[0];
}

export const ACCESS_LOGIN_URL = 'https://panaops.cloudflareaccess.com/cdn-cgi/access/login/pana-ambassadors.pages.dev?redirect_url=' +
  (typeof window !== 'undefined' ? encodeURIComponent(window.location.origin + '/dashboard') : '%2Fdashboard');
