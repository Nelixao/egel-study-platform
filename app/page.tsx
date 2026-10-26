import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { lecciones, preguntas } from '@/db/schema';
import { getEstructuraCompleta } from '@/lib/queries';
import FocusDashboard from './FocusDashboard';

export default async function Home() {
  const [estructura, preguntasPorSubarea, leccionesPorSubarea] =
    await Promise.all([
      getEstructuraCompleta(),
      db
        .select({
          subareaId: preguntas.subareaId,
          total: sql<number>`count(*)::int`,
        })
        .from(preguntas)
        .where(eq(preguntas.esBorrador, false))
        .groupBy(preguntas.subareaId),
      db
        .select({
          subareaId: lecciones.subareaId,
          total: sql<number>`count(*)::int`,
        })
        .from(lecciones)
        .groupBy(lecciones.subareaId),
    ]);

  const preguntasPorId = new Map(
    preguntasPorSubarea.map((resultado) => [
      resultado.subareaId,
      resultado.total,
    ])
  );
  const leccionesPorId = new Map(
    leccionesPorSubarea.map((resultado) => [
      resultado.subareaId,
      resultado.total,
    ])
  );

  const subareas = estructura.flatMap((seccion) =>
    seccion.areas.flatMap((area) =>
      area.subareas.map((subarea) => {
        const lecciones = leccionesPorId.get(subarea.id) ?? 0;
        const preguntas = preguntasPorId.get(subarea.id) ?? 0;
        return {
          slug: subarea.slug,
          nombre: subarea.nombre,
          area: area.nombre,
          tieneContenido: lecciones > 0 || preguntas > 0,
          lecciones,
          preguntas,
        };
      })
    )
  );

  return <FocusDashboard subareas={subareas} />;
}
