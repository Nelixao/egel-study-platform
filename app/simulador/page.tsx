import Link from 'next/link';
import { db } from '@/db';
import { secciones, areas, subareas } from '@/db/schema';
import { asc } from 'drizzle-orm';
import SimuladorForm from './SimuladorForm';

export default async function SimuladorPage() {
  const todasSecciones = await db.select().from(secciones).orderBy(asc(secciones.id));
  const todasAreas = await db.select().from(areas).orderBy(asc(areas.orden));
  const todasSubareas = await db.select().from(subareas);

  const estructura = todasSecciones.map((s) => ({
    ...s,
    areas: todasAreas
      .filter((a) => a.seccionId === s.id)
      .map((a) => ({
        ...a,
        subareas: todasSubareas.filter((sub) => sub.areaId === a.id),
      })),
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-3 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Simulador</h1>
          <p className="text-slate-600 mt-1">
            Configura tu examen de práctica
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <SimuladorForm estructura={estructura} />
      </div>
    </main>
  );
}