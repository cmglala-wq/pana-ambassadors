import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const onLanding = loc.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'py-2.5' : 'py-4'}`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className={`flex items-center justify-between rounded-full px-4 md:px-5 py-2.5 transition-all ${scrolled ? 'glass-strong shadow-2xl shadow-black/40' : ''}`}>
          <Link to="/" className="flex items-center"><Logo /></Link>

          {onLanding && (
            <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
              <a href="#programa" className="hover:text-white transition-colors">El programa</a>
              <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
              <a href="#tracks" className="hover:text-white transition-colors">Modalidades</a>
              <a href="#como" className="hover:text-white transition-colors">Cómo aplicar</a>
            </nav>
          )}

          <div className="flex items-center gap-2">
            {onLanding ? (
              <Link to="/dashboard" className="btn-lime !py-2.5 !px-4 text-sm">
                Acceso embajadores
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
            ) : (
              <Link to="/" className="btn-ghost !py-2.5 !px-4 text-sm">Inicio</Link>
            )}
            {onLanding && (
              <button onClick={() => setOpen(v => !v)} className="md:hidden btn-ghost !py-2.5 !px-3" aria-label="Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
        {onLanding && open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-3 text-sm">
            <a href="#programa" onClick={() => setOpen(false)}>El programa</a>
            <a href="#beneficios" onClick={() => setOpen(false)}>Beneficios</a>
            <a href="#tracks" onClick={() => setOpen(false)}>Modalidades</a>
            <a href="#como" onClick={() => setOpen(false)}>Cómo aplicar</a>
          </div>
        )}
      </div>
    </header>
  );
}
