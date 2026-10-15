import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { preguntas, subareas } from '@/db/schema';
import RepasarSession from './RepasarSession';

export const metadata = {
  title: 'Repasar mis errores — EGEL ICOMPU',
};

export default async function RepasarPage() {
  const preguntasDisponibles = await db
    .select({
      id: preguntas.id,
      enunciado: preguntas.enunciado,
      opcionA: preguntas.opcionA,
      opcionB: preguntas.opcionB,
      opcionC: preguntas.opcionC,
      respuestaCorrecta: preguntas.respuestaCorrecta,
      explicacion: preguntas.explicacion,
      dificultad: preguntas.dificultad,
      subareaSlug: subareas.slug,
      subareaNombre: subareas.nombre,
    })
    .from(preguntas)
    .innerJoin(subareas, eq(preguntas.subareaId, subareas.id))
    .where(eq(preguntas.esBorrador, false))
    .orderBy(asc(preguntas.id));

  return <RepasarSession preguntas={preguntasDisponibles} />;
}
