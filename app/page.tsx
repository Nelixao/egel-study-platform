import { getEstructuraCompleta } from '@/lib/queries';

export default async function Home() {
  const secciones = await getEstructuraCompleta();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Simulador EGEL Plus ICOMPU
          </h1>
          <p className="text-slate-600 mt-2">
            Preparación para el examen de titulación en Ingeniería Computacional
          </p>
          <p className="text-sm text-slate-500 mt-1">
            200 reactivos · 8 horas · 2 sesiones
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {secciones.map((seccion) => (
          <section key={seccion.id}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {seccion.nombre}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {seccion.totalReactivos} reactivos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seccion.areas.map((area) => (
                <div
                  key={area.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 leading-tight">
                      {area.nombre}
                    </h3>
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {area.totalReactivos} reactivos
                    </span>
                  </div>

                  <ul className="space-y-1.5 mt-4">
                    {area.subareas.map((sub) => (
                      <li
                        key={sub.id}
                        className="text-sm text-slate-600 flex items-start gap-2"
                      >
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span className="flex-1">{sub.nombre}</span>
                        <span className="text-slate-400 text-xs whitespace-nowrap">
                          {sub.totalReactivos}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-slate-500">
          Basado en la Guía para el sustentante del EGEL Plus ICOMPU (Ceneval, 2023)
        </div>
      </footer>
    </main>
  );
}