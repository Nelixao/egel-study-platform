import { db } from '@/db';
import { secciones, areas, subareas, preguntas } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function getEstructuraCompleta() {
  const todasSecciones = await db
    .select()
    .from(secciones)
    .orderBy(asc(secciones.id));

  const todasAreas = await db
    .select()
    .from(areas)
    .orderBy(asc(areas.orden));

  const todasSubareas = await db
    .select()
    .from(subareas)
    .orderBy(asc(subareas.id));

  return todasSecciones.map((seccion) => {
    const areasDeSeccion = todasAreas.filter((a) => a.seccionId === seccion.id);
    return {
      ...seccion,
      areas: areasDeSeccion.map((area) => ({
        ...area,
        subareas: todasSubareas.filter((s) => s.areaId === area.id),
      })),
    };
  });
}

export async function getSubareaPorSlug(slug: string) {
  const [subarea] = await db
    .select()
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) return null;

  const [area] = await db
    .select()
    .from(areas)
    .where(eq(areas.id, subarea.areaId))
    .limit(1);

  const preguntasDeSubarea = await db
    .select()
    .from(preguntas)
    .where(eq(preguntas.subareaId, subarea.id))
    .orderBy(asc(preguntas.id));

  return { subarea, area, preguntas: preguntasDeSubarea };
}