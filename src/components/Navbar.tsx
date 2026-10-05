'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cerrarSesion } from '@/app/actions/auth';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/simulador', label: 'Simulador' },
  { href: '/admin/lecciones', label: 'Lecciones' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/preguntas', label: 'Preguntas' },
  { href: '/admin/borradores', label: 'Borradores' },
];
export default function Navbar() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-md shadow-[#007AFF]/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-black tracking-tight group-hover:text-[#007AFF] transition-colors">
              EGEL ICOMPU
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1 bg-black/[0.04] rounded-full p-1">
            {links.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-sm rounded-full transition-all font-medium ${activo
                      ? 'bg-white text-black shadow-sm'
                      : 'text-black/60 hover:text-black'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/simulador"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#007AFF] hover:bg-[#0066DD] text-white text-sm font-semibold px-4 py-2 rounded-full tap-scale shadow-md shadow-[#007AFF]/20"
            >
              Practicar
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="hidden md:inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-[#FF3B30] px-3 py-2 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Salir
              </button>
            </form>

            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 rounded-full text-black/70 hover:bg-black/5 tap-scale"
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

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="md:hidden py-3 border-t border-black/5 space-y-1 animate-slide-up">
            {links.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className={`block px-4 py-2.5 text-sm rounded-xl transition-colors font-medium ${activo
                      ? 'bg-[#007AFF]/10 text-[#007AFF]'
                      : 'text-black/70 hover:bg-black/5'
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