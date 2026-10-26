'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  calcularEstadisticas,
  obtenerIntentos,
  obtenerMetaDiaria,
} from '@/lib/progreso';

const FORMATO_CLAVE_DIA = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Mexico_City',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const FORMATO_DIA_CORTO = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'UTC',
  weekday: 'narrow',
});

function claveDia(fecha: Date) {
  const partes = FORMATO_CLAVE_DIA.formatToParts(fecha);
  const anio = partes.find((parte) => parte.type === 'year')?.value;
  const mes = partes.find((parte) => parte.type === 'month')?.value;
  const dia = partes.find((parte) => parte.type === 'day')?.value;
  return `${anio}-${mes}-${dia}`;
}

function desplazarDia(clave: string, cantidad: number) {
  const [anio, mes, dia] = clave.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia + cantidad, 12));
  return [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, '0'),
    String(fecha.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function etiquetaDia(clave: string) {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return FORMATO_DIA_CORTO.format(new Date(Date.UTC(anio, mes - 1, dia, 12)));
}

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
  const [rachaDias, setRachaDias] = useState(0);
  const [preguntasHoy, setPreguntasHoy] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(10);
  const [diasActivos, setDiasActivos] = useState<string[]>([]);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [precisionPorSlug, setPrecisionPorSlug] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    function actualizarProgreso() {
      const intentos = obtenerIntentos();
      const estadisticas = calcularEstadisticas(intentos);
      const hoy = claveDia(new Date());
      const diasRecientes = Array.from({ length: 7 }, (_, indice) =>
        desplazarDia(hoy, indice - 6)
      );

      setRachaDias(estadisticas.rachaDias);
      setPreguntasHoy(estadisticas.preguntasHoy);
      setMetaDiaria(obtenerMetaDiaria());
      setPrecisionPorSlug(
        Object.fromEntries(
          estadisticas.precisionPorSubarea.map((resultado) => [
            resultado.subareaSlug,
            resultado.precision,
          ])
        )
      );
      setDiasActivos(
        intentos
          .filter((intento) =>
            diasRecientes.includes(claveDia(new Date(intento.fecha)))
          )
          .map((intento) => claveDia(new Date(intento.fecha)))
      );

      const slugsPracticados = new Set(
        intentos.map((intento) => intento.subareaSlug)
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
  const subareasVisibles = mostrarTodas
    ? subareas
    : subareas.filter((subarea) => subarea.tieneContenido);
  const porcentajeMeta = Math.min(100, (preguntasHoy / metaDiaria) * 100);
  const diasRecientes = Array.from({ length: 7 }, (_, indice) => {
    const fecha = desplazarDia(claveDia(new Date()), indice - 6);
    return {
      fecha,
      etiqueta: etiquetaDia(fecha),
      activo: diasActivos.includes(fecha),
    };
  });

  return (
    <main className="bg-ios-canvas-v2 min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <section className="glass-elevated rounded-[28px] p-6 md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-slate-400">
                EGEL Plus ICOMPU
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Cada sesión te acerca a tu meta.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                Avanza a tu ritmo, celebra cada respuesta y construye un hábito
                que te acerque al EGEL.
              </p>

              <Link
                href="/hoy"
                className="interactive-glow group relative mt-6 inline-flex min-h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 px-7 py-4 text-lg font-bold text-white shadow-[0_14px_38px_-12px_rgba(99,102,241,0.72)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_-12px_rgba(34,211,238,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:w-auto"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative">Continuar estudiando</span>
                <svg
                  aria-hidden="true"
                  className="relative h-5 w-5 transition-transform group-hover:translate-x-1"
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

            <aside
              aria-label="Tu racha y objetivo diario"
              className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/25 p-5 sm:grid-cols-[1fr_auto] lg:min-w-[340px] lg:grid-cols-1"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300 shadow-[0_0_28px_rgba(251,146,60,0.16)]"
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 22a7 7 0 0 0 7-7c0-2.4-1.1-4.3-3-6-.1 2-1.4 3-2 3-1-4-3.5-6.5-6-8 0 3-1 4.5-2 6-1 1.5-2 3-2 5a8 8 0 0 0 8 7Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 22a4 4 0 0 0 4-4c0-1.3-.6-2.3-1.7-3.3-.1 1.1-.8 1.7-1.3 1.7-.6-2-1.8-3.1-3-3.9 0 1.7-.6 2.7-1.2 3.6-.5.7-.8 1.3-.8 2a4 4 0 0 0 4 3.9Z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {rachaDias > 0 ? 'Racha actual' : 'Empieza hoy'}
                  </p>
                  <p className="mt-0.5 text-3xl font-bold tabular-nums text-white">
                    {rachaDias}
                    <span className="ml-2 text-sm font-medium text-slate-400">
                      {rachaDias === 1 ? 'día' : 'días'}
                    </span>
                  </p>
                </div>
              </div>

              <div
                className="flex items-center justify-between gap-3 sm:flex-col sm:items-center"
                aria-label="Actividad de los últimos siete días"
              >
                <p className="text-xs text-slate-400 sm:text-center">Últimos 7 días</p>
                <div className="flex gap-1.5">
                  {diasRecientes.map((dia) => (
                    <span
                      key={dia.fecha}
                      title={`${dia.fecha}: ${dia.activo ? 'estudiaste' : 'sin actividad'}`}
                      aria-label={`${dia.etiqueta}: ${dia.activo ? 'estudiaste' : 'sin actividad'}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                        dia.activo
                          ? 'bg-emerald-400 text-emerald-950 shadow-[0_0_14px_rgba(52,211,153,0.35)]'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {dia.etiqueta}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-4 sm:col-span-2">
                <div
                  className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full"
                  role="progressbar"
                  aria-label="Progreso de tu objetivo diario"
                  aria-valuenow={Math.min(preguntasHoy, metaDiaria)}
                  aria-valuemin={0}
                  aria-valuemax={metaDiaria}
                  style={{
                    background: `conic-gradient(#22d3ee ${porcentajeMeta}%, rgba(71,85,105,0.55) ${porcentajeMeta}% 100%)`,
                  }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-cyan-200">
                    {Math.round(porcentajeMeta)}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Objetivo diario
                  </p>
                  <p className="text-xs text-slate-400">
                    {preguntasHoy} de {metaDiaria} preguntas
                  </p>
                </div>
              </div>
            </aside>
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
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Con contenido
              </span>
              <button
                type="button"
                onClick={() => setMostrarTodas((mostrar) => !mostrar)}
                className="rounded-lg px-2 py-1 font-semibold text-cyan-300 transition hover:bg-cyan-300/10 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                aria-expanded={mostrarTodas}
              >
                {mostrarTodas ? 'Ver solo disponibles' : 'Ver todas'}
              </button>
            </div>
          </div>

          {subareas.length > 0 ? (
            subareasVisibles.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {subareasVisibles.map((subarea) => {
                  const precision = precisionPorSlug[subarea.slug];
                  const perimetro = 100.53;
                  const desplazamiento =
                    perimetro * (1 - (precision ?? 0) / 100);

                  return (
                  <Link
                    key={subarea.slug}
                    href={`/subarea/${subarea.slug}`}
                    aria-disabled={!subarea.tieneContenido}
                    aria-label={`${subarea.nombre}, ${
                      subarea.tieneContenido
                        ? `${subarea.lecciones} lecciones y ${subarea.preguntas} preguntas`
                        : 'sin contenido todavía'
                    }${
                      precision === undefined
                        ? ''
                        : `, ${precision}% de respuestas correctas`
                    }`}
                    className={`interactive-glow glass-card group min-h-28 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-slate-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                      subarea.tieneContenido
                        ? 'border-emerald-400/25 shadow-[0_10px_28px_-20px_rgba(52,211,153,0.45)]'
                        : 'border-slate-700/70 opacity-55'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold tabular-nums text-slate-500">
                        {String(
                          subareas.findIndex(
                            (elemento) => elemento.slug === subarea.slug
                          ) + 1
                        ).padStart(2, '0')}
                      </span>
                      <span
                        className="relative grid h-11 w-11 shrink-0 place-items-center"
                        role="img"
                        aria-label={
                          precision === undefined
                            ? `${subarea.nombre}: aún no practicada`
                            : `${subarea.nombre}: ${precision}% de respuestas correctas`
                        }
                      >
                        <svg
                          className="absolute inset-0 h-full w-full -rotate-90"
                          viewBox="0 0 40 40"
                          aria-hidden="true"
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="rgba(148,163,184,0.22)"
                            strokeWidth="3"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke={precision === undefined ? 'transparent' : '#34d399'}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={perimetro}
                            strokeDashoffset={desplazamiento}
                            className="transition-[stroke-dashoffset] duration-700"
                          />
                        </svg>
                        <span className="text-[9px] font-bold tabular-nums text-slate-300">
                          {precision === undefined ? '—' : `${precision}%`}
                        </span>
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-slate-200 group-hover:text-white">
                      {subarea.nombre}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-slate-500">
                      {subarea.area}
                    </p>
                  </Link>
                  );
                })}
              </div>
            ) : (
              <p className="glass-card rounded-2xl p-6 text-sm text-slate-400">
                Aún no hay subáreas con material disponible. Puedes consultar el
                temario completo con “Ver todas”.
              </p>
            )
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
