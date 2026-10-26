import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { preguntas, subareas } from '@/db/schema';
import HoyDashboard from './HoyDashboard';

export const metadata = {
  title: 'Hoy — EGEL ICOMPU',
};

export default async function HoyPage() {
  const [todasSubareas, preguntasDisponibles] = await Promise.all([
    db
      .select({
        id: subareas.id,
        slug: subareas.slug,
        nombre: subareas.nombre,
        preguntasDisponibles: sql<number>`count(${preguntas.id})::int`,
      })
      .from(subareas)
      .leftJoin(
        preguntas,
        and(
          eq(preguntas.subareaId, subareas.id),
          eq(preguntas.esBorrador, false)
        )
      )
      .groupBy(subareas.id, subareas.slug, subareas.nombre)
      .orderBy(asc(subareas.id)),
    db
      .select({ id: preguntas.id })
      .from(preguntas)
      .where(eq(preguntas.esBorrador, false)),
  ]);

  return (
    <HoyDashboard
      subareas={todasSubareas}
      preguntaIds={preguntasDisponibles.map((pregunta) => pregunta.id)}
    />
  );
}
