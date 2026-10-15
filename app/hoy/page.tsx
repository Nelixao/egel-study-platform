import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { subareas } from '@/db/schema';
import HoyDashboard from './HoyDashboard';

export const metadata = {
  title: 'Hoy — EGEL ICOMPU',
};

export default async function HoyPage() {
  const todasSubareas = await db
    .select({ slug: subareas.slug, nombre: subareas.nombre })
    .from(subareas)
    .orderBy(asc(subareas.id));

  return <HoyDashboard subareas={todasSubareas} />;
}
