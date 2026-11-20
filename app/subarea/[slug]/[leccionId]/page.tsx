import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { lecciones, subareas } from '@/db/schema';
import LectorLeccion from './LectorLeccion';

type Props = {
  params: Promise<{ slug: string; leccionId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, leccionId: rawId } = await params;
  const leccionId = Number(rawId);

  if (!Number.isSafeInteger(leccionId) || leccionId < 1) {
    return { title: 'Lección no encontrada' };
  }

  const [resultado] = await db
    .select({ titulo: lecciones.titulo })
    .from(lecciones)
    .innerJoin(subareas, eq(lecciones.subareaId, subareas.id))
    .where(and(eq(lecciones.id, leccionId), eq(subareas.slug, slug)))
    .limit(1);

  return resultado
    ? { title: `${resultado.titulo} | EGEL ICOMPU` }
    : { title: 'Lección no encontrada' };
}

export default async function LeccionPage({ params }: Props) {
  const { slug, leccionId: rawId } = await params;
  const leccionId = Number(rawId);

  if (!Number.isSafeInteger(leccionId) || leccionId < 1) notFound();

  const [subarea] = await db
    .select({
      id: subareas.id,
      slug: subareas.slug,
      nombre: subareas.nombre,
    })
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) notFound();

  const leccionesSubarea = await db
    .select({
      id: lecciones.id,
      titulo: lecciones.titulo,
      orden: lecciones.orden,
    })
    .from(lecciones)
    .where(eq(lecciones.subareaId, subarea.id))
    .orderBy(asc(lecciones.orden), asc(lecciones.id));

  const indice = leccionesSubarea.findIndex(
    (leccion) => leccion.id === leccionId
  );
  if (indice < 0) notFound();

  const [contenido] = await db
    .select({ contenido: lecciones.contenido })
    .from(lecciones)
    .where(
      and(
        eq(lecciones.id, leccionId),
        eq(lecciones.subareaId, subarea.id)
      )
    )
    .limit(1);

  if (!contenido) notFound();

  const session = await auth();
  const administradorEmail = process.env.ADMIN_EMAIL;
  const esAdministrador = Boolean(
    administradorEmail &&
      session?.user?.email &&
      session.user.email === administradorEmail
  );
  const leccionActual = leccionesSubarea[indice];
  const siguienteLeccion = leccionesSubarea[indice + 1];

  return (
    <LectorLeccion
      slug={subarea.slug}
      subareaNombre={subarea.nombre}
      leccionId={leccionActual.id}
      titulo={leccionActual.titulo}
      contenido={contenido.contenido}
      numero={indice + 1}
      total={leccionesSubarea.length}
      siguienteId={siguienteLeccion?.id ?? null}
      esAdministrador={esAdministrador}
    />
  );
}
