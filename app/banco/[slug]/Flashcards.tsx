'use client';

import { useState } from 'react';
import { guardarIntento } from '@/lib/progreso';

type Pregunta = {
  id: number;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
  dificultad: string | null;
  subareaSlug?: string;
};

export default function Flashcards({
  preguntas,
  subareaSlug,
  onRespuesta,
  onComplete,
  onCompleteLabel,
}: {
  preguntas: Pregunta[];
  subareaSlug?: string;
  onRespuesta?: (preguntaId: number, correcta: boolean) => void;
  onComplete?: () => void;
  onCompleteLabel?: string;
}) {
  const [indice, setIndice] = useState(0);
  const [opcionSel, setOpcionSel] = useState<string | null>(null);
  const [preguntasRespondidas, setPreguntasRespondidas] = useState<Set<number>>(
    () => new Set()
  );

  const p = preguntas[indice];
  const total = preguntas.length;
  const respondida = opcionSel !== null;
  const esCorrecta = opcionSel === p.respuestaCorrecta;
  const porcentajeRespondido =
    total > 0 ? (preguntasRespondidas.size / total) * 100 : 0;

  const dificultadColor: Record<string, { bg: string; text: string }> = {
    facil: { bg: 'rgba(52, 199, 89, 0.15)', text: '#34C759' },
    media: { bg: 'rgba(255, 149, 0, 0.15)', text: '#FF9500' },
    dificil: { bg: 'rgba(255, 59, 48, 0.15)', text: '#FF3B30' },
  };
  const color = dificultadColor[p.dificultad || 'media'];

  function siguiente() {
    if (indice < total - 1) {
      setIndice(indice + 1);
      setOpcionSel(null);
    }
  }

  function anterior() {
    if (indice > 0) {
      setIndice(indice - 1);
      setOpcionSel(null);
    }
  }

  function reiniciar() {
    setIndice(0);
    setOpcionSel(null);
    setPreguntasRespondidas(new Set());
  }

  function elegir(letra: string) {
    if (respondida) return;
    setOpcionSel(letra);
    setPreguntasRespondidas((actuales) => {
      const actualizadas = new Set(actuales);
      actualizadas.add(p.id);
      return actualizadas;
    });
    const correcta = letra === p.respuestaCorrecta;
    const slug = p.subareaSlug ?? subareaSlug;
    if (slug) {
      guardarIntento({
        subareaSlug: slug,
        preguntaId: p.id,
        correcta,
        fecha: new Date().toISOString(),
      });
    }
    onRespuesta?.(p.id, correcta);
  }

  return (
    <div className="space-y-5">
      {/* Barra de progreso */}
      <div className="glass-card-strong rounded-[20px] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-slate-400">
            {preguntasRespondidas.size} / {total} respondidas
            </span>
          <span className="text-xs text-slate-500">
            Pregunta {String(indice + 1).padStart(2, '0')}
          </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-md capitalize"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {p.dificultad || 'media'}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {Math.round(porcentajeRespondido)}%
          </span>
        </div>

        <div
          className="h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Preguntas respondidas en esta sesión"
          aria-valuenow={preguntasRespondidas.size}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-300"
            style={{ width: `${porcentajeRespondido}%` }}
          />
        </div>
      </div>

      {/* Tarjeta */}
      <div className="glass-card-strong rounded-[22px] p-6 md:p-8 animate-slide-up">
        <p className="text-lg font-medium text-white leading-relaxed mb-6">
          {p.enunciado}
        </p>

        <div className="space-y-2">
          {[
            { letra: 'A', texto: p.opcionA },
            { letra: 'B', texto: p.opcionB },
            { letra: 'C', texto: p.opcionC },
          ].map((op) => {
            const seleccionada = opcionSel === op.letra;
            const esLaCorrecta = op.letra === p.respuestaCorrecta;

            let clase =
              'bg-white/10 border-white/15 hover:border-indigo-300/50 hover:bg-white/15';
            if (respondida) {
              if (esLaCorrecta) {
                clase =
                  'bg-emerald-500/20 border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.2)]';
              } else if (seleccionada && !esLaCorrecta) {
                clase =
                  'bg-rose-500/20 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.18)]';
              } else {
                clase = 'bg-white/5 border-white/5 opacity-50';
              }
            }

            return (
              <button
                key={op.letra}
                onClick={() => elegir(op.letra)}
                disabled={respondida}
                aria-pressed={seleccionada}
                className={`answer-option min-h-12 w-full text-left flex gap-4 p-5 rounded-2xl border transition-all duration-300 active:scale-105 tap-scale ${seleccionada ? 'answer-pulse' : ''} ${clase}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                    respondida && esLaCorrecta
                      ? 'bg-emerald-500 text-white'
                      : respondida && seleccionada && !esLaCorrecta
                      ? 'bg-rose-500 text-white'
                      : seleccionada
                      ? 'bg-[#007AFF] text-white'
                      : 'bg-white/15 text-slate-100'
                  }`}
                >
                  {respondida && esLaCorrecta ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : respondida && seleccionada ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    op.letra
                  )}
                </span>
                <span className="text-base text-white pt-1">{op.texto}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {respondida && (
          <div className="mt-6 pt-5 border-t border-white/10 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  esCorrecta
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {esCorrecta ? 'Correcta' : 'Incorrecta'}
              </span>
              {!esCorrecta && (
                <span className="text-xs text-slate-400">
                  La respuesta correcta es <strong className="text-slate-200">{p.respuestaCorrecta}</strong>
                </span>
              )}
            </div>
            {p.explicacion && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {p.explicacion}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={anterior}
          disabled={indice === 0}
          className="interactive-glow min-h-12 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-white/10 tap-scale"
        >
          ← Anterior
        </button>

        <button
          onClick={reiniciar}
          className="min-h-12 px-3 text-sm font-medium text-slate-300 hover:text-[#007AFF] transition-colors"
        >
          Reiniciar
        </button>

        {indice === total - 1 ? (
          <button
            onClick={onComplete ?? reiniciar}
            className="interactive-glow min-h-12 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold tap-scale shadow-md shadow-indigo-500/20"
          >
            {onCompleteLabel ?? (onComplete ? 'Continuar' : 'Volver al inicio')}
          </button>
        ) : (
          <button
            onClick={siguiente}
            className="interactive-glow min-h-12 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold tap-scale shadow-md shadow-indigo-500/20"
          >
            Siguiente →
          </button>
        )}
      </div>

      {/* Navegación rápida por puntos */}
      <div className="flex flex-wrap gap-1.5 justify-center pt-2">
        {preguntas.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndice(i);
              setOpcionSel(null);
            }}
            className="group flex min-h-[48px] min-w-[48px] items-center justify-center"
            aria-label={`Ir a pregunta ${i + 1}`}
          >
            <span
              className={`h-2 rounded-full transition-all ${
                i === indice
                  ? 'w-6 bg-[#007AFF]'
                  : 'w-2 bg-white/30 group-hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}