import Link from 'next/link';
import { db } from '@/db';
import { documentos, areas } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import UploadForm from './UploadForm';

export default async function BibliotecaPage() {
  const todosDocumentos = await db
    .select({
      id: documentos.id,
      titulo: documentos.titulo,
      autor: documentos.autor,
      archivoUrl: documentos.archivoUrl,
      creadoEn: documentos.creadoEn,
      areaNombre: areas.nombre,
    })
    .from(documentos)
    .leftJoin(areas, eq(documentos.areaId, areas.id))
    .orderBy(desc(documentos.creadoEn));

  const todasAreas = await db.select().from(areas);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Biblioteca</h1>
          <p className="text-slate-600 mt-2">
            Sube libros y materiales de estudio. El texto se extrae
            automáticamente para generar preguntas más adelante.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <UploadForm areas={todasAreas} />

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Documentos subidos ({todosDocumentos.length})
          </h2>

          {todosDocumentos.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <p className="text-slate-500">
                Aún no has subido documentos.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Empieza subiendo la bibliografía sugerida por Ceneval.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todosDocumentos.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/biblioteca/${doc.id}`}
                  className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📄</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {doc.titulo}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                        {doc.autor && <span>{doc.autor}</span>}
                        {doc.areaNombre && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                            {doc.areaNombre}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-slate-300">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}