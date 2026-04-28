import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { SessionUser, clearDemoUser, setAdmin } from '../lib/session';

export default function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function logout() {
    clearDemoUser();
    setAdmin(false);
    if (user.source === 'access') {
      window.location.href = '/cdn-cgi/access/logout';
    } else {
      nav('/login');
    }
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full glass-strong hover:bg-white/[0.10] transition-colors">
        <Avatar src={user.photo} name={user.name} size={30} ring="lime"/>
        <div className="hidden sm:block text-left leading-tight">
          <div className="text-[11px] text-white/50">Embajador</div>
          <div className="text-[12px] font-bold text-white truncate max-w-[120px]">{user.name.split(' ')[0]}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? 'rotate-180' : ''} text-white/60`}><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 glass-strong rounded-2xl p-2 shadow-2xl shadow-black/60 z-50 animate-fadeUp">
          <div className="flex items-center gap-3 p-3">
            <Avatar src={user.photo} name={user.name} size={40} ring="lime"/>
            <div className="min-w-0">
              <div className="font-bold text-white truncate">{user.name}</div>
              <div className="text-xs text-white/50 truncate">{user.email}</div>
              {user.source === 'demo' && <div className="mt-1 text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-300/15 text-amber-300 border border-amber-300/30 font-bold">DEMO</div>}
            </div>
          </div>

          <div className="divider my-1"/>

          <MenuItem icon="👤" label="Mi perfil" onClick={() => { setOpen(false); nav('/dashboard'); }}/>
          <MenuItem icon="🔔" label="Notificaciones" hint="3" onClick={() => setOpen(false)}/>

          <div className="divider my-1"/>

          <MenuItem
            icon="👑"
            label="Vista admin"
            hint={user.isAdmin ? 'activo' : ''}
            highlight
            onClick={() => { setAdmin(true); setOpen(false); nav('/admin'); }}
          />

          <div className="divider my-1"/>

          <MenuItem icon="↗" label={user.source === 'access' ? 'Cerrar sesión' : 'Salir del demo'} danger onClick={logout}/>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, hint, onClick, highlight, danger }: { icon: string; label: string; hint?: string; onClick: () => void; highlight?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${highlight ? 'bg-pana-lime/10 hover:bg-pana-lime/15 text-pana-lime' : danger ? 'hover:bg-red-500/10 text-white/80 hover:text-red-300' : 'hover:bg-white/5 text-white/85'}`}
    >
      <span className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      {hint && <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{hint}</span>}
    </button>
  );
}
