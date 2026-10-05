import Link from 'next/link';
import { getEstructuraCompleta } from '@/lib/queries';

export const metadata = {
  title: 'Temas — EGEL ICOMPU',
};

export default async function TemasPage() {
  const secciones = await getEstructuraCompleta();

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-2">
            Todas las áreas
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Temas del examen
          </h1>
          <p className="text-sm text-black/60 mt-2">
            Estructura completa del EGEL Plus ICOMPU
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">
        {secciones.map((seccion) => (
          <section key={seccion.id}>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-xl font-bold text-black tracking-tight">
                {seccion.nombre}
              </h2>
              <span className="text-xs text-black/50">
                {seccion.totalReactivos} reactivos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {seccion.areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/area/${area.slug}`}
                  className="glass-card-strong rounded-[20px] p-5 hover:shadow-lg transition-all tap-scale block"
                >
                  <h3 className="font-semibold text-black">{area.nombre}</h3>
                  <p className="text-xs text-black/50 mt-1">
                    {area.subareas.length} subáreas
                  </p>
                  <ul className="mt-3 space-y-1">
                    {area.subareas.slice(0, 3).map((sub) => (
                      <li
                        key={sub.id}
                        className="text-xs text-black/60 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#007AFF]" />
                        {sub.nombre}
                      </li>
                    ))}
                    {area.subareas.length > 3 && (
                      <li className="text-xs text-[#007AFF] font-medium">
                        +{area.subareas.length - 3} más
                      </li>
                    )}
                  </ul>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}