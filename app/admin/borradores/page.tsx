
'use client';

import { useEffect, useState } from 'react';

type Borrador = {
  id: number;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
  subareaNombre: string | null;
  areaNombre: string | null;
};

export default function BorradoresPage() {
  const [borradores, setBorradores] = useState<Borrador[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar(estaActivo: () => boolean = () => true) {
    try {
      const res = await fetch('/api/borradores');
      const data = await res.json();
      if (estaActivo()) {
        setBorradores(data.borradores || []);
      }
    } catch {
      if (estaActivo()) {
        setError('Error cargando borradores');
      }
    } finally {
      if (estaActivo()) {
        setCargando(false);
      }
    }
  }

  useEffect(() => {
    let activo = true;

    async function cargarInicial() {
      await cargar(() => activo);
    }

    void cargarInicial();
    return () => {
      activo = false;
    };
  }, []);

  async function aprobar(id: number) {
    await fetch(`/api/preguntas/${id}/aprobar`, { method: 'POST' });
    setCargando(true);
    cargar();
  }

  async function descartar(id: number) {
    if (!confirm('¿Descartar esta pregunta? Se eliminará permanentemente.')) return;
    await fetch(`/api/preguntas/${id}`, { method: 'DELETE' });
    setCargando(true);
    cargar();
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-ios-canvas p-8">
        <p className="text-slate-400">Cargando borradores...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ios-canvas">
      <header className="glass-nav">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Borradores generados por IA
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {borradores.length} preguntas pendientes de revisión
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        {error && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">
            {error}
          </div>
        )}

        {borradores.length === 0 ? (
          <div className="glass-card rounded-2xl border-dashed p-10 text-center">
            <p className="text-slate-300">No hay borradores pendientes.</p>
            <p className="text-sm text-slate-400 mt-2">
              Sube un PDF en la Biblioteca y genera preguntas.
            </p>
          </div>
        ) : (
          borradores.map((b) => (
            <article
              key={b.id}
              className="glass-card-strong rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-200">
                  Borrador #{b.id}
                </span>
                {b.areaNombre && (
                  <span className="text-xs text-slate-400">
                    {b.areaNombre} → {b.subareaNombre}
                  </span>
                )}
              </div>

              <p className="mb-4 font-medium text-slate-100">{b.enunciado}</p>

              <ul className="space-y-2 mb-4">
                {[
                  { letra: 'A', texto: b.opcionA },
                  { letra: 'B', texto: b.opcionB },
                  { letra: 'C', texto: b.opcionC },
                ].map((op) => (
                  <li
                    key={op.letra}
                    className={`flex gap-3 p-3 rounded-lg border ${
                      op.letra === b.respuestaCorrecta
                        ? 'border-emerald-400/30 bg-emerald-400/10'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <span className="font-semibold text-slate-300">
                      {op.letra})
                    </span>
                    <span className="text-slate-300">{op.texto}</span>
                  </li>
                ))}
              </ul>

              {b.explicacion && (
                <div className="mb-4 border-t border-white/10 pt-3">
                  <p className="mb-1 text-xs font-semibold text-slate-400">
                    Explicación
                  </p>
                  <p className="text-sm text-slate-300">{b.explicacion}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => aprobar(b.id)}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:brightness-110"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => descartar(b.id)}
                  className="rounded-xl border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/10"
                >
                  Descartar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
