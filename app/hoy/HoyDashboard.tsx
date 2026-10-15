'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  calcularEstadisticas,
  obtenerIntentos,
  type EstadisticasProgreso,
} from '@/lib/progreso';

type Subarea = {
  slug: string;
  nombre: string;
};

const estadisticasIniciales: EstadisticasProgreso = {
  rachaDias: 0,
  preguntasHoy: 0,
  precisionPorSubarea: [],
};

export default function HoyDashboard({ subareas }: { subareas: Subarea[] }) {
  const [estadisticas, setEstadisticas] = useState(estadisticasIniciales);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEstadisticas(calcularEstadisticas(obtenerIntentos()));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const precisionPorSlug = new Map(
    estadisticas.precisionPorSubarea.map((resultado) => [
      resultado.subareaSlug,
      resultado,
    ])
  );

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
