'use client';

import { useState, useTransition, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { actualizarLeccion } from '@/app/actions/lecciones';

export default function FormularioEditarLeccion({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [pendiente, iniciarTransicion] = useTransition();
  const [mensaje, setMensaje] = useState<
    { tipo: 'exito' | 'error'; texto: string } | null
  >(null);

  function enviarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    setMensaje(null);

    iniciarTransicion(async () => {
      try {
        const resultado = await actualizarLeccion(datos);
        if ('error' in resultado && resultado.error) {
          setMensaje({ tipo: 'error', texto: resultado.error });
          return;
        }

        setMensaje({ tipo: 'exito', texto: 'Cambios guardados correctamente.' });
        router.refresh();
      } catch {
        setMensaje({ tipo: 'error', texto: 'No se pudieron guardar los cambios. Inténtalo de nuevo.' });
      }
    });
  }

  return (
    <form
      onSubmit={enviarFormulario}
      className="glass-card-strong divide-y divide-white/10 overflow-hidden rounded-[20px]"
    >
      {children}
      <div className="px-5 py-4">
        {pendiente && (
          <p role="status" className="mb-3 text-sm font-medium text-cyan-200">
            Guardando cambios…
          </p>
        )}
        {mensaje && (
          <p
            role={mensaje.tipo === 'error' ? 'alert' : 'status'}
            className={`mb-3 rounded-xl border px-4 py-3 text-sm ${mensaje.tipo === 'exito' ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200' : 'border-rose-300/20 bg-rose-300/10 text-rose-200'}`}
          >
            {mensaje.texto}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={pendiente}
            className="min-h-14 flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 font-semibold text-white shadow-lg shadow-blue-500/15 transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            {pendiente ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <Link
            href="/admin/lecciones"
            className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 font-medium text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}