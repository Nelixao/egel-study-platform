import Link from 'next/link';
import { db } from '@/db';
import { documentos, areas } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import UploadForm from './UploadForm';

const coloresPortada = [
  ['#0f766e', '#164e63'],
  ['#4338ca', '#312e81'],
  ['#be123c', '#7f1d1d'],
  ['#b45309', '#78350f'],
  ['#7e22ce', '#4c1d95'],
  ['#0369a1', '#1e3a8a'],
  ['#047857', '#14532d'],
  ['#c2410c', '#7c2d12'],
] as const;

function obtenerColoresPortada(titulo: string) {
  let hash = 0;
  for (let indice = 0; indice < titulo.length; indice += 1) {
    hash = (hash * 31 + titulo.charCodeAt(indice)) | 0;
  }
  return coloresPortada[Math.abs(hash) % coloresPortada.length];
}

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
    <main className="min-h-screen bg-ios-canvas">
      <header className="glass-nav">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Tu espacio de lectura
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Biblioteca
            </h1>
            <p className="mt-2 max-w-xl leading-relaxed text-slate-300">
              Reúne tus libros y materiales de estudio en un solo lugar. El texto
              se extrae automáticamente para ayudarte a practicar.
            </p>
          </div>
          <a
            href="#subir-pdf"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 16V4m0 0L7 9m5-5 5 5M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"
              />
            </svg>
            Subir nuevo PDF
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <section id="subir-pdf" className="scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 16V4m0 0L7 9m5-5 5 5M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-white">Añade a tu biblioteca</h2>
              <p className="text-sm text-slate-400">
                Sube un PDF para tenerlo siempre a mano.
              </p>
            </div>
          </div>
          <UploadForm areas={todasAreas} />
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Colección
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
                Tus libros
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
              {todosDocumentos.length}{' '}
              {todosDocumentos.length === 1 ? 'documento' : 'documentos'}
            </span>
          </div>

          {todosDocumentos.length === 0 ? (
            <div className="glass-card rounded-2xl border-dashed p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M7 3.75h6.5L19 9.25v11A1.75 1.75 0 0117.25 22h-10.5A1.75 1.75 0 015 20.25V5.5A1.75 1.75 0 016.75 3.75zM13 4v5.5h5.5"
                  />
                </svg>
              </div>
              <p className="font-medium text-slate-200">
                Tu próxima lectura empieza aquí.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Sube tu primer PDF y aparecerá en esta colección.
              </p>
              <a
                href="#subir-pdf"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Ir a subir PDF
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {todosDocumentos.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/biblioteca/${doc.id}`}
                  className="group glass-card-strong rounded-2xl p-3 transition duration-300 hover:-translate-y-1 hover:border-blue-300/30 hover:shadow-xl hover:shadow-indigo-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:p-4"
                >
                  <div
                    className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-lg transition duration-300 group-hover:shadow-2xl"
                    style={{
                      backgroundImage: `linear-gradient(145deg, ${obtenerColoresPortada(doc.titulo)[0]}, ${obtenerColoresPortada(doc.titulo)[1]})`,
                    }}
                  >
                    <div className="absolute inset-y-0 left-0 w-2 bg-black/20" />
                    <div className="absolute inset-y-0 left-2 w-px bg-white/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(255,255,255,0.28),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-6 text-center">
                      <span className="mb-3 h-0.5 w-8 rounded-full bg-white/65" />
                      <span className="line-clamp-5 font-serif text-base font-semibold leading-snug tracking-wide text-white drop-shadow sm:text-lg">
                        {doc.titulo}
                      </span>
                      <span className="mt-4 h-px w-8 bg-white/40" />
                    </div>
                    <div className="pointer-events-none absolute -inset-8 bg-white/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-50" />
                  </div>

                  <div className="min-w-0 px-1 pb-1">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-slate-100 sm:text-base">
                      {doc.titulo}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {doc.autor || 'Autor desconocido'}
                    </p>
                    <div className="mt-3 flex min-h-6 items-center justify-between gap-2">
                      {doc.areaNombre ? (
                        <span className="max-w-full truncate rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                          {doc.areaNombre}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Sin área
                        </span>
                      )}
                      <svg
                        className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14m-6-6 6 6-6 6"
                        />
                      </svg>
                    </div>
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