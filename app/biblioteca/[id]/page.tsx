import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { documentos, areas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import GenerarPreguntas from './GenerarPreguntas';
import EliminarDocumentoButton from '../EliminarDocumentoButton';

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
    <main className="min-h-screen bg-ios-canvas">
      <header className="glass-nav">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/biblioteca"
            className="mb-3 inline-block text-sm text-blue-300 hover:text-blue-200"
          >
            ← Volver a la biblioteca
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">{doc.titulo}</h1>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
            {doc.autor && <span>{doc.autor}</span>}
            {doc.areaNombre && (
              <span className="bg-white/5 px-2 py-0.5 rounded-full text-xs text-slate-300">
                {doc.areaNombre}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-wrap gap-3">
          {doc.archivoUrl && (
            <a
              href={doc.archivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:brightness-110"
            >
              Ver PDF original
            </a>
          )}
          <Link
            href={`/biblioteca/${doc.id}/editar`}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Editar información
          </Link>
          <EliminarDocumentoButton id={doc.id} />
        </div>

        <section className="glass-card-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">
              Texto extraído
            </h2>
            <span className="text-xs text-slate-400">
              {textoLimpio.length.toLocaleString()} caracteres
            </span>
          </div>

          {doc.textoExtraido ? (
            <>
              <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/70 p-4 font-sans text-sm leading-relaxed text-slate-300">{`${preview}${textoLimpio.length > 3000 ? '\n\n...' : ''}`}</pre>
              <p className="text-xs text-slate-400 mt-3">
                Mostrando los primeros 3000 caracteres del texto extraído.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-300">
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