import Link from 'next/link';
import { getEstructuraCompleta } from '@/lib/queries';

export default async function Home() {
  const secciones = await getEstructuraCompleta();

  const totalPreguntas = secciones
    .flatMap((s) => s.areas)
    .flatMap((a) => a.subareas)
    .reduce((acc, sub) => acc + sub.totalReactivos, 0);

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <span className="inline-block text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full mb-5 backdrop-blur-sm">
            Basado en la guía oficial de Ceneval 2023
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
            Prepárate para el{' '}
            <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              EGEL Plus ICOMPU
            </span>{' '}
            a tu ritmo
          </h1>
          <p className="text-lg md:text-xl text-blue-50 mt-6 max-w-2xl">
            Simulacros cronometrados, banco de preguntas categorizado por
            subárea y recursos de estudio. Todo en un solo lugar, gratis.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/simulador"
              className="bg-white hover:bg-slate-100 text-blue-700 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
              Iniciar simulador →
            </Link>
            <Link
              href="/admin/preguntas"
              className="border border-white/40 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
            >
              Agregar preguntas
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-14 max-w-2xl">
            <div>
              <p className="text-3xl font-bold text-white">200</p>
              <p className="text-sm text-blue-100 mt-1">Reactivos totales</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-sm text-blue-100 mt-1">Áreas del examen</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">15</p>
              <p className="text-sm text-blue-100 mt-1">Subáreas</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/simulador"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <span className="text-xl">⏱️</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Simulador</h3>
            <p className="text-sm text-slate-600">
              Exámenes cronometrados con preguntas aleatorias de las subáreas
              que elijas.
            </p>
          </Link>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all group">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
              <span className="text-xl">📚</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Banco de preguntas
            </h3>
            <p className="text-sm text-slate-600">
              Preguntas organizadas por área y subárea según la estructura
              oficial del examen.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 opacity-70">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <span className="text-xl">📖</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900">Biblioteca</h3>
              <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Próximamente
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Sube PDFs, videos y recursos. Genera preguntas automáticamente con
              IA.
            </p>
          </div>
        </div>
      </section>

      {/* ESTRUCTURA DEL EXAMEN */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            Estructura del examen
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Las {secciones.length} secciones y 15 subáreas oficiales. Haz clic
            en cualquier subárea para ver sus preguntas.
          </p>
        </div>

        <div className="space-y-14">
          {secciones.map((seccion) => (
            <div key={seccion.id}>
              <div className="flex items-baseline gap-3 mb-6">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {seccion.nombre}
                </h3>
                <span className="text-sm text-slate-500">
                  {seccion.totalReactivos} reactivos
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {seccion.areas.map((area) => (
                  <div
                    key={area.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-slate-900 leading-tight">
                        {area.nombre}
                      </h4>
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {area.totalReactivos}
                      </span>
                    </div>

                    <ul className="space-y-1">
                      {area.subareas.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/subarea/${sub.slug}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors group"
                          >
                            <span className="text-slate-300 group-hover:text-blue-500 transition-colors">
                              •
                            </span>
                            <span className="flex-1">{sub.nombre}</span>
                            <span className="text-xs text-slate-400">
                              {sub.totalReactivos}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Lista para empezar?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Configura tu primer simulacro en menos de un minuto. Elige las
            subáreas, el número de preguntas y el tiempo.
          </p>
          <Link
            href="/simulador"
            className="inline-block bg-white hover:bg-slate-100 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Iniciar simulador
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            Proyecto de estudio basado en la{' '}
            <span className="text-slate-700">
              Guía para el sustentante del EGEL Plus ICOMPU
            </span>{' '}
            (Ceneval, 2023).
          </p>
          <p>Código abierto · Hecho con Next.js y PostgreSQL</p>
        </div>
      </footer>
    </main>
  );
}