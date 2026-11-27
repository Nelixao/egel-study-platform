'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  calcularEstadisticas,
  obtenerIntentos,
  type Intento,
} from '@/lib/progreso';
import { guardarPracticaPendiente } from '@/lib/practica-pendiente';

type Subarea = {
  id: number;
  nombre: string;
  slug: string;
};

type Pregunta = {
  id: number;
  enunciado: string;
};

type ActividadDiaria = {
  clave: string;
  etiqueta: string;
  total: number;
};

const ZONA_HORARIA = 'America/Mexico_City';
const FORMATEADOR_DIA = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_HORARIA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const FORMATEADOR_DIA_CORTO = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'UTC',
  weekday: 'short',
});

function obtenerClaveDia(fecha: Date): string {
  const partes = FORMATEADOR_DIA.formatToParts(fecha);
  const anio = partes.find((parte) => parte.type === 'year')?.value;
  const mes = partes.find((parte) => parte.type === 'month')?.value;
  const dia = partes.find((parte) => parte.type === 'day')?.value;
  return `${anio}-${mes}-${dia}`;
}

function desplazarDia(clave: string, cantidad: number): string {
  const [anio, mes, dia] = clave.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia + cantidad, 12));
  return [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, '0'),
    String(fecha.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function etiquetaDia(clave: string): string {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return FORMATEADOR_DIA_CORTO.format(
    new Date(Date.UTC(anio, mes - 1, dia, 12))
  ).replace('.', '');
}

function obtenerColorPrecision(precision: number) {
  if (precision < 50) {
    return {
      texto: 'text-rose-300',
      fondo: 'bg-rose-400',
      etiqueta: 'Reforzar',
    };
  }
  if (precision <= 80) {
    return {
      texto: 'text-amber-300',
      fondo: 'bg-amber-400',
      etiqueta: 'En progreso',
    };
  }
  return {
    texto: 'text-emerald-300',
    fondo: 'bg-emerald-400',
    etiqueta: 'Dominada',
  };
}

function calcularActividad(intentos: Intento[]): ActividadDiaria[] {
  const hoy = obtenerClaveDia(new Date());
  const totalesPorDia = new Map<string, number>();

  for (const intento of intentos) {
    const clave = obtenerClaveDia(new Date(intento.fecha));
    totalesPorDia.set(clave, (totalesPorDia.get(clave) ?? 0) + 1);
  }

  return Array.from({ length: 7 }, (_, indice) => {
    const clave = desplazarDia(hoy, indice - 6);
    return {
      clave,
      etiqueta: etiquetaDia(clave),
      total: totalesPorDia.get(clave) ?? 0,
    };
  });
}

export default function EstadisticasDashboard({
  subareas,
  preguntas,
}: {
  subareas: Subarea[];
  preguntas: Pregunta[];
}) {
  const [intentos, setIntentos] = useState<Intento[] | null>(null);

  useEffect(() => {
    function actualizarIntentos() {
      setIntentos(obtenerIntentos());
    }

    actualizarIntentos();
    window.addEventListener(
      'egel-study-platform:progreso-actualizado',
      actualizarIntentos
    );
    window.addEventListener('storage', actualizarIntentos);
    return () => {
      window.removeEventListener(
        'egel-study-platform:progreso-actualizado',
        actualizarIntentos
      );
      window.removeEventListener('storage', actualizarIntentos);
    };
  }, []);

  const intentosActuales = useMemo(() => intentos ?? [], [intentos]);
  const estadisticas = useMemo(() => {
    const total = intentosActuales.length;
    const correctas = intentosActuales.filter((intento) => intento.correcta).length;
    const porSlug = new Map(
      calcularEstadisticas(intentosActuales).precisionPorSubarea.map((resultado) => [
        resultado.subareaSlug,
        resultado,
      ])
    );
    const porSubarea = subareas
      .map((subarea) => {
        const resultado = porSlug.get(subarea.slug);
        const totalSubarea = resultado?.total ?? 0;
        const aciertos = resultado?.correctas ?? 0;
        const precision =
          totalSubarea > 0 ? Math.round((aciertos / totalSubarea) * 100) : null;

        return {
          ...subarea,
          aciertos,
          fallos: totalSubarea - aciertos,
          total: totalSubarea,
          precision,
        };
      })
      .sort((a, b) => {
        if (a.precision === null) return b.precision === null ? a.nombre.localeCompare(b.nombre) : 1;
        if (b.precision === null) return -1;
        return a.precision - b.precision || a.nombre.localeCompare(b.nombre);
      });

    const intentosPorPregunta = new Map<
      number,
      { total: number; fallidas: number }
    >();
    for (const intento of intentosActuales) {
      if (intento.preguntaId === undefined) continue;
      const resultado = intentosPorPregunta.get(intento.preguntaId) ?? {
        total: 0,
        fallidas: 0,
      };
      resultado.total += 1;
      if (!intento.correcta) resultado.fallidas += 1;
      intentosPorPregunta.set(intento.preguntaId, resultado);
    }

    const enunciadoPorId = new Map(
      preguntas.map((pregunta) => [pregunta.id, pregunta.enunciado])
    );
    const preguntasFalladas = Array.from(intentosPorPregunta, ([id, resultado]) => ({
      id,
      enunciado:
        enunciadoPorId.get(id) ?? `Pregunta #${id} no disponible en el banco actual`,
      ...resultado,
    }))
      .filter((pregunta) => pregunta.fallidas > 0)
      .sort(
        (a, b) =>
          b.fallidas - a.fallidas ||
          b.total - a.total ||
          a.id - b.id
      );

    return {
      total,
      correctas,
      precision: total > 0 ? Math.round((correctas / total) * 100) : 0,
      rachaDias: calcularEstadisticas(intentosActuales).rachaDias,
      porSubarea,
      preguntasFalladas,
      actividad: calcularActividad(intentosActuales),
    };
  }, [intentosActuales, preguntas, subareas]);

  if (intentos === null) {
    return (
      <main className="min-h-screen bg-ios-canvas px-4 py-16">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-56 rounded-lg bg-white/[0.08]" />
          <div className="mt-8 h-48 rounded-3xl bg-white/[0.05]" />
        </div>
      </main>
    );
  }

  if (intentosActuales.length === 0) {
    return (
      <main className="min-h-screen bg-ios-canvas px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center">
          <section className="glass-card-strong w-full rounded-[28px] px-6 py-12 text-center sm:px-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M4 19V5m0 14h17M8 15v-4m4 4V7m4 8v-6m4 6V4"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Tus estadísticas aparecerán aquí
            </h1>
            <p className="mt-3 text-base text-slate-300">
              Aún no hay datos. ¡Haz tu primera práctica!
            </p>
            <Link
              href="/simulador"
              className="tap-scale mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-blue-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              Ir a practicar
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const maxActividad = Math.max(...estadisticas.actividad.map((dia) => dia.total), 1);

  return (
    <main className="min-h-screen bg-ios-canvas px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="pb-8 pt-10 sm:pb-10 sm:pt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            Tu progreso
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Estadísticas
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Un resumen de tus respuestas guardadas y los temas que puedes
                reforzar.
              </p>
            </div>
            <Link
              href="/simulador"
              className="tap-scale inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.08] sm:self-auto"
            >
              Nueva práctica
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <section
          aria-label="Métricas generales"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <article className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Preguntas respondidas</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-white">
              {estadisticas.total.toLocaleString('es-MX')}
            </p>
            <p className="mt-1 text-xs text-slate-500">Intentos guardados</p>
          </article>
          <article className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Acierto global</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-emerald-300">
              {estadisticas.precision}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {estadisticas.correctas} de {estadisticas.total} respuestas correctas
            </p>
          </article>
          <article className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Racha actual</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-amber-300">
              {estadisticas.rachaDias}{' '}
              <span className="text-base font-semibold">días</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Días consecutivos con actividad</p>
          </article>
          <article className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Tiempo de estudio</p>
            <p className="mt-3 text-3xl font-bold text-slate-200">No registrado</p>
            <p className="mt-1 text-xs text-slate-500">
              El tiempo no se guarda con cada intento
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
          <article className="glass-card-strong min-w-0 rounded-3xl p-5 sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-300">
                Prioridad de estudio
              </p>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Puntos débiles por subárea
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Ordenadas de menor a mayor precisión. Sin intentos se muestran al final.
              </p>
            </div>
            <div className="-mx-5 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[690px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold sm:px-3">Subárea</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Aciertos</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Fallos</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Intentos</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Precisión</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold sm:px-3">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {estadisticas.porSubarea.map((subarea) => {
                    const color =
                      subarea.precision === null
                        ? null
                        : obtenerColorPrecision(subarea.precision);
                    const esDebil =
                      subarea.precision !== null && subarea.precision <= 80;

                    return (
                      <tr key={subarea.id} className="transition-colors hover:bg-white/[0.025]">
                        <th scope="row" className="px-5 py-4 font-medium sm:px-3">
                          <span className="block text-sm text-slate-100">{subarea.nombre}</span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {color?.etiqueta ?? 'Aún sin practicar'}
                          </span>
                        </th>
                        <td className="px-3 py-4 text-right text-sm tabular-nums text-emerald-300">
                          {subarea.aciertos}
                        </td>
                        <td className="px-3 py-4 text-right text-sm tabular-nums text-rose-300">
                          {subarea.fallos}
                        </td>
                        <td className="px-3 py-4 text-right text-sm tabular-nums text-slate-300">
                          {subarea.total}
                        </td>
                        <td className={`px-3 py-4 text-right text-sm font-semibold tabular-nums ${color?.texto ?? 'text-slate-500'}`}>
                          {subarea.precision === null ? '—' : `${subarea.precision}%`}
                        </td>
                        <td className="px-5 py-4 text-right sm:px-3">
                          {esDebil ? (
                            <Link
                              href="/simulador"
                              onClick={() =>
                                guardarPracticaPendiente([subarea.id])
                              }
                              className="tap-scale inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border border-blue-300/20 bg-blue-400/10 px-3 text-xs font-semibold text-blue-200 transition-colors hover:bg-blue-400/20"
                            >
                              Reforzar ahora
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>

          <article className="glass-card-strong rounded-3xl p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">
              Últimos 7 días
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">Actividad</h2>
            <p className="mt-1 text-sm text-slate-400">
              Respuestas por día · zona horaria de Ciudad de México
            </p>
            <div
              className="mt-7 grid h-40 grid-cols-7 items-end gap-2"
              aria-label="Preguntas respondidas durante los últimos siete días"
            >
              {estadisticas.actividad.map((dia) => (
                <div
                  key={dia.clave}
                  className="flex h-full flex-col items-center justify-end gap-2"
                  title={`${dia.total} ${dia.total === 1 ? 'respuesta' : 'respuestas'}`}
                >
                  <span className="text-[11px] tabular-nums text-slate-400">
                    {dia.total || ''}
                  </span>
                  <div className="flex h-28 w-full items-end rounded-lg bg-white/[0.035] p-1">
                    <div
                      className={`w-full rounded-md transition-[height] duration-200 ${
                        dia.total > 0
                          ? 'bg-gradient-to-t from-blue-600 to-cyan-300'
                          : 'bg-white/[0.08]'
                      }`}
                      style={{
                        height:
                          dia.total > 0
                            ? `${Math.max(12, (dia.total / maxActividad) * 100)}%`
                            : '5%',
                      }}
                    />
                  </div>
                  <span className="text-[11px] capitalize text-slate-500">
                    {dia.etiqueta}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="glass-card-strong mt-6 rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-300">
                Para repasar
              </p>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Preguntas con más fallos
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Se cuentan los fallos de cada intento, no solo el último resultado.
            </p>
          </div>

          {estadisticas.preguntasFalladas.length > 0 ? (
            <ol className="mt-5 divide-y divide-white/[0.06]">
              {estadisticas.preguntasFalladas.map((pregunta, indice) => (
                <li
                  key={pregunta.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-400/10 text-sm font-bold tabular-nums text-rose-300">
                    {indice + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-slate-200">
                      {pregunta.enunciado}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {pregunta.total}{' '}
                      {pregunta.total === 1 ? 'intento' : 'intentos'} ·{' '}
                      <span className="font-semibold text-rose-300">
                        {pregunta.fallidas}{' '}
                        {pregunta.fallidas === 1 ? 'fallo' : 'fallos'}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-5 rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] px-4 py-5 text-sm text-emerald-200">
              Aún no hay preguntas falladas. ¡Sigue así!
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
