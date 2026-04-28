import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-12 grid md:grid-cols-3 gap-8 text-sm text-white/60">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs">Pana Global. Fintech inclusiva que conecta a personas y empresas en una red de pagos sin fronteras.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-white/90 font-bold mb-2">Programa</div>
            <a href="#programa" className="block hover:text-white">Resumen</a>
            <a href="#beneficios" className="block hover:text-white">Beneficios</a>
            <a href="#tracks" className="block hover:text-white">Modalidades</a>
            <a href="#como" className="block hover:text-white">Cómo aplicar</a>
          </div>
          <div>
            <div className="text-white/90 font-bold mb-2">Pana</div>
            <a href="https://getpana.app" target="_blank" rel="noreferrer" className="block hover:text-white">getpana.app</a>
            <a href="https://www.instagram.com/getpana" target="_blank" rel="noreferrer" className="block hover:text-white">Instagram</a>
            <a href="mailto:embajadores@getpana.app" className="block hover:text-white">embajadores@getpana.app</a>
          </div>
        </div>
        <div className="text-xs">
          <div className="text-white/90 font-bold mb-2">Aviso</div>
          <p>Programa privado y confidencial. Sujeto a aprobación. Pana se reserva el derecho de admisión y de terminar la participación si se incumplen las guías.</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10 text-[11px] text-white/30 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Pana®. Todos los derechos reservados.</span>
        <span>v1.0 · Hecho con ⚡ en Miami</span>
      </div>
    </footer>
  );
}
