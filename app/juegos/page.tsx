import Link from 'next/link';
import { and, asc, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { areas, preguntas, secciones, subareas } from '@/db/schema';

export default async function JuegosPage() {
  const subareasConPreguntas = await db
    .select({
      id: subareas.id,
      slug: subareas.slug,
      nombre: subareas.nombre,
      areaId: areas.id,
      areaNombre: areas.nombre,
      areaSlug: areas.slug,
      seccionNombre: secciones.nombre,
      preguntas: count(preguntas.id),
    })
    .from(subareas)
    .innerJoin(areas, eq(subareas.areaId, areas.id))
    .innerJoin(secciones, eq(areas.seccionId, secciones.id))
    .leftJoin(
      preguntas,
      and(
        eq(preguntas.subareaId, subareas.id),
        eq(preguntas.esBorrador, false)
      )
    )
    .groupBy(
      subareas.id,
      areas.id,
      areas.nombre,
      areas.slug,
      areas.orden,
      secciones.id,
      secciones.nombre
    )
    .orderBy(asc(secciones.id), asc(areas.orden), asc(subareas.id));

  const porArea = new Map<
    number,
    {
      id: number;
      nombre: string;
      slug: string;
      seccion: string;
      subareas: typeof subareasConPreguntas;
    }
  >();

  for (const subarea of subareasConPreguntas) {
    const grupo = porArea.get(subarea.areaId) ?? {
      id: subarea.areaId,
      nombre: subarea.areaNombre,
      slug: subarea.areaSlug,
      seccion: subarea.seccionNombre,
      subareas: [],
    };
    grupo.subareas.push(subarea);
    porArea.set(subarea.areaId, grupo);
  }

  const grupos = Array.from(porArea.values());
  const cantidadDisponibles = subareasConPreguntas.filter(
    (subarea) => subarea.preguntas > 0
  ).length;

  return (
    <main className="bg-ios-canvas-v2 min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-7 md:py-16 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
            Laboratorio de práctica
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            ¿Qué quieres reforzar?
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            Elige una subárea para jugar con sus reactivos y conceptos.
          </p>
          <p className="mt-5 text-xs font-medium text-slate-500">
            {cantidadDisponibles} subáreas con preguntas aprobadas
          </p>
        </header>

        <div className="space-y-10">
          {grupos.map((grupo) => (
            <section key={grupo.id} aria-labelledby={`area-${grupo.slug}`}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-white/[0.08] pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {grupo.seccion}
                  </p>
                  <h2 id={`area-${grupo.slug}`} className="mt-1 text-lg font-semibold text-slate-100">
                    {grupo.nombre}
                  </h2>
                </div>
                <span className="text-xs tabular-nums text-slate-500">
                  {grupo.subareas.length} subáreas
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grupo.subareas.map((subarea) => {
                  const contenido = (
                    <>
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-base font-semibold leading-snug text-slate-100">
                          {subarea.nombre}
                        </span>
                        {subarea.preguntas > 0 && (
                          <svg aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                          </svg>
                        )}
                      </span>
                      <span className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <span className={`h-2 w-2 rounded-full ${subarea.preguntas > 0 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        {subarea.preguntas > 0
                          ? `${subarea.preguntas} ${subarea.preguntas === 1 ? 'reactivo aprobado' : 'reactivos aprobados'}`
                          : 'Sin reactivos aprobados'}
                      </span>
                    </>
                  );

                  return subarea.preguntas > 0 ? (
                    <Link
                      key={subarea.slug}
                      href={`/juegos/${subarea.slug}`}
                      className="glass-card group flex min-h-32 flex-col rounded-2xl p-5 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[0.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                    >
                      {contenido}
                    </Link>
                  ) : (
                    <div key={subarea.slug} aria-disabled="true" className="glass-card flex min-h-32 flex-col rounded-2xl p-5 opacity-60">
                      {contenido}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {grupos.length === 0 && (
          <p className="glass-card rounded-2xl p-6 text-sm text-slate-400">
            No hay subáreas disponibles todavía.
          </p>
        )}
      </div>
    </main>
  );
}