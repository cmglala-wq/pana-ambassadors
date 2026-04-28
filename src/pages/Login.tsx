import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Blob from '../components/Blob';
import Sparkle from '../components/Sparkle';
import { ACCESS_LOGIN_URL, setDemoUser } from '../lib/session';
import { AMBASSADORS } from '../data/ambassadors';

const TOP_DEMOS = AMBASSADORS.slice(0, 4);

export default function Login() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function tryGoogle() {
    setBusy(true);
    try {
      const r = await fetch('/cdn-cgi/access/get-identity', { credentials: 'include' });
      if (r.ok) {
        const ct = r.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          window.location.href = '/dashboard';
          return;
        }
      }
      // Try the Access login URL — works once Access is wired
      window.location.href = ACCESS_LOGIN_URL;
    } catch {
      window.location.href = ACCESS_LOGIN_URL;
    }
  }

  function pickDemo(id: string, name: string, email: string) {
    setDemoUser({ ambassadorId: id, name, email });
    nav('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden">
      <Blob className="absolute -top-32 -left-32 w-[640px] opacity-50 animate-floaty" tone="lime"/>
      <Blob className="absolute -bottom-32 -right-32 w-[640px] opacity-40 animate-floaty [animation-delay:2s]" tone="blue"/>
      <Sparkle className="absolute top-1/4 right-1/3 w-5 animate-spinSlow opacity-50" color="#CFFF04"/>
      <Sparkle className="absolute bottom-1/4 left-1/3 w-4 animate-spinSlow [animation-delay:3s] opacity-50" color="#1E7FE0"/>

      <div className="absolute top-6 left-6"><Link to="/"><Logo/></Link></div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-[28px] glass-strong p-8 md:p-10 animate-fadeUp">
          <div className="chip mb-5"><span className="dot"/> Acceso embajadores</div>
          <h1 className="h-display text-4xl md:text-5xl mb-3">Bienvenido<br/>de vuelta.</h1>
          <p className="text-white/60 text-sm mb-8">Inicia sesión con la cuenta Google asociada a tu programa de embajadores.</p>

          <button
            onClick={tryGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 bg-white text-pana-navy hover:bg-white/95 font-bold py-3.5 px-5 rounded-full transition-all hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.4)] disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span>{busy ? 'Conectando…' : 'Continuar con Google'}</span>
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/40">
            <div className="flex-1 h-px bg-white/10"/>
            o
            <div className="flex-1 h-px bg-white/10"/>
          </div>

          <button
            onClick={() => setDemoOpen(v => !v)}
            className="w-full text-sm text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            Explorar como embajador (demo)
          </button>

          {demoOpen && (
            <div className="mt-3 rounded-2xl bg-white/[0.04] border border-white/8 p-3 space-y-2 animate-fadeUp">
              {TOP_DEMOS.map(a => (
                <button
                  key={a.id}
                  onClick={() => pickDemo(a.id, a.name, a.email)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <img src={a.photo} alt={a.name} loading="lazy" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{a.name}</div>
                    <div className="text-[11px] text-white/50">Rank #{a.rank} · {a.country} · {a.track}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CFFF04" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </button>
              ))}
              <div className="text-[10px] text-white/40 px-2 pt-1">El modo demo no escribe nada en producción — es solo para previsualizar la experiencia.</div>
            </div>
          )}

          <div className="mt-8 text-[11px] text-white/40 text-center">
            ¿Aún no eres embajador? <a href="mailto:embajadores@getpana.app" className="text-pana-lime hover:underline">Aplica al programa</a>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-white/30">
          Privado y confidencial · Pana Global 2026
        </div>
      </div>
    </div>
  );
}
