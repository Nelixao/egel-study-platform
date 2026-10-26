'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { eliminarPregunta } from '@/app/actions/preguntas';

export default function EliminarPreguntaButton({ id }: { id: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function eliminar() {
    if (!window.confirm('¿Eliminar esta pregunta permanentemente?')) return;

    setError(null);
    startTransition(async () => {
      try {
        const resultado = await eliminarPregunta(id);
        if (resultado.error) {
          setError(resultado.error);
          return;
        }
        router.refresh();
      } catch {
        setError('No se pudo eliminar la pregunta. Inténtalo de nuevo.');
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={eliminar}
        disabled={pending}
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50"
      >
        {pending ? 'Eliminando...' : 'Eliminar'}
      </button>
      {error && (
        <p role="alert" className="max-w-48 text-right text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
