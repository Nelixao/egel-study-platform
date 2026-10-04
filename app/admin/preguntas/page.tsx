import { db } from '@/db';
import { subareas, areas, preguntas } from '@/db/schema';
import { asc, eq, desc } from 'drizzle-orm';
import { crearPregunta } from '@/app/actions/preguntas';

export default async function AdminPreguntasPage() {
  const todasSubareas = await db
    .select({
      id: subareas.id,
      nombre: subareas.nombre,
      areaNombre: areas.nombre,
    })
    .from(subareas)
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .orderBy(asc(areas.orden), asc(subareas.id));

  const ultimasPreguntas = await db
    .select()
    .from(preguntas)
    .orderBy(desc(preguntas.id))
    .limit(10);

  return (
    <main className="min-h-screen bg-[#F2F2F7]">
      {/* Header estilo iOS */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <h1 className="text-2xl font-semibold text-black tracking-tight">
            Preguntas
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">
            Crea y revisa reactivos del banco
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Formulario agrupado estilo iOS Settings */}
        <section className="bg-white rounded-[20px] overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide">
              Nueva pregunta
            </h2>
          </div>

          <form action={crearPregunta} className="divide-y divide-black/5">
            {/* Subárea */}
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

            {/* Enunciado */}
            <div className="px-5 py-4">
              <label className="block text-sm font-medium text-black mb-2">
                Enunciado
              </label>
              <textarea
                name="enunciado"
                required
                rows={3}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 resize-none"
                placeholder="Escribe la pregunta aquí..."
              />
            </div>

            {/* Opciones */}
            <div className="px-5 py-4 space-y-3">
              <label className="block text-sm font-medium text-black">
                Opciones de respuesta
              </label>
              {[
                { name: 'opcionA', label: 'A' },
                { name: 'opcionB', label: 'B' },
                { name: 'opcionC', label: 'C' },
              ].map((op) => (
                <div key={op.name} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#007AFF] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {op.label}
                  </span>
                  <input
                    type="text"
                    name={op.name}
                    required
                    className="flex-1 bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
                    placeholder={`Texto de la opción ${op.label}`}
                  />
                </div>
              ))}
            </div>

            {/* Respuesta correcta y dificultad */}
            <div className="px-5 py-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Correcta
                </label>
                <select
                  name="respuestaCorrecta"
                  required
                  className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Dificultad
                </label>
                <select
                  name="dificultad"
                  className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
                >
                  <option value="facil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Explicación */}
            <div className="px-5 py-4">
              <label className="block text-sm font-medium text-black mb-2">
                Explicación
              </label>
              <textarea
                name="explicacion"
                rows={2}
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-sm text-black placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 resize-none"
                placeholder="¿Por qué esa es la respuesta correcta?"
              />
            </div>

            {/* Botón */}
            <div className="px-5 py-4">
              <button
                type="submit"
                className="w-full bg-[#007AFF] hover:bg-[#0066DD] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all"
              >
                Guardar pregunta
              </button>
            </div>
          </form>
        </section>

        {/* Lista de últimas preguntas estilo iOS */}
        <section className="bg-white rounded-[20px] overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-black/5">
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide">
              Últimas 10 agregadas
            </h2>
          </div>

          {ultimasPreguntas.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[#8E8E93]">
                Aún no hay preguntas en el banco.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/5">
              {ultimasPreguntas.map((p) => {
                const colores: Record<string, string> = {
                  facil: 'bg-[#34C759]',
                  media: 'bg-[#FF9500]',
                  dificil: 'bg-[#FF3B30]',
                };
                const color = colores[p.dificultad || 'media'] || 'bg-[#8E8E93]';

                return (
                  <li key={p.id} className="px-5 py-4 hover:bg-black/[0.02] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${color} mt-2 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black leading-snug">
                          {p.enunciado}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-[#8E8E93]">
                            Correcta: <span className="font-semibold text-black">{p.respuestaCorrecta}</span>
                          </span>
                          <span className="text-xs text-[#8E8E93] capitalize">
                            {p.dificultad}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Info footer estilo iOS */}
        <p className="text-xs text-[#8E8E93] text-center px-5 pb-4">
          Los cambios se aplican automáticamente
        </p>
      </div>
    </main>
  );
}