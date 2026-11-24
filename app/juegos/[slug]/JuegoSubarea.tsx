'use client';

import Link from 'next/link';
import { useState } from 'react';
import { obtenerPreguntasParaJuego } from '@/app/actions/juegos';
import { guardarIntento } from '@/lib/progreso';
import { secuenciasPorSubarea } from './secuencias';

type Juego = 'verdadero-falso' | 'ordenar';

type PreguntaJuego = {
  id: number;
  enunciado: string;
  opcionAfirmada: string;
  esVerdadera: boolean;
  respuestaCorrecta: string;
  opcionCorrecta: string;
  explicacion: string | null;
};

export default function JuegoSubarea({
  slug,
  nombre,
  area,
}: {
  slug: string;
  nombre: string;
  area: string;
}) {
  const [juego, setJuego] = useState<Juego | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaJuego[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function elegirJuego(seleccionado: Juego) {
    setJuego(seleccionado);
    if (seleccionado !== 'verdadero-falso' || preguntas || cargando) return;

    setCargando(true);
    setError(null);
    try {
      const resultado = await obtenerPreguntasParaJuego(slug);
      if ('error' in resultado) {
        setError(resultado.error ?? 'No fue posible cargar las preguntas.');
      } else {
        setPreguntas(resultado.preguntas);
      }
    } catch {
      setError('No fue posible cargar las preguntas. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="bg-ios-canvas-v2 min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7 md:py-12">
        <Link href="/juegos" className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 18-6-6 6-6" />
          </svg>
          Todas las subáreas
        </Link>

        <header className="mb-7 mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">{area}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">{nombre}</h1>
        </header>

        <div role="tablist" aria-label="Tipo de juego" className="grid grid-cols-2 gap-3">
          <button
            id="tab-verdadero-falso"
            type="button"
            role="tab"
            aria-selected={juego === 'verdadero-falso'}
            aria-controls="panel-juego"
            onClick={() => void elegirJuego('verdadero-falso')}
            className={`min-h-[72px] rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color] duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${juego === 'verdadero-falso' ? 'border-cyan-300/45 bg-cyan-300/10 text-cyan-100' : 'border-white/[0.08] bg-slate-900/35 text-slate-300 hover:bg-white/[0.05]'}`}
          >
            <span className="block text-sm font-bold">⚡ Verdadero o Falso</span>
            <span className="mt-1 block text-xs text-slate-400">Reactivos al azar</span>
          </button>
          <button
            id="tab-ordenar"
            type="button"
            role="tab"
            aria-selected={juego === 'ordenar'}
            aria-controls="panel-juego"
            onClick={() => setJuego('ordenar')}
            className={`min-h-[72px] rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color] duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${juego === 'ordenar' ? 'border-amber-300/45 bg-amber-300/10 text-amber-100' : 'border-white/[0.08] bg-slate-900/35 text-slate-300 hover:bg-white/[0.05]'}`}
          >
            <span className="block text-sm font-bold">🧩 Ordenar Conceptos</span>
            <span className="mt-1 block text-xs text-slate-400">Procesos y secuencias</span>
          </button>
        </div>

        <section id="panel-juego" role="tabpanel" aria-labelledby={juego === 'ordenar' ? 'tab-ordenar' : 'tab-verdadero-falso'} className="mt-5">
          {juego === 'verdadero-falso' && (
            cargando ? (
              <div className="glass-card rounded-3xl p-8 text-center text-sm text-slate-300" role="status">Preparando reactivos…</div>
            ) : error ? (
              <div className="glass-card rounded-3xl p-6 text-center" role="alert">
                <p className="text-sm text-rose-200">{error}</p>
                <button type="button" onClick={() => { setPreguntas(null); void elegirJuego('verdadero-falso'); }} className="mt-4 min-h-12 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-200">Reintentar</button>
              </div>
            ) : preguntas ? (
              <JuegoVerdaderoFalso key={`${slug}-verdadero-falso`} preguntas={preguntas} slug={slug} />
            ) : null
          )}
          {juego === 'ordenar' && <JuegoOrdenar key={`${slug}-ordenar`} slug={slug} />}
          {juego === null && (
            <div className="glass-card rounded-3xl p-7 text-center sm:p-9">
              <p className="text-sm leading-6 text-slate-400">Elige un formato para empezar a practicar en esta subárea.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function JuegoVerdaderoFalso({ preguntas, slug }: { preguntas: PreguntaJuego[]; slug: string }) {
  const [indice, setIndice] = useState(0);
  const [respuesta, setRespuesta] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const pregunta = preguntas[indice];
  const terminado = indice >= preguntas.length;

  function responder(valor: boolean) {
    if (respuesta !== null || !pregunta) return;

    const correcta = valor === pregunta.esVerdadera;
    setRespuesta(valor);
    if (correcta) setAciertos((actual) => actual + 1);
    guardarIntento({ subareaSlug: slug, preguntaId: pregunta.id, correcta, fecha: new Date().toISOString() });
    window.setTimeout(() => {
      setRespuesta(null);
      setIndice((actual) => actual + 1);
    }, 1500);
  }

  if (terminado) {
    return (
      <section aria-labelledby="resultado-juego" className="glass-card rounded-3xl p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Ronda completada</p>
        <h2 id="resultado-juego" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          {aciertos === preguntas.length ? '¡Perfecto!' : `Lograste ${aciertos} de ${preguntas.length} aciertos.`}
        </h2>
        {aciertos === preguntas.length && <p className="mt-3 text-5xl motion-reduce:animate-none animate-bounce" aria-label="Trofeo">🏆</p>}
        <p className="mt-3 text-sm leading-6 text-slate-400">Tus respuestas ya cuentan para el progreso de esta subárea.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-6 min-h-14 rounded-2xl bg-cyan-300 px-6 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">Cargar otra ronda</button>
      </section>
    );
  }

  if (!pregunta) return null;

  function estiloOpcion(valor: boolean) {
    if (respuesta === null) return valor
      ? 'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-100 hover:bg-emerald-300/[0.13]'
      : 'border-rose-300/20 bg-rose-300/[0.07] text-rose-100 hover:bg-rose-300/[0.13]';
    if (valor === pregunta.esVerdadera) return 'border-emerald-300/50 bg-emerald-300/15 text-emerald-100';
    if (valor === respuesta) return 'border-rose-300/50 bg-rose-300/15 text-rose-100';
    return 'border-white/[0.08] bg-slate-900/30 text-slate-500';
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-300">Reactivo <span className="tabular-nums text-white">{indice + 1}</span> de {preguntas.length}</p>
        <p className="text-sm font-semibold tabular-nums text-cyan-200">{aciertos} correctas</p>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-700/70" role="progressbar" aria-label="Progreso del juego" aria-valuenow={indice} aria-valuemin={0} aria-valuemax={preguntas.length}>
        <div className="h-full rounded-full bg-cyan-300 transition-[width] duration-200 ease-out" style={{ width: `${(indice / preguntas.length) * 100}%` }} />
      </div>

      <article className="glass-card rounded-3xl p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">¿Verdadero o falso?</p>
        <p className="mt-4 text-sm leading-6 text-slate-300">{pregunta.enunciado}</p>
        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-slate-900/45 p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">La respuesta correcta es:</p>
          <p className="mt-2 text-lg font-semibold leading-snug text-white">{pregunta.opcionAfirmada}</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[true, false].map((valor) => (
            <button key={String(valor)} type="button" disabled={respuesta !== null} onClick={() => responder(valor)} className={`min-h-[76px] rounded-2xl border text-lg font-bold transition-[transform,border-color,background-color,color] duration-150 active:scale-[0.98] disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${estiloOpcion(valor)}`}>
              {valor ? 'Verdadero' : 'Falso'}
            </button>
          ))}
        </div>
        {respuesta !== null && (
          <div role="status" aria-live="polite" className={`mt-5 rounded-2xl border p-4 ${respuesta === pregunta.esVerdadera ? 'border-emerald-300/25 bg-emerald-300/[0.08]' : 'border-rose-300/25 bg-rose-300/[0.08]'}`}>
            <p className={`font-semibold ${respuesta === pregunta.esVerdadera ? 'text-emerald-200' : 'text-rose-200'}`}>{respuesta === pregunta.esVerdadera ? '¡Correcto!' : 'No exactamente'}</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-300">Reactivo: {pregunta.enunciado}</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">Respuesta correcta: {pregunta.respuestaCorrecta}) {pregunta.opcionCorrecta}</p>
            {pregunta.explicacion && <p className="mt-2 text-sm leading-6 text-slate-400">{pregunta.explicacion}</p>}
            <p className="mt-2 text-xs text-slate-500">Siguiente reactivo…</p>
          </div>
        )}
      </article>
    </>
  );
}

function JuegoOrdenar({ slug }: { slug: string }) {
  const secuencia = secuenciasPorSubarea[slug];
  const [elementos, setElementos] = useState<string[]>(() => secuencia ? [...secuencia.elementos].reverse() : []);
  const [comprobado, setComprobado] = useState(false);
  const correcto = Boolean(secuencia && elementos.every((elemento, indice) => elemento === secuencia.elementos[indice]));

  if (!secuencia) {
    return <div className="glass-card rounded-3xl p-6 text-sm leading-6 text-slate-400" role="status">Aún no hay una secuencia disponible para esta subárea.</div>;
  }

  function mover(indice: number, direccion: -1 | 1) {
    const destino = indice + direccion;
    if (destino < 0 || destino >= elementos.length) return;
    setElementos((actuales) => {
      const nuevos = [...actuales];
      [nuevos[indice], nuevos[destino]] = [nuevos[destino], nuevos[indice]];
      return nuevos;
    });
    setComprobado(false);
  }

  function comprobar() {
    const resultado = elementos.every((elemento, indice) => elemento === secuencia.elementos[indice]);
    setComprobado(true);
    guardarIntento({ subareaSlug: slug, correcta: resultado, fecha: new Date().toISOString() });
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-300">Ordena los pasos</p>
        <h2 className="mt-2 text-xl font-semibold text-white">{secuencia.titulo}</h2>
      </div>
      <ol className="space-y-2">
        {elementos.map((elemento, indice) => {
          const enPosicion = elemento === secuencia.elementos[indice];
          const estado = comprobado ? enPosicion ? 'border-emerald-400/40 bg-emerald-400/[0.08]' : 'border-rose-400/45 bg-rose-400/[0.08]' : 'border-white/[0.08] bg-slate-900/35';
          return (
            <li key={elemento} className={`flex min-h-[72px] items-center gap-3 rounded-2xl border p-3 transition-[border-color,background-color] duration-200 sm:gap-4 sm:p-4 ${estado}`}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-700/70 text-sm font-bold tabular-nums text-slate-300">{indice + 1}</span>
              <span className="min-w-0 flex-1 text-sm font-medium leading-5 text-slate-100">{elemento}</span>
              {comprobado && <span className={enPosicion ? 'text-emerald-300' : 'text-rose-300'} aria-label={enPosicion ? 'Posición correcta' : 'Posición incorrecta'}>{enPosicion ? '✓' : '!'}</span>}
              <span className="flex shrink-0 flex-col gap-1">
                <button type="button" onClick={() => mover(indice, -1)} disabled={indice === 0} aria-label={`Subir elemento ${indice + 1}`} className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"><svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 15 6-6 6 6" /></svg></button>
                <button type="button" onClick={() => mover(indice, 1)} disabled={indice === elementos.length - 1} aria-label={`Bajar elemento ${indice + 1}`} className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"><svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" /></svg></button>
              </span>
            </li>
          );
        })}
      </ol>
      {comprobado && (
        <div role="status" className={`mt-4 flex items-center gap-3 rounded-2xl border p-4 ${correcto ? 'border-emerald-300/25 bg-emerald-300/[0.08]' : 'border-rose-300/25 bg-rose-300/[0.08]'}`}>
          {correcto && <span className="text-3xl motion-reduce:animate-none animate-bounce" aria-hidden="true">🏆</span>}
          <p className={`text-sm font-semibold ${correcto ? 'text-emerald-200' : 'text-rose-200'}`}>{correcto ? '¡Muy bien! La secuencia es correcta.' : 'Hay elementos fuera de lugar. Ajusta el orden y vuelve a comprobar.'}</p>
        </div>
      )}
      <button type="button" onClick={comprobar} disabled={comprobado} className="mt-4 min-h-14 w-full rounded-2xl bg-amber-300 px-6 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-200 active:scale-[0.98] disabled:cursor-default disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:w-auto">Comprobar orden</button>
    </div>
  );
}