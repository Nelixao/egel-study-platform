import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { subareas } from '@/db/schema';
import BancoSubareaRedirect from './BancoSubareaRedirect';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BancoSubareaPage({ params }: Props) {
  const { slug } = await params;
  const [subarea] = await db
    .select({ id: subareas.id })
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) notFound();

  return <BancoSubareaRedirect subareaId={subarea.id} />;
}
