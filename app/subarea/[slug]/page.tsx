import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '@/db';
import { subareas, areas, preguntas, lecciones } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import VideoEmbed from '@/components/VideoEmbed';

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

  const [area] = await db
    .select()
    .from(areas)
    .where(eq(areas.id, subarea.areaId))
    .limit(1);

  const leccionesDeSubarea = await db
    .select()
    .from(lecciones)
    .where(eq(lecciones.subareaId, subarea.id))
    .orderBy(asc(lecciones.orden), asc(lecciones.id));

  const preguntasDeSubarea = await db
    .select()
    .from(preguntas)
    .where(eq(preguntas.subareaId, subarea.id))
    .orderBy(asc(preguntas.id));

  return (
    <main className="bg-ios-canvas">
      {/* Hero con gradiente */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 pt-8 pb-12">
          <Link
            href={area ? `/area/${area.slug}` : '/'}
            className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white mb-6 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md tap-scale"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {area?.nombre || 'Inicio'}
          </Link>

          <p className="text-xs font-semibold text-white/70 uppercase tracking-[0.15em]">
            {area?.nombre}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">
            {subarea.nombre}
          </h1>
          {subarea.descripcion && (
            <p className="text-white/85 mt-3 leading-relaxed max-w-2xl">
              {subarea.descripcion}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="text-xs font-semibold bg-white/20 text-white backdrop-blur-md px-3 py-1.5 rounded-full">
              📚 {leccionesDeSubarea.length} {leccionesDeSubarea.length === 1 ? 'lección' : 'lecciones'}
            </span>
            <span className="text-xs font-semibold bg-white/20 text-white backdrop-blur-md px-3 py-1.5 rounded-full">
              ✏️ {preguntasDeSubarea.length} {preguntasDeSubarea.length === 1 ? 'pregunta' : 'preguntas'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 -mt-6 pb-16 space-y-5 relative z-10">
        {/* Índice de contenidos */}
        {leccionesDeSubarea.length > 0 && (
          <section className="glass-card-strong rounded-[22px] p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                En esta lección
              </p>

            </div>
            {/* Video explicativo */}
            {subarea.videoUrl && (
              <VideoEmbed url={subarea.videoUrl} titulo={`Video: ${subarea.nombre}`} />
            )}
            <ul className="space-y-1">
              {leccionesDeSubarea.map((l, i) => (
                <li key={l.id}>
                  <a
                    href={`#leccion-${l.id}`}
                    className="group flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-[#007AFF]/5 transition-colors"
                  >
                    <span className="text-xs font-mono text-[#007AFF] bg-[#007AFF]/10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-black group-hover:text-[#007AFF] transition-colors pt-1 font-medium">
                      {l.titulo}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sin lecciones */}
        {leccionesDeSubarea.length === 0 && (
          <div className="glass-card-strong rounded-[22px] p-10 text-center animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-[#8E8E93]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-[#8E8E93] font-medium">
              Aún no hay lecciones para esta subárea
            </p>
            <Link
              href="/admin/lecciones"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#007AFF] hover:underline"
            >
              Agregar la primera lección →
            </Link>
          </div>
        )}

        {/* Lecciones */}
        {leccionesDeSubarea.map((l, idx) => (
          <article
            key={l.id}
            id={`leccion-${l.id}`}
            className="glass-card-strong rounded-[22px] overflow-hidden scroll-mt-20 animate-slide-up"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="px-6 md:px-8 pt-6 md:pt-7 pb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-semibold text-[#007AFF] bg-[#007AFF]/10 px-2.5 py-1 rounded-md">
                  Lección {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                {l.titulo}
              </h2>
            </div>

            <div className="px-6 md:px-8 py-6 prose prose-slate max-w-none
              prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-black
              prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4
              prose-h2:text-xl prose-h2:mt-7 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-black/5
              prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-[#007AFF]
              prose-p:leading-relaxed prose-p:text-black/80 prose-p:my-3
              prose-strong:text-black prose-strong:font-semibold
              prose-code:bg-[#F2F2F7] prose-code:text-[#5856D6] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#1C1C1E] prose-pre:rounded-2xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:shadow-lg
              prose-ul:my-4 prose-ul:pl-5 prose-li:my-1.5 prose-li:text-black/80 prose-li:marker:text-[#007AFF]
              prose-ol:my-4 prose-ol:pl-5
              prose-blockquote:border-l-4 prose-blockquote:border-[#007AFF] prose-blockquote:bg-[#007AFF]/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-black/80 prose-blockquote:font-normal
              prose-table:my-5 prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm prose-table:border prose-table:border-black/5
              prose-thead:bg-[#F2F2F7] prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-black
              prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-black/80 prose-td:border-t prose-td:border-black/5
              prose-hr:my-6 prose-hr:border-black/10
              prose-a:text-[#007AFF] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {l.contenido}
              </ReactMarkdown>
            </div>
          </article>
        ))}

        {/* Sección de práctica */}
        <section className="relative overflow-hidden rounded-[22px] p-6 md:p-8 text-white animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_60%)]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Práctica
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Pon a prueba lo aprendido
            </h2>
            <p className="text-white/85 text-sm mb-6 max-w-md">
              {preguntasDeSubarea.length} {preguntasDeSubarea.length === 1 ? 'pregunta disponible' : 'preguntas disponibles'} de esta subárea. Se seleccionarán al azar cada vez.
            </p>

            <Link
              href={`/simulador?subareas=${subarea.id}`}
              className="inline-flex items-center gap-2 bg-white text-[#007AFF] font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/95 tap-scale shadow-lg shadow-black/10"
            >
              Iniciar práctica
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Preguntas disponibles */}
        {preguntasDeSubarea.length > 0 && (
          <section className="glass-card-strong rounded-[22px] overflow-hidden animate-slide-up">
            <div className="px-6 pt-5 pb-3 border-b border-black/[0.04] flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#5856D6]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#5856D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                Preguntas del banco
              </p>
            </div>





          </section>
        )}
      </div>
    </main>
  );
}