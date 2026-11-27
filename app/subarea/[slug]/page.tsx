import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { areas, lecciones, subareas } from '@/db/schema';
import VideoEmbed from '@/components/VideoEmbed';
import LeccionesIndice from './LeccionesIndice';
import PracticarSubareaLink from './PracticarSubareaLink';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SubareaPage({ params }: Props) {
  const { slug } = await params;
  const [subarea] = await db
    .select()
    .from(subareas)
    .where(eq(subareas.slug, slug))
    .limit(1);

  if (!subarea) notFound();

  const [area] = subarea.areaId
    ? await db
        .select()
        .from(areas)
        .where(eq(areas.id, subarea.areaId))
        .limit(1)
    : [null];

  const leccionesDeSubarea = await db
    .select({
      id: lecciones.id,
      titulo: lecciones.titulo,
    })
    .from(lecciones)
    .where(eq(lecciones.subareaId, subarea.id))
    .orderBy(asc(lecciones.orden), asc(lecciones.id));

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-8 sm:px-6">
          <Link
            href={area ? `/area/${area.slug}` : '/'}
            className="mb-6 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/15 px-3 text-sm text-white/90 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {area?.nombre || 'Inicio'}
          </Link>

          {area?.nombre && (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
              {area.nombre}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {subarea.nombre}
          </h1>
          {subarea.descripcion && (
            <p className="mt-3 max-w-2xl leading-relaxed text-white/85">
              {subarea.descripcion}
            </p>
          )}
          {subarea.temas && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
              {subarea.temas}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              {leccionesDeSubarea.length}{' '}
              {leccionesDeSubarea.length === 1 ? 'lección' : 'lecciones'}
            </span>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-6 max-w-3xl space-y-5 px-4 pb-16 sm:px-6">
        {subarea.videoUrl && (
          <section className="glass-card-strong rounded-[22px] p-4 sm:p-5">
            <VideoEmbed
              url={subarea.videoUrl}
              titulo={`Video: ${subarea.nombre}`}
            />
          </section>
        )}

        {leccionesDeSubarea.length > 0 ? (
          <LeccionesIndice slug={subarea.slug} lecciones={leccionesDeSubarea} />
        ) : (
          <section className="glass-card-strong rounded-[22px] p-8 text-center sm:p-10">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-cyan-300/10 text-cyan-200">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Aún no hay lecciones
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Cuando estén disponibles, aparecerán aquí para que puedas avanzar
              a tu ritmo.
            </p>
          </section>
        )}

        <section className="relative overflow-hidden rounded-[22px] p-6 text-white sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_60%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/75">
              Repaso activo
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Pon a prueba lo aprendido
            </h2>
            <p className="mb-6 mt-2 max-w-md text-sm leading-relaxed text-white/85">
              Practica las preguntas relacionadas con esta subárea.
            </p>
            <PracticarSubareaLink subareaId={subarea.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
