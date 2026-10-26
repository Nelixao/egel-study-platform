'use server';

import { db } from '@/db';
import { subareas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export async function actualizarVideoSubarea(formData: FormData) {
  await requireAdmin();

  const subareaId = Number(formData.get('subareaId'));
  const videoUrl = String(formData.get('videoUrl') ?? '').trim();

  if (!Number.isInteger(subareaId) || subareaId < 1) {
    return { error: 'Falta el ID de la subárea' };
  }

  const resultado = await db
    .update(subareas)
    .set({ videoUrl: videoUrl || null })
    .where(eq(subareas.id, subareaId))
    .returning({ id: subareas.id });

  if (resultado.length === 0) {
    return { error: 'No se encontró la subárea' };
  }

  revalidatePath(`/admin/videos`);
  revalidatePath('/subarea/[slug]', 'page');
  return { success: true };
}

export async function eliminarVideoSubarea(subareaId: number) {
  await requireAdmin();

  if (!Number.isInteger(subareaId) || subareaId < 1) {
    return { error: 'El identificador de la subárea no es válido' };
  }

  const resultado = await db
    .update(subareas)
    .set({ videoUrl: null })
    .where(eq(subareas.id, subareaId))
    .returning({ id: subareas.id });

  if (resultado.length === 0) {
    return { error: 'No se encontró la subárea' };
  }

  revalidatePath('/admin/videos');
  revalidatePath('/subarea/[slug]', 'page');
  return { success: true };
}