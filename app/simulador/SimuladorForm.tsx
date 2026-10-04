'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { obtenerPreguntasAleatorias } from '@/app/actions/simulador';

type Subarea = { id: number; nombre: string };
type Area = { id: number; nombre: string; subareas: Subarea[] };
type Seccion = { id: number; nombre: string; areas: Area[] };
type Pregunta = {
  id: number;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
};

type Fase = 'config' | 'examen' | 'resultado';

export default function SimuladorForm({ estructura }: { estructura: Seccion[] }) {
  const searchParams = useSearchParams();
  const [fase, setFase] = useState<Fase>('config');
  const [subareasSel, setSubareasSel] = useState<number[]>([]);
  const [cantidad, setCantidad] = useState(10);
  const [minutos, setMinutos] = useState(15);
  const [error, setError] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [segundos, setSegundos] = useState(0);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-seleccionar subárea si viene por URL
  useEffect(() => {
    const subareaParam = searchParams.get('subareas');
    if (subareaParam) {
      const ids = subareaParam
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
      if (ids.length > 0) {
        setSubareasSel(ids);
        setCantidad(10);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (fase !== 'examen') return;

    intervaloRef.current = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          terminar();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [fase]);

  function toggleSubarea(id: number) {
    setSubareasSel((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function iniciar() {
    setError(null);
    if (subareasSel.length === 0) {
      setError('Selecciona al menos una subárea');
      return;
    }

    const resultado = await obtenerPreguntasAleatorias(subareasSel, cantidad);

    if ('error' in resultado) {
      setError(resultado.error);
      return;
    }

    setPreguntas(resultado.preguntas);
    setRespuestas({});
    setIndice(0);
    setSegundos(minutos * 60);
    setFase('examen');
  }

  function responder(opcion: string) {
    setRespuestas((r) => ({ ...r, [preguntas[indice].id]: opcion }));
  }

  function siguiente() {
    if (indice < preguntas.length - 1) setIndice(indice + 1);
    else terminar();
  }

  function anterior() {
    if (indice > 0) setIndice(indice - 1);
  }

  function terminar() {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setFase('resultado');
  }

  function reiniciar() {
    setFase('config');
    setPreguntas([]);
    setRespuestas({});
    setIndice(0);
  }

  // === FASE CONFIG ===
  if (fase === 'config') {
    const hayPreseleccion = subareasSel.length > 0;

    return (
      <div className="space-y-6">
        {hayPreseleccion && (
          <div className="glass-card-strong rounded-[22px] p-5 border-l-4 border-[#007AFF] animate-slide-up">
            <p className="text-sm text-black/70">
              ✨ Ya seleccionamos las subáreas por ti. Puedes ajustar la
              cantidad de preguntas y el tiempo antes de comenzar.
            </p>
          </div>
        )}

        <section className="glass-card-strong rounded-[22px] p-6 animate-slide-up">
          <h2 className="text-sm font-semibold text-black/70 uppercase tracking-wide mb-4">
            Subáreas a incluir
          </h2>

          <div className="space-y-6">
            {estructura.map((seccion) => (
              <div key={seccion.id}>
                <p className="text-xs font-semibold uppercase text-[#8E8E93] tracking-wide mb-3">
                  {seccion.nombre}
                </p>
                <div className="space-y-4">
                  {seccion.areas.map((area) => (
                    <div key={area.id}>
                      <p className="text-sm font-semibold text-black mb-2">
                        {area.nombre}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {area.subareas.map((sub) => {
                          const activa = subareasSel.includes(sub.id);
                          return (
                            <label
                              key={sub.id}
                              className={`flex items-center gap-3 text-sm cursor-pointer px-3.5 py-2.5 rounded-xl transition-all tap-scale ${
                                activa
                                  ? 'bg-[#007AFF]/10 text-[#007AFF] font-medium'
                                  : 'bg-black/[0.03] text-black/70 hover:bg-black/[0.06]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={activa}
                                onChange={() => toggleSubarea(sub.id)}
                                className="sr-only"
                              />
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                                  activa
                                    ? 'bg-[#007AFF]'
                                    : 'bg-white border border-black/15'
                                }`}
                              >
                                {activa && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </span>
                              {sub.nombre}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card-strong rounded-[22px] p-6 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-3">
                Número de preguntas
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[5, 10, 20, 40].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCantidad(n)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all tap-scale ${
                      cantidad === n
                        ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20'
                        : 'bg-black/[0.05] text-black/70 hover:bg-black/[0.08]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={200}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-3">
                Duración (minutos)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[5, 15, 30, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutos(m)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all tap-scale ${
                      minutos === m
                        ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20'
                        : 'bg-black/[0.05] text-black/70 hover:bg-black/[0.08]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={240}
                value={minutos}
                onChange={(e) => setMinutos(Number(e.target.value))}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 text-[#FF3B30] text-sm rounded-2xl p-4 animate-slide-up">
            {error}
          </div>
        )}

        <button
          onClick={iniciar}
          className="w-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] hover:opacity-95 text-white font-semibold py-4 rounded-2xl tap-scale shadow-lg shadow-[#007AFF]/20 animate-slide-up"
        >
          Iniciar simulador
        </button>
      </div>
    );
  }

  // === FASE EXAMEN ===
  if (fase === 'examen') {
    const p = preguntas[indice];
    const minutosRestantes = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    const respondidas = Object.keys(respuestas).length;

    return (
      <div className="space-y-5">
        <div className="glass-card-strong rounded-[22px] p-4 flex items-center justify-between sticky top-20 z-10">
          <div className="text-sm text-black/60">
            Pregunta <span className="font-bold text-black">{indice + 1}</span> de {preguntas.length}
            <span className="mx-3 text-black/20">·</span>
            {respondidas} respondidas
          </div>
          <div
            className={`font-mono font-bold px-3 py-1.5 rounded-lg ${
              segundos < 60
                ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                : 'bg-[#007AFF]/10 text-[#007AFF]'
            }`}
          >
            {String(minutosRestantes).padStart(2, '0')}:
            {String(segundosRestantes).padStart(2, '0')}
          </div>
        </div>

        <div className="glass-card-strong rounded-[22px] p-6 md:p-8">
          <p className="text-black font-medium text-lg leading-relaxed mb-6">
            {p.enunciado}
          </p>

          <div className="space-y-2">
            {[
              { letra: 'A', texto: p.opcionA },
              { letra: 'B', texto: p.opcionB },
              { letra: 'C', texto: p.opcionC },
            ].map((op) => {
              const seleccionada = respuestas[p.id] === op.letra;
              return (
                <button
                  key={op.letra}
                  onClick={() => responder(op.letra)}
                  className={`w-full text-left flex gap-4 p-4 rounded-2xl border transition-all tap-scale ${
                    seleccionada
                      ? 'bg-[#007AFF]/10 border-[#007AFF] shadow-sm'
                      : 'bg-white/60 border-black/5 hover:border-black/15'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                      seleccionada
                        ? 'bg-[#007AFF] text-white'
                        : 'bg-black/[0.05] text-black/70'
                    }`}
                  >
                    {op.letra}
                  </span>
                  <span className="text-black/80 pt-1">{op.texto}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            onClick={anterior}
            disabled={indice === 0}
            className="px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-black/5 text-black/70 text-sm font-medium disabled:opacity-40 hover:bg-white tap-scale"
          >
            ← Anterior
          </button>
          <button
            onClick={terminar}
            className="px-5 py-3 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm font-semibold hover:bg-[#FF3B30]/15 tap-scale"
          >
            Terminar
          </button>
          <button
            onClick={siguiente}
            className="px-5 py-3 rounded-2xl bg-[#007AFF] text-white text-sm font-semibold hover:bg-[#0066DD] tap-scale shadow-md shadow-[#007AFF]/20"
          >
            {indice === preguntas.length - 1 ? 'Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    );
  }

  // === FASE RESULTADO ===
  const correctas = preguntas.filter(
    (p) => respuestas[p.id] === p.respuestaCorrecta
  ).length;
  const porcentaje = Math.round((correctas / preguntas.length) * 100);
  const aprobado = porcentaje >= 60;

  return (
    <div className="space-y-6">
      <div className="glass-card-strong rounded-[22px] p-8 text-center animate-slide-up">
        <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-4">
          Resultado final
        </p>
        <p className="text-6xl font-bold text-black mb-2 tracking-tight">
          {correctas}<span className="text-black/30">/{preguntas.length}</span>
        </p>
        <p
          className={`text-3xl font-bold ${
            aprobado ? 'text-[#34C759]' : 'text-[#FF3B30]'
          }`}
        >
          {porcentaje}%
        </p>
        <p className="text-sm text-black/60 mt-4">
          {aprobado
            ? '¡Excelente trabajo! Sigue así.'
            : 'Necesitas más práctica. Repasa las subáreas débiles.'}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-black/70 uppercase tracking-wide px-1">
          Revisión detallada
        </h2>
        {preguntas.map((p, i) => {
          const respuesta = respuestas[p.id];
          const esCorrecta = respuesta === p.respuestaCorrecta;

          return (
            <div
              key={p.id}
              className={`glass-card-strong rounded-[22px] p-5 border-l-4 ${
                esCorrecta ? 'border-[#34C759]' : 'border-[#FF3B30]'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-black/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    esCorrecta
                      ? 'bg-[#34C759]/10 text-[#34C759]'
                      : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                  }`}
                >
                  {esCorrecta ? '✓ Correcta' : '✗ Incorrecta'}
                </span>
              </div>
              <p className="text-black font-medium mb-3 leading-snug">
                {p.enunciado}
              </p>
              <div className="space-y-1 text-sm mb-3">
                <p className="text-black/60">
                  Tu respuesta:{' '}
                  <span className={`font-bold ${esCorrecta ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                    {respuesta || '—'}
                  </span>
                </p>
                {!esCorrecta && (
                  <p className="text-black/60">
                    Correcta:{' '}
                    <span className="font-bold text-[#34C759]">
                      {p.respuestaCorrecta}
                    </span>
                  </p>
                )}
              </div>
              {p.explicacion && (
                <div className="pt-3 border-t border-black/5">
                  <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide mb-1">
                    Explicación
                  </p>
                  <p className="text-sm text-black/70 leading-relaxed">
                    {p.explicacion}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center pt-4">
        <button
          onClick={reiniciar}
          className="bg-[#007AFF] hover:bg-[#0066DD] text-white font-semibold px-8 py-3.5 rounded-2xl tap-scale shadow-md shadow-[#007AFF]/20"
        >
          Nuevo simulador
        </button>
        <a
          href="/"
          className="px-8 py-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-black/5 text-black/70 font-medium hover:bg-white tap-scale"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}