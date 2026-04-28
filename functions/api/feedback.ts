interface Env {}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  try {
    const body = await ctx.request.json() as { topic?: string; message?: string; email?: string | null; name?: string | null };
    const topic = (body.topic || 'otro').slice(0, 40);
    const message = (body.message || '').trim().slice(0, 4000);
    if (!message) return json({ ok: false, error: 'Empty message' }, 400);

    // Identity from CF Access (if present)
    const accessEmail = ctx.request.headers.get('Cf-Access-Authenticated-User-Email') || body.email || null;
    const accessName = body.name || null;
    const userAgent = ctx.request.headers.get('User-Agent') || '';
    const country = ctx.request.headers.get('CF-IPCountry') || '';

    const payload = {
      ts: new Date().toISOString(),
      topic, message,
      email: accessEmail,
      name: accessName,
      country,
      ua: userAgent
    };

    // For v1: log structured to CF logs (visible in `wrangler pages deployment tail`).
    // Future: forward to Slack webhook / D1 table when wired.
    console.log('[ambassadors-feedback]', JSON.stringify(payload));

    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: e?.message || 'unknown' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
