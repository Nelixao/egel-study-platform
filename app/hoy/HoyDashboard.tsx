'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  calcularEstadisticas,
  calcularLogros,
  guardarMetaDiaria,
  obtenerIdsErroresPendientes,
  obtenerIntentos,
  obtenerMetaDiaria,
  type EstadisticasProgreso,
  type Logro,
} from '@/lib/progreso';
import Pomodoro from '@/components/Pomodoro';

type Subarea = {
  slug: string;
  nombre: string;
  preguntasDisponibles: number;
};

const estadisticasIniciales: EstadisticasProgreso = {
  rachaDias: 0,
  preguntasHoy: 0,
  precisionPorSubarea: [],
};

const logrosIniciales: Logro[] = calcularLogros([]);

export default function HoyDashboard({
  subareas,
  preguntaIds,
}: {
  subareas: Subarea[];
  preguntaIds: number[];
}) {
  const [estadisticas, setEstadisticas] = useState(estadisticasIniciales);
  const [logros, setLogros] = useState(logrosIniciales);
  const [erroresPendientes, setErroresPendientes] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(10);

  useEffect(() => {
    function actualizarProgreso() {
      const intentos = obtenerIntentos();
      setEstadisticas(calcularEstadisticas(intentos));
      setLogros(calcularLogros(intentos));
      const preguntasDisponibles = new Set(preguntaIds);
      setErroresPendientes(
        obtenerIdsErroresPendientes(intentos).filter((id) =>
          preguntasDisponibles.has(id)
        ).length
      );
    }

    const frame = window.requestAnimationFrame(() => {
      setMetaDiaria(obtenerMetaDiaria());
      actualizarProgreso();
    });
    window.addEventListener(
      'egel-study-platform:progreso-actualizado',
      actualizarProgreso
    );
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(
        'egel-study-platform:progreso-actualizado',
        actualizarProgreso
      );
    };
  }, [preguntaIds]);

  const precisionPorSlug = new Map(
    estadisticas.precisionPorSubarea.map((resultado) => [
      resultado.subareaSlug,
      resultado,
    ])
  );
  const recomendacionConIntentos = subareas
    .map((subarea) => ({
      ...subarea,
      resultado: precisionPorSlug.get(subarea.slug),
    }))
    .filter(
      (subarea) =>
        subarea.preguntasDisponibles > 0 &&
        subarea.resultado !== undefined &&
        subarea.resultado.total >= 3
    )
    .sort(
      (a, b) =>
        a.resultado!.precision - b.resultado!.precision ||
        a.nombre.localeCompare(b.nombre)
    )[0];
  const recomendacionInicial =
    recomendacionConIntentos ??
    subareas.find((subarea) => subarea.preguntasDisponibles > 0);

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav">
        <div className="max-w-4xl mx-auto px-5 py-8">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-2">
            Tu progreso
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Hoy
          </h1>
          <p className="text-sm text-black/60 mt-2">
            Un resumen de tus respuestas guardadas en este dispositivo.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-6">
        <section
          className={`glass-card-strong rounded-[22px] p-6 transition-colors ${
            estadisticas.preguntasHoy >= metaDiaria
              ? 'border-[#34C759]/30 bg-[#34C759]/[0.06]'
              : ''
          }`}
          aria-labelledby="meta-diaria-titulo"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-2">
                Tu objetivo de hoy
              </p>
              <h2
                id="meta-diaria-titulo"
                className="text-xl font-semibold text-black"
              >
                Responde {metaDiaria} preguntas hoy
              </h2>
              {estadisticas.preguntasHoy >= metaDiaria && (
                <p className="mt-2 text-sm font-semibold text-[#248A3D]">
                  Meta cumplida
                  {estadisticas.preguntasHoy > metaDiaria &&
                    `: llevas ${estadisticas.preguntasHoy - metaDiaria} más. ¡Buen trabajo!`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-black/70">
                {estadisticas.preguntasHoy}/{metaDiaria}
              </span>
              <button
                type="button"
                onClick={() => {
                  const nuevaMeta = Math.max(1, metaDiaria - 1);
                  setMetaDiaria(nuevaMeta);
                  guardarMetaDiaria(nuevaMeta);
                }}
                className="h-9 w-9 rounded-full bg-black/[0.05] text-black/70 font-semibold hover:bg-black/[0.08] tap-scale"
                aria-label="Disminuir meta diaria"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => {
                  const nuevaMeta = metaDiaria + 1;
                  setMetaDiaria(nuevaMeta);
                  guardarMetaDiaria(nuevaMeta);
                }}
                className="h-9 w-9 rounded-full bg-black/[0.05] text-black/70 font-semibold hover:bg-black/[0.08] tap-scale"
                aria-label="Aumentar meta diaria"
              >
                +
              </button>
            </div>
          </div>

          <div
            className="mt-5 h-3 rounded-full bg-black/[0.06] overflow-hidden"
            role="progressbar"
            aria-label="Progreso de la meta diaria"
            aria-valuenow={Math.min(estadisticas.preguntasHoy, metaDiaria)}
            aria-valuemin={0}
            aria-valuemax={metaDiaria}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${
                estadisticas.preguntasHoy >= metaDiaria
                  ? 'bg-[#34C759]'
                  : 'bg-gradient-to-r from-[#007AFF] to-[#5856D6]'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (estadisticas.preguntasHoy / metaDiaria) * 100
                )}%`,
              }}
            />
          </div>
        </section>

        <Pomodoro />

        <Link
          href="/repasar"
          className="flex items-center justify-between gap-4 glass-card-strong rounded-[22px] p-5 hover:border-[#007AFF]/25 transition-colors group"
        >
          <span>
            <span className="block text-base font-semibold text-black group-hover:text-[#007AFF] transition-colors">
              Repasar mis errores
            </span>
            <span className="block text-sm text-black/55 mt-1">
              {erroresPendientes}{' '}
              {erroresPendientes === 1
                ? 'pregunta pendiente'
                : 'preguntas pendientes'}
            </span>
          </span>
          <span className="flex items-center gap-2 text-[#007AFF] text-sm font-semibold whitespace-nowrap">
            Repasar
            <span aria-hidden="true">→</span>
          </span>
        </Link>

        <section className="glass-card-strong rounded-[22px] p-6">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-2">
            Recomendación de hoy
          </p>
          {recomendacionConIntentos ? (
            <>
              <h2 className="text-xl font-semibold text-black">
                Practica {recomendacionConIntentos.nombre}: has acertado{' '}
                {recomendacionConIntentos.resultado!.precision}%
              </h2>
              <p className="text-sm text-black/55 mt-2">
                Basado en {recomendacionConIntentos.resultado!.total} respuestas.
                Reforzar esta subárea puede ayudarte a mejorar.
              </p>
              <Link
                href={`/banco/${recomendacionConIntentos.slug}`}
                className="inline-flex mt-5 bg-[#007AFF] hover:bg-[#0066DD] text-white text-sm font-semibold px-5 py-3 rounded-xl tap-scale transition-colors"
              >
                Practicar esta subárea
              </Link>
            </>
          ) : recomendacionInicial ? (
            <>
              <h2 className="text-xl font-semibold text-black">
                Empieza practicando: {recomendacionInicial.nombre}
              </h2>
              <p className="text-sm text-black/55 mt-2">
                Cuando tengas al menos 3 respuestas en una subárea, te recomendaremos
                cuál conviene reforzar.
              </p>
              <Link
                href={`/banco/${recomendacionInicial.slug}`}
                className="inline-flex mt-5 bg-[#007AFF] hover:bg-[#0066DD] text-white text-sm font-semibold px-5 py-3 rounded-xl tap-scale transition-colors"
              >
                Empezar a practicar
              </Link>
            </>
          ) : (
            <p className="text-sm text-black/55">
              Aún no hay subáreas con preguntas aprobadas para practicar.
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card-strong rounded-[22px] p-6">
            <p className="text-sm font-medium text-black/55">Racha de días</p>
            <p className="text-4xl font-bold text-[#5856D6] mt-2">
              {estadisticas.rachaDias}
            </p>
            <p className="text-xs text-black/50 mt-1">
              {estadisticas.rachaDias === 1 ? 'día consecutivo' : 'días consecutivos'}
            </p>
          </div>
          <div className="glass-card-strong rounded-[22px] p-6">
            <p className="text-sm font-medium text-black/55">
              Preguntas respondidas hoy
            </p>
            <p className="text-4xl font-bold text-[#007AFF] mt-2">
              {estadisticas.preguntasHoy}
            </p>
            <p className="text-xs text-black/50 mt-1">en banco y simuladores</p>
          </div>
        </section>

        <section className="glass-card-strong rounded-[22px] p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black">Logros</h2>
            <p className="text-sm text-black/55 mt-1">
              Se desbloquean automáticamente con tu práctica.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {logros.map((logro) => (
              <li
                key={logro.id}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${
                  logro.logrado
                    ? 'border-[#007AFF]/15 bg-[#007AFF]/[0.04]'
                    : 'border-black/[0.06] bg-black/[0.02]'
                }`}
                aria-label={`${logro.nombre}: ${logro.logrado ? 'logrado' : 'pendiente'}`}
              >
                <span
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
                    logro.logrado
                      ? 'bg-[#007AFF]/10'
                      : 'bg-black/[0.05] grayscale opacity-45'
                  }`}
                  aria-hidden="true"
                >
                  {logro.icono}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-semibold ${
                      logro.logrado ? 'text-black' : 'text-black/45'
                    }`}
                  >
                    {logro.nombre}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      logro.logrado ? 'text-black/55' : 'text-black/35'
                    }`}
                  >
                    {logro.descripcion}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card-strong rounded-[22px] p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black">
              Precisión por subárea
            </h2>
            <p className="text-sm text-black/55 mt-1">
              Porcentaje de respuestas correctas desde que empezaste a practicar.
            </p>
          </div>

          {subareas.length > 0 ? (
            <ul className="space-y-4">
              {subareas.map((subarea) => {
                const resultado = precisionPorSlug.get(subarea.slug);
                const precision = resultado?.precision ?? 0;

                return (
                  <li key={subarea.slug}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-sm font-medium text-black/80">
                        {subarea.nombre}
                      </span>
                      <span className="text-xs text-black/55 whitespace-nowrap">
                        {resultado
                          ? `${precision}% · ${resultado.total} respuestas`
                          : 'Sin respuestas'}
                      </span>
                    </div>
                    <div
                      className="h-2 bg-black/[0.06] rounded-full overflow-hidden"
                      role="progressbar"
                      aria-label={`Precisión en ${subarea.nombre}`}
                      aria-valuenow={precision}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-full transition-all"
                        style={{ width: `${precision}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-black/55">
              Todavía no hay subáreas disponibles.
            </p>
          )}
        </section>

        <Link
          href="/banco"
          className="flex items-center justify-center w-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] hover:opacity-95 text-white text-base font-semibold py-4 rounded-2xl tap-scale shadow-lg shadow-[#007AFF]/20 transition-opacity"
        >
          Continuar practicando
        </Link>
      </div>
    </main>
  );
}
