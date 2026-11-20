'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ResultadoBusqueda = {
  id: number;
  titulo: string;
  contenido: string;
  subareaNombre: string;
  subareaSlug: string;
};

type RespuestaBusqueda = {
  results?: ResultadoBusqueda[];
  error?: string;
};

function normalizarTexto(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es');
}

function obtenerTextoPlano(markdown: string) {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/```[\w-]*\n?/g, '')
    .replace(/[`*_~>#|]/g, ' ')
    .replace(/^\s*(?:[-+*]|\d+\.)\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function obtenerFragmento(markdown: string, termino: string) {
  const texto = obtenerTextoPlano(markdown);
  const terminoNormalizado = normalizarTexto(termino);
  const offsetsOriginales: number[] = [];
  let textoNormalizado = '';

  for (let offset = 0; offset < texto.length; ) {
    const caracter = String.fromCodePoint(texto.codePointAt(offset) ?? 0);
    const caracterNormalizado = normalizarTexto(caracter);
    textoNormalizado += caracterNormalizado;
    offsetsOriginales.push(
      ...Array.from({ length: caracterNormalizado.length }, () => offset)
    );
    offset += caracter.length;
  }

  const indiceNormalizado = textoNormalizado.indexOf(terminoNormalizado);
  const inicioCoincidencia =
    indiceNormalizado >= 0
      ? (offsetsOriginales[indiceNormalizado] ?? 0)
      : 0;
  const finCoincidencia =
    indiceNormalizado >= 0
      ? (offsetsOriginales[indiceNormalizado + terminoNormalizado.length] ??
        texto.length)
      : Math.min(texto.length, 150);
  const inicio = Math.max(0, inicioCoincidencia - 55);
  const fin = Math.min(texto.length, Math.max(finCoincidencia + 95, inicio + 150));
  const fragmento = texto.slice(inicio, fin).trim();

  return `${inicio > 0 ? '…' : ''}${fragmento}${fin < texto.length ? '…' : ''}`;
}

export default function BuscadorLecciones() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const consulta = termino.trim();

    if (!consulta) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCargando(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/buscar?q=${encodeURIComponent(consulta)}`,
          { signal: controller.signal }
        );
        const data: RespuestaBusqueda = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? 'No se pudo completar la búsqueda.');
        }

        if (!Array.isArray(data.results)) {
          throw new Error('La respuesta de búsqueda no tiene un formato válido.');
        }

        setResultados(data.results);
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name === 'AbortError') {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'No se pudo completar la búsqueda.'
        );
        setResultados([]);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [termino]);

  function actualizarTermino(value: string) {
    setTermino(value);
    setResultados([]);
    setError(null);
    setCargando(Boolean(value.trim()));
  }

  return (
    <main className="bg-ios-canvas min-h-screen">
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Biblioteca de lecciones
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Encuentra lo que necesitas estudiar
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Busca conceptos en los títulos y el contenido de todas las lecciones.
          </p>
        </div>

        <div className="glass-elevated mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl p-3 sm:mt-10 sm:p-4">
          <svg
            className="ml-2 h-6 w-6 shrink-0 text-cyan-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="m16 16 4 4"
            />
          </svg>
          <input
            type="search"
            value={termino}
            onChange={(event) => actualizarTermino(event.target.value)}
            placeholder="Busca un tema, palabra clave o concepto..."
            aria-label="Busca un tema, palabra clave o concepto"
            aria-describedby="ayuda-busqueda"
            className="min-h-14 min-w-0 flex-1 bg-transparent px-1 text-base text-white outline-none placeholder:text-slate-400 sm:text-lg"
          />
          {termino && (
            <button
              type="button"
              onClick={() => actualizarTermino('')}
              className="min-h-11 shrink-0 rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              aria-label="Limpiar búsqueda"
            >
              Limpiar
            </button>
          )}
        </div>
        <p
          id="ayuda-busqueda"
          className="mx-auto mt-3 max-w-2xl px-2 text-sm text-slate-400"
        >
          La búsqueda ignora mayúsculas y acentos.
        </p>

        <div className="mx-auto mt-8 max-w-3xl" aria-live="polite">
          {cargando && (
            <p className="py-8 text-center text-base text-slate-300">
              Buscando lecciones…
            </p>
          )}

          {error && (
            <p
              className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-200"
              role="alert"
            >
              {error}
            </p>
          )}

          {!cargando && !error && termino.trim() && resultados.length === 0 && (
            <p className="glass-card rounded-2xl p-6 text-center text-slate-300">
              No encontramos lecciones para “{termino.trim()}”. Prueba con otra
              palabra o concepto.
            </p>
          )}

          {!cargando && resultados.length > 0 && (
            <>
              <p className="mb-4 text-sm font-medium text-slate-400">
                {resultados.length === 20
                  ? 'Mostrando los primeros 20 resultados'
                  : `${resultados.length} ${
                      resultados.length === 1 ? 'resultado' : 'resultados'
                    }`}
              </p>
              <ul className="space-y-4">
                {resultados.map((resultado) => (
                  <li key={resultado.id}>
                    <Link
                      href={`/subarea/${encodeURIComponent(
                        resultado.subareaSlug
                      )}/${resultado.id}`}
                      className="glass-card-strong group block rounded-2xl p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-[0_16px_40px_-24px_rgba(34,211,238,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:p-6"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-cyan-100 sm:text-xl">
                          {resultado.titulo}
                        </h2>
                        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                          {resultado.subareaNombre}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                        {obtenerFragmento(resultado.contenido, termino.trim())}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                        Ir a la lección
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
