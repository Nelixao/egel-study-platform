import Link from 'next/link';
import { db } from '@/db';
import { preguntas, lecciones, documentos } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function AdminDashboardPage() {
  // Contar elementos en cada sección
  const [{ total: totalPreguntas }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(preguntas);

  const [{ total: totalBorradores }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(preguntas)
    .where(eq(preguntas.esBorrador, true));

  const [{ total: totalLecciones }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(lecciones);

  const [{ total: totalDocumentos }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(documentos);

  const secciones = [
    {
      href: '/admin/preguntas',
      titulo: 'Preguntas',
      descripcion: 'Crea y revisa reactivos del banco',
      contador: totalPreguntas,
      etiqueta: 'en el banco',
      color: '#007AFF',
      icono: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/admin/borradores',
      titulo: 'Borradores',
      descripcion: 'Preguntas generadas por IA pendientes',
      contador: totalBorradores,
      etiqueta: totalBorradores === 1 ? 'pendiente' : 'pendientes',
      color: '#FF9500',
      destacado: totalBorradores > 0,
      icono: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      href: '/admin/lecciones',
      titulo: 'Lecciones',
      descripcion: 'Contenido teórico por subárea',
      contador: totalLecciones,
      etiqueta: totalLecciones === 1 ? 'lección' : 'lecciones',
      color: '#5856D6',
      icono: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      href: '/admin/videos',
      titulo: 'Videos',
      descripcion: 'URLs de videos por subárea',
      contador: null,
      etiqueta: 'configurar',
      color: '#FF3B30',
      icono: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const accesosRapidos = [
    {
      href: '/biblioteca',
      titulo: 'Biblioteca',
      descripcion: 'Sube PDFs y genera preguntas',
      contador: totalDocumentos,
      etiqueta: totalDocumentos === 1 ? 'documento' : 'documentos',
      color: '#34C759',
      icono: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      href: '/simulador',
      titulo: 'Simulador',
      descripcion: 'Prueba el examen como lo ve un usuario',
      contador: null,
      etiqueta: 'abrir',
      color: '#5AC8FA',
      icono: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <h1 className="text-2xl font-semibold text-black tracking-tight">
            Panel de administración
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">
            Gestiona el contenido de la plataforma
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Administración */}
        <section>
          <h2 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide mb-3 px-1">
            Administración
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {secciones.map((sec, idx) => (
              <Link
                key={sec.href}
                href={sec.href}
                className="glass-card-strong rounded-[20px] p-5 hover:shadow-lg transition-all tap-scale animate-slide-up block relative overflow-hidden"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {sec.destacado && (
                  <div className="absolute top-3 right-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-pulse block" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${sec.color}15`, color: sec.color }}
                  >
                    {sec.icono}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black">{sec.titulo}</h3>
                    <p className="text-xs text-black/60 mt-0.5 leading-relaxed">
                      {sec.descripcion}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      {sec.contador !== null && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${sec.color}15`,
                            color: sec.color,
                          }}
                        >
                          {sec.contador}
                        </span>
                      )}
                      <span className="text-xs text-black/50">{sec.etiqueta}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Accesos rápidos */}
        <section>
          <h2 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide mb-3 px-1">
            Accesos rápidos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accesosRapidos.map((acc, idx) => (
              <Link
                key={acc.href}
                href={acc.href}
                className="glass-card-strong rounded-[20px] p-5 hover:shadow-lg transition-all tap-scale animate-slide-up block"
                style={{ animationDelay: `${(idx + 4) * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${acc.color}15`, color: acc.color }}
                  >
                    {acc.icono}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black">{acc.titulo}</h3>
                    <p className="text-xs text-black/60 mt-0.5 leading-relaxed">
                      {acc.descripcion}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      {acc.contador !== null && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${acc.color}15`,
                            color: acc.color,
                          }}
                        >
                          {acc.contador}
                        </span>
                      )}
                      <span className="text-xs text-black/50">{acc.etiqueta}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <p className="text-xs text-[#8E8E93] text-center pt-2">
          Panel privado. Solo visible para el administrador.
        </p>
      </div>
    </main>
  );
}