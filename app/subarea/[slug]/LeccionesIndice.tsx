'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  EVENTO_PROGRESO_LECTURA,
  obtenerLeccionesLeidas,
} from '@/lib/progreso-lectura';

type LeccionIndice = {
  id: number;
  titulo: string;
};

export default function LeccionesIndice({
  slug,
  lecciones,
}: {
  slug: string;
  lecciones: LeccionIndice[];
}) {
  const [leidas, setLeidas] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activa = true;

    function cargarProgreso() {
      try {
        const idsLeidos = obtenerLeccionesLeidas(slug);
        const idsDisponibles = new Set(lecciones.map((leccion) => leccion.id));
        if (activa) {
          setLeidas(idsLeidos.filter((id) => idsDisponibles.has(id)));
          setError(null);
        }
      } catch {
        if (activa) {
          setLeidas([]);
          setError('No pudimos leer el progreso guardado en este dispositivo.');
        }
      }
    }

    const frame = window.requestAnimationFrame(cargarProgreso);
    window.addEventListener(EVENTO_PROGRESO_LECTURA, cargarProgreso);
    window.addEventListener('storage', cargarProgreso);

    return () => {
      activa = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener(EVENTO_PROGRESO_LECTURA, cargarProgreso);
      window.removeEventListener('storage', cargarProgreso);
    };
  }, [lecciones, slug]);

  const total = lecciones.length;
  const porcentaje = total === 0 ? 0 : (leidas.length / total) * 100;
  const circunferencia = 2 * Math.PI * 20;

  return (
    <section className="glass-card-strong rounded-[24px] p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="relative grid h-24 w-24 shrink-0 place-items-center self-center sm:self-auto"
          role="progressbar"
          aria-label="Progreso de lectura de la subárea"
          aria-valuenow={leidas.length}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(148,163,184,0.2)"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia * (1 - porcentaje / 100)}
              className="transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <span className="text-center">
            <span className="block text-lg font-bold tabular-nums text-white">
              {leidas.length}/{total}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              leídas
            </span>
          </span>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
            Tu avance
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {leidas.length === total && total > 0
              ? '¡Subárea completada!'
              : 'Sigue a tu propio ritmo'}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">
            {leidas.length} de {total}{' '}
            {total === 1 ? 'lección completada' : 'lecciones completadas'}.
            Tu avance se guarda en este dispositivo.
          </p>
          {error && (
            <p className="mt-2 text-sm text-rose-300" role="status">
              {error}
            </p>
          )}
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {lecciones.map((leccion, indice) => {
          const leida = leidas.includes(leccion.id);

          return (
            <li key={leccion.id}>
              <Link
                href={`/subarea/${encodeURIComponent(slug)}/${leccion.id}`}
                className="group flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/35 p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-slate-800/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:px-5"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums ${
                    leida
                      ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25'
                      : 'bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-200/20'
                  }`}
                  aria-label={leida ? 'Lección leída' : `Lección ${indice + 1}`}
                >
                  {leida ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  ) : (
                    indice + 1
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-400">
                    Lección {String(indice + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-0.5 block text-base font-semibold leading-snug text-slate-100 group-hover:text-white sm:text-lg">
                    {leccion.titulo}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition-colors group-hover:bg-cyan-300/15">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                  <span className="hidden sm:inline">
                    {leida ? 'Repasar' : 'Leer'}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
