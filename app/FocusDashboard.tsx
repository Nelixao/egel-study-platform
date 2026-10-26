'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { obtenerIntentos } from '@/lib/progreso';

type Subarea = {
  slug: string;
  nombre: string;
  area: string;
  tieneContenido: boolean;
  lecciones: number;
  preguntas: number;
};

export default function FocusDashboard({
  subareas,
}: {
  subareas: Subarea[];
}) {
  const [subareasPracticadas, setSubareasPracticadas] = useState(0);

  useEffect(() => {
    function actualizarProgreso() {
      const slugsPracticados = new Set(
        obtenerIntentos().map((intento) => intento.subareaSlug)
      );
      setSubareasPracticadas(
        subareas.filter((subarea) => slugsPracticados.has(subarea.slug)).length
      );
    }

    actualizarProgreso();
    window.addEventListener(
      'egel-study-platform:progreso-actualizado',
      actualizarProgreso
    );
    return () =>
      window.removeEventListener(
        'egel-study-platform:progreso-actualizado',
        actualizarProgreso
      );
  }, [subareas]);

  const totalSubareas = subareas.length;
  const porcentaje =
    totalSubareas > 0
      ? Math.round((subareasPracticadas / totalSubareas) * 100)
      : 0;
  const subareasConContenido = subareas.filter(
    (subarea) => subarea.tieneContenido
  ).length;

  return (
    <main className="bg-ios-canvas-v2 min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <section className="glass-elevated rounded-[28px] p-6 md:p-9">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                EGEL Plus ICOMPU
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
                Hola, vamos paso a paso.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                Tu espacio de estudio está listo. Elige una sesión y avanza a tu
                ritmo.
              </p>
            </div>

            <Link
              href="/hoy"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
            >
              Continuar estudiando
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="avance-titulo"
          className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="glass-card-strong rounded-[24px] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Tu avance de práctica
                </p>
                <h2
                  id="avance-titulo"
                  className="mt-2 text-2xl font-semibold tracking-tight text-slate-100"
                >
                  {subareasPracticadas} de {totalSubareas} subáreas
                </h2>
              </div>
              <span className="text-2xl font-semibold tabular-nums text-blue-300">
                {porcentaje}%
              </span>
            </div>
            <div
              className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700/70"
              role="progressbar"
              aria-label="Subáreas practicadas"
              aria-valuenow={subareasPracticadas}
              aria-valuemin={0}
              aria-valuemax={Math.max(1, totalSubareas)}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400 transition-[width] duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Subáreas en las que ya has respondido preguntas en este
              dispositivo.
            </p>
          </div>

          <div className="glass-card-strong flex items-center gap-4 rounded-[24px] p-6">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums text-slate-100">
                {subareasConContenido}
                <span className="text-base font-medium text-slate-500">
                  {' '}
                  / {totalSubareas}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                subáreas con material disponible
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="mapa-titulo">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Mapa de estudio
              </p>
              <h2
                id="mapa-titulo"
                className="mt-1 text-xl font-semibold tracking-tight text-slate-100"
              >
                Tus subáreas
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Con contenido
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                Próximamente
              </span>
            </div>
          </div>

          {subareas.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {subareas.map((subarea, index) => (
                <Link
                  key={subarea.slug}
                  href={`/subarea/${subarea.slug}`}
                  aria-label={`${subarea.nombre}, ${
                    subarea.tieneContenido
                      ? `${subarea.lecciones} lecciones y ${subarea.preguntas} preguntas`
                      : 'sin contenido todavía'
                  }`}
                  className={`glass-card group min-h-28 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-slate-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                    subarea.tieneContenido
                      ? 'border-emerald-400/20'
                      : 'border-slate-700/70 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tabular-nums text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full ${
                        subarea.tieneContenido
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'bg-slate-600'
                      }`}
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-slate-200 group-hover:text-white">
                    {subarea.nombre}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">
                    {subarea.area}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="glass-card rounded-2xl p-6 text-sm text-slate-400">
              Aún no hay subáreas en el temario.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
