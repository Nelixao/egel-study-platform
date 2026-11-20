import { NextRequest, NextResponse } from 'next/server';
import { asc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { lecciones, subareas } from '@/db/schema';

function normalizarTermino(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es');
}

function escaparPatron(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

export async function GET(request: NextRequest) {
  const termino = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (!termino) {
    return NextResponse.json({ results: [] });
  }

  if (termino.length > 100) {
    return NextResponse.json(
      { error: 'El término de búsqueda no puede superar 100 caracteres.' },
      { status: 400 }
    );
  }

  const terminoNormalizado = normalizarTermino(termino);
  if (!terminoNormalizado) {
    return NextResponse.json({ results: [] });
  }

  const patron = `%${escaparPatron(terminoNormalizado)}%`;
  const tituloNormalizado = sql`translate(lower(${lecciones.titulo}), 'áéíóúüñàèìòùäëïöüâêîôûçý', 'aeiouunaeiouaeiouaeioucy')`;
  const contenidoNormalizado = sql`translate(lower(${lecciones.contenido}), 'áéíóúüñàèìòùäëïöüâêîôûçý', 'aeiouunaeiouaeiouaeioucy')`;

  const results = await db
    .select({
      id: lecciones.id,
      titulo: lecciones.titulo,
      contenido: lecciones.contenido,
      subareaNombre: subareas.nombre,
      subareaSlug: subareas.slug,
    })
    .from(lecciones)
    .innerJoin(subareas, eq(lecciones.subareaId, subareas.id))
    .where(
      sql`(${tituloNormalizado} ILIKE ${patron} OR ${contenidoNormalizado} ILIKE ${patron})`
    )
    .orderBy(asc(lecciones.id))
    .limit(20);

  return NextResponse.json({ results });
}
