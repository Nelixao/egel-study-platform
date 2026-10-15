'use server';

import { db } from '@/db';
import { lecciones } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export async function crearLeccion(formData: FormData) {
  await requireAdmin();

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
  await requireAdmin();

  await db.delete(lecciones).where(eq(lecciones.id, id));
  revalidatePath('/admin/lecciones');
  return { success: true };
}
export async function actualizarLeccion(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const subareaId = Number(formData.get('subareaId'));
  const titulo = formData.get('titulo') as string;
  const contenido = formData.get('contenido') as string;
  const orden = Number(formData.get('orden') || 0);

  if (!id || !subareaId || !titulo || !contenido) {
    return { error: 'Faltan campos obligatorios' };
  }

  await db
    .update(lecciones)
    .set({ subareaId, titulo, contenido, orden })
    .where(eq(lecciones.id, id));

  revalidatePath('/admin/lecciones');
  revalidatePath('/admin/lecciones/' + id + '/editar');
  return { success: true };
}