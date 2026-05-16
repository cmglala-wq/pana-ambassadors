import { useEffect, useMemo, useState } from 'react';
import { AMBASSADORS as MOCK, MONTHLY_GROWTH as MOCK_MONTHLY, COUNTRY_BREAKDOWN as MOCK_COUNTRY, TOTALS as MOCK_TOTALS, type Ambassador } from '../data/ambassadors';
import { isAdminHost } from './hosts';

export type DataSource = 'live' | 'mock' | 'loading';

export type MonthlyDatum = { month: string; installs: number; approved: number; commission: number; events?: number };
export type DailyDatum = { day: string; installs: number; approved: number; commission: number; events?: number };

export type AmbassadorWithMonths = Ambassador & {
  monthlyData?: MonthlyDatum[];
  dailyData?: DailyDatum[];
  panaUserId?: string | null;
  panaFirstname?: string | null;
  panaLastname?: string | null;
};

export interface AmbassadorsState {
  source: DataSource;
  ambassadors: AmbassadorWithMonths[];
  totals: typeof MOCK_TOTALS;
  monthly: { month: string; installs: number; approved: number; commission: number }[];
  byCountry: typeof MOCK_COUNTRY;
  availableMonths: string[];
  fetchedAt?: string;
}

export function useAmbassadors(): AmbassadorsState {
  const [state, setState] = useState<AmbassadorsState>(() => ({
    source: 'loading',
    ambassadors: MOCK,
    totals: MOCK_TOTALS,
    monthly: MOCK_MONTHLY,
    byCountry: MOCK_COUNTRY,
    availableMonths: MOCK_MONTHLY.map(m => m.month).sort().reverse()
  }));

  useEffect(() => {
    // On the PUBLIC site we never fetch live data — mock only.
    // Tech team will own the data layer for the public-facing dashboard.
    if (!isAdminHost()) {
      setState(s => ({ ...s, source: 'mock' }));
      return;
    }
    let cancelled = false;
    fetch('/api/ambassadors').then(r => r.ok ? r.json() : null).then(j => {
      if (cancelled || !j) {
        setState(s => ({ ...s, source: 'mock' }));
        return;
      }
      if (j.source === 'live' && Array.isArray(j.ambassadors) && j.ambassadors.length > 0) {
        // Merge live performance data with mock cosmetic fields (photos, etc.)
        const merged: AmbassadorWithMonths[] = j.ambassadors.map((live: any, i: number) => ({
          id: live.id,
          rank: i + 1,
          name: live.name,
          email: live.email || `${slug(live.name)}@example.com`,
          country: live.country || ('?' as any), // Real country from Pana profile, "?" when no profile match
          track: live.track || 'Embajador',
          photo: live.photo || pickPhoto(live.name),
          joinedAt: live.joinedAt || '2026-03-01',
          installs: live.installs,
          approved: live.approved,
          installs30d: live.installs30d,
          approved30d: live.approved30d,
          commission: live.commission,
          streak: live.streak,
          xp: live.xp,
          badges: live.badges || [],
          adjustLink: `https://pana.go.link/${slug(live.name).slice(0, 6)}`,
          contract: {
            id: `CT-2026-${String(i + 1).padStart(3, '0')}`,
            status: 'signed',
            sentAt: live.joinedAt || '2026-03-01',
            signedAt: live.joinedAt || '2026-03-02',
            ip: '—',
            fileUrl: '/acuerdo-embajadores.pdf'
          },
          monthlyData: Array.isArray(live.monthlyData) ? live.monthlyData : [],
          dailyData: Array.isArray(live.dailyData) ? live.dailyData : [],
          panaUserId: live.panaUserId || null,
          panaFirstname: live.panaFirstname || null,
          panaLastname: live.panaLastname || null
        }));

        const totals = {
          ambassadors: merged.length,
          installs: j.totals?.installs ?? merged.reduce((s, a) => s + a.installs, 0),
          approved: j.totals?.approved ?? merged.reduce((s, a) => s + a.approved, 0),
          commission: j.totals?.commission ?? merged.reduce((s, a) => s + a.commission, 0),
          installs30d: j.totals?.installs30d ?? merged.reduce((s, a) => s + a.installs30d, 0),
          approved30d: j.totals?.approved30d ?? merged.reduce((s, a) => s + a.approved30d, 0)
        };

        const monthly = (j.monthly || []).map((m: any) => ({
          month: m.month,
          installs: m.installs,
          approved: Math.round(m.installs * (totals.approved / Math.max(1, totals.installs))),
          commission: Math.round(m.installs * (totals.approved / Math.max(1, totals.installs))) * 10
        }));

        const byCountry = (j.byCountry && j.byCountry.length > 0)
          ? j.byCountry.map((c: any) => ({
              country: c.country,
              name: c.country,
              flag: '🌎',
              ambassadors: c.ambassadors,
              installs: c.installs,
              approved: 0,
              commission: 0
            }))
          : MOCK_COUNTRY;

        const availableMonths = Array.isArray(j.availableMonths) && j.availableMonths.length > 0
          ? j.availableMonths
          : Array.from(new Set(merged.flatMap(a => (a.monthlyData || []).map(m => m.month)))).sort().reverse();
        setState({ source: 'live', ambassadors: merged, totals: totals as any, monthly, byCountry: byCountry as any, availableMonths, fetchedAt: j.fetchedAt });
      } else {
        setState(s => ({ ...s, source: 'mock' }));
      }
    }).catch(() => {
      if (!cancelled) setState(s => ({ ...s, source: 'mock' }));
    });
    return () => { cancelled = true; };
  }, []);

  return state;
}

