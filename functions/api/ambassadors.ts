// /api/ambassadors — currently returns the mock dataset shipped in the bundle.
// To wire real Adjust data: query BigQuery via Metabase
//   - Source: panaapp-16ce3.adjust.events  (channel="Ambassadors")
//   - Join: panaapp-16ce3.planetscale_pana.users on tracker_token / cio_id
//   - Aggregate by ambassador_id → installs, approved (= activated), commission

interface Env {}

export const onRequestGet: PagesFunction<Env> = async () => {
  // Future: fetch('https://pana-ops-dashboard.pages.dev/api/metabase/ambassadors-performance')
  // For now: simple ping that confirms the function is wired. Frontend ships the dataset
  // statically (src/data/ambassadors.ts) for instant load.
  return new Response(JSON.stringify({
    ok: true,
    source: 'mock',
    note: 'Frontend uses bundled mock dataset. Swap to BigQuery via Metabase when corridor-kpis-style query is published.',
    plannedQueries: [
      'ambassadors-performance',
      'ambassadors-installs-by-month',
      'ambassadors-approved-by-month',
      'ambassadors-by-country'
    ]
  }), { headers: { 'Content-Type': 'application/json' } });
};
