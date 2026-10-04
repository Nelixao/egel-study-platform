'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerarPreguntas({
  documentoId,
}: {
  documentoId: number;
}) {
  const [generando, setGenerando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: 'ok' | 'error';
    texto: string;
  } | null>(null);
  const router = useRouter();

  async function generar() {
    setGenerando(true);
    setMensaje(null);

    try {
      const res = await fetch('/api/generar-preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentoId, cantidad: 5 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: 'error', texto: data.error || 'Error al generar' });
      } else {
        setMensaje({
          tipo: 'ok',
          texto: `✅ ${data.total} preguntas generadas. Revísalas en el panel de borradores.`,
        });
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setGenerando(false);
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="font-semibold text-blue-900 mb-2">
        Generar preguntas automáticamente
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        La IA generará 5 preguntas de opción múltiple basadas en el texto
        extraído. Se guardarán como borradores para que las revises.
      </p>

      {mensaje && (
        <div
          className={`text-sm rounded-lg p-3 mb-4 ${
            mensaje.tipo === 'ok'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <button
        onClick={generar}
        disabled={generando}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg"
      >
        {generando ? 'Generando...' : 'Generar preguntas con IA'}
      </button>

      {mensaje?.tipo === 'ok' && (
        <button
          onClick={() => router.push('/admin/borradores')}
          className="ml-3 border border-blue-300 text-blue-700 font-medium px-5 py-2.5 rounded-lg hover:bg-blue-100"
        >
          Ver borradores
        </button>
      )}
    </div>
  );
}