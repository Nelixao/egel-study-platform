'use server';

import { db } from '@/db';
import { preguntas } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function crearPregunta(formData: FormData) {
  const subareaId = Number(formData.get('subareaId'));
  const enunciado = formData.get('enunciado') as string;
  const opcionA = formData.get('opcionA') as string;
  const opcionB = formData.get('opcionB') as string;
  const opcionC = formData.get('opcionC') as string;
  const respuestaCorrecta = formData.get('respuestaCorrecta') as string;
  const explicacion = formData.get('explicacion') as string;
  const dificultad = formData.get('dificultad') as string;

  // Validación mínima
  if (!subareaId || !enunciado || !opcionA || !opcionB || !opcionC) {
    return { error: 'Faltan campos obligatorios' };
  }

  if (!['A', 'B', 'C'].includes(respuestaCorrecta)) {
    return { error: 'La respuesta correcta debe ser A, B o C' };
  }

  await db.insert(preguntas).values({
    subareaId,
    enunciado,
    opcionA,
    opcionB,
    opcionC,
    respuestaCorrecta,
    explicacion: explicacion || null,
    dificultad: dificultad || 'media',
    esBorrador: false,
  });

  revalidatePath('/admin/preguntas');
  return { success: true };
}