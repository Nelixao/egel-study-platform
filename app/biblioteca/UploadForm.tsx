'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Area = { id: number; nombre: string };

export default function UploadForm({ areas }: { areas: Area[] }) {
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje(null);
    setSubiendo(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/biblioteca/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: 'error', texto: data.error || 'Error al subir' });
      } else {
        setMensaje({ tipo: 'ok', texto: 'Documento subido correctamente' });
        formRef.current?.reset();
        router.refresh();
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <section
      id="formulario-subir-pdf"
      className="glass-card-strong rounded-2xl p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">
        Subir documento
      </h2>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              placeholder="Ej. Ingeniería del software"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Autor
            </label>
            <input
              type="text"
              name="autor"
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              placeholder="Ej. Roger Pressman"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Área relacionada
          </label>
          <select
            name="areaId"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="">Sin especificar</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Archivo PDF * (máx. 50 MB)
          </label>
          <input
            type="file"
            name="file"
            accept=".pdf,application/pdf"
            required
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-blue-400/15 file:px-3 file:py-1 file:font-medium file:text-blue-200 hover:file:bg-blue-400/25"
          />
        </div>

        {mensaje && (
          <div
            className={`text-sm rounded-lg p-3 ${
              mensaje.tipo === 'ok'
                ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                : 'border border-rose-400/30 bg-rose-400/10 text-rose-200'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <button
          type="submit"
          disabled={subiendo}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:brightness-110 disabled:opacity-50"
        >
          {subiendo ? 'Subiendo...' : 'Subir PDF'}
        </button>
      </form>
    </section>
  );
}