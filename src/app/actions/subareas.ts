'use server';

import { db } from '@/db';
import { subareas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function actualizarVideoSubarea(formData: FormData) {
  const subareaId = Number(formData.get('subareaId'));
  const videoUrl = (formData.get('videoUrl') as string) || null;

  if (!subareaId) {
    return { error: 'Falta el ID de la subárea' };
  }

  await db
    .update(subareas)
    .set({ videoUrl: videoUrl?.trim() || null })
    .where(eq(subareas.id, subareaId));

  revalidatePath(`/admin/videos`);
  return { success: true };
}