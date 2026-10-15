import { NextResponse } from 'next/server';
import { db } from '@/db';
import { preguntas, subareas, areas } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth-guard';

export async function GET() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    throw error;
  }

  const borradores = await db
    .select({
      id: preguntas.id,
      enunciado: preguntas.enunciado,
      opcionA: preguntas.opcionA,
      opcionB: preguntas.opcionB,
      opcionC: preguntas.opcionC,
      respuestaCorrecta: preguntas.respuestaCorrecta,
      explicacion: preguntas.explicacion,
      documentoId: preguntas.documentoId,
      subareaNombre: subareas.nombre,
      areaNombre: areas.nombre,
    })
    .from(preguntas)
    .leftJoin(subareas, eq(preguntas.subareaId, subareas.id))
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .where(eq(preguntas.esBorrador, true))
    .orderBy(desc(preguntas.id));

  return NextResponse.json({ borradores });
}