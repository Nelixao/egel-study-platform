'use server';

import { db } from '@/db';
import { preguntas, subareas } from '@/db/schema';
import { inArray, sql } from 'drizzle-orm';

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
    .where(inArray(preguntas.subareaId, subareaIds))
    .orderBy(sql`random()`)
    .limit(cantidad);

  if (resultado.length === 0) {
    return { error: 'No hay preguntas disponibles en las subáreas seleccionadas' };
  }

  return { preguntas: resultado };
}

export async function obtenerSubareasAgrupadas() {
  const todas = await db.select().from(subareas);
  return todas;
}