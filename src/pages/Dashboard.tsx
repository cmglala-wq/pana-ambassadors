import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Sparkle from '../components/Sparkle';
import Blob from '../components/Blob';

type Identity = { email?: string; name?: string; given_name?: string };

const RESOURCES = [
  {
    cat: 'Marca',
    title: 'Guía de marca',
    desc: 'Logos, colores oficiales (lima, royal, navy), tipografía y dos/dont\'s. Todo en un solo lugar.',
    cta: 'Descargar (.zip)',
    href: 'https://drive.google.com/drive/folders/pana-brand-kit',
    accent: 'lime'
  },
  {
    cat: 'Mensajes',
    title: 'Plantillas listas',
    desc: 'Frases que funcionan en historias, posts y DM. Copia-pega y personaliza con tu voz.',
    cta: 'Ver plantillas',
    href: '#templates',
    accent: 'blue'
  },
  {
    cat: 'Ideas',
    title: 'Banco de contenido',
    desc: 'Ángulos comprobados — desde "cómo recibo pagos sin cuenta US" hasta "el truco para enviar dinero sin perder en el cambio".',
    cta: 'Inspírame',
    href: '#ideas',
    accent: 'mix'
  }
] as const;

const MISSIONS = [
  { id: 'invite', title: 'Invita a tu primera persona', xp: 10, desc: 'Comparte tu link único con alguien que necesita una cuenta US.', cta: 'Copiar mi link', icon: '↗' },
  { id: 'post', title: 'Publica una historia', xp: 25, desc: 'Una historia de 24h con tu link. Etiqueta @getpana para recompartirte.', cta: 'Ver guía', icon: '◐' },
  { id: 'video', title: 'Graba un mini-tutorial', xp: 80, desc: 'Reel de 15-30s mostrando cómo abriste tu cuenta o enviaste tu primer pago.', cta: 'Briefing', icon: '◉' },
  { id: 'community', title: 'Activa una comunidad', xp: 150, desc: 'Lleva el programa a un grupo de WhatsApp, Discord o evento presencial.', cta: 'Hablar con tu manager', icon: '◈' }
];

const TEMPLATES = [
  { ctx: 'Historia (24h)', text: '¿Sabías que puedes tener una cuenta bancaria de USA sin papeleo gringo? La uso desde @getpana — te dejo mi link 👇' },
  { ctx: 'Post / Carrusel', text: 'Si recibes pagos en USD o envías dinero afuera, tu banco te está cobrando sin que te des cuenta. Probé Pana 30 días y este fue el resultado…' },
  { ctx: 'DM personal', text: 'Hey! Recordé que me preguntaste por cómo recibo pagos del exterior. Uso Pana — abro la cuenta gratis con mi link y si la activas me ayudas con el programa de embajadores 🙌' }
];

const IDEAS = [
  '"Le mando $200 a mi mamá. Esto es lo que llega con Pana vs. mi banco."',
  '"Cómo abrí mi cuenta US sin moverme de [tu país]"',
  '"3 cosas que mi banco me cobraba y Pana no"',
  '"Las personas que más usan Pana en mi círculo y por qué"',
  '"Mi setup financiero como creador con clientes en USA"',
  '"El error #1 al recibir pagos del exterior (y cómo lo resolví)"'
];

