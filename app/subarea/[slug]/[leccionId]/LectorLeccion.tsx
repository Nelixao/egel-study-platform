'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marcarLeccionLeida } from '@/lib/progreso-lectura';
import { guardarPracticaPendiente } from '@/lib/practica-pendiente';

type LectorLeccionProps = {
  slug: string;
  subareaId: number;
  subareaNombre: string;
  leccionId: number;
  titulo: string;
  contenido: string;
  numero: number;
  total: number;
  siguienteId: number | null;
  esAdministrador: boolean;
};

const componentesMarkdown: Components = {
  h2: ({ children }) => {
    const texto =
      typeof children === 'string'
        ? children.toLocaleLowerCase()
        : Array.isArray(children)
          ? children
              .filter((child): child is string => typeof child === 'string')
              .join(' ')
              .toLocaleLowerCase()
          : '';
    const esProceso = /proceso|procedimiento|paso|método/.test(texto);

    return (
      <h2 className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-2xl font-semibold tracking-tight text-slate-100">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
          {esProceso ? (
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
                strokeWidth={1.8}
                d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0-5.25v2.25m0 13.5v2.25m9-9h-2.25m-13.5 0H3m15.364-6.364-1.591 1.591M7.227 16.773l-1.591 1.591m12.728 0-1.591-1.591M7.227 7.227 5.636 5.636"
              />
            </svg>
          ) : (
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
                strokeWidth={1.8}
                d="m12 3 2.78 5.63 6.22.9-4.5 4.38 1.06 6.19L12 17.18l-5.56 2.92 1.06-6.19L3 9.53l6.22-.9L12 3Z"
              />
            </svg>
          )}
        </span>
        <span>{children}</span>
      </h2>
    );
  },
  ul: ({ children }) => (
    <ul className="my-6 space-y-3 pl-6 marker:text-cyan-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 space-y-3 pl-6 marker:text-cyan-300">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li
      className="rounded-2xl border border-white/10 bg-slate-800/65 px-5 py-4 text-lg leading-relaxed text-slate-200 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.8)] marker:text-cyan-300"
    >
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="my-7 rounded-2xl border border-cyan-300/20 border-l-4 border-l-cyan-300/70 bg-cyan-300/[0.07] px-5 py-4 text-lg leading-relaxed text-slate-200 [&>p]:my-1"
    >
      {children}
    </blockquote>
  ),
};

