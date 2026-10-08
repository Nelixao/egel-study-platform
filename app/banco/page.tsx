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

  const conContenido = subareasConPreguntas.filter((s) => s.total > 0);

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
            {totalGeneral} {totalGeneral === 1 ? 'pregunta' : 'preguntas'} en{' '}
            {conContenido.length} {conContenido.length === 1 ? 'subárea' : 'subáreas'}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="glass-card-strong rounded-[22px] overflow-hidden">
          <ul className="divide-y divide-black/[0.05]">
            {subareasConPreguntas.map((sub) => {
              const tienePreguntas = sub.total > 0;

              if (tienePreguntas) {
                return (
                  <li key={sub.id}>
                    <Link
                      href={`/banco/${sub.slug}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.03] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#007AFF]/15 transition-colors">
                        <svg
                          className="w-5 h-5 text-[#007AFF]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black truncate">
                          {sub.nombre}
                        </p>
                        <p className="text-xs text-black/50 mt-0.5 truncate">
                          {sub.areaNombre}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-semibold bg-[#007AFF]/10 text-[#007AFF] px-2.5 py-1 rounded-md">
                          {sub.total}
                        </span>
                        <svg
                          className="w-4 h-4 text-black/20 group-hover:text-[#007AFF] group-hover:translate-x-0.5 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={sub.id}>
                  <div className="flex items-center gap-4 px-5 py-4 opacity-40">
                    <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-black/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {sub.nombre}
                      </p>
                      <p className="text-xs text-black/50 mt-0.5 truncate">
                        {sub.areaNombre}
                      </p>
                    </div>
                    <span className="text-xs font-semibold bg-black/5 text-black/40 px-2.5 py-1 rounded-md">
                      0
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs text-[#8E8E93] text-center mt-6">
          {subareasConPreguntas.length - conContenido.length} subáreas aún sin preguntas aprobadas
        </p>
      </div>
    </main>
  );
}