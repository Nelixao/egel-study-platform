import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { preguntas } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db
    .update(preguntas)
    .set({ esBorrador: false })
    .where(eq(preguntas.id, Number(id)));

  return NextResponse.json({ success: true });
}
