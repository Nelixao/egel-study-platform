'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { preguntas } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export type PreguntaActionState = {
  error?: string;
  success?: boolean;
};

function revalidarPreguntas() {
  revalidatePath('/admin/preguntas');
  revalidatePath('/subarea/[slug]', 'page');
  revalidatePath('/banco');
  revalidatePath('/banco/[slug]', 'page');
  revalidatePath('/simulador');
  revalidatePath('/repasar');
}

export async function crearPregunta(formData: FormData) {
  await requireAdmin();

  const subareaId = Number(formData.get('subareaId'));
  const enunciado = String(formData.get('enunciado') ?? '').trim();
  const opcionA = String(formData.get('opcionA') ?? '').trim();
  const opcionB = String(formData.get('opcionB') ?? '').trim();
  const opcionC = String(formData.get('opcionC') ?? '').trim();
  const respuestaCorrecta = String(formData.get('respuestaCorrecta') ?? '');
  const explicacion = String(formData.get('explicacion') ?? '').trim();
  const dificultad = String(formData.get('dificultad') ?? 'media');

  if (
    !Number.isInteger(subareaId) ||
    subareaId < 1 ||
    !enunciado ||
    !opcionA ||
    !opcionB ||
    !opcionC
  ) {
    return { error: 'Faltan campos obligatorios' };
  }

  if (!['A', 'B', 'C'].includes(respuestaCorrecta)) {
    return { error: 'La respuesta correcta debe ser A, B o C' };
  }

  if (!['facil', 'media', 'dificil'].includes(dificultad)) {
    return { error: 'La dificultad seleccionada no es válida' };
  }

  await db.insert(preguntas).values({
    subareaId,
    enunciado,
    opcionA,
    opcionB,
    opcionC,
    respuestaCorrecta,
    explicacion: explicacion || null,
    dificultad,
    esBorrador: false,
  });

  revalidarPreguntas();
  return { success: true };
}

export async function actualizarPregunta(
  _previousState: PreguntaActionState,
  formData: FormData
): Promise<PreguntaActionState> {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const subareaId = Number(formData.get('subareaId'));
  const enunciado = String(formData.get('enunciado') ?? '').trim();
  const opcionA = String(formData.get('opcionA') ?? '').trim();
  const opcionB = String(formData.get('opcionB') ?? '').trim();
  const opcionC = String(formData.get('opcionC') ?? '').trim();
  const respuestaCorrecta = String(formData.get('respuestaCorrecta') ?? '');
  const explicacion = String(formData.get('explicacion') ?? '').trim();
  const dificultad = String(formData.get('dificultad') ?? 'media');

  if (
    !Number.isInteger(id) ||
    id < 1 ||
    !Number.isInteger(subareaId) ||
    subareaId < 1 ||
    !enunciado ||
    !opcionA ||
    !opcionB ||
    !opcionC
  ) {
    return { error: 'Completa todos los campos obligatorios.' };
  }

  if (!['A', 'B', 'C'].includes(respuestaCorrecta)) {
    return { error: 'La respuesta correcta debe ser A, B o C.' };
  }

  if (!['facil', 'media', 'dificil'].includes(dificultad)) {
    return { error: 'La dificultad seleccionada no es válida.' };
  }

  const resultado = await db
    .update(preguntas)
    .set({
      subareaId,
      enunciado,
      opcionA,
      opcionB,
      opcionC,
      respuestaCorrecta,
      explicacion: explicacion || null,
      dificultad,
    })
    .where(eq(preguntas.id, id))
    .returning({ id: preguntas.id });

  if (resultado.length === 0) {
    return { error: 'No se encontró la pregunta que intentas editar.' };
  }

  revalidarPreguntas();
  return { success: true };
}

export async function eliminarPregunta(id: number): Promise<PreguntaActionState> {
  await requireAdmin();

  if (!Number.isInteger(id) || id < 1) {
    return { error: 'El identificador de la pregunta no es válido.' };
  }

  const resultado = await db
    .delete(preguntas)
    .where(eq(preguntas.id, id))
    .returning({ id: preguntas.id });

  if (resultado.length === 0) {
    return { error: 'No se encontró la pregunta que intentas eliminar.' };
  }

  revalidarPreguntas();
  return { success: true };
}