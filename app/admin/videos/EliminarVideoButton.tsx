'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { eliminarVideoSubarea } from '@/app/actions/subareas';

export default function EliminarVideoButton({ subareaId }: { subareaId: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function eliminar() {
    if (!window.confirm('¿Quitar el video de esta subárea?')) return;

    setError(null);
    startTransition(async () => {
      try {
        const resultado = await eliminarVideoSubarea(subareaId);
        if (resultado.error) {
          setError(resultado.error);
          return;
        }
        router.refresh();
      } catch {
        setError('No se pudo quitar el video. Inténtalo de nuevo.');
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={eliminar}
        disabled={pending}
        className="rounded-xl border border-rose-400/25 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50"
      >
        {pending ? 'Eliminando...' : 'Eliminar video'}
      </button>
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
