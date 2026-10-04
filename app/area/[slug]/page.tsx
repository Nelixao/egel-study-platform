import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAreaPorSlug } from '@/lib/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const resultado = await getAreaPorSlug(slug);

  if (!resultado) notFound();

  const { area, subareas, seccion } = resultado;

  return (
    <main className="min-h-screen bg-[#F2F2F7]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <Link
            href="/"
            className="text-sm text-[#007AFF] mb-3 inline-block"
          >
            ← Inicio
          </Link>
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide">
            {seccion?.nombre}
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight mt-1">
            {area.nombre}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-medium bg-[#007AFF]/10 text-[#007AFF] px-3 py-1 rounded-full">
              {area.totalReactivos} reactivos
            </span>
            <span className="text-sm text-[#8E8E93]">
              {subareas.length} subáreas
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Descripción */}
        {area.descripcion && (
          <section className="bg-white rounded-[20px] p-6">
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
              Descripción
            </h2>
            <p className="text-black leading-relaxed">
              {area.descripcion}
            </p>
          </section>
        )}

        {/* Subáreas con temas */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-black px-1">
            Subáreas y temas
          </h2>

          {subareas.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-[20px] overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-lg">
                      {sub.nombre}
                    </h3>
                    {sub.descripcion && (
                      <p className="text-sm text-[#8E8E93] mt-1 leading-relaxed">
                        {sub.descripcion}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-medium bg-[#F2F2F7] text-[#8E8E93] px-2.5 py-1 rounded-full whitespace-nowrap">
                    {sub.totalReactivos} reactivos
                  </span>
                </div>
              </div>

              {sub.temas && (
                <div className="px-6 py-4">
                  <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
                    Temas
                  </p>
                  <ul className="space-y-2">
                    {sub.temas.split('\n').map((tema, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-black"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] mt-2 flex-shrink-0" />
                        <span className="leading-snug">{tema}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="px-6 py-4 bg-[#F2F2F7]/50">
                <Link
                  href={`/subarea/${sub.slug}`}
                  className="text-sm font-semibold text-[#007AFF] hover:underline"
                >
                  Ver preguntas de esta subárea →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}