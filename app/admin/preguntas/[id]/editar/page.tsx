export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { areas, preguntas, subareas } from '@/db/schema';
import PreguntaForm from '../../PreguntaForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarPreguntaPage({ params }: Props) {
  const { id } = await params;
  const preguntaId = Number(id);

  if (!Number.isInteger(preguntaId) || preguntaId < 1) notFound();

  const [pregunta] = await db
    .select()
    .from(preguntas)
    .where(eq(preguntas.id, preguntaId))
    .limit(1);

  if (!pregunta) notFound();

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
        <div className="mx-auto max-w-3xl px-5 py-5">
          <Link
            href="/admin/preguntas"
            className="mb-3 inline-flex text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            Volver a preguntas
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Editar pregunta
          </h1>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {pregunta.enunciado}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-5 py-6">
        <PreguntaForm pregunta={pregunta} subareas={todasSubareas} />
      </div>
    </main>
  );
}
