export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { subareas, areas, lecciones } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import MarkdownEditor from '../../MarkdownEditor';
import FormularioEditarLeccion from './FormularioEditarLeccion';

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
    <main className="bg-ios-canvas min-h-screen animate-slide-up">
      <header className="glass-nav sticky top-16 z-40">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Link
            href="/admin/lecciones"
            className="mb-3 inline-flex min-h-12 items-center text-sm text-blue-300 transition-colors hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            ← Volver a lecciones
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Editar lección
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">{leccion.titulo}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <FormularioEditarLeccion>
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

          <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
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
            <label
              htmlFor="contenido"
              className="mb-2 block text-sm font-medium text-black"
            >
              Contenido de la lección
            </label>
            <MarkdownEditor
              name="contenido"
              initialValue={leccion.contenido}
            />
          </div>

        </FormularioEditarLeccion>
      </div>
    </main>
  );
}