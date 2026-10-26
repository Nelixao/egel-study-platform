export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/db';
import { secciones, areas, subareas } from '@/db/schema';
import { asc } from 'drizzle-orm';
import SimuladorForm from './SimuladorForm';

export default async function SimuladorPage() {
  const todasSecciones = await db
    .select()
    .from(secciones)
    .orderBy(asc(secciones.id));
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
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#007AFF] hover:underline mb-3"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Zona de Práctica
          </h1>
          <p className="text-sm text-black/50 mt-1">
            Elige entre practicar con feedback inmediato o simular un examen cronometrado.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <SimuladorForm estructura={estructura} />
      </div>
    </main>
  );
}