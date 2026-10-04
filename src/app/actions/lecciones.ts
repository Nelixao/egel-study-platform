'use server';

import { db } from '@/db';
import { lecciones } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function crearLeccion(formData: FormData) {
  const subareaId = Number(formData.get('subareaId'));
  const titulo = formData.get('titulo') as string;
  const contenido = formData.get('contenido') as string;
  const orden = Number(formData.get('orden') || 0);

  if (!subareaId || !titulo || !contenido) {
    return { error: 'Faltan campos obligatorios' };
  }

  await db.insert(lecciones).values({
    subareaId,
    titulo,
    contenido,
    orden,
  });

  revalidatePath('/admin/lecciones');
  return { success: true };
}

export async function eliminarLeccion(id: number) {
  await db.delete(lecciones).where(eq(lecciones.id, id));
  revalidatePath('/admin/lecciones');
  return { success: true };
}