'use client';

import { useRef, useState, type ReactNode } from 'react';

type OpcionSubarea = {
  id: number;
  nombre: string;
};

type OpcionDificultad = {
  id: string;
  nombre: string;
};

function normalizarTexto(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim();
}

export default function AdminListFilters({
  total,
  plural,
  subareas,
  dificultades = [],
  children,
}: {
  total: number;
  plural: string;
  subareas: OpcionSubarea[];
  dificultades?: OpcionDificultad[];
  children: ReactNode;
}) {
  const [busqueda, setBusqueda] = useState('');
  const [subareaSeleccionada, setSubareaSeleccionada] = useState('todas');
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState('todas');
  const [cantidadVisible, setCantidadVisible] = useState(total);
  const contenedorRef = useRef<HTMLDivElement>(null);

  function actualizarFilas(
    terminoBusqueda: string,
    subareaId: string,
    dificultad: string
  ) {
    const termino = normalizarTexto(terminoBusqueda);
    const filas = contenedorRef.current?.querySelectorAll<HTMLElement>(
      '[data-admin-filter-row]'
    ) ?? [];
    let visibles = 0;

    filas.forEach((fila) => {
      const coincideTexto = normalizarTexto(fila.dataset.search ?? '').includes(
        termino
      );
      const coincideSubarea =
        subareaId === 'todas' || fila.dataset.subarea === subareaId;
      const coincideDificultad =
        dificultad === 'todas' || fila.dataset.difficulty === dificultad;
      const visible = coincideTexto && coincideSubarea && coincideDificultad;

      fila.hidden = !visible;
      if (visible) visibles += 1;
    });

    setCantidadVisible(visibles);
  }

  return (
    <div ref={contenedorRef}>
      <div className="mx-4 mb-3 flex flex-col gap-3 sm:mx-6">
        <label className="glass-card flex min-h-12 items-center gap-3 rounded-xl px-4">
          <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="m16 16 4 4" />
          </svg>
          <span className="sr-only">Buscar {plural}</span>
          <input
            type="search"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              actualizarFilas(
                event.target.value,
                subareaSeleccionada,
                dificultadSeleccionada
              );
            }}
            placeholder={`Buscar ${plural}…`}
            className="min-h-12 min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                actualizarFilas('', subareaSeleccionada, dificultadSeleccionada);
              }}
              className="min-h-12 rounded-lg px-3 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Limpiar
            </button>
          )}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-slate-900/35 px-4">
            <span className="shrink-0 text-xs font-semibold text-slate-400">Subárea</span>
            <select
              value={subareaSeleccionada}
              onChange={(event) => {
                setSubareaSeleccionada(event.target.value);
                actualizarFilas(busqueda, event.target.value, dificultadSeleccionada);
              }}
              className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none"
            >
              <option className="bg-slate-900" value="todas">Todas</option>
              {subareas.map((subarea) => (
                <option className="bg-slate-900" key={subarea.id} value={String(subarea.id)}>
                  {subarea.nombre}
                </option>
              ))}
            </select>
          </label>

          {dificultades.length > 0 && (
            <div className="flex min-h-12 items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-slate-900/35 p-1" role="group" aria-label="Filtrar por dificultad">
              {[{ id: 'todas', nombre: 'Todas' }, ...dificultades].map((dificultad) => (
                <button
                  key={dificultad.id}
                  type="button"
                  aria-pressed={dificultadSeleccionada === dificultad.id}
                  onClick={() => {
                    setDificultadSeleccionada(dificultad.id);
                    actualizarFilas(busqueda, subareaSeleccionada, dificultad.id);
                  }}
                  className={`min-h-10 shrink-0 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${dificultadSeleccionada === dificultad.id ? 'bg-cyan-300/15 text-cyan-100' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
                >
                  {dificultad.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="px-6 pb-3 text-xs text-[#8E8E93]" aria-live="polite">
        {cantidadVisible} de {total} {plural}
      </p>
      {cantidadVisible === 0 && total > 0 && (
        <p className="px-6 py-8 text-center text-sm text-[#8E8E93]">
          No hay {plural} que coincidan con los filtros.
        </p>
      )}
      {children}
    </div>
  );
}