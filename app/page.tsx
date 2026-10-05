import Link from 'next/link';
import { getEstructuraCompleta } from '@/lib/queries';

export default async function Home() {
  const secciones = await getEstructuraCompleta();

  const totalSubareas = secciones
    .flatMap((s) => s.areas)
    .flatMap((a) => a.subareas).length;

  const totalAreas = secciones.flatMap((s) => s.areas).length;

  return (
    <main className="bg-ios-canvas">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 text-xs font-semibold bg-white/20 text-white px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Basado en la guía oficial de Ceneval 2023
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-3xl">
            Prepárate para el{' '}
            <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              EGEL Plus ICOMPU
            </span>{' '}
            a tu ritmo
          </h1>

          <p className="text-lg md:text-xl text-white/85 mt-6 max-w-2xl leading-relaxed">
            Lecciones, simulacros cronometrados y un banco de preguntas
            organizado por subárea. Todo en un solo lugar, gratis.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/simulador"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/95 text-[#007AFF] font-semibold px-6 py-3.5 rounded-2xl transition-all tap-scale shadow-lg shadow-black/10"
            >
              Iniciar simulador
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/temas"
              className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-2xl transition-colors backdrop-blur-md"
            >
              Explorar temas
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-14 max-w-xl">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">200</p>
              <p className="text-xs text-white/70 mt-1 font-medium">Reactivos</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{totalAreas}</p>
              <p className="text-xs text-white/70 mt-1 font-medium">Áreas</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{totalSubareas}</p>
              <p className="text-xs text-white/70 mt-1 font-medium">Subáreas</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-5 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/simulador"
            className="glass-card-strong rounded-[22px] p-6 hover:shadow-lg transition-all tap-scale group animate-slide-up"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mb-4 group-hover:bg-[#007AFF]/15 transition-colors">
              <svg className="w-5 h-5 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-black mb-1">Simulador</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Exámenes cronometrados con preguntas aleatorias de las subáreas que elijas.
            </p>
          </Link>

          <Link
            href="/banco"
            className="glass-card-strong rounded-[22px] p-6 hover:shadow-lg transition-all tap-scale group animate-slide-up"
            style={{ animationDelay: '60ms' }}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#5856D6]/10 flex items-center justify-center mb-4 group-hover:bg-[#5856D6]/15 transition-colors">
              <svg className="w-5 h-5 text-[#5856D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-black mb-1">Banco de preguntas</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Flashcards interactivas con explicación de cada respuesta, organizadas por subárea.
            </p>
          </Link>

          <Link
            href="/temas"
            className="glass-card-strong rounded-[22px] p-6 hover:shadow-lg transition-all tap-scale group animate-slide-up"
            style={{ animationDelay: '120ms' }}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#34C759]/10 flex items-center justify-center mb-4 group-hover:bg-[#34C759]/15 transition-colors">
              <svg className="w-5 h-5 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-black mb-1">Lecciones</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Contenido teórico por subárea con explicaciones y ejercicios resueltos.
            </p>
          </Link>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-3">
            Cómo funciona
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Tres pasos para empezar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              num: '01',
              titulo: 'Elige tus temas',
              descripcion:
                'Selecciona las subáreas que necesitas reforzar. Puedes empezar por las que más te cuestan.',
              color: '#007AFF',
            },
            {
              num: '02',
              titulo: 'Estudia el contenido',
              descripcion:
                'Lee las lecciones teóricas y mira los videos explicativos de cada tema.',
              color: '#5856D6',
            },
            {
              num: '03',
              titulo: 'Practica y evalúa',
              descripcion:
                'Responde preguntas con explicación inmediata o mide tu nivel con el simulador cronometrado.',
              color: '#34C759',
            },
          ].map((paso, idx) => (
            <div
              key={paso.num}
              className="glass-card-strong rounded-[22px] p-6 relative overflow-hidden animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <span
                className="absolute top-4 right-5 text-4xl font-bold opacity-10"
                style={{ color: paso.color }}
              >
                {paso.num}
              </span>
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-sm font-bold"
                style={{
                  backgroundColor: `${paso.color}15`,
                  color: paso.color,
                }}
              >
                {paso.num}
              </div>
              <h3 className="font-semibold text-black mb-2">{paso.titulo}</h3>
              <p className="text-sm text-black/60 leading-relaxed">
                {paso.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ESTRUCTURA DEL EXAMEN */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-3">
            Estructura
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Contenido del examen
          </h2>
          <p className="text-black/60 mt-3 max-w-2xl mx-auto">
            {secciones.length} secciones, {totalAreas} áreas y {totalSubareas} subáreas oficiales.
          </p>
        </div>

        <div className="space-y-8">
          {secciones.map((seccion) => (
            <div key={seccion.id}>
              <div className="flex items-baseline gap-3 mb-4 px-1">
                <h3 className="text-lg font-bold text-black tracking-tight">
                  {seccion.nombre}
                </h3>
                <span className="text-xs text-black/50 font-medium">
                  {seccion.totalReactivos} reactivos
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seccion.areas.map((area, idx) => (
                  <div
                    key={area.id}
                    className="glass-card-strong rounded-[22px] p-5 hover:shadow-md transition-shadow animate-slide-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <Link
                        href={`/area/${area.slug}`}
                        className="font-semibold text-black leading-tight hover:text-[#007AFF] transition-colors"
                      >
                        {area.nombre}
                      </Link>
                      <span className="text-xs font-semibold bg-black/[0.05] text-black/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {area.totalReactivos}
                      </span>
                    </div>

                    <ul className="space-y-0.5">
                      {area.subareas.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/subarea/${sub.slug}`}
                            className="flex items-center gap-2 text-sm text-black/65 hover:text-[#007AFF] hover:bg-[#007AFF]/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors group"
                          >
                            <span className="w-1 h-1 rounded-full bg-black/20 group-hover:bg-[#007AFF] transition-colors" />
                            <span className="flex-1 truncate">{sub.nombre}</span>
                            <span className="text-xs text-black/40">
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
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden rounded-[28px] p-10 md:p-14 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_60%)]" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              ¿Lista para empezar?
            </h2>
            <p className="text-white/85 max-w-xl mx-auto mb-8 leading-relaxed">
              Configura tu primer simulacro en menos de un minuto. Elige las
              subáreas, el número de preguntas y el tiempo.
            </p>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/95 text-[#007AFF] font-semibold px-8 py-4 rounded-2xl transition-all tap-scale shadow-lg shadow-black/10"
            >
              Iniciar simulador
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}