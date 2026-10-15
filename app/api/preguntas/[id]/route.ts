import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { preguntas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth-guard';

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

  await db.delete(preguntas).where(eq(preguntas.id, Number(id)));

  return NextResponse.json({ success: true });
}
