'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type FasePomodoro = 'estudio' | 'descanso';

const DURACION_ESTUDIO = 25 * 60 * 1000;
const DURACION_DESCANSO = 5 * 60 * 1000;

function duracionDe(fase: FasePomodoro): number {
  return fase === 'estudio' ? DURACION_ESTUDIO : DURACION_DESCANSO;
}

function formatoTiempo(milisegundos: number): string {
  const segundos = Math.ceil(milisegundos / 1000);
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
}

export default function Pomodoro({ compacto = false }: { compacto?: boolean }) {
  const [fase, setFase] = useState<FasePomodoro>('estudio');
  const [restante, setRestante] = useState(DURACION_ESTUDIO);
  const [activo, setActivo] = useState(false);
  const [aviso, setAviso] = useState('');
  const finFaseRef = useRef<number | null>(null);
  const faseRef = useRef<FasePomodoro>('estudio');
  const restanteRef = useRef(DURACION_ESTUDIO);

  const actualizarCronometro = useCallback(() => {
    const finFase = finFaseRef.current;
    if (finFase === null) return;

    const ahora = Date.now();
    let siguienteFase = faseRef.current;
    let siguienteFin = finFase;
    let ciclosTerminados = 0;

    while (ahora >= siguienteFin) {
      siguienteFase = siguienteFase === 'estudio' ? 'descanso' : 'estudio';
      siguienteFin += duracionDe(siguienteFase);
      ciclosTerminados += 1;
    }

    if (ciclosTerminados > 0) {
      faseRef.current = siguienteFase;
      finFaseRef.current = siguienteFin;
      setFase(siguienteFase);
      setAviso(
        siguienteFase === 'descanso'
          ? 'Terminó el bloque de estudio. ¡Hora de descansar 5 minutos!'
          : 'Terminó el descanso. ¡Comienza un nuevo bloque de estudio!'
      );
    }

    const nuevoRestante = Math.max(0, siguienteFin - ahora);
    restanteRef.current = nuevoRestante;
    setRestante(nuevoRestante);
  }, []);

  useEffect(() => {
    if (!activo) return;

    const intervalo = window.setInterval(actualizarCronometro, 250);
    const actualizarAlVolver = () => actualizarCronometro();
    document.addEventListener('visibilitychange', actualizarAlVolver);

    return () => {
      window.clearInterval(intervalo);
      document.removeEventListener('visibilitychange', actualizarAlVolver);
    };
  }, [activo, actualizarCronometro]);

  function iniciarOPausar() {
    if (activo) {
      const finFase = finFaseRef.current;
      if (finFase !== null && finFase <= Date.now()) {
        actualizarCronometro();
        finFaseRef.current = null;
        setActivo(false);
        return;
      }
      const nuevoRestante =
        finFase === null ? restanteRef.current : Math.max(0, finFase - Date.now());
      restanteRef.current = nuevoRestante;
      setRestante(nuevoRestante);
      finFaseRef.current = null;
      setActivo(false);
      return;
    }

    if (restanteRef.current <= 0) {
      const nuevaFase: FasePomodoro =
        faseRef.current === 'estudio' ? 'descanso' : 'estudio';
      faseRef.current = nuevaFase;
      restanteRef.current = duracionDe(nuevaFase);
      setFase(nuevaFase);
      setRestante(restanteRef.current);
    }

    finFaseRef.current = Date.now() + restanteRef.current;
    setAviso('');
    setActivo(true);
  }

  function reiniciar() {
    finFaseRef.current = null;
    faseRef.current = 'estudio';
    restanteRef.current = DURACION_ESTUDIO;
    setFase('estudio');
    setRestante(DURACION_ESTUDIO);
    setActivo(false);
    setAviso('');
  }

  const progreso = (restante / duracionDe(fase)) * 100;

  if (compacto) {
    return (
      <section
        className={`w-full rounded-2xl border p-3 transition-colors duration-300 sm:w-64 ${
          aviso
            ? 'border-emerald-400/40 bg-emerald-500/10'
            : 'border-white/10 bg-slate-900/90'
        }`}
        aria-label="Temporizador Pomodoro"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-300">
              {fase === 'estudio' ? 'Estudio · 25 min' : 'Descanso · 5 min'}
            </p>
            <p
              className="font-mono text-2xl font-bold leading-tight text-white"
              role="timer"
              aria-label={`${formatoTiempo(restante)} restantes`}
            >
              {formatoTiempo(restante)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={iniciarOPausar}
              className="min-h-11 rounded-xl bg-indigo-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
              aria-label={activo ? 'Pausar Pomodoro' : 'Iniciar Pomodoro'}
            >
              {activo ? 'Pausar' : 'Iniciar'}
            </button>
            <button
              type="button"
              onClick={reiniciar}
              className="min-h-11 min-w-11 rounded-xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10"
              aria-label="Reiniciar Pomodoro"
              title="Reiniciar Pomodoro"
            >
              ↻
            </button>
          </div>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Tiempo restante del ciclo Pomodoro"
          aria-valuenow={Math.round(progreso)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-[width,color] duration-300 ${
              aviso
                ? 'bg-emerald-300'
                : fase === 'estudio'
                  ? 'bg-indigo-400'
                  : 'bg-emerald-400'
            }`}
            style={{ width: `${progreso}%` }}
          />
        </div>
        {aviso && (
          <p
            className="mt-2 text-xs font-medium text-emerald-200"
            role="status"
            aria-live="polite"
          >
            {aviso}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="glass-card-strong rounded-[22px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black">Pomodoro</h2>
          <p className="text-sm text-black/55 mt-1">
            25 minutos de estudio y 5 minutos de descanso.
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            fase === 'estudio'
              ? 'bg-[#007AFF]/10 text-[#007AFF]'
              : 'bg-[#34C759]/10 text-[#248A3D]'
          }`}
        >
          {fase === 'estudio' ? 'Tiempo de estudio' : 'Tiempo de descanso'}
        </span>
      </div>

      <p
        className="text-6xl sm:text-7xl font-bold font-mono text-black text-center tracking-tight py-7"
        role="timer"
        aria-label={`${formatoTiempo(restante)} restantes`}
      >
        {formatoTiempo(restante)}
      </p>

      <div
        className="h-2 bg-black/[0.06] rounded-full overflow-hidden mb-6"
        role="progressbar"
        aria-label="Tiempo restante del ciclo"
        aria-valuenow={Math.round(progreso)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-200 ${
            fase === 'estudio' ? 'bg-[#007AFF]' : 'bg-[#34C759]'
          }`}
          style={{ width: `${progreso}%` }}
        />
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={iniciarOPausar}
          className="min-w-32 bg-[#007AFF] hover:bg-[#0066DD] text-white font-semibold px-6 py-3 rounded-xl tap-scale transition-colors"
        >
          {activo ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          type="button"
          onClick={reiniciar}
          className="bg-black/[0.05] hover:bg-black/[0.08] text-black/75 font-semibold px-6 py-3 rounded-xl tap-scale transition-colors"
        >
          Reiniciar
        </button>
      </div>

      {aviso && (
        <p
          className="mt-5 rounded-xl border border-[#34C759]/25 bg-[#34C759]/10 px-4 py-3 text-center text-sm font-medium text-[#248A3D]"
          role="status"
          aria-live="polite"
        >
          {aviso}
        </p>
      )}
    </section>
  );
}
