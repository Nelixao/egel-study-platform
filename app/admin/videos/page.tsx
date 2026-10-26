import Link from 'next/link';
import { db } from '@/db';
import { subareas, areas } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { actualizarVideoSubarea } from '@/app/actions/subareas';
import EliminarVideoButton from './EliminarVideoButton';

export const dynamic = 'force-dynamic';

export default async function AdminVideosPage() {
  const todasSubareas = await db
    .select({
      id: subareas.id,
      nombre: subareas.nombre,
      slug: subareas.slug,
      videoUrl: subareas.videoUrl,
      areaNombre: areas.nombre,
      areaSlug: areas.slug,
    })
    .from(subareas)
    .leftJoin(areas, eq(subareas.areaId, areas.id))
    .orderBy(asc(areas.orden), asc(subareas.id));

  return (
    <main className="bg-ios-canvas min-h-screen">
      <header className="glass-nav sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Videos por subárea
          </h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">
            Pega la URL de YouTube o Vimeo para cada tema
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-4">
        <div className="glass-card rounded-[18px] p-4 text-sm text-black/70">
          <strong className="text-black">Acepta:</strong> youtube.com/watch?v=...,
          youtu.be/..., vimeo.com/..., o cualquier URL con iframe compatible.
        </div>

        {todasSubareas.map((sub) => (
          <section
            key={sub.id}
            className="glass-card-strong rounded-[20px] p-5 animate-slide-up"
          >
            <div className="mb-3">
              <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide">
                {sub.areaNombre}
              </p>
              <h2 className="font-semibold text-black mt-0.5">
                {sub.nombre}
              </h2>
            </div>

            <form
              action={async (formData) => {
                'use server';
                await actualizarVideoSubarea(formData);
              }}
              className="divide-y divide-white/10"
            >
              <input type="hidden" name="subareaId" value={sub.id} />
              <div className="flex gap-2">
                <input
                  type="url"
                  name="videoUrl"
                  defaultValue={sub.videoUrl || ''}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 rounded-xl border border-slate-600/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:brightness-110 tap-scale"
                >
                  {sub.videoUrl ? 'Actualizar' : 'Guardar'}
                </button>
              </div>

              {sub.videoUrl && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                  <span className="text-[#34C759] font-medium">
                    Video configurado
                  </span>
                  <Link
                    href={`/subarea/${sub.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#007AFF] hover:underline ml-auto"
                  >
                    Ver en la subárea →
                  </Link>
                </div>
              )}
            </form>

            {sub.videoUrl && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <EliminarVideoButton subareaId={sub.id} />
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}