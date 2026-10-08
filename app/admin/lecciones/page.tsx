import Link from 'next/link';
import { db } from '@/db';
import { subareas, areas, lecciones } from '@/db/schema';
import { asc, eq, desc } from 'drizzle-orm';
import { crearLeccion, eliminarLeccion } from '@/app/actions/lecciones';

export const metadata = {
  title: 'Lecciones — Admin',
};

export default async function AdminLeccionesPage() {
  const todasSubareas = await db
    .select({
      id: subareas.id,
      nombre: subareas.nombre,
      areaNombre: areas.nombre,
      areaOrden: areas.orden,
    })
    .from(subareas)
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .orderBy(asc(areas.orden), asc(subareas.id));

  const ultimas = await db
    .select({
      id: lecciones.id,
      titulo: lecciones.titulo,
      orden: lecciones.orden,
      subareaNombre: subareas.nombre,
      areaNombre: areas.nombre,
    })
    .from(lecciones)
    .leftJoin(subareas, eq(lecciones.subareaId, subareas.id))
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .orderBy(desc(lecciones.id))
    .limit(15);

  // Agrupar subáreas por área para el select
  const subareasPorArea = todasSubareas.reduce<
    Record<string, typeof todasSubareas>
  >((acc, s) => {
    const key = s.areaNombre || 'Sin área';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-black tracking-tight">
                Lecciones
              </h1>
              <p className="text-sm text-[#8E8E93] mt-0.5">
                {ultimas.length} {ultimas.length === 1 ? 'lección reciente' : 'lecciones recientes'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#5856D6]/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#5856D6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Formulario de nueva lección */}
        <section className="glass-card-strong rounded-[22px] overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-black/[0.06] flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#007AFF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-black/70 uppercase tracking-wide">
              Nueva lección
            </h2>
          </div>

          <form action={crearLeccion} className="divide-y divide-black/[0.05]">
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-black mb-2">
                Subárea
              </label>
              <select
                name="subareaId"
                required
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
              >
                <option value="">Selecciona una subárea</option>
                {Object.entries(subareasPorArea).map(([areaNombre, subs]) => (
                  <optgroup key={areaNombre} label={areaNombre}>
                    {subs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  required
                  className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
                  placeholder="Ej. Introducción a circuitos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Orden
                </label>
                <input
                  type="number"
                  name="orden"
                  defaultValue={1}
                  className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
                />
              </div>
            </div>

            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-black mb-2">
                Contenido (Markdown)
              </label>
              <textarea
                name="contenido"
                required
                rows={14}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black font-mono focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 resize-y"
                placeholder={`# Título del tema

Explicación del concepto...

## Subtema

- Punto 1
- Punto 2

**Concepto clave:** definición

> Nota importante`}
              />
              <p className="text-xs text-[#8E8E93] mt-2">
                Acepta markdown: # títulos, **negritas**, - listas, tablas,
                bloques de código.
              </p>
            </div>

            <div className="px-6 py-4">
              <button
                type="submit"
                className="w-full bg-[#007AFF] hover:bg-[#0066DD] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all tap-scale"
              >
                Guardar lección
              </button>
            </div>
          </form>
        </section>

        {/* Lista de lecciones recientes */}
        <section className="glass-card-strong rounded-[22px] overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#8E8E93]/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#8E8E93]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                Lecciones recientes
              </h2>
            </div>
            <span className="text-xs text-[#8E8E93] font-medium">
              {ultimas.length}
            </span>
          </div>

          {ultimas.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#8E8E93]">
                Aún no hay lecciones creadas.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.05]">
              {ultimas.map((l) => (
                <li
                  key={l.id}
                  className="px-6 py-4 hover:bg-black/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">
                        {l.titulo}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {l.areaNombre && (
                          <span className="text-xs text-[#8E8E93] truncate">
                            {l.areaNombre}
                          </span>
                        )}
                        {l.subareaNombre && (
                          <>
                            <span className="text-[#8E8E93] text-xs">·</span>
                            <span className="text-xs text-[#8E8E93] truncate">
                              {l.subareaNombre}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link
                        href={`/admin/lecciones/${l.id}/editar`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#007AFF] hover:bg-[#007AFF]/10 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </Link>

                      <form
                        action={async () => {
                          'use server';
                          await eliminarLeccion(l.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#FF3B30] hover:bg-[#FF3B30]/10 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Borrar
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}