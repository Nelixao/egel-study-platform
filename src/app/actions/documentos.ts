'use server';

import { db } from '@/db';
import { documentos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function actualizarDocumento(formData: FormData) {
  const id = Number(formData.get('id'));
  const titulo = formData.get('titulo') as string;
  const autor = (formData.get('autor') as string) || null;
  const areaId = formData.get('areaId') as string | null;

  if (!id || !titulo) {
    return { error: 'Faltan campos obligatorios' };
  }

  await db
    .update(documentos)
    .set({
      titulo,
      autor,
      areaId: areaId ? Number(areaId) : null,
    })
    .where(eq(documentos.id, id));

  revalidatePath('/biblioteca');
  revalidatePath('/biblioteca/' + id);
  return { success: true };
}