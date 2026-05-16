// /api/ambassadors — proxies live Adjust data via pana-ops-dashboard's Metabase endpoints.
// Source: BigQuery `panaapp-16ce3.adjust.*`, joined via `tracker_id` (FK to tracker._fivetran_id).
// Falls back to {source:'mock',ambassadors:[]} if upstream fails so the frontend can show its bundled mock.

interface Env {
  CF_ACCESS_CLIENT_ID?: string;
  CF_ACCESS_CLIENT_SECRET?: string;
}

const OPS_BASE = 'https://pana-ops-dashboard.pages.dev/api/metabase';

type Row = (string | number | null)[];
type ApiResp = { cols: { name: string }[]; rows: Row[] } | { error: string };

function authHeaders(env: Env): Record<string, string> {
  if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
    return {
      'CF-Access-Client-Id': env.CF_ACCESS_CLIENT_ID,
      'CF-Access-Client-Secret': env.CF_ACCESS_CLIENT_SECRET
    };
  }
  return {};
}

async function fetchQuery(queryId: string, env: Env): Promise<{ cols: string[]; rows: Row[] } | null> {
  try {
    const r = await fetch(`${OPS_BASE}/${queryId}`, {
      headers: authHeaders(env),
      cf: { cacheTtl: 60 } as any
    });
    if (!r.ok) return null;
    const j = (await r.json()) as ApiResp;
    if ('error' in j) return null;
    return { cols: j.cols.map(c => c.name), rows: j.rows };
  } catch {
    return null;
  }
}

function rowsToObjects(d: { cols: string[]; rows: Row[] }) {
  return d.rows.map(r => Object.fromEntries(d.cols.map((c, i) => [c, r[i]])));
}

// XP from real performance: approved * 50 + installs * 2 + events
function deriveXP(approved: number, installs: number, events: number) {
  return Math.round(approved * 50 + installs * 2 + events);
}

