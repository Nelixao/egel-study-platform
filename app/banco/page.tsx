import Link from 'next/link';
import { db } from '@/db';
import { subareas, areas, preguntas } from '@/db/schema';
import { eq, and, asc, sql } from 'drizzle-orm';

export const metadata = {
  title: 'Banco de preguntas — EGEL ICOMPU',
};

export default async function BancoPage() {
  const subareasConPreguntas = await db
    .select({
      id: subareas.id,
      nombre: subareas.nombre,
      slug: subareas.slug,
      areaNombre: areas.nombre,
      areaSlug: areas.slug,
      areaOrden: areas.orden,
      total: sql<number>`count(${preguntas.id})::int`,
    })
    .from(subareas)
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .leftJoin(
      preguntas,
      and(
        eq(preguntas.subareaId, subareas.id),
        eq(preguntas.esBorrador, false)
      )
    )
    .groupBy(
      subareas.id,
      subareas.nombre,
      subareas.slug,
      areas.nombre,
      areas.slug,
      areas.orden
    )
    .orderBy(asc(areas.orden), asc(subareas.id));

  const totalGeneral = subareasConPreguntas.reduce(
    (acc, s) => acc + s.total,
    0
  );

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-2">
            Banco de preguntas
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Preguntas disponibles
          </h1>
          <p className="text-sm text-black/60 mt-2">
            {totalGeneral} preguntas en el banco
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="glass-card-strong rounded-[20px] overflow-hidden">
          <ul className="divide-y divide-black/5">
            {subareasConPreguntas.map((sub) => {
              const tienePreguntas = sub.total > 0;

              if (tienePreguntas) {
                return (
                  <li key={sub.id}>
                    <Link
                      href={`/banco/${sub.slug}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-black/[0.03] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {sub.nombre}
                        </p>
                        <p className="text-xs text-black/50 mt-0.5">
                          {sub.areaNombre}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#007AFF]/10 text-[#007AFF]">
                        {sub.total}
                      </span>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={sub.id}>
                  <div className="flex items-center justify-between px-5 py-4 opacity-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {sub.nombre}
                      </p>
                      <p className="text-xs text-black/50 mt-0.5">
                        {sub.areaNombre}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-black/5 text-black/40">
                      {sub.total}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}