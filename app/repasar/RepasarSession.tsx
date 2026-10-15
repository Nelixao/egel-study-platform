'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Flashcards from '../banco/[slug]/Flashcards';
import {
  obtenerIdsErroresPendientes,
  obtenerIntentos,
} from '@/lib/progreso';

type PreguntaRepaso = {
  id: number;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
  dificultad: string | null;
  subareaSlug: string;
  subareaNombre: string;
};

export default function RepasarSession({
  preguntas,
}: {
  preguntas: PreguntaRepaso[];
}) {
  const [idsPendientes, setIdsPendientes] = useState<number[]>([]);
  const [visitadas, setVisitadas] = useState<number[]>([]);
  const [preguntaResuelta, setPreguntaResuelta] = useState(false);
  const [cargado, setCargado] = useState(false);
  const preguntasPorId = useMemo(
    () => new Map(preguntas.map((pregunta) => [pregunta.id, pregunta])),
    [preguntas]
  );
  const preguntasPendientes = idsPendientes
    .map((id) => preguntasPorId.get(id))
    .filter((pregunta): pregunta is PreguntaRepaso => pregunta !== undefined);
  const siguientePregunta = preguntasPendientes.find(
    (pregunta) => !visitadas.includes(pregunta.id)
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const disponibles = new Set(preguntas.map((pregunta) => pregunta.id));
      setIdsPendientes(
        obtenerIdsErroresPendientes(obtenerIntentos()).filter((id) =>
          disponibles.has(id)
        )
      );
      setCargado(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [preguntas]);

  function avanzarPregunta() {
    if (!siguientePregunta) return;

    setVisitadas((actuales) => [...actuales, siguientePregunta.id]);
  }

  function reiniciarSesion() {
    setVisitadas([]);
    setPreguntaResuelta(false);
  }

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <Link
            href="/hoy"
            className="text-sm text-[#007AFF] hover:underline mb-3 inline-block"
          >
            ← Volver a Hoy
          </Link>
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest">
            Práctica personalizada
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight mt-1">
            Repasar mis errores
          </h1>
          <p className="text-sm text-black/60 mt-2">
            {preguntasPendientes.length}{' '}
            {preguntasPendientes.length === 1
              ? 'pregunta pendiente'
              : 'preguntas pendientes'}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {!cargado ? (
          <div className="glass-card-strong rounded-[22px] p-8 text-center text-sm text-black/55">
            Cargando tus errores guardados…
          </div>
        ) : preguntaResuelta ? (
          <div className="glass-card-strong rounded-[22px] p-8 text-center">
            <p className="text-4xl mb-3" aria-hidden="true">
              ✅
            </p>
            <h2 className="text-xl font-semibold text-black">
              ¡Respuesta correcta!
            </h2>
            <p className="text-sm text-black/60 mt-2">
              La pregunta ya no aparece entre tus errores pendientes.
            </p>
            <button
              type="button"
              onClick={() => setPreguntaResuelta(false)}
              className="mt-5 bg-[#007AFF] hover:bg-[#0066DD] text-white text-sm font-semibold px-5 py-3 rounded-xl tap-scale transition-colors"
            >
              Continuar repaso
            </button>
          </div>
        ) : siguientePregunta ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest px-1">
              {siguientePregunta.subareaNombre}
            </p>
            <Flashcards
              key={siguientePregunta.id}
              preguntas={[siguientePregunta]}
              onRespuesta={(preguntaId, correcta) => {
                if (correcta) {
                  setIdsPendientes((actuales) =>
                    actuales.filter((id) => id !== preguntaId)
                  );
                  setPreguntaResuelta(true);
                }
              }}
              onComplete={avanzarPregunta}
              onCompleteLabel={
                preguntasPendientes.length > 1
                  ? 'Siguiente error →'
                  : 'Terminar repaso'
              }
            />
          </div>
        ) : preguntasPendientes.length > 0 ? (
          <div className="glass-card-strong rounded-[22px] p-8 text-center">
            <p className="text-4xl mb-3" aria-hidden="true">
              ✅
            </p>
            <h2 className="text-xl font-semibold text-black">
              Terminaste esta ronda
            </h2>
            <p className="text-sm text-black/60 mt-2">
              Aún quedan {preguntasPendientes.length}{' '}
              {preguntasPendientes.length === 1
                ? 'pregunta por reforzar'
                : 'preguntas por reforzar'}. Si ya contestaste alguna bien, se quitará
              del repaso al continuar.
            </p>
            <button
              type="button"
              onClick={reiniciarSesion}
              className="mt-5 bg-[#007AFF] hover:bg-[#0066DD] text-white text-sm font-semibold px-5 py-3 rounded-xl tap-scale transition-colors"
            >
              Repasar errores pendientes
            </button>
          </div>
        ) : (
          <div className="glass-card-strong rounded-[22px] p-8 text-center">
            <p className="text-4xl mb-3" aria-hidden="true">
              🎉
            </p>
            <h2 className="text-xl font-semibold text-black">
              No tienes errores pendientes
            </h2>
            <p className="text-sm text-black/60 mt-2">
              Las preguntas desaparecen del repaso cuando tu respuesta más reciente
              es correcta.
            </p>
            <Link
              href="/banco"
              className="inline-flex mt-5 bg-[#007AFF] hover:bg-[#0066DD] text-white text-sm font-semibold px-5 py-3 rounded-xl tap-scale transition-colors"
            >
              Seguir practicando
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
