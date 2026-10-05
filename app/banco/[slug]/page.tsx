import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { subareas, areas, preguntas } from '@/db/schema';
import { asc, eq, and } from 'drizzle-orm';
import Flashcards from './Flashcards';

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata = {
  title: 'Banco de preguntas',
};

export default async function BancoSubareaPage({ params }: Props) {
  const { slug } = await params;

  const [subarea] = await db
    .select()
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) notFound();

  const [area] = await db
    .select()
    .from(areas)
    .where(eq(areas.id, subarea.areaId))
    .limit(1);

  const preguntasDeSubarea = await db
    .select()
    .from(preguntas)
    .where(
      and(
        eq(preguntas.subareaId, subarea.id),
        eq(preguntas.esBorrador, false)
      )
    )
    .orderBy(asc(preguntas.id));

  if (preguntasDeSubarea.length === 0) {
    return (
      <main className="bg-ios-canvas min-h-screen">
        <header className="glass-nav">
          <div className="max-w-3xl mx-auto px-5 py-6">
            <Link
              href="/banco"
              className="text-sm text-[#007AFF] hover:underline mb-3 inline-block"
            >
              ← Banco de preguntas
            </Link>
            <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest">
              {area?.nombre}
            </p>
            <h1 className="text-3xl font-bold text-black tracking-tight mt-1">
              {subarea.nombre}
            </h1>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <div className="glass-card-strong rounded-[22px] p-10">
            <p className="text-black/60">
              Todavía no hay preguntas aprobadas en esta subárea.
            </p>
            <Link
              href="/admin/borradores"
              className="inline-block mt-4 text-sm font-semibold text-[#007AFF] hover:underline"
            >
              Revisar borradores →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <Link
            href="/banco"
            className="text-sm text-[#007AFF] hover:underline mb-3 inline-block"
          >
            ← Banco de preguntas
          </Link>
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest">
            {area?.nombre}
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight mt-1">
            {subarea.nombre}
          </h1>
          <p className="text-sm text-black/60 mt-2">
            {preguntasDeSubarea.length} {preguntasDeSubarea.length === 1 ? 'pregunta' : 'preguntas'}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <Flashcards preguntas={preguntasDeSubarea} />
      </div>
    </main>
  );
}