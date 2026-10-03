import { db } from '@/db';
import { secciones, areas, subareas } from '@/db/schema';
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
