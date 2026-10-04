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

  async function cargar() {
    setCargando(true);
    try {
      const res = await fetch('/api/borradores');
      const data = await res.json();
      setBorradores(data.borradores || []);
    } catch {
      setError('Error cargando borradores');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function aprobar(id: number) {
    await fetch(`/api/preguntas/${id}/aprobar`, { method: 'POST' });
    cargar();
  }

  async function descartar(id: number) {
    if (!confirm('¿Descartar esta pregunta? Se eliminará permanentemente.')) return;
    await fetch(`/api/preguntas/${id}`, { method: 'DELETE' });
    cargar();
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <p className="text-slate-500">Cargando borradores...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Borradores generados por IA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {borradores.length} preguntas pendientes de revisión
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {error}
          </div>
        )}

        {borradores.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-slate-500">No hay borradores pendientes.</p>
            <p className="text-sm text-slate-400 mt-2">
              Sube un PDF en la Biblioteca y genera preguntas.
            </p>
          </div>
        ) : (
          borradores.map((b) => (
            <article
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  Borrador #{b.id}
                </span>
                {b.areaNombre && (
                  <span className="text-xs text-slate-500">
                    {b.areaNombre} → {b.subareaNombre}
                  </span>
                )}
              </div>

              <p className="text-slate-800 font-medium mb-4">{b.enunciado}</p>

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
                        ? 'bg-green-50 border-green-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-slate-700">
                      {op.letra})
                    </span>
                    <span className="text-slate-700">{op.texto}</span>
                  </li>
                ))}
              </ul>

              {b.explicacion && (
                <div className="mb-4 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Explicación
                  </p>
                  <p className="text-sm text-slate-600">{b.explicacion}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => aprobar(b.id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  ✓ Aprobar
                </button>
                <button
                  onClick={() => descartar(b.id)}
                  className="border border-red-300 text-red-700 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg"
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