import { db } from '@/db';
import { subareas, areas, lecciones } from '@/db/schema';
import { asc, eq, desc } from 'drizzle-orm';
import { crearLeccion } from '@/app/actions/lecciones';
import { eliminarLeccion } from '@/app/actions/lecciones';

export default async function AdminLeccionesPage() {
  const todasSubareas = await db
    .select({
      id: subareas.id,
      nombre: subareas.nombre,
      areaNombre: areas.nombre,
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
    .limit(10);

  return (
    <main className="min-h-screen bg-[#F2F2F7]">
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <h1 className="text-2xl font-semibold text-black tracking-tight">
            Lecciones
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">
            Pega el contenido de cada tema
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Formulario */}
        <section className="bg-white rounded-[20px] overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide">
              Nueva lección
            </h2>
          </div>

          <form action={crearLeccion} className="divide-y divide-black/5">
            <div className="px-5 py-4">
              <label className="block text-sm font-medium text-black mb-2">
                Subárea
              </label>
              <select
                name="subareaId"
                required
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
              >
                <option value="">Selecciona una subárea</option>
                {todasSubareas.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.areaNombre} → {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-5 py-4 grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Título de la lección
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

            <div className="px-5 py-4">
              <label className="block text-sm font-medium text-black mb-2">
                Contenido (Markdown)
              </label>
              <textarea
                name="contenido"
                required
                rows={15}
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
                Acepta markdown: # títulos, **negritas**, - listas, etc.
              </p>
            </div>

            <div className="px-5 py-4">
              <button
                type="submit"
                className="w-full bg-[#007AFF] hover:bg-[#0066DD] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all"
              >
                Guardar lección
              </button>
            </div>
          </form>
        </section>

        {/* Últimas lecciones */}
        <section className="bg-white rounded-[20px] overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-black/5">
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide">
              Últimas 10 lecciones
            </h2>
          </div>

          {ultimas.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[#8E8E93]">
                Aún no hay lecciones.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/5">
              {ultimas.map((l) => (
                <li key={l.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {l.titulo}
                    </p>
                    <p className="text-xs text-[#8E8E93] mt-0.5">
                      {l.areaNombre} → {l.subareaNombre}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      'use server';
                      await eliminarLeccion(l.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-[#FF3B30] hover:bg-[#FF3B30]/10 px-2 py-1 rounded-lg"
                    >
                      Borrar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}