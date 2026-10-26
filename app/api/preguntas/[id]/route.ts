import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { preguntas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    throw error;
  }

  const { id } = await params;
  const preguntaId = Number(id);

  if (!Number.isInteger(preguntaId) || preguntaId < 1) {
    return NextResponse.json({ error: 'ID de pregunta no válido' }, { status: 400 });
  }

  const resultado = await db
    .delete(preguntas)
    .where(eq(preguntas.id, preguntaId))
    .returning({ id: preguntas.id });

  if (resultado.length === 0) {
    return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 });
  }

  revalidatePath('/admin/preguntas');
  revalidatePath('/admin/borradores');
  revalidatePath('/subarea/[slug]', 'page');
  revalidatePath('/banco');
  revalidatePath('/banco/[slug]', 'page');
  revalidatePath('/simulador');
  revalidatePath('/repasar');

  return NextResponse.json({ success: true });
}
