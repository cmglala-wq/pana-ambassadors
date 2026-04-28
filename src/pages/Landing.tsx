import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Blob from '../components/Blob';
import Sparkle from '../components/Sparkle';
import { useEffect, useState } from 'react';

const TRACKS = [
  {
    id: 'embajador',
    label: 'Programa Embajador',
    tag: 'Para todos',
    accent: 'lime',
    desc: 'Para cualquier persona con cuenta activa en Pana. Recibe un enlace de referido único, comparte y gana por cada cuenta nueva que se active.',
    payout: '$10 USD',
    payoutNote: 'por cada cuenta abierta y activada',
    bullets: ['Enlace de referido único', 'Reporte mensual de desempeño', 'Pago directo a tu cuenta Pana']
  },
  {
    id: 'influencer',
    label: 'Embajador + Influencer',
    tag: 'Para creadores',
    accent: 'blue',
    desc: 'Todo lo del Programa Embajador, más creación de video. Producimos contigo, tú creas, Pana paga la pieza y mantienes tus comisiones.',
    payout: '$100 — $400 USD',
    payoutNote: 'por video aprobado, además de tus comisiones',
    bullets: ['Pautas y guías de marca', 'Aprobación express por Marketing', 'Compensación adicional por pieza']
  },
  {
    id: 'corporativo',
    label: 'Programa Corporativo',
    tag: 'Para empresas',
    accent: 'mix',
    desc: 'Para compañías que quieren implementar Pana como vehículo de depósitos directos. One-pager personalizado y link único de descarga.',
    payout: '$10 USD',
    payoutNote: 'por cuenta aperturada activa (mínimo $1,000 transaccionales)',
    bullets: ['Link exclusivo no transferible', 'One-pager digital personalizado', 'Acuerdo mes a mes autorenovable']
  }
] as const;

const BENEFITS = [
  { title: 'Confianza y credibilidad', icon: '✓', desc: 'Recomiendas un producto que aporta. Tu audiencia te lee como consejo de alguien en quien confía.' },
  { title: 'Valor agregado', icon: '♥', desc: 'Tus seguidores acceden a beneficios exclusivos gracias a ti. No es una recomendación, es abrir una puerta.' },
  { title: 'Diferenciación', icon: '★', desc: 'Conviértete en el punto de conexión que ofrece soluciones tangibles, no solo contenido.' },
  { title: 'Relación más fuerte', icon: '⌘', desc: 'Al resolverles necesidades reales, la cercanía se traduce en lealtad y mayor interacción.' },
  { title: 'Impacto positivo', icon: '◎', desc: 'Más allá de lo monetario, contribuyes a que tu comunidad acceda a servicios que mejoran su vida.' },
  { title: 'Ingresos reales', icon: '$', desc: 'Pago mensual directo a tu cuenta Pana. Reporte transparente con cada referido confirmado.' }
];

const STEPS = [
  { n: '01', title: 'Aplica', body: 'Llena el formulario con tus datos y redes. Toma menos de 2 minutos.' },
  { n: '02', title: 'Firma', body: 'Revisamos tu perfil y, si calificas, te enviamos el acuerdo digital mes-a-mes.' },
  { n: '03', title: 'Activa', body: 'Recibes tu link único + kit de marca. Empiezas a compartir desde el día 1.' },
  { n: '04', title: 'Cobra', body: 'Cada fin de mes te depositamos las comisiones directamente en tu cuenta Pana.' }
];

