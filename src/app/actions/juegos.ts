'use server';

import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { preguntas, subareas } from '@/db/schema';

export async function obtenerPreguntasParaJuego(slug: string) {
  const [subarea] = await db
    .select({ id: subareas.id })
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) return { error: 'No encontramos esta subárea.' };

  const reactivos = await db
    .select({
      id: preguntas.id,
      enunciado: preguntas.enunciado,
      opcionA: preguntas.opcionA,
      opcionB: preguntas.opcionB,
      opcionC: preguntas.opcionC,
      respuestaCorrecta: preguntas.respuestaCorrecta,
      explicacion: preguntas.explicacion,
    })
    .from(preguntas)
    .where(
      and(
        eq(preguntas.subareaId, subarea.id),
        eq(preguntas.esBorrador, false)
      )
    )
    .orderBy(sql`random()`)
    .limit(10);

  if (reactivos.length === 0) {
    return { error: 'Esta subárea todavía no tiene reactivos aprobados.' };
  }

  const claves = ['A', 'B', 'C'] as const;
  const preguntasJuego = reactivos.map((pregunta, indice) => {
    const esVerdadera = indice % 2 === 0;
    const claveAfirmada = esVerdadera
      ? pregunta.respuestaCorrecta
      : claves.find((clave) => clave !== pregunta.respuestaCorrecta) ?? 'A';
    const opcionAfirmada =
      claveAfirmada === 'A'
        ? pregunta.opcionA
        : claveAfirmada === 'B'
          ? pregunta.opcionB
          : pregunta.opcionC;
    const opcionCorrecta =
      pregunta.respuestaCorrecta === 'A'
        ? pregunta.opcionA
        : pregunta.respuestaCorrecta === 'B'
          ? pregunta.opcionB
          : pregunta.opcionC;

    return {
      id: pregunta.id,
      enunciado: pregunta.enunciado,
      opcionAfirmada,
      esVerdadera,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      opcionCorrecta,
      explicacion: pregunta.explicacion,
    };
  });

  return { preguntas: preguntasJuego };
}