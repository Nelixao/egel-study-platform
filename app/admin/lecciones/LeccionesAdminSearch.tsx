'use client';

import { useRef, useState, type ReactNode } from 'react';

function normalizarTexto(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim();
}

export default function LeccionesAdminSearch({
  total,
  children,
}: {
  total: number;
  children: ReactNode;
}) {
  const [busqueda, setBusqueda] = useState('');
  const [cantidadVisible, setCantidadVisible] = useState(total);
  const contenedorRef = useRef<HTMLDivElement>(null);

  function filtrar(value: string) {
    setBusqueda(value);
    const termino = normalizarTexto(value);
    const filas =
      contenedorRef.current?.querySelectorAll<HTMLElement>(
        '[data-leccion-search]'
      ) ?? [];
    let visibles = 0;

    filas.forEach((fila) => {
      const coincide = normalizarTexto(
        fila.dataset.leccionSearch ?? ''
      ).includes(termino);
      fila.hidden = !coincide;
      if (coincide) visibles += 1;
    });

    setCantidadVisible(visibles);
  }

  return (
    <div ref={contenedorRef}>
      <label className="sr-only" htmlFor="buscar-lecciones-admin">
        Buscar por título o subárea
      </label>
      <div className="glass-card mx-4 mb-4 flex items-center gap-3 rounded-xl px-4 sm:mx-6">
        <svg
          className="h-5 w-5 shrink-0 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="m16 16 4 4" />
        </svg>
        <input
          id="buscar-lecciones-admin"
          type="search"
          value={busqueda}
          onChange={(event) => filtrar(event.target.value)}
          placeholder="Buscar por título o subárea…"
          className="min-h-12 min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => filtrar('')}
            className="min-h-11 rounded-lg px-3 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            Limpiar
          </button>
        )}
      </div>
      <p className="px-6 pb-3 text-xs text-[#8E8E93]" aria-live="polite">
        {cantidadVisible} de {total}{' '}
        {total === 1 ? 'lección' : 'lecciones'}
      </p>
      {busqueda && cantidadVisible === 0 && (
        <p className="px-6 py-8 text-center text-sm text-[#8E8E93]">
          No hay lecciones que coincidan con la búsqueda.
        </p>
      )}
      {children}
    </div>
  );
}
