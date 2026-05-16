// /api/feed — live activity stream for ambassadors.
// Pulls last 14d of installs + in_app_events from ops dashboard, formats them
// into a human-readable feed for the gamified dashboard.

interface Env {}

const OPS_BASE = 'https://pana-ops-dashboard.pages.dev/api/metabase';

type Row = (string | number | null)[];
type ApiResp = { cols: { name: string }[]; rows: Row[] } | { error: string };

const EVENT_LABELS: Record<string, { icon: string; verb: string; weight: number }> = {
  GlobalBankAccountApproved:  { icon: '🎯', verb: 'nueva cuenta aprobada',     weight: 100 },
  GlobalBankAccountRequested: { icon: '🆔', verb: 'solicitó verificación',     weight: 40 },
  CompletedWelcomeFlow:       { icon: '✨', verb: 'completó onboarding',       weight: 30 },
  OnboardingComplete:         { icon: '✨', verb: 'completó onboarding',       weight: 30 },
  FirstSend:                  { icon: '💸', verb: 'primer envío',              weight: 80 },
  Login:                      { icon: '🔓', verb: 'sesión iniciada',           weight: 5 },
  PushOptIn:                  { icon: '🔔', verb: 'activó notificaciones',     weight: 10 }
};

function fmtEvent(eventName: string) {
  const known = EVENT_LABELS[eventName];
  if (known) return known;
  return { icon: '✦', verb: eventName.replace(/([A-Z])/g, ' $1').trim().toLowerCase(), weight: 15 };
}

export const onRequestGet: PagesFunction<Env> = async () => {
  try {
    const r = await fetch(`${OPS_BASE}/ambassadors-recent-activity`, { cf: { cacheTtl: 30 } as any });
    if (!r.ok) return json({ source: 'mock', events: [] });
    const j = (await r.json()) as ApiResp;
    if ('error' in j) return json({ source: 'mock', events: [] });

    const cols = j.cols.map(c => c.name);
    const idxKind = cols.indexOf('kind');
    const idxAmb = cols.indexOf('ambassador');
    const idxCountry = cols.indexOf('country');
    const idxEvent = cols.indexOf('event_name');
    const idxTs = cols.indexOf('ts');

    const events = j.rows.map(row => {
      const kind = row[idxKind] as string;
      const ambassador = row[idxAmb] as string;
      const country = (row[idxCountry] as string) || '';
      const eventName = (row[idxEvent] as string) || '';
      const ts = row[idxTs] as string;
      const ambId = `AMB-${slug(ambassador)}`;

      if (kind === 'install') {
        return { id: `${ts}-${ambId}-install`, ts, ambassador, ambId, kind: 'install', icon: '📲', verb: 'nueva descarga', country, weight: 20 };
      }
      const f = fmtEvent(eventName);
      return { id: `${ts}-${ambId}-${eventName}`, ts, ambassador, ambId, kind: 'event', eventName, icon: f.icon, verb: f.verb, country, weight: f.weight };
    });

    // "On fire" detector: 3+ events in last 60 min from same ambassador
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const heatMap = new Map<string, number>();
    for (const e of events) {
      if (new Date(e.ts).getTime() > oneHourAgo) heatMap.set(e.ambId, (heatMap.get(e.ambId) || 0) + 1);
    }
    const onFire = Array.from(heatMap.entries()).filter(([, c]) => c >= 3).map(([id]) => id);

    // Trending: most events in last 24h
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const dayCount = new Map<string, { name: string; count: number; weight: number }>();
    for (const e of events) {
      if (new Date(e.ts).getTime() > dayAgo) {
        const cur = dayCount.get(e.ambId) || { name: e.ambassador, count: 0, weight: 0 };
        cur.count += 1;
        cur.weight += e.weight;
        dayCount.set(e.ambId, cur);
      }
    }
    const trending = Array.from(dayCount.entries())
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 1)
      .map(([id, info]) => ({ ambId: id, name: info.name, count: info.count }));

    // Counters
    const last1h = events.filter(e => new Date(e.ts).getTime() > oneHourAgo).length;
    const last24h = events.filter(e => new Date(e.ts).getTime() > dayAgo).length;

    return json({
      source: 'live',
      fetchedAt: new Date().toISOString(),
      events: events.slice(0, 30),
      onFire,
      trending,
      counters: { last1h, last24h, total: events.length }
    });
  } catch {
    return json({ source: 'mock', events: [] });
  }
};

function slug(s: string) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30, s-maxage=30' }
  });
}
