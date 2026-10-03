'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Cronómetro
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
    return (
      <div className="space-y-8">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Subáreas a incluir
          </h2>

          <div className="space-y-5">
            {estructura.map((seccion) => (
              <div key={seccion.id}>
                <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                  {seccion.nombre}
                </p>
                <div className="space-y-3">
                  {seccion.areas.map((area) => (
                    <div key={area.id}>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        {area.nombre}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {area.subareas.map((sub) => (
                          <label
                            key={sub.id}
                            className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                          >
                            <input
                              type="checkbox"
                              checked={subareasSel.includes(sub.id)}
                              onChange={() => toggleSubarea(sub.id)}
                              className="rounded border-slate-300"
                            />
                            {sub.nombre}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número de preguntas
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duración (minutos)
            </label>
            <input
              type="number"
              min={1}
              max={240}
              value={minutos}
              onChange={(e) => setMinutos(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
            {error}
          </div>
        )}

        <button
          onClick={iniciar}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
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
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between sticky top-4 z-10">
          <div className="text-sm text-slate-600">
            Pregunta <span className="font-semibold text-slate-900">{indice + 1}</span> de {preguntas.length}
            <span className="mx-3 text-slate-300">|</span>
            Respondidas: <span className="font-semibold text-slate-900">{respondidas}</span>
          </div>
          <div
            className={`font-mono font-semibold ${
              segundos < 60 ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {String(minutosRestantes).padStart(2, '0')}:
            {String(segundosRestantes).padStart(2, '0')}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-800 font-medium mb-5">{p.enunciado}</p>

          <div className="space-y-2">
            {[
              { letra: 'A', texto: p.opcionA },
              { letra: 'B', texto: p.opcionB },
              { letra: 'C', texto: p.opcionC },
            ].map((op) => (
              <button
                key={op.letra}
                onClick={() => responder(op.letra)}
                className={`w-full text-left flex gap-3 p-4 rounded-lg border transition-colors ${
                  respuestas[p.id] === op.letra
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-semibold text-slate-700">{op.letra})</span>
                <span className="text-slate-700">{op.texto}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={anterior}
            disabled={indice === 0}
            className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium disabled:opacity-40 hover:bg-slate-100"
          >
            ← Anterior
          </button>
          <button
            onClick={terminar}
            className="px-5 py-2 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50"
          >
            Terminar examen
          </button>
          <button
            onClick={siguiente}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
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
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500 mb-2">Resultado</p>
        <p className="text-5xl font-bold text-slate-900 mb-2">
          {correctas} / {preguntas.length}
        </p>
        <p className={`text-2xl font-semibold ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
          {porcentaje}%
        </p>
        <p className="text-sm text-slate-500 mt-3">
          {aprobado
            ? '¡Buen trabajo! Sigue así.'
            : 'Necesitas más práctica. Repasa las subáreas débiles.'}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-slate-900">Revisión</h2>
        {preguntas.map((p, i) => {
          const respuesta = respuestas[p.id];
          const esCorrecta = respuesta === p.respuestaCorrecta;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl border p-5 ${
                esCorrecta ? 'border-green-200' : 'border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {i + 1}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    esCorrecta
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {esCorrecta ? 'Correcta' : 'Incorrecta'}
                </span>
              </div>
              <p className="text-slate-800 font-medium mb-3">{p.enunciado}</p>
              <p className="text-sm text-slate-600 mb-1">
                Tu respuesta: <span className="font-semibold">{respuesta || '—'}</span>
              </p>
              <p className="text-sm text-slate-600 mb-3">
                Respuesta correcta:{' '}
                <span className="font-semibold text-green-700">
                  {p.respuestaCorrecta}
                </span>
              </p>
              {p.explicacion && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Explicación</p>
                  <p className="text-sm text-slate-600">{p.explicacion}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={reiniciar}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg"
        >
          Nuevo simulador
        </button>
        <a
          href="/"
          className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
