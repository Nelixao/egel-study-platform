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
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Administrar preguntas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Agrega nuevas preguntas al banco
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Formulario */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Nueva pregunta
          </h2>

          <form action={crearPregunta} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subárea
              </label>
              <select
                name="subareaId"
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una subárea</option>
                {todasSubareas.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.areaNombre} → {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Enunciado
              </label>
              <textarea
                name="enunciado"
                required
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe la pregunta aquí..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Opción A
                </label>
                <input
                  type="text"
                  name="opcionA"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Opción B
                </label>
                <input
                  type="text"
                  name="opcionB"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Opción C
                </label>
                <input
                  type="text"
                  name="opcionC"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Respuesta correcta
                </label>
                <select
                  name="respuestaCorrecta"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dificultad
                </label>
                <select
                  name="dificultad"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="facil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Explicación (opcional)
              </label>
              <textarea
                name="explicacion"
                rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Por qué esa es la respuesta correcta?"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Guardar pregunta
            </button>
          </form>
        </section>

        {/* Últimas preguntas */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Últimas 10 preguntas agregadas
          </h2>

          {ultimasPreguntas.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aún no hay preguntas en el banco.
            </p>
          ) : (
            <div className="space-y-3">
              {ultimasPreguntas.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg border border-slate-200 p-4"
                >
                  <p className="text-sm text-slate-800 font-medium">
                    {p.enunciado}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-500">
                    <span>Correcta: {p.respuestaCorrecta}</span>
                    <span>Dificultad: {p.dificultad}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}