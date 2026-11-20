'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marcarLeccionLeida } from '@/lib/progreso-lectura';

type LectorLeccionProps = {
  slug: string;
  subareaNombre: string;
  leccionId: number;
  titulo: string;
  contenido: string;
  numero: number;
  total: number;
  siguienteId: number | null;
  esAdministrador: boolean;
};

export default function LectorLeccion({
  slug,
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
  const [modoLectura, setModoLectura] = useState(false);
  const [errorProgreso, setErrorProgreso] = useState<string | null>(null);
  const porcentaje = total === 0 ? 0 : (numero / total) * 100;
  const rutaIndice = `/subarea/${encodeURIComponent(slug)}`;

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
              <p className="truncate text-sm font-semibold text-slate-100">
                Lección {numero} de {total}
              </p>
              <span className="shrink-0 text-xs tabular-nums text-slate-400">
                {Math.round(porcentaje)}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label={`Progreso de lectura: lección ${numero} de ${total}`}
              aria-valuenow={numero}
              aria-valuemin={0}
              aria-valuemax={total}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-[width] duration-300"
                style={{ width: `${porcentaje}%` }}
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

        <article className="reading-content">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">
            {subareaNombre} · Lección {String(numero).padStart(2, '0')}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {titulo}
          </h1>
          <div className="my-8 h-px bg-gradient-to-r from-cyan-300/40 via-white/10 to-transparent sm:my-10" />
          <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-100 prose-h1:text-3xl prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-lg prose-p:leading-[1.9] prose-p:text-slate-200 prose-p:sm:text-xl prose-li:text-lg prose-li:leading-[1.85] prose-li:text-slate-200 prose-strong:text-white prose-a:text-cyan-300 prose-blockquote:border-cyan-300/60 prose-blockquote:text-slate-300 prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-slate-950/60 prose-table:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
          <p className="mb-4 text-center text-sm text-slate-400">
            {siguienteId
              ? '¿Listo para continuar con la siguiente lección?'
              : 'Has llegado al final de las lecciones de esta subárea.'}
          </p>
          <button
            type="button"
            onClick={marcarComoLeida}
            className="interactive-glow flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-center text-base font-bold text-white shadow-[0_14px_38px_-16px_rgba(34,211,238,0.65)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_18px_42px_-14px_rgba(59,130,246,0.55)] sm:min-h-16 sm:text-lg"
          >
            {siguienteId
              ? 'Marcar como leída y continuar'
              : '¡Subárea completada! Volver al índice'}
            <span aria-hidden="true">→</span>
          </button>
          {!siguienteId && (
            <p className="mt-3 text-center text-xs text-slate-500">
              Tu avance quedará guardado para la próxima vez.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
