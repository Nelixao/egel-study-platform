'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { eliminarDocumento } from '@/app/actions/documentos';

export default function EliminarDocumentoButton({ id }: { id: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function eliminar() {
    if (
      !window.confirm(
        '¿Eliminar este documento y su archivo PDF permanentemente?'
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const resultado = await eliminarDocumento(id);
        if (resultado.error) {
          setError(resultado.error);
          return;
        }
        router.push('/biblioteca');
        router.refresh();
      } catch {
        setError('No se pudo eliminar el documento. Inténtalo de nuevo.');
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={eliminar}
        disabled={pending}
        className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Eliminando...' : 'Eliminar documento'}
      </button>
      {error && (
        <p role="alert" className="max-w-xl text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
