import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { documentos, areas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import GenerarPreguntas from './GenerarPreguntas';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DocumentoPage({ params }: Props) {
  const { id } = await params;
  const [doc] = await db
    .select({
      id: documentos.id,
      titulo: documentos.titulo,
      autor: documentos.autor,
      archivoUrl: documentos.archivoUrl,
      textoExtraido: documentos.textoExtraido,
      areaNombre: areas.nombre,
    })
    .from(documentos)
    .leftJoin(areas, eq(documentos.areaId, areas.id))
    .where(eq(documentos.id, Number(id)))
    .limit(1);

  if (!doc) notFound();

  const textoLimpio = (doc.textoExtraido || '').trim();
  const preview = textoLimpio.slice(0, 3000);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/biblioteca"
            className="text-sm text-blue-600 hover:underline mb-3 inline-block"
          >
            ← Volver a la biblioteca
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{doc.titulo}</h1>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
            {doc.autor && <span>{doc.autor}</span>}
            {doc.areaNombre && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                {doc.areaNombre}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex gap-3">
          {doc.archivoUrl && (
            <a
              href={doc.archivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
            >
              Ver PDF original
            </a>
          )}
          <Link
            href={`/biblioteca/${doc.id}/editar`}
            className="bg-black/[0.05] hover:bg-black/[0.08] text-black/70 font-medium px-5 py-2.5 rounded-lg text-sm"
          >
            Editar información
          </Link>
        </div>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">
              Texto extraído
            </h2>
            <span className="text-xs text-slate-500">
              {textoLimpio.length.toLocaleString()} caracteres
            </span>
          </div>

          {doc.textoExtraido ? (
            <>
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed max-h-96 overflow-y-auto bg-slate-50 rounded-lg p-4 border border-slate-100">{`${preview}${textoLimpio.length > 3000 ? '\n\n...' : ''}`}</pre>
              <p className="text-xs text-slate-400 mt-3">
                Mostrando los primeros 3000 caracteres del texto extraído.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No se pudo extraer texto de este PDF. Puede ser un documento
              escaneado o con imágenes.
            </p>
          )}
        </section>

        <GenerarPreguntas documentoId={doc.id} />
      </div>
    </main>
  );
}