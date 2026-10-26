'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { obtenerPreguntasAleatorias } from '@/app/actions/simulador';
import { guardarIntento } from '@/lib/progreso';
import LogroModal from '@/components/LogroModal';

type Subarea = { id: number; nombre: string; slug: string };
type Area = { id: number; nombre: string; subareas: Subarea[] };
type Seccion = { id: number; nombre: string; areas: Area[] };
type Pregunta = {
  id: number;
  subareaId: number | null;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
};

type Modo = 'practica' | 'examen';
type Fase = 'config' | Modo | 'resultado';

export default function SimuladorForm({ estructura }: { estructura: Seccion[] }) {
  const searchParams = useSearchParams();
  const [fase, setFase] = useState<Fase>('config');
  const [modo, setModo] = useState<Modo>('examen');
  const [subareasSel, setSubareasSel] = useState<number[]>([]);
  const [cantidad, setCantidad] = useState(10);
  const [minutos, setMinutos] = useState(15);
  const [error, setError] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [segundos, setSegundos] = useState(0);
  const [mostrarCelebracion, setMostrarCelebracion] = useState(false);
  const [detalleCelebracion, setDetalleCelebracion] = useState('');
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);
  const preguntasRef = useRef<Pregunta[]>([]);
  const respuestasRef = useRef<Record<number, string>>({});
  const finalizadoRef = useRef(false);

  const terminar = useCallback(() => {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;

    if (intervaloRef.current) clearInterval(intervaloRef.current);

    const subareaSlugPorId = new Map(
      estructura.flatMap((seccion) =>
        seccion.areas.flatMap((area) =>
          area.subareas.map((subarea) => [subarea.id, subarea.slug] as const)
        )
      )
    );
    const fecha = new Date().toISOString();

    for (const pregunta of preguntasRef.current) {
      const respuesta = respuestasRef.current[pregunta.id];
      const subareaSlug = pregunta.subareaId
        ? subareaSlugPorId.get(pregunta.subareaId)
        : undefined;

      if (modo === 'examen' && respuesta && subareaSlug) {
        guardarIntento({
          subareaSlug,
          preguntaId: pregunta.id,
          correcta: respuesta === pregunta.respuestaCorrecta,
          fecha,
        });
      }
    }

    const correctas = preguntasRef.current.filter(
      (pregunta) =>
        respuestasRef.current[pregunta.id] === pregunta.respuestaCorrecta
    ).length;
    setDetalleCelebracion(
      `${correctas} de ${preguntasRef.current.length} respuestas correctas.`
    );
    setMostrarCelebracion(true);
    setFase('resultado');
  }, [estructura, modo]);

  useEffect(() => {
    let activo = true;

    async function aplicarParametros() {
      await Promise.resolve();
      if (!activo) return;

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
    }

    void aplicarParametros();
    return () => {
      activo = false;
    };
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
  }, [fase, terminar]);

  function toggleSubarea(id: number) {
    setSubareasSel((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function seleccionarTodas() {
    const todas = estructura.flatMap((s) =>
      s.areas.flatMap((a) => a.subareas.map((sub) => sub.id))
    );
    setSubareasSel(todas);
  }

  function limpiarSeleccion() {
    setSubareasSel([]);
  }

  async function iniciar(modoElegido: Modo) {
    setError(null);
    if (subareasSel.length === 0) {
      setError('Selecciona al menos una subárea');
      return;
    }

    const resultado = await obtenerPreguntasAleatorias(subareasSel, cantidad);

    if ('error' in resultado) {
      setError(resultado.error ?? null);
      return;
    }

    setPreguntas(resultado.preguntas);
    preguntasRef.current = resultado.preguntas;
    respuestasRef.current = {};
    setRespuestas({});
    setIndice(0);
    setSegundos(minutos * 60);
    setModo(modoElegido);
    finalizadoRef.current = false;
    setMostrarCelebracion(false);
    setFase(modoElegido);
  }

  function responder(opcion: string) {
    const preguntaActual = preguntas[indice];
    if (modo === 'practica' && respuestasRef.current[preguntaActual.id]) return;

    const actualizadas = {
      ...respuestasRef.current,
      [preguntaActual.id]: opcion,
    };
    respuestasRef.current = actualizadas;
    setRespuestas(actualizadas);

    if (modo === 'practica' && preguntaActual.subareaId) {
      const slug = estructura
        .flatMap((seccion) => seccion.areas)
        .flatMap((area) => area.subareas)
        .find((subarea) => subarea.id === preguntaActual.subareaId)?.slug;
      if (slug) {
        guardarIntento({
          subareaSlug: slug,
          preguntaId: preguntaActual.id,
          correcta: opcion === preguntaActual.respuestaCorrecta,
          fecha: new Date().toISOString(),
        });
      }
    }
  }

  function siguiente() {
    if (indice < preguntas.length - 1) setIndice(indice + 1);
    else terminar();
  }

  function anterior() {
    if (indice > 0) setIndice(indice - 1);
  }

  function reiniciar() {
    finalizadoRef.current = false;
    setMostrarCelebracion(false);
    preguntasRef.current = [];
    respuestasRef.current = {};
    setFase('config');
    setPreguntas([]);
    setRespuestas({});
    setIndice(0);
  }

  if (fase === 'config') {
    const hayPreseleccion = subareasSel.length > 0;

    return (
      <div className="space-y-6">
        {hayPreseleccion && (
          <div className="glass-card-strong rounded-[22px] p-5 border-l-4 border-[#007AFF] animate-slide-up">
            <p className="text-sm leading-relaxed text-slate-300">
              Ya seleccionamos las subáreas por ti. Puedes ajustar la cantidad
              de preguntas y el tiempo antes de comenzar.
            </p>
          </div>
        )}

        <section className="glass-card-strong rounded-[22px] p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              Subáreas a incluir
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={seleccionarTodas}
                className="text-xs font-semibold text-[#007AFF] hover:bg-[#007AFF]/10 px-2.5 py-1.5 rounded-lg transition-colors tap-scale"
              >
                Seleccionar todo
              </button>
              {subareasSel.length > 0 && (
                <button
                  type="button"
                  onClick={limpiarSeleccion}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200 tap-scale"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {estructura.map((seccion) => (
              <div key={seccion.id}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {seccion.nombre}
                </p>
                <div className="space-y-4">
                  {seccion.areas.map((area) => (
                    <div key={area.id}>
                      <p className="mb-2 text-sm font-semibold text-slate-200">
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
                                  ? 'bg-cyan-400/10 font-medium text-cyan-200'
                                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/70'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={activa}
                                onChange={() => toggleSubarea(sub.id)}
                                className="peer sr-only"
                              />
                              <span
                                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan-300 ${
                                  activa
                                    ? 'border-cyan-400 bg-cyan-500 text-white shadow-[0_0_14px_rgba(34,211,238,0.35)]'
                                    : 'border-slate-500 bg-slate-800/80'
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
                              <span className="flex-1 truncate">
                                {sub.nombre}
                              </span>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                Duración del examen (minutos)
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

        <section
          className="grid gap-4 sm:grid-cols-2"
          aria-label="Elige un modo de práctica"
        >
          <button
            type="button"
            onClick={() => void iniciar('practica')}
            className="interactive-glow group rounded-[22px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]"
          >
            <span className="flex items-center gap-3 text-base font-bold text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
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
                    strokeWidth={2}
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </span>
              Modo Práctica
            </span>
            <span className="mt-3 block text-sm font-medium text-emerald-200">
              Flashcards, sin tiempo y con feedback inmediato
            </span>
          </button>
          <button
            type="button"
            onClick={() => void iniciar('examen')}
            className="interactive-glow group rounded-[22px] border border-indigo-400/25 bg-gradient-to-br from-indigo-500/20 to-violet-500/10 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/55 hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]"
          >
            <span className="flex items-center gap-3 text-base font-bold text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/15 text-indigo-300">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  <path
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M12 7v5l3 2"
                  />
                </svg>
              </span>
              Modo Examen
            </span>
            <span className="mt-3 block text-sm font-medium text-indigo-200">
              Cronometrado, revisa tus respuestas al final
            </span>
          </button>
        </section>
      </div>
    );
  }

  if (fase === 'examen' || fase === 'practica') {
    const p = preguntas[indice];
    const minutosRestantes = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    const respondidas = Object.keys(respuestas).length;

    return (
      <div className="space-y-5">
        <div className="glass-card-strong rounded-[22px] p-4 flex items-center justify-between sticky top-20 z-10">
          <div className="text-sm text-slate-400">
            {modo === 'practica' && (
              <span className="mr-3 font-semibold text-emerald-300">
                Modo práctica · sin tiempo
              </span>
            )}
            Pregunta{' '}
            <span className="font-bold text-slate-100">{indice + 1}</span> de{' '}
            {preguntas.length}
            <span className="mx-3 text-slate-600">·</span>
            {respondidas} respondidas
          </div>
          {modo === 'examen' && (
            <div
              className={`font-mono font-bold px-3 py-1.5 rounded-lg ${
                segundos < 60
                  ? 'bg-rose-500/10 text-rose-400'
                  : 'bg-indigo-400/10 text-indigo-300'
              }`}
            >
              {String(minutosRestantes).padStart(2, '0')}:
              {String(segundosRestantes).padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="glass-card-strong rounded-[22px] p-6 md:p-8">
          <p className="text-slate-100 font-medium text-lg leading-relaxed mb-6">
            {p.enunciado}
          </p>

          <div className="space-y-2">
            {[
              { letra: 'A', texto: p.opcionA },
              { letra: 'B', texto: p.opcionB },
              { letra: 'C', texto: p.opcionC },
            ].map((op) => {
              const seleccionada = respuestas[p.id] === op.letra;
              const respondidaEnPractica = modo === 'practica' && seleccionada;
              const opcionCorrectaEnPractica =
                modo === 'practica' &&
                respuestas[p.id] !== undefined &&
                op.letra === p.respuestaCorrecta;
              const opcionIncorrectaEnPractica =
                respondidaEnPractica && op.letra !== p.respuestaCorrecta;
              return (
                <button
                  key={op.letra}
                  onClick={() => responder(op.letra)}
                  disabled={modo === 'practica' && respuestas[p.id] !== undefined}
                  className={`w-full text-left flex gap-4 p-4 rounded-2xl border transition-all tap-scale ${
                    opcionCorrectaEnPractica
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.2)]'
                      : opcionIncorrectaEnPractica
                      ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.18)]'
                      : seleccionada
                      ? 'bg-indigo-500/15 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-indigo-300/40 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                      opcionCorrectaEnPractica
                        ? 'bg-emerald-500 text-white'
                        : opcionIncorrectaEnPractica
                        ? 'bg-rose-500 text-white'
                        : seleccionada
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {op.letra}
                  </span>
                  <span className="text-slate-200 pt-1">{op.texto}</span>
                </button>
              );
            })}
          </div>
          {modo === 'practica' && respuestas[p.id] !== undefined && (
            <div
              className={`mt-5 rounded-2xl border p-4 animate-slide-up ${
                respuestas[p.id] === p.respuestaCorrecta
                  ? 'border-emerald-400/25 bg-emerald-500/10'
                  : 'border-rose-400/25 bg-rose-500/10'
              }`}
              role="status"
            >
              <p
                className={`font-semibold ${
                  respuestas[p.id] === p.respuestaCorrecta
                    ? 'text-emerald-300'
                    : 'text-rose-300'
                }`}
              >
                {respuestas[p.id] === p.respuestaCorrecta
                  ? '¡Correcto!'
                  : `No exactamente. La respuesta correcta es ${p.respuestaCorrecta}.`}
              </p>
              {p.explicacion && (
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {p.explicacion}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3">
          <button
            onClick={anterior}
            disabled={indice === 0}
            className="px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-black/5 text-black/70 text-sm font-medium disabled:opacity-40 hover:bg-white tap-scale"
          >
            ← Anterior
          </button>
          {modo === 'examen' && (
            <button
              onClick={terminar}
              className="px-5 py-3 rounded-2xl bg-rose-500/10 text-rose-300 text-sm font-semibold hover:bg-rose-500/15 tap-scale"
            >
              Terminar
            </button>
          )}
          <button
            onClick={siguiente}
            disabled={modo === 'practica' && respuestas[p.id] === undefined}
            className="interactive-glow px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:brightness-110 tap-scale shadow-md shadow-indigo-500/20 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {indice === preguntas.length - 1
              ? modo === 'practica'
                ? 'Terminar práctica'
                : 'Finalizar'
              : 'Siguiente →'}
          </button>
        </div>
      </div>
    );
  }

  const correctas = preguntas.filter(
    (p) => respuestas[p.id] === p.respuestaCorrecta
  ).length;
  const porcentaje = Math.round((correctas / preguntas.length) * 100);
  const aprobado = porcentaje >= 60;

  return (
    <div className="space-y-6">
      <LogroModal
        abierto={mostrarCelebracion}
        titulo={
          modo === 'practica'
            ? '¡Práctica completada!'
            : '¡Simulacro completado!'
        }
        mensaje="Llegaste hasta el final. Cada práctica te ayuda a reconocer lo que ya dominas y lo que puedes reforzar."
        detalle={detalleCelebracion}
        textoBoton="Revisar mi resultado"
        onClose={() => setMostrarCelebracion(false)}
      />
      <div className="glass-card-strong rounded-[22px] p-8 text-center animate-slide-up">
        <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-4">
          Resultado final
        </p>
        <p className="text-6xl font-bold text-black mb-2 tracking-tight">
          {correctas}
          <span className="text-black/30">/{preguntas.length}</span>
        </p>
        <p
          className={`text-3xl font-bold ${
            aprobado ? 'text-emerald-400' : 'text-rose-400'
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
                  {esCorrecta ? 'Correcta' : 'Incorrecta'}
                </span>
              </div>
              <p className="text-black font-medium mb-3 leading-snug">
                {p.enunciado}
              </p>
              <div className="space-y-1 text-sm mb-3">
                <p className="text-black/60">
                  Tu respuesta:{' '}
                  <span
                    className={`font-bold ${
                      esCorrecta ? 'text-[#34C759]' : 'text-[#FF3B30]'
                    }`}
                  >
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
          className="interactive-glow bg-gradient-to-r from-indigo-500 to-violet-500 hover:brightness-110 text-white font-semibold px-8 py-3.5 rounded-2xl tap-scale shadow-md shadow-indigo-500/20 transition-all duration-300"
        >
          Nuevo simulador
        </button>
        <Link
          href="/"
          className="px-8 py-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-black/5 text-black/70 font-medium hover:bg-white tap-scale"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}