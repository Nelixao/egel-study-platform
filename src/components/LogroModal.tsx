'use client';

import { useEffect } from 'react';

type Props = {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  detalle?: string;
  textoBoton?: string;
  onClose: () => void;
};

export default function LogroModal({
  abierto,
  titulo,
  mensaje,
  detalle,
  textoBoton = '¡Continuar!',
  onClose,
}: Props) {
  useEffect(() => {
    if (!abierto) return;

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div
      className="achievement-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-md"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="logro-modal-title"
        aria-describedby="logro-modal-message"
        className="achievement-modal-enter glass-card-strong relative w-full max-w-md overflow-hidden rounded-[28px] border border-indigo-300/20 p-7 text-center shadow-[0_24px_90px_-20px_rgba(99,102,241,0.5)] sm:p-9"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.2),transparent_65%)]"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar celebración"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
        >
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
              d="m6 6 12 12M18 6 6 18"
            />
          </svg>
        </button>

        <div className="relative mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-amber-300/30 bg-amber-400/10 text-amber-300 shadow-[0_0_38px_rgba(251,191,36,0.2)]">
          <svg
            className="achievement-icon h-11 w-11"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.7}
              d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77l-5.4 2.84 1.03-6.01L3.27 9.35l6.03-.88L12 3Z"
            />
          </svg>
        </div>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Logro desbloqueado
          </p>
          <h2
            id="logro-modal-title"
            className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {titulo}
          </h2>
          <p
            id="logro-modal-message"
            className="mt-3 text-sm leading-relaxed text-slate-300"
          >
            {mensaje}
          </p>
          {detalle && (
            <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-100">
              {detalle}
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="interactive-glow mt-7 w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            {textoBoton}
          </button>
        </div>
      </section>
    </div>
  );
}
