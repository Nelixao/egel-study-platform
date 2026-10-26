export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { documentos, areas } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { actualizarDocumento } from '@/app/actions/documentos';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarDocumentoPage({ params }: Props) {
  const { id } = await params;
  const documentoId = Number(id);

  if (!documentoId) notFound();

  const [doc] = await db
    .select()
    .from(documentos)
    .where(eq(documentos.id, documentoId))
    .limit(1);

  if (!doc) notFound();

  const todasAreas = await db.select().from(areas).orderBy(asc(areas.orden));

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <Link
            href={`/biblioteca/${doc.id}`}
            className="mb-3 inline-block text-sm text-blue-300 hover:text-blue-200"
          >
            ← Volver al documento
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Editar documento
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">
            Solo se puede editar la información. El PDF no se puede reemplazar.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6">
        <form
          action={async (formData) => {
            'use server';
            await actualizarDocumento(formData);
          }}
          className="glass-card-strong divide-y divide-white/10 overflow-hidden rounded-[22px]"
        >
          <input type="hidden" name="id" value={doc.id} />

          <div className="px-5 py-4">
            <label className="block text-sm font-medium text-black mb-2">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              required
              defaultValue={doc.titulo}
              className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
            />
          </div>

          <div className="px-5 py-4">
            <label className="block text-sm font-medium text-black mb-2">
              Autor
            </label>
            <input
              type="text"
              name="autor"
              defaultValue={doc.autor || ''}
              className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
            />
          </div>

          <div className="px-5 py-4">
            <label className="block text-sm font-medium text-black mb-2">
              Área relacionada
            </label>
            <select
              name="areaId"
              defaultValue={doc.areaId ?? ''}
              className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
            >
              <option value="">Sin especificar</option>
              {todasAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="px-5 py-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:brightness-110 tap-scale"
            >
              Guardar cambios
            </button>
            <Link
              href={`/biblioteca/${doc.id}`}
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