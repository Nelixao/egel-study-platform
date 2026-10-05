'use client';

import { useState } from 'react';

type Pregunta = {
  id: number;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
  dificultad: string | null;
};

export default function Flashcards({ preguntas }: { preguntas: Pregunta[] }) {
  const [indice, setIndice] = useState(0);
  const [volteada, setVolteada] = useState(false);
  const [opcionSel, setOpcionSel] = useState<string | null>(null);

  const p = preguntas[indice];
  const total = preguntas.length;
  const respondida = opcionSel !== null;
  const esCorrecta = opcionSel === p.respuestaCorrecta;

  const dificultadColor: Record<string, { bg: string; text: string }> = {
    facil: { bg: 'rgba(52, 199, 89, 0.1)', text: '#34C759' },
    media: { bg: 'rgba(255, 149, 0, 0.1)', text: '#FF9500' },
    dificil: { bg: 'rgba(255, 59, 48, 0.1)', text: '#FF3B30' },
  };
  const color = dificultadColor[p.dificultad || 'media'];

  function siguiente() {
    if (indice < total - 1) {
      setIndice(indice + 1);
      setVolteada(false);
      setOpcionSel(null);
    }
  }

  function anterior() {
    if (indice > 0) {
      setIndice(indice - 1);
      setVolteada(false);
      setOpcionSel(null);
    }
  }

  function reiniciar() {
    setIndice(0);
    setVolteada(false);
    setOpcionSel(null);
  }

  function elegir(letra: string) {
    if (respondida) return;
    setOpcionSel(letra);
  }

  return (
    <div className="space-y-5">
      {/* Barra de progreso */}
      <div className="glass-card-strong rounded-[20px] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-black/60">
              {String(indice + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-md capitalize"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {p.dificultad || 'media'}
            </span>
          </div>
          <span className="text-xs font-semibold text-black/50">
            {Math.round(((indice + 1) / total) * 100)}%
          </span>
        </div>

        <div className="h-1.5 bg-black/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] transition-all duration-300"
            style={{ width: `${((indice + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Tarjeta */}
      <div className="glass-card-strong rounded-[22px] p-6 md:p-8 animate-slide-up">
        <p className="text-lg font-medium text-black leading-relaxed mb-6">
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
              'bg-white/60 border-black/5 hover:border-black/15 hover:bg-white';
            if (respondida) {
              if (esLaCorrecta) {
                clase = 'bg-[#34C759]/10 border-[#34C759]/40';
              } else if (seleccionada && !esLaCorrecta) {
                clase = 'bg-[#FF3B30]/10 border-[#FF3B30]/40';
              } else {
                clase = 'bg-white/40 border-black/5 opacity-60';
              }
            }

            return (
              <button
                key={op.letra}
                onClick={() => elegir(op.letra)}
                disabled={respondida}
                className={`w-full text-left flex gap-4 p-4 rounded-2xl border transition-all tap-scale ${clase}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                    respondida && esLaCorrecta
                      ? 'bg-[#34C759] text-white'
                      : respondida && seleccionada && !esLaCorrecta
                      ? 'bg-[#FF3B30] text-white'
                      : seleccionada
                      ? 'bg-[#007AFF] text-white'
                      : 'bg-black/[0.05] text-black/70'
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
                <span className="text-black/85 pt-1">{op.texto}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {respondida && (
          <div
            className={`mt-6 pt-5 border-t border-black/5 animate-slide-up ${
              esCorrecta ? '' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  esCorrecta
                    ? 'bg-[#34C759]/10 text-[#34C759]'
                    : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                }`}
              >
                {esCorrecta ? 'Correcta' : 'Incorrecta'}
              </span>
              {!esCorrecta && (
                <span className="text-xs text-black/50">
                  La respuesta correcta es <strong className="text-black">{p.respuestaCorrecta}</strong>
                </span>
              )}
            </div>
            {p.explicacion && (
              <p className="text-sm text-black/75 leading-relaxed">
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
          className="px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-black/5 text-black/70 text-sm font-medium disabled:opacity-40 hover:bg-white tap-scale"
        >
          ← Anterior
        </button>

        <button
          onClick={reiniciar}
          className="text-xs font-medium text-black/50 hover:text-[#007AFF] transition-colors"
        >
          Reiniciar
        </button>

        {indice === total - 1 ? (
          <button
            onClick={reiniciar}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#007AFF] to-[#5856D6] text-white text-sm font-semibold tap-scale shadow-md shadow-[#007AFF]/20"
          >
            Volver al inicio
          </button>
        ) : (
          <button
            onClick={siguiente}
            className="px-5 py-3 rounded-2xl bg-[#007AFF] text-white text-sm font-semibold hover:bg-[#0066DD] tap-scale shadow-md shadow-[#007AFF]/20"
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
              setVolteada(false);
              setOpcionSel(null);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === indice
                ? 'bg-[#007AFF] w-6'
                : 'bg-black/15 hover:bg-black/30'
            }`}
            aria-label={`Ir a pregunta ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}