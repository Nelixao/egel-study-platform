import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSubareaPorSlug } from '@/lib/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SubareaPage({ params }: Props) {
  const { slug } = await params;
  const resultado = await getSubareaPorSlug(slug);

  if (!resultado) {
    notFound();
  }

  const { subarea, area, preguntas } = resultado;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline mb-3 inline-block"
          >
            ← Volver al inicio
          </Link>
          <p className="text-sm text-slate-500">{area?.nombre}</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            {subarea.nombre}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {preguntas.length} {preguntas.length === 1 ? 'pregunta' : 'preguntas'} en el banco
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {preguntas.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-slate-500">
              Aún no hay preguntas en esta subárea.
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Cuando agregues preguntas, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {preguntas.map((p, i) => (
              <article
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    Pregunta {i + 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    Dificultad: {p.dificultad}
                  </span>
                </div>
                <p className="text-slate-800 font-medium mb-4">{p.enunciado}</p>
                <ul className="space-y-2">
                  {[
                    { letra: 'A', texto: p.opcionA },
                    { letra: 'B', texto: p.opcionB },
                    { letra: 'C', texto: p.opcionC },
                  ].map((op) => (
                    <li
                      key={op.letra}
                      className={`flex gap-3 p-3 rounded-lg border ${
                        op.letra === p.respuestaCorrecta
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="font-semibold text-slate-700">
                        {op.letra})
                      </span>
                      <span className="text-slate-700">{op.texto}</span>
                      {op.letra === p.respuestaCorrecta && (
                        <span className="ml-auto text-xs text-green-700 font-medium">
                          Correcta
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {p.explicacion && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      Explicación
                    </p>
                    <p className="text-sm text-slate-600">{p.explicacion}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}