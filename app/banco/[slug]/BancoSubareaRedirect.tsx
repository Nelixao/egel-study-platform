'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarPracticaPendiente } from '@/lib/practica-pendiente';

export default function BancoSubareaRedirect({
  subareaId,
}: {
  subareaId: number;
}) {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    function abrirSimulador() {
      try {
        guardarPracticaPendiente([subareaId], false);
        router.replace('/simulador');
      } catch {
        setError(true);
      }
    }

    abrirSimulador();
  }, [router, subareaId]);

  if (error) {
    return (
      <main className="bg-ios-canvas min-h-screen px-4 py-12 text-center text-slate-200">
        <p role="alert">
          No pudimos preparar la práctica. Revisa el almacenamiento de este
          navegador e inténtalo de nuevo.
        </p>
      </main>
    );
  }

  return (
    <main className="bg-ios-canvas min-h-screen px-4 py-12 text-center text-slate-400">
      <p role="status">Abriendo la práctica…</p>
    </main>
  );
}
