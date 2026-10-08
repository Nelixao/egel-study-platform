'use server';

import { db } from '@/db';
import { preguntas, subareas } from '@/db/schema';
import { inArray, and, eq, sql } from 'drizzle-orm';

export async function obtenerPreguntasAleatorias(
  subareaIds: number[],
  cantidad: number
) {
  if (subareaIds.length === 0) {
    return { error: 'Selecciona al menos una subárea' };
  }

  const resultado = await db
    .select()
    .from(preguntas)
    .where(
      and(
        inArray(preguntas.subareaId, subareaIds),
        eq(preguntas.esBorrador, false)
      )
    )
    .orderBy(sql`random()`)
    .limit(cantidad);

  if (resultado.length === 0) {
    return {
      error: 'No hay preguntas aprobadas en las subáreas seleccionadas',
    };
  }

  // Barajar las opciones de cada pregunta
  const preguntasBarajadas = resultado.map((p) => {
    const letras = ['A', 'B', 'C'];
    const textos = [p.opcionA, p.opcionB, p.opcionC];
    const letraCorrectaOriginal = p.respuestaCorrecta;
    const indexOriginal = letras.indexOf(letraCorrectaOriginal);

    // Fisher-Yates shuffle sobre los índices
    const indices = [0, 1, 2];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Nuevos textos en orden barajado
    const nuevosTextos = indices.map((i) => textos[i]);
    // Encontrar la nueva posición de la respuesta correcta
    const nuevaIndexCorrecta = indices.indexOf(indexOriginal);
    const nuevaLetraCorrecta = letras[nuevaIndexCorrecta];

    return {
      ...p,
      opcionA: nuevosTextos[0],
      opcionB: nuevosTextos[1],
      opcionC: nuevosTextos[2],
      respuestaCorrecta: nuevaLetraCorrecta,
    };
  });

  return { preguntas: preguntasBarajadas };
}

export async function obtenerSubareasAgrupadas() {
  const todas = await db.select().from(subareas);
  return todas;
}