/** Project the dataset for a specific month (or 'all'). Re-ranks by approved descending. */
export function viewForMonth(state: AmbassadorsState, month: string | 'all') {
  const list = state.ambassadors || [];
  if (month === 'all') {
    return {
      ambassadors: list,
      totals: state.totals
    };
  }
  const projected = list.map(a => {
    const m = (a.monthlyData || []).find(x => x.month === month);
    return {
      ...a,
      installs: m ? m.installs : 0,
      approved: m ? m.approved : 0,
      commission: m ? m.commission : 0,
      installs30d: m ? m.installs : 0,
      approved30d: m ? m.approved : 0,
      events: (m as any)?.events || 0
    };
  })
  .sort((a, b) => (b.approved - a.approved) || (b.installs - a.installs))
  .map((a, i) => ({ ...a, rank: i + 1 }));

  const totals = {
    ambassadors: projected.filter(a => a.installs > 0 || a.approved > 0).length,
    installs: projected.reduce((s, a) => s + a.installs, 0),
    approved: projected.reduce((s, a) => s + a.approved, 0),
    commission: projected.reduce((s, a) => s + a.commission, 0),
    installs30d: projected.reduce((s, a) => s + a.installs, 0),
    approved30d: projected.reduce((s, a) => s + a.approved, 0)
  };

  return { ambassadors: projected, totals };
}

/** Project the dataset for an arbitrary date range using daily data. */
export function viewForRange(state: AmbassadorsState, range: { from: string; to: string } | { all: true }) {
  const list = state.ambassadors || [];
  if ('all' in range) {
    return { ambassadors: list, totals: state.totals };
  }
  const { from, to } = range;
  const projected = list.map(a => {
    const days = (a.dailyData || []).filter(d => d.day >= from && d.day <= to);
    const installs = days.reduce((s, d) => s + d.installs, 0);
    const approved = days.reduce((s, d) => s + d.approved, 0);
    const commission = days.reduce((s, d) => s + d.commission, 0);
    const events = days.reduce((s, d) => s + ((d as any).events || 0), 0);
    return {
      ...a,
      installs,
      approved,
      commission,
      installs30d: installs,
      approved30d: approved,
      events
    };
  })
  .sort((a, b) => (b.approved - a.approved) || (b.installs - a.installs))
  .map((a, i) => ({ ...a, rank: i + 1 }));

  const totals = {
    ambassadors: projected.filter(a => a.installs > 0 || a.approved > 0).length,
    installs: projected.reduce((s, a) => s + a.installs, 0),
    approved: projected.reduce((s, a) => s + a.approved, 0),
    commission: projected.reduce((s, a) => s + a.commission, 0),
    installs30d: projected.reduce((s, a) => s + a.installs, 0),
    approved30d: projected.reduce((s, a) => s + a.approved, 0)
  };

  return { ambassadors: projected, totals };
}

function slug(s: string) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const PHOTO_POOL = [
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/72.jpg',
  'https://randomuser.me/api/portraits/men/27.jpg',
  'https://randomuser.me/api/portraits/men/41.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/women/48.jpg',
  'https://randomuser.me/api/portraits/women/67.jpg',
  'https://randomuser.me/api/portraits/men/56.jpg',
  'https://randomuser.me/api/portraits/men/64.jpg'
];
function pickPhoto(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PHOTO_POOL[h % PHOTO_POOL.length];
}