export default function LectorLeccion({
  slug,
  subareaId,
  subareaNombre,
  leccionId,
  titulo,
  contenido,
  numero,
  total,
  siguienteId,
  esAdministrador,
}: LectorLeccionProps) {
  const router = useRouter();
  const articleRef = useRef<HTMLElement>(null);
  const [modoLectura, setModoLectura] = useState(false);
  const [errorProgreso, setErrorProgreso] = useState<string | null>(null);
  const [progresoLectura, setProgresoLectura] = useState(0);
  const [iniciandoPractica, setIniciandoPractica] = useState(false);
  const lecturaCompletada = progresoLectura >= 100;
  const rutaIndice = `/subarea/${encodeURIComponent(slug)}`;

  useEffect(() => {
    let frameId: number | null = null;

    function actualizarProgreso() {
      const article = articleRef.current;
      if (!article) return;

      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const distancia = article.offsetHeight - window.innerHeight;
      const porcentaje =
        distancia <= 0
          ? 100
          : ((window.scrollY - articleTop) / distancia) * 100;
      const siguienteProgreso = Math.min(
        100,
        Math.max(0, Math.round(porcentaje))
      );

      setProgresoLectura((actual) => Math.max(actual, siguienteProgreso));
    }

    function programarActualizacion() {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        actualizarProgreso();
      });
    }

    actualizarProgreso();
    window.addEventListener('scroll', programarActualizacion, { passive: true });
    window.addEventListener('resize', programarActualizacion);

    return () => {
      window.removeEventListener('scroll', programarActualizacion);
      window.removeEventListener('resize', programarActualizacion);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [modoLectura]);

  useEffect(() => {
    if (!modoLectura) {
      document.body.classList.remove('reading-mode-active');
      return;
    }

    document.body.classList.add('reading-mode-active');
    function salirConEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setModoLectura(false);
    }
    window.addEventListener('keydown', salirConEscape);

    return () => {
      document.body.classList.remove('reading-mode-active');
      window.removeEventListener('keydown', salirConEscape);
    };
  }, [modoLectura]);

  function marcarComoLeida() {
    try {
      marcarLeccionLeida(slug, leccionId);
      setErrorProgreso(null);
      router.push(
        siguienteId
          ? `/subarea/${encodeURIComponent(slug)}/${siguienteId}`
          : rutaIndice
      );
    } catch {
      setErrorProgreso(
        'No pudimos guardar tu progreso. Revisa la configuración de almacenamiento de este navegador.'
      );
    }
  }

  function marcarCompletadaYPracticar() {
    try {
      marcarLeccionLeida(slug, leccionId);
      setErrorProgreso(null);
      setIniciandoPractica(true);
      guardarPracticaPendiente([subareaId]);
      router.push('/simulador');
    } catch {
      setIniciandoPractica(false);
      setErrorProgreso(
        'No pudimos guardar tu progreso. Revisa la configuración de almacenamiento de este navegador.'
      );
    }
  }

  return (
    <main className="reading-page min-h-screen">
      <div
        className={`reading-progress-bar sticky z-40 border-b border-white/10 bg-slate-900/90 px-4 py-3 backdrop-blur-xl sm:px-6 ${
          modoLectura ? 'top-0' : 'top-16'
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          {modoLectura && (
            <button
              type="button"
              onClick={() => setModoLectura(false)}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Salir
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p
                className={`flex min-w-0 items-center gap-2 truncate text-sm font-semibold ${
                  lecturaCompletada ? 'text-emerald-300' : 'text-slate-100'
                }`}
              >
                {lecturaCompletada && (
                  <svg
                    className="h-4 w-4 shrink-0 achievement-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                )}
                <span className="truncate">
                  {lecturaCompletada
                    ? '¡Has terminado esta lección!'
                    : `Lección ${numero} de ${total}`}
                </span>
              </p>
              <span className="shrink-0 text-xs tabular-nums text-slate-300">
                {progresoLectura}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Progreso de lectura de la lección"
              aria-valuenow={progresoLectura}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full transition-[width,background-color] duration-300 ${
                  lecturaCompletada
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-400'
                }`}
                style={{ width: `${progresoLectura}%` }}
              />
            </div>
          </div>
          {!modoLectura && (
            <div className="flex shrink-0 items-center gap-2">
              {esAdministrador && (
                <Link
                  href={`/admin/lecciones/${leccionId}/editar`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-300/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                  aria-label="Editar lección"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m16.862 4.487 1.687-1.687a1.875 1.875 0 1 1 2.652 2.652l-9.193 9.193a4.5 4.5 0 0 1-1.897 1.13l-2.685.806.806-2.685a4.5 4.5 0 0 1 1.13-1.897l7.5-7.5Zm0 0L19.5 7.125M18 14.25V19.5A2.25 2.25 0 0 1 15.75 21.75h-11.25A2.25 2.25 0 0 1 2.25 19.5V6.75A2.25 2.25 0 0 1 4.5 4.5h5.25"
                    />
                  </svg>
                  <span className="hidden sm:inline">Editar</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => setModoLectura(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 6.25c2.6-1.5 5.85-1.5 8.5 0v12c-2.65-1.5-5.9-1.5-8.5 0m0-12c-2.6-1.5-5.85-1.5-8.5 0v12c2.65-1.5 5.9-1.5 8.5 0m0-12v12"
                  />
                </svg>
                <span className="hidden sm:inline">Modo Lectura</span>
                <span className="sm:hidden">Leer</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        {!modoLectura && (
          <Link
            href={rutaIndice}
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Índice de {subareaNombre}
          </Link>
        )}

        <article ref={articleRef} className="reading-content">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">
            {subareaNombre} · Lección {String(numero).padStart(2, '0')}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {titulo}
          </h1>
          <div className="my-8 h-px bg-gradient-to-r from-cyan-300/40 via-white/10 to-transparent sm:my-10" />
          <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-100 prose-h1:text-3xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-200 prose-li:text-lg prose-li:leading-relaxed prose-li:text-slate-200 prose-strong:text-cyan-200 prose-a:text-cyan-300 prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-slate-950/60 prose-table:text-base">
            <ReactMarkdown
              components={componentesMarkdown}
              remarkPlugins={[remarkGfm]}
            >
              {contenido}
            </ReactMarkdown>
          </div>
        </article>

        {errorProgreso && (
          <p
            className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-200"
            role="alert"
          >
            {errorProgreso}
          </p>
        )}

        <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16">
          {lecturaCompletada && (
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <svg
                className="h-12 w-12 text-amber-300 achievement-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M8 21h8m-4-4v4m-5-17h10v5a5 5 0 0 1-10 0V4Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4"
                />
              </svg>
              <p className="text-sm font-semibold text-emerald-200">
                ¡Lectura completada! Ya puedes poner a prueba lo aprendido.
              </p>
            </div>
          )}
          <p className="mb-4 text-center text-sm text-slate-400">
            {!lecturaCompletada
              ? 'Sigue leyendo hasta el final para desbloquear tu práctica.'
              : 'Refuerza lo que acabas de aprender con preguntas de esta subárea.'}
          </p>
          <button
            type="button"
            onClick={marcarCompletadaYPracticar}
            disabled={!lecturaCompletada || iniciandoPractica}
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-center text-lg font-bold text-white shadow-[0_14px_38px_-16px_rgba(34,211,238,0.65)] transition-[transform,box-shadow,opacity] duration-200 hover:shadow-[0_18px_42px_-14px_rgba(59,130,246,0.55)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-[0_14px_38px_-16px_rgba(34,211,238,0.65)]"
          >
            {iniciandoPractica
              ? 'Abriendo la práctica…'
              : 'Marcar como completada y practicar'}
            <span aria-hidden="true">→</span>
          </button>
          {siguienteId && (
            <button
              type="button"
              onClick={marcarComoLeida}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Continuar con la siguiente lección
            </button>
          )}
          {!siguienteId && (
            <Link
              href={rutaIndice}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Volver al índice de {subareaNombre}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
