import TemarioInteractivo from './TemarioInteractivo';

export const metadata = {
  title: 'Temario — EGEL ICOMPU',
  description:
    'Temario completo del EGEL Plus ICOMPU con seguimiento de progreso por subárea y tema.',
};

export default function TemarioPage() {
  return (
    <main className="bg-ios-canvas-v2 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#4A8FE7] to-[#5856D6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-5 py-14 md:py-20">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-[0.15em]">
            Temario
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-2 leading-tight">
            EGEL Plus ICOMPU
          </h1>
          <p className="text-white/85 mt-4 max-w-2xl leading-relaxed">
            Estructura oficial del examen con seguimiento de progreso. Marca
            cada tema cuando lo domines; tu avance se guarda automáticamente en
            este navegador.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="glass-hero rounded-2xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                200
              </p>
              <p className="text-xs text-white/75 mt-1 font-medium">
                Reactivos
              </p>
            </div>
            <div className="glass-hero rounded-2xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                12
              </p>
              <p className="text-xs text-white/75 mt-1 font-medium">
                Subáreas
              </p>
            </div>
            <div className="glass-hero rounded-2xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                8h
              </p>
              <p className="text-xs text-white/75 mt-1 font-medium">
                Duración
              </p>
            </div>
            <div className="glass-hero rounded-2xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                5 dic
              </p>
              <p className="text-xs text-white/75 mt-1 font-medium">
                Examen 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <TemarioInteractivo />
      </div>
    </main>
  );
}