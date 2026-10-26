export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { subareas, areas, lecciones } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { actualizarLeccion } from '@/app/actions/lecciones';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarLeccionPage({ params }: Props) {
  const { id } = await params;
  const leccionId = Number(id);

  if (!leccionId) notFound();

  const [leccion] = await db
    .select()
    .from(lecciones)
    .where(eq(lecciones.id, leccionId))
    .limit(1);

  if (!leccion) notFound();

  const todasSubareas = await db
    .select({
      id: subareas.id,
      nombre: subareas.nombre,
      areaNombre: areas.nombre,
    })
    .from(subareas)
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .orderBy(asc(areas.orden), asc(subareas.id));

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <Link
            href="/admin/lecciones"
            className="mb-3 inline-block text-sm text-blue-300 hover:text-blue-200"
          >
            ← Volver a lecciones
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Editar lección
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">{leccion.titulo}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6">
        <form
          action={async (formData) => {
            'use server';
            await actualizarLeccion(formData);
          }}
          className="glass-card-strong rounded-[20px] overflow-hidden divide-y divide-white/10"
        >
          <input type="hidden" name="id" value={leccion.id} />

          <div className="px-5 py-4">
            <label className="block text-sm font-medium text-black mb-2">
              Subárea
            </label>
            <select
              name="subareaId"
              required
              defaultValue={leccion.subareaId ?? ''}
              className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
            >
              <option value="">Selecciona una subárea</option>
              {todasSubareas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.areaNombre} → {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="px-5 py-4 grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                required
                defaultValue={leccion.titulo}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Orden
              </label>
              <input
                type="number"
                name="orden"
                defaultValue={leccion.orden}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
              />
            </div>
          </div>

          <div className="px-5 py-4">
            <label className="block text-sm font-medium text-black mb-2">
              Contenido (Markdown)
            </label>
            <textarea
              name="contenido"
              required
              rows={20}
              defaultValue={leccion.contenido}
              className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black font-mono focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 resize-y"
            />
          </div>

          <div className="px-5 py-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:brightness-110 tap-scale"
            >
              Guardar cambios
            </button>
            <Link
              href="/admin/lecciones"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-medium text-slate-200 transition hover:bg-white/10 tap-scale"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}