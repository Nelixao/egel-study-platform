import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { subareas } from '@/db/schema';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BancoSubareaPage({ params }: Props): Promise<never> {
  const { slug } = await params;
  const [subarea] = await db
    .select({ id: subareas.id })
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) notFound();

  redirect(`/simulador?subareas=${subarea.id}`);
}
