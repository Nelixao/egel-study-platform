'use client';

import { useActionState } from 'react';
import {
  actualizarPregunta,
  type PreguntaActionState,
} from '@/app/actions/preguntas';

type Subarea = {
  id: number;
  nombre: string;
  areaNombre: string | null;
};

type Pregunta = {
  id: number;
  subareaId: number | null;
  enunciado: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  respuestaCorrecta: string;
  explicacion: string | null;
  dificultad: string | null;
};

const fieldClass =
  'w-full rounded-xl border border-slate-600/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50';

export default function PreguntaForm({
  pregunta,
  subareas,
}: {
  pregunta: Pregunta;
  subareas: Subarea[];
}) {
  const [state, formAction, pending] = useActionState<
    PreguntaActionState,
    FormData
  >(actualizarPregunta, {});

  return (
    <form action={formAction} className="glass-card-strong divide-y divide-white/10 overflow-hidden rounded-[22px]">
      <input type="hidden" name="id" value={pregunta.id} />

      <div className="space-y-2 px-5 py-4">
        <label htmlFor="subareaId" className="block text-sm font-medium text-slate-200">
          Subárea
        </label>
        <select
          id="subareaId"
          name="subareaId"
          required
          defaultValue={pregunta.subareaId ?? ''}
          className={fieldClass}
        >
          <option value="">Selecciona una subárea</option>
          {subareas.map((subarea) => (
            <option key={subarea.id} value={subarea.id}>
              {subarea.areaNombre ? `${subarea.areaNombre} → ` : ''}
              {subarea.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 px-5 py-4">
        <label htmlFor="enunciado" className="block text-sm font-medium text-slate-200">
          Enunciado
        </label>
        <textarea
          id="enunciado"
          name="enunciado"
          required
          rows={4}
          defaultValue={pregunta.enunciado}
          className={fieldClass}
        />
      </div>

      <div className="space-y-3 px-5 py-4">
        <p className="text-sm font-medium text-slate-200">Opciones de respuesta</p>
        {[
          { name: 'opcionA', label: 'A', value: pregunta.opcionA },
          { name: 'opcionB', label: 'B', value: pregunta.opcionB },
          { name: 'opcionC', label: 'C', value: pregunta.opcionC },
        ].map((opcion) => (
          <div key={opcion.name} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-semibold text-blue-300">
              {opcion.label}
            </span>
            <input
              type="text"
              name={opcion.name}
              required
              defaultValue={opcion.value}
              className={fieldClass}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="respuestaCorrecta" className="block text-sm font-medium text-slate-200">
            Respuesta correcta
          </label>
          <select
            id="respuestaCorrecta"
            name="respuestaCorrecta"
            required
            defaultValue={pregunta.respuestaCorrecta}
            className={fieldClass}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="dificultad" className="block text-sm font-medium text-slate-200">
            Dificultad
          </label>
          <select
            id="dificultad"
            name="dificultad"
            required
            defaultValue={pregunta.dificultad || 'media'}
            className={fieldClass}
          >
            <option value="facil">Fácil</option>
            <option value="media">Media</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 px-5 py-4">
        <label htmlFor="explicacion" className="block text-sm font-medium text-slate-200">
          Explicación
        </label>
        <textarea
          id="explicacion"
          name="explicacion"
          rows={4}
          defaultValue={pregunta.explicacion ?? ''}
          className={fieldClass}
        />
      </div>

      <div className="space-y-3 px-5 py-4">
        {state.error && (
          <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            Cambios guardados correctamente.
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
