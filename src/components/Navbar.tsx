'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/simulador', label: 'Simulador' },
  { href: '/admin/preguntas', label: 'Banco de preguntas' },
  { href: '/biblioteca', label: 'Biblioteca', disabled: true },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              EGEL ICOMPU
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const activo = pathname === link.href;
              if (link.disabled) {
                return (
                  <span
                    key={link.href}
                    className="px-3 py-2 text-sm text-slate-300 cursor-not-allowed"
                    title="Próximamente"
                  >
                    {link.label}
                  </span>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    activo
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/simulador"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Practicar
          </Link>
        </div>
      </div>
    </nav>
  );
}