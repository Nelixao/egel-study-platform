'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cerrarSesion } from '@/app/actions/auth';

const publicLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/temario', label: 'Temario' },
  { href: '/simulador', label: 'Zona de Práctica' },
  { href: '/hoy', label: 'Hoy' },
];

const adminLinks = [
  { href: '/admin', label: 'Panel' },
  { href: '/admin/lecciones', label: 'Lecciones' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/preguntas', label: 'Preguntas' },
  { href: '/admin/borradores', label: 'Borradores' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const isAdmin = pathname.startsWith('/admin');
  const links = isAdmin ? adminLinks : publicLinks;

  useEffect(() => {
    function actualizarEstadoScroll() {
      setDesplazado(window.scrollY > 12);
    }

    actualizarEstadoScroll();
    window.addEventListener('scroll', actualizarEstadoScroll, { passive: true });
    return () => window.removeEventListener('scroll', actualizarEstadoScroll);
  }, []);

  return (
    <nav
      className={`glass-nav sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        desplazado ? 'glass-nav-scrolled' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="navbar-logo-mark w-9 h-9 rounded-[13px] bg-gradient-to-br from-[#1688FF] to-[#7068E8] flex items-center justify-center shadow-sm shadow-[#007AFF]/20 transition-all duration-300 group-hover:scale-105 group-hover:from-[#5856D6] group-hover:to-[#007AFF]">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-white tracking-tight group-hover:text-[#60A5FA] transition-colors">
              {isAdmin ? 'Admin' : 'EGEL ICOMPU'}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 border border-slate-700/70 rounded-full p-1">
            {links.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link min-h-[48px] flex items-center px-3.5 py-1.5 text-sm rounded-full transition-all duration-300 font-medium ${
                    activo
                      ? 'nav-link-active text-blue-300 shadow-inner'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Link
                  href="/"
                  className="hidden sm:inline-flex min-h-[48px] items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-full transition-colors"
                >
                  Ver sitio
                </Link>
                <form action={cerrarSesion}>
                  <button
                    type="submit"
                    className="hidden sm:inline-flex min-h-[48px] items-center gap-1.5 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-sm font-semibold px-4 py-2 rounded-full tap-scale transition-colors"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex min-h-[48px] items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-full transition-colors"
                >
                  Admin
                </Link>
              </>
            )}

            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="lg:hidden min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-slate-200 hover:bg-slate-700/70 tap-scale"
              aria-label="Menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="lg:hidden py-3 border-t border-slate-700/70 space-y-1 animate-slide-up">
            {links.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className={`nav-mobile-link block min-h-[48px] px-4 py-3 text-base rounded-xl transition-colors font-medium ${
                    activo
                      ? 'bg-blue-400/10 text-blue-300'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}