// Badges from Adjust performance milestones
function deriveBadges(approved: number, installs: number, events: number, daysActive: number): string[] {
  const out: string[] = [];
  if (approved >= 1) out.push('genesis');
  if (daysActive >= 30) out.push('rising');
  if (approved >= 10) out.push('decimator');
  if (approved >= 50) out.push('half');
  if (approved >= 100) out.push('centurion');
  if (events >= 100) out.push('lightning');
  if (installs >= 100) out.push('cross');
  if (approved * 10 >= 1000) out.push('highroller');
  if (daysActive >= 30 && installs > 0) out.push('marathon');
  return out;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const env = ctx.env;
  const [perf, monthly, byCountry, perfMonthly, perfDaily, panaMapping] = await Promise.all([
    fetchQuery('ambassadors-performance', env),
    fetchQuery('ambassadors-monthly', env),
    fetchQuery('ambassadors-by-country', env),
    fetchQuery('ambassadors-performance-monthly', env),
    fetchQuery('ambassadors-performance-daily', env),
    fetchQuery('ambassadors-pana-mapping', env)
  ]);

  if (!perf || perf.rows.length === 0) {
    return json({ source: 'mock', ambassadors: [], totals: null, monthly: [], byCountry: [], note: 'Upstream unreachable, frontend should use bundled mock.' });
  }

  const performance = rowsToObjects(perf);
  const perfByMonth = perfMonthly ? rowsToObjects(perfMonthly) : [];
  const perfByDay = perfDaily ? rowsToObjects(perfDaily) : [];
  const dailyByAmb: Record<string, Array<{ day: string; installs: number; events: number; approved: number; commission: number }>> = {};
  for (const r of perfByDay as any[]) {
    const key = String(r.ambassador || r.tracker_name);
    if (!dailyByAmb[key]) dailyByAmb[key] = [];
    dailyByAmb[key].push({
      day: String(r.day),
      installs: Number(r.installs || 0),
      events: Number(r.events || 0),
      approved: Number(r.approved || 0),
      commission: Number(r.commission_usd || 0)
    });
  }

  // Build Pana 360 lookup: ambassador_name -> { panaUserId, firstname, lastname, country }
  const panaLookup: Record<string, { panaUserId: string | null; firstname: string | null; lastname: string | null; country: string | null }> = {};
  if (panaMapping) {
    for (const r of rowsToObjects(panaMapping) as any[]) {
      panaLookup[String(r.ambassador_name)] = {
        panaUserId: r.pana_user_id || null,
        firstname: r.firstname || null,
        lastname: r.lastname || null,
        country: r.country || null
      };
    }
  }
  // Group monthly performance by ambassador name (tracker_name as fallback for uniqueness)
  const byAmb: Record<string, Array<{ month: string; installs: number; events: number; approved: number; commission: number }>> = {};
  for (const r of perfByMonth as any[]) {
    const key = String(r.ambassador || r.tracker_name);
    if (!byAmb[key]) byAmb[key] = [];
    byAmb[key].push({
      month: String(r.month),
      installs: Number(r.installs || 0),
      events: Number(r.events || 0),
      approved: Number(r.approved || 0),
      commission: Number(r.commission_usd || 0)
    });
  }
  const now = Date.now();

  const ambassadors = performance.map((p: any, i: number) => {
    const installs = Number(p.installs || 0);
    const installs30d = Number(p.installs_30d || 0);
    const approved = Number(p.approved || 0);
    const events = Number(p.events || 0);
    const firstInstall = p.first_install ? new Date(p.first_install).toISOString().slice(0, 10) : null;
    const lastInstall = p.last_install ? new Date(p.last_install).toISOString().slice(0, 10) : null;
    const daysActive = firstInstall ? Math.floor((now - new Date(firstInstall).getTime()) / 86400000) : 0;
    const daysSinceLast = lastInstall ? Math.floor((now - new Date(lastInstall).getTime()) / 86400000) : 999;
    const streak = daysSinceLast <= 1 ? Math.max(1, Math.min(30, Math.round(installs30d / 4))) : 0;

    const id = `AMB-${slugify(p.ambassador || 'unknown')}`;
    const xp = deriveXP(approved, installs, events);
    const badges = deriveBadges(approved, installs, events, daysActive);
    const ambName = String(p.ambassador || p.tracker_name);
    const monthlyData = byAmb[ambName] || [];
    const dailyData = dailyByAmb[ambName] || [];
    const pana = panaLookup[ambName] || { panaUserId: null, firstname: null, lastname: null, country: null };

    return {
      id,
      rank: i + 1,
      name: p.ambassador || p.tracker_name,
      adgroup: p.adgroup_name || null,
      trackerName: p.tracker_name,
      panaUserId: pana.panaUserId,
      panaFirstname: pana.firstname,
      panaLastname: pana.lastname,
      country: pana.country,
      track: 'Embajador' as const,
      photo: null as string | null,
      email: null as string | null,
      // Lifetime metrics:
      installs,
      installs30d,
      approved,
      approved30d: Math.round(approved * (installs30d / Math.max(installs, 1))),
      commission: approved * 10,
      events,
      streak,
      xp,
      badges,
      joinedAt: firstInstall,
      lastActivity: lastInstall,
      // Per-month + per-day breakdowns for range filtering:
      monthlyData,
      dailyData
    };
  });

  const totals = {
    ambassadors: ambassadors.length,
    installs: ambassadors.reduce((s, a) => s + a.installs, 0),
    installs30d: ambassadors.reduce((s, a) => s + a.installs30d, 0),
    approved: ambassadors.reduce((s, a) => s + a.approved, 0),
    approved30d: ambassadors.reduce((s, a) => s + a.approved30d, 0),
    commission: ambassadors.reduce((s, a) => s + a.commission, 0)
  };

  const monthlyData = monthly && monthly.rows.length ? rowsToObjects(monthly).map((m: any) => ({
    month: m.month,
    installs: Number(m.installs || 0),
    activeAmbassadors: Number(m.active_ambassadors || 0),
    countries: Number(m.countries || 0)
  })) : [];

  const countryData = byCountry && byCountry.rows.length ? rowsToObjects(byCountry).map((c: any) => ({
    country: c.country,
    installs: Number(c.installs || 0),
    ambassadors: Number(c.ambassadors_active || 0)
  })) : [];

  // Available months across all ambassadors (newest first)
  const monthSet = new Set<string>();
  for (const a of ambassadors) for (const m of a.monthlyData) monthSet.add(m.month);
  const availableMonths = Array.from(monthSet).sort().reverse();

  return json({
    source: 'live',
    fetchedAt: new Date().toISOString(),
    ambassadors,
    totals,
    monthly: monthlyData,
    byCountry: countryData,
    availableMonths
  });
};

function slugify(s: string) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=60'
    }
  });
}
