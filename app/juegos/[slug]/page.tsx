import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { areas, subareas } from '@/db/schema';
import JuegoSubarea from './JuegoSubarea';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function JuegoPorSubareaPage({ params }: Props) {
  const { slug } = await params;
  const [resultado] = await db
    .select({
      nombre: subareas.nombre,
      slug: subareas.slug,
      areaNombre: areas.nombre,
    })
    .from(subareas)
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!resultado) notFound();

  return (
    <JuegoSubarea
      slug={resultado.slug}
      nombre={resultado.nombre}
      area={resultado.areaNombre ?? 'Subárea'}
    />
  );
}