import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { preguntas, subareas } from '@/db/schema';
import EstadisticasDashboard from './EstadisticasDashboard';

export const dynamic = 'force-dynamic';

export default async function EstadisticasPage() {
  const [todasSubareas, preguntasPublicadas] = await Promise.all([
    db
      .select({
        id: subareas.id,
        nombre: subareas.nombre,
        slug: subareas.slug,
      })
      .from(subareas)
      .orderBy(asc(subareas.nombre)),
    db
      .select({
        id: preguntas.id,
        enunciado: preguntas.enunciado,
      })
      .from(preguntas)
      .where(eq(preguntas.esBorrador, false)),
  ]);

  return (
    <EstadisticasDashboard
      subareas={todasSubareas}
      preguntas={preguntasPublicadas}
    />
  );
}
