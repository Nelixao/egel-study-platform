import TemarioInteractivo from './TemarioInteractivo';

export const metadata = {
  title: 'Temario — EGEL ICOMPU',
  description:
    'Temario completo del EGEL Plus ICOMPU con seguimiento de progreso por subárea y tema.',
};

export default function TemarioPage() {
  return (
    <main className="bg-ios-canvas-v2 min-h-screen">
      <section className="border-b border-slate-700/50">
        <div className="mx-auto max-w-4xl px-5 py-9 md:py-12">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-[0.15em]">
            Temario
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight mt-2 leading-tight">
            EGEL Plus ICOMPU
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
            Estructura oficial del examen con seguimiento de progreso. Marca
            cada tema cuando lo domines; tu avance se guarda automáticamente en
            este navegador.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-lg font-semibold text-slate-100 tracking-tight">
                200
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Reactivos
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-100 tracking-tight">
                12
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Subáreas
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-100 tracking-tight">
                8h
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Duración
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-100 tracking-tight">
                5 dic
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
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