export default function Dashboard() {
  const [me, setMe] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ topic: 'producto', message: '', sent: false, sending: false, error: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/cdn-cgi/access/get-identity', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (!cancelled) { setMe(j || null); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const firstName = me?.given_name || me?.name?.split(' ')[0] || (me?.email?.split('@')[0]) || 'Embajador';
  const referralCode = useMemo(() => {
    const base = (me?.email || 'embajador@pana').split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    return `pana.app/r/${base || 'pana'}`;
  }, [me]);

  function copyLink() {
    navigator.clipboard.writeText(`https://${referralCode}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.message.trim()) return;
    setFeedback(f => ({ ...f, sending: true, error: '' }));
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: feedback.topic, message: feedback.message, email: me?.email || null, name: me?.name || null })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setFeedback(f => ({ ...f, sent: true, sending: false, message: '' }));
    } catch (err: any) {
      setFeedback(f => ({ ...f, sending: false, error: 'Hubo un problema enviando. Intenta de nuevo.' }));
    }
  }

  return (
    <div className="min-h-screen text-white">
      <NavBar />

      <section className="relative pt-32 pb-12 overflow-hidden">
        <Blob className="absolute -top-24 -right-32 w-[480px] opacity-50 animate-floaty" tone="lime"/>
        <Blob className="absolute top-40 -left-24 w-[380px] opacity-40 animate-floaty [animation-delay:2s]" tone="blue"/>

        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-5">
            <Link to="/" className="hover:text-white/70">Inicio</Link>
            <span>/</span>
            <span className="text-white/70">Portal Embajador</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-fadeUp">
            <div>
              <div className="chip mb-4"><span className="dot"/> Sesión activa</div>
              <h1 className="h-display text-4xl md:text-6xl">
                {greeting},<br/>
                <span className="gradient-text">{loading ? '…' : firstName}</span>.
              </h1>
              <p className="mt-3 text-white/60 max-w-lg">Tu hub privado — recursos, misiones y el canal directo con el equipo. Hagamos crecer la red.</p>
            </div>

            <div className="glass-strong rounded-3xl p-5 min-w-[280px]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime mb-2 font-bold">Tu link de referido</div>
              <div className="font-mono text-sm text-white truncate">{referralCode}</div>
              <button onClick={copyLink} className={`mt-3 btn-lime w-full justify-center text-sm transition-all ${copied ? '!bg-white !text-pana-navy' : ''}`}>
                {copied ? '✓ Copiado' : 'Copiar link'}
              </button>
            </div>
          </div>

          {/* Status row */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeUp [animation-delay:120ms]">
            <StatusCard label="Estado" value="Activo" hint="Verificado" tone="lime"/>
            <StatusCard label="Track" value="Embajador" hint="Mes a mes"/>
            <StatusCard label="XP" value="0" hint="Empieza tu primera misión"/>
            <StatusCard label="Próximo pago" value="Fin de mes" hint="A tu cuenta Pana"/>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead kicker="Recursos" title="Tu kit de embajador" subtitle="Marca, mensajes, ideas — todo lo que necesitas para empezar a comunicar con criterio."/>
          <div className="grid md:grid-cols-3 gap-3">
            {RESOURCES.map(r => (
              <a key={r.title} href={r.href} target={r.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="group rounded-3xl glass p-6 hover:-translate-y-1 transition-all hover:bg-white/[0.06]">
                <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold mb-3">{r.cat}</div>
                <div className="font-display text-2xl mb-2 leading-tight">{r.title}</div>
                <div className="text-sm text-white/60 leading-relaxed mb-5">{r.desc}</div>
                <span className="inline-flex items-center gap-2 text-sm text-white group-hover:text-pana-lime transition-colors">
                  {r.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </span>
              </a>
            ))}
          </div>

          {/* Templates */}
          <div id="templates" className="scroll-mt-nav mt-10 grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl glass-strong p-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold mb-4">Plantillas de mensaje</div>
              <div className="space-y-3">
                {TEMPLATES.map((t, i) => <TemplateCard key={i} ctx={t.ctx} text={t.text}/>)}
              </div>
            </div>
            <div id="ideas" className="rounded-3xl glass-strong p-6 scroll-mt-nav">
              <div className="text-[11px] uppercase tracking-[0.18em] text-pana-lime font-bold mb-4">Ideas de contenido</div>
              <ul className="space-y-2.5">
                {IDEAS.map((idea, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80 group">
                    <span className="font-mono text-xs text-pana-lime/60 mt-1">{String(i + 1).padStart(2, '0')}</span>
                    <span className="group-hover:text-white transition-colors">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIONS */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead kicker="Misiones" title="Acciones que mueven la aguja" subtitle="Cada misión completada cuenta. Empieza por la primera y vamos subiendo la apuesta."/>
          <div className="grid md:grid-cols-2 gap-3">
            {MISSIONS.map((m, i) => (
              <div key={m.id} className="rounded-3xl glass p-6 flex items-start gap-5 hover:bg-white/[0.06] transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-pana-lime/15 text-pana-lime border border-pana-lime/30 flex items-center justify-center font-display text-xl shrink-0">{m.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="font-display text-xl">{m.title}</div>
                    <span className="text-xs font-bold text-pana-lime bg-pana-lime/10 border border-pana-lime/30 px-2.5 py-1 rounded-full whitespace-nowrap">+{m.xp} XP</span>
                  </div>
                  <div className="text-sm text-white/60 mb-4">{m.desc}</div>
                  <button onClick={m.id === 'invite' ? copyLink : undefined} className="btn-ghost !py-2 !px-4 text-sm">{m.id === 'invite' && copied ? '✓ Copiado' : m.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="py-12 mb-10">
        <div className="mx-auto max-w-3xl px-5">
          <SectionHead kicker="Feedback" title="¿Qué nos vas a contar?" subtitle="Lo que ves en tu día a día con la app, con tu audiencia, lo que falta. Léase atentamente."/>
          <div className="rounded-3xl glass-strong p-6 md:p-8 relative overflow-hidden">
            <Sparkle className="absolute top-5 right-5 w-4 animate-spinSlow" color="#CFFF04"/>
            {feedback.sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-pana-lime/15 border border-pana-lime/30 flex items-center justify-center text-pana-lime mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="font-display text-2xl mb-2">Recibido. Gracias.</div>
                <div className="text-white/60 text-sm">Lo leemos y volvemos.</div>
                <button onClick={() => setFeedback({ topic: 'producto', message: '', sent: false, sending: false, error: '' })} className="btn-ghost mt-6 text-sm">Enviar otro</button>
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold mb-2 block">Tema</label>
                  <select value={feedback.topic} onChange={e => setFeedback(f => ({ ...f, topic: e.target.value }))}>
                    <option value="producto">Producto / app</option>
                    <option value="programa">Programa de embajadores</option>
                    <option value="contenido">Contenido y mensajes</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold mb-2 block">Tu insight</label>
                  <textarea value={feedback.message} onChange={e => setFeedback(f => ({ ...f, message: e.target.value }))} rows={6} placeholder="Lo que mejoraría, una idea, una fricción que viste con tu audiencia…" required/>
                </div>
                {feedback.error && <div className="text-sm text-red-400">{feedback.error}</div>}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-white/40">Enviado como <span className="text-white/70">{me?.email || 'embajador'}</span></div>
                  <button type="submit" disabled={feedback.sending || !feedback.message.trim()} className="btn-lime !py-2.5 !px-5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {feedback.sending ? 'Enviando…' : 'Enviar feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function SectionHead({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <span className="chip mb-3">{kicker}</span>
        <h2 className="h-display text-3xl md:text-4xl">{title}</h2>
      </div>
      {subtitle && <p className="text-white/60 text-sm max-w-md">{subtitle}</p>}
    </div>
  );
}

function StatusCard({ label, value, hint, tone }: { label: string; value: string; hint: string; tone?: 'lime' }) {
  return (
    <div className={`rounded-2xl glass p-4 border ${tone === 'lime' ? 'border-pana-lime/30 bg-pana-lime/[0.06]' : 'border-white/10'}`}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold">{label}</div>
      <div className={`font-display text-2xl mt-1 ${tone === 'lime' ? 'text-pana-lime' : 'text-white'}`}>{value}</div>
      <div className="text-xs text-white/40 mt-1">{hint}</div>
    </div>
  );
}

function TemplateCard({ ctx, text }: { ctx: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-[0.16em] text-pana-lime font-bold">{ctx}</div>
        <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
                className="text-[11px] text-white/50 hover:text-white transition-colors">{copied ? '✓ copiado' : 'copiar'}</button>
      </div>
      <div className="text-sm text-white/80 leading-relaxed">"{text}"</div>
    </div>
  );
}
