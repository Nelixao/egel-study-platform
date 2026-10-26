'use server';

import { db } from '@/db';
import { lecciones } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export async function crearLeccion(formData: FormData) {
  await requireAdmin();

  const subareaId = Number(formData.get('subareaId'));
  const titulo = String(formData.get('titulo') ?? '').trim();
  const contenido = String(formData.get('contenido') ?? '').trim();
  const orden = Number(formData.get('orden') || 0);

  if (!Number.isInteger(subareaId) || subareaId < 1 || !titulo || !contenido || !Number.isInteger(orden)) {
    return { error: 'Faltan campos obligatorios' };
  }

  await db.insert(lecciones).values({
    subareaId,
    titulo,
    contenido,
    orden,
  });

  revalidatePath('/admin/lecciones');
  revalidatePath('/subarea/[slug]', 'page');
  return { success: true };
}

export async function eliminarLeccion(id: number) {
  await requireAdmin();

  if (!Number.isInteger(id) || id < 1) {
    return { error: 'El identificador de la lección no es válido' };
  }

  const [leccion] = await db
    .select({ id: lecciones.id })
    .from(lecciones)
    .where(eq(lecciones.id, id))
    .limit(1);

  if (!leccion) {
    return { error: 'No se encontró la lección' };
  }

  await db.delete(lecciones).where(eq(lecciones.id, id));
  revalidatePath('/admin/lecciones');
  revalidatePath('/subarea/[slug]', 'page');
  return { success: true };
}
export async function actualizarLeccion(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const subareaId = Number(formData.get('subareaId'));
  const titulo = String(formData.get('titulo') ?? '').trim();
  const contenido = String(formData.get('contenido') ?? '').trim();
  const orden = Number(formData.get('orden') || 0);

  if (
    !Number.isInteger(id) ||
    id < 1 ||
    !Number.isInteger(subareaId) ||
    subareaId < 1 ||
    !titulo ||
    !contenido ||
    !Number.isInteger(orden)
  ) {
    return { error: 'Faltan campos obligatorios' };
  }

  const resultado = await db
    .update(lecciones)
    .set({ subareaId, titulo, contenido, orden })
    .where(eq(lecciones.id, id))
    .returning({ id: lecciones.id });

  if (resultado.length === 0) {
    return { error: 'No se encontró la lección' };
  }

  revalidatePath('/admin/lecciones');
  revalidatePath('/admin/lecciones/' + id + '/editar');
  revalidatePath('/subarea/[slug]', 'page');
  return { success: true };
}