export default function Landing() {
  const [count, setCount] = useState({ amb: 0, paid: 0, refs: 0 });

  useEffect(() => {
    const target = { amb: 240, paid: 12480, refs: 1248 };
    const dur = 1400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount({
        amb: Math.round(target.amb * eased),
        paid: Math.round(target.paid * eased),
        refs: Math.round(target.refs * eased)
      });
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen text-white selection:bg-pana-lime selection:text-pana-navy">
      <NavBar />

      {/* HERO */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-30"/>
          <Blob className="absolute -top-20 -right-32 w-[640px] opacity-70 animate-floaty" tone="lime"/>
          <Blob className="absolute top-40 -left-40 w-[520px] opacity-60 animate-floaty [animation-delay:1.5s]" tone="blue"/>
          <div className="absolute top-1/3 right-1/4">
            <Sparkle className="w-6 animate-spinSlow" color="#CFFF04"/>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5">
          <div className="chip mb-6 animate-fadeUp">
            <span className="dot"/>
            Programa de Embajadores · 2026
          </div>

          <h1 className="h-display text-[42px] sm:text-[64px] md:text-[88px] lg:text-[112px] max-w-5xl animate-fadeUp [animation-delay:80ms]">
            Convierte tu <span className="gradient-text">comunidad</span><br/>
            en oportunidad.
          </h1>

          <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/70 animate-fadeUp [animation-delay:160ms]">
            Pana es la fintech sin fronteras que conecta personas y empresas con cuentas USA de uso global.
            Si te lee, te escucha o trabaja contigo — gana <strong className="text-pana-lime">$10 USD</strong> por cada cuenta abierta y activa.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 animate-fadeUp [animation-delay:240ms]">
            <a href="#como" className="btn-lime text-base">
              Aplicar al programa
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <Link to="/login" className="btn-ghost text-base">Soy embajador · Iniciar sesión</Link>
          </div>

          {/* live counters */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 animate-fadeUp [animation-delay:320ms]">
            <Stat value={count.amb} suffix="+" label="Embajadores activos"/>
            <Stat value={count.refs} suffix="+" label="Cuentas referidas"/>
            <Stat value={`$${count.paid.toLocaleString()}`} label="Pagados a la red"/>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-24 border-y border-white/5 py-5 overflow-hidden">
          <div className="marquee text-2xl md:text-4xl font-display text-white/15">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex gap-12 px-6">
                <span>★ Pana Global</span>
                <span>· Sin fronteras</span>
                <span>· $10 / cuenta</span>
                <span>· Mes a mes</span>
                <span>· Pago directo</span>
                <span>· LATAM + USA</span>
                <span>· 2026</span>
                <span className="text-pana-lime">★</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section id="programa" className="scroll-mt-nav py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <span className="chip mb-4">El programa</span>
              <h2 className="h-display text-4xl md:text-6xl max-w-2xl">
                Una red que <span className="gradient-text">crece contigo</span>.
              </h2>
            </div>
            <p className="max-w-md text-white/70">
              Más allá de generar ingresos, ofreces a tu comunidad soluciones útiles. Cuentas USA, pagos sin fronteras y herramientas que mejoran su vida — gracias a ti.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard kicker="Quiénes somos" title="Pana Global" body="Fintech inclusiva con cuentas bancarias USA de uso internacional. Pagos, envíos y recibos sin fronteras."/>
            <FeatureCard kicker="Para quién" title="Cualquier persona con cuenta Pana" body="Desde un usuario que ama el producto hasta el creador con audiencia y la empresa con empleados." accent="blue"/>
            <FeatureCard kicker="Por qué importa" title="Ingreso + impacto" body="Comisión real ($10 USD/cuenta) y la satisfacción de abrirle a tu gente una puerta a mejores servicios." accent="lime"/>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="beneficios" className="scroll-mt-nav py-20 md:py-28 relative overflow-hidden">
        <Blob className="absolute -right-40 top-20 w-[500px] opacity-40 animate-floaty" tone="blue"/>
        <div className="mx-auto max-w-6xl px-5 relative">
          <span className="chip mb-4">Beneficios</span>
          <h2 className="h-display text-4xl md:text-6xl max-w-3xl mb-12">
            No es solo dinero. <span className="text-white/40">Es propósito.</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="glass rounded-3xl p-6 group hover:bg-white/[0.06] transition-all hover:-translate-y-1 animate-fadeUp" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-pana-lime/15 text-pana-lime flex items-center justify-center font-display text-xl border border-pana-lime/30">{b.icon}</div>
                  <div className="text-xs text-white/40 font-mono">0{i + 1}</div>
                </div>
                <div className="font-display text-xl mb-2">{b.title}</div>
                <div className="text-sm text-white/60 leading-relaxed">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section id="tracks" className="scroll-mt-nav py-20 md:py-28 relative">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="chip mb-4">Modalidades</span>
              <h2 className="h-display text-4xl md:text-6xl max-w-2xl">
                Tres caminos. <span className="gradient-text">Una sola red.</span>
              </h2>
            </div>
            <p className="max-w-md text-white/70">
              Elige el que mejor se ajusta a tu perfil. Puedes empezar como Embajador y subir a Influencer cuando estés listo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TRACKS.map((t, i) => (
              <TrackCard key={t.id} track={t} index={i}/>
            ))}
          </div>

          <div className="mt-12 glass-strong rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-pana-lime text-xs font-bold tracking-[0.18em] uppercase mb-2">Términos del acuerdo</div>
              <div className="text-lg md:text-xl font-display">Mes a mes. Autorenovable. Transparente.</div>
              <div className="text-sm text-white/60 mt-1 max-w-2xl">Pana se reserva el derecho de terminar la participación si se incumplen las guías de marca, hay desinformación o uso indebido. Nuestro compromiso: cero letra chica.</div>
            </div>
            <a href="#como" className="btn-lime shrink-0">Ver cómo aplicar</a>
          </div>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section id="como" className="scroll-mt-nav py-20 md:py-28 relative overflow-hidden">
        <Blob className="absolute -left-40 top-20 w-[500px] opacity-40 animate-floaty [animation-delay:2s]" tone="lime"/>
        <div className="mx-auto max-w-6xl px-5 relative">
          <div className="text-center mb-14">
            <span className="chip mb-4">Cómo aplicar</span>
            <h2 className="h-display text-4xl md:text-6xl">4 pasos. <span className="text-white/40">Sin fricción.</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative glass rounded-3xl p-6 hover:bg-white/[0.06] transition-all animate-fadeUp" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="font-display text-5xl text-pana-lime/30">{s.n}</div>
                <div className="font-display text-2xl mt-2">{s.title}</div>
                <div className="text-sm text-white/60 mt-2 leading-relaxed">{s.body}</div>
                {i < STEPS.length - 1 && (
                  <svg className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                )}
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-pana-lime/20 via-pana-blue/10 to-transparent blur-2xl"/>
            <div className="rounded-[32px] border border-pana-lime/30 bg-gradient-to-br from-pana-lime/[0.08] to-pana-blue/[0.05] p-8 md:p-14 text-center relative overflow-hidden">
              <Sparkle className="absolute top-6 right-8 w-5 animate-spinSlow" color="#CFFF04"/>
              <Sparkle className="absolute bottom-8 left-10 w-3 animate-spinSlow [animation-delay:3s]" color="#1E7FE0"/>
              <h3 className="h-display text-4xl md:text-6xl mb-4">¿Listo para entrar?</h3>
              <p className="text-white/70 max-w-xl mx-auto mb-8">Si tienes una cuenta Pana activa, ya cumples el primer requisito. El resto lo hacemos juntos.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="mailto:embajadores@getpana.app?subject=Quiero%20ser%20embajador%20Pana&body=Hola!%20Mi%20nombre%20es%3A%0AMi%20%40%20en%20redes%3A%0APa%C3%ADs%3A%0ATama%C3%B1o%20de%20comunidad%3A%0APor%20qu%C3%A9%20quiero%20ser%20embajador%3A" className="btn-lime text-base">
                  Aplicar ahora
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
                <Link to="/login" className="btn-ghost text-base">Acceder al portal</Link>
              </div>
              <div className="mt-8 text-xs text-white/40">Privado y confidencial · Sujeto a aprobación</div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function Stat({ value, suffix, label }: { value: number | string; suffix?: string; label: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="font-display text-3xl md:text-4xl flex items-baseline gap-1">
        <span>{value}</span>
        {suffix && <span className="text-pana-lime">{suffix}</span>}
      </div>
      <div className="text-xs text-white/50 mt-1 uppercase tracking-[0.16em]">{label}</div>
    </div>
  );
}

function FeatureCard({ kicker, title, body, accent = 'mix' }: { kicker: string; title: string; body: string; accent?: 'lime' | 'blue' | 'mix' }) {
  const ring = accent === 'lime' ? 'border-pana-lime/30 hover:border-pana-lime/60' : accent === 'blue' ? 'border-pana-blue/30 hover:border-pana-blue/60' : 'border-white/10 hover:border-white/20';
  return (
    <div className={`relative rounded-3xl p-7 glass ${ring} transition-all hover:-translate-y-1 group`}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime mb-3 font-bold">{kicker}</div>
      <div className="font-display text-2xl md:text-3xl mb-3 leading-tight">{title}</div>
      <div className="text-sm text-white/60 leading-relaxed">{body}</div>
      <svg className="absolute top-6 right-6 text-white/20 group-hover:text-pana-lime transition-colors" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
    </div>
  );
}

type TrackData = typeof TRACKS[number];
function TrackCard({ track, index }: { track: TrackData; index: number }) {
  const lime = track.accent === 'lime';
  const blue = track.accent === 'blue';
  return (
    <div className={`relative rounded-3xl overflow-hidden p-7 glass border-white/10 transition-all hover:-translate-y-1 animate-fadeUp ${lime ? 'hover:border-pana-lime/40' : blue ? 'hover:border-pana-blue/40' : 'hover:border-white/20'}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pana-lime/40 to-transparent"/>
      <div className="flex items-center justify-between mb-5">
        <span className={`chip ${blue ? '!bg-pana-blue/15 !text-pana-blue !border-pana-blue/30' : ''}`}>{track.tag}</span>
        <span className="text-xs text-white/30 font-mono">0{index + 1}</span>
      </div>
      <div className="font-display text-2xl md:text-[28px] leading-tight mb-3">{track.label}</div>
      <p className="text-sm text-white/60 mb-6 leading-relaxed">{track.desc}</p>

      <div className="rounded-2xl bg-pana-navy-2/60 border border-white/5 p-4 mb-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-1">Pago</div>
        <div className="font-display text-2xl text-pana-lime">{track.payout}</div>
        <div className="text-xs text-white/50 mt-0.5">{track.payoutNote}</div>
      </div>

      <ul className="space-y-2 mb-1">
        {track.bullets.map(b => (
          <li key={b} className="text-sm text-white/70 flex items-start gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CFFF04" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
