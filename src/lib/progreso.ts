export type Intento = {
  subareaSlug: string;
  correcta: boolean;
  fecha: string;
  preguntaId?: number;
};

export type PrecisionSubarea = {
  subareaSlug: string;
  total: number;
  correctas: number;
  precision: number;
};

export type EstadisticasProgreso = {
  rachaDias: number;
  preguntasHoy: number;
  precisionPorSubarea: PrecisionSubarea[];
};

export type Logro = {
  id: 'primera-pregunta' | 'racha-3-dias' | '50-preguntas' | 'precision-70';
  nombre: string;
  descripcion: string;
  icono: string;
  logrado: boolean;
};

const STORAGE_KEY = 'egel-study-platform:progreso';
const ZONA_HORARIA = 'America/Mexico_City';
const FORMATEADOR_DIA = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_HORARIA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function esIntento(valor: unknown): valor is Intento {
  if (!valor || typeof valor !== 'object') return false;

  const intento = valor as Record<string, unknown>;
  return (
    typeof intento.subareaSlug === 'string' &&
    intento.subareaSlug.length > 0 &&
    typeof intento.correcta === 'boolean' &&
    typeof intento.fecha === 'string' &&
    !Number.isNaN(Date.parse(intento.fecha)) &&
    (intento.preguntaId === undefined ||
      (typeof intento.preguntaId === 'number' &&
        Number.isSafeInteger(intento.preguntaId) &&
        intento.preguntaId > 0))
  );
}

export function obtenerIntentos(): Intento[] {
  if (typeof window === 'undefined') return [];

  try {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (!guardado) return [];

    const datos: unknown = JSON.parse(guardado);
    return Array.isArray(datos) ? datos.filter(esIntento) : [];
  } catch {
    return [];
  }
}

export function obtenerIdsErroresPendientes(intentos: Intento[]): number[] {
  const ultimoIntentoPorPregunta = new Map<number, Intento>();

  for (const intento of intentos.filter(esIntento)) {
    if (intento.preguntaId === undefined) continue;

    const anterior = ultimoIntentoPorPregunta.get(intento.preguntaId);
    if (!anterior || Date.parse(intento.fecha) >= Date.parse(anterior.fecha)) {
      ultimoIntentoPorPregunta.set(intento.preguntaId, intento);
    }
  }

  return Array.from(ultimoIntentoPorPregunta)
    .filter(([, intento]) => !intento.correcta)
    .map(([preguntaId]) => preguntaId);
}

export function guardarIntento(intento: Intento): void {
  if (typeof window === 'undefined' || !esIntento(intento)) return;

  try {
    const intentos = obtenerIntentos();
    intentos.push(intento);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intentos));
  } catch {
    // El progreso sigue siendo opcional si el navegador bloquea el almacenamiento.
  }
}

function obtenerClaveDia(fecha: Date): string {
  const partes = FORMATEADOR_DIA.formatToParts(fecha);
  const anio = partes.find((parte) => parte.type === 'year')?.value;
  const mes = partes.find((parte) => parte.type === 'month')?.value;
  const dia = partes.find((parte) => parte.type === 'day')?.value;
  return `${anio}-${mes}-${dia}`;
}

function desplazarDia(claveDia: string, cantidad: number): string {
  const [anio, mes, dia] = claveDia.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia + cantidad));
  return [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, '0'),
    String(fecha.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function tieneRachaDeTresDias(diasConActividad: Set<string>): boolean {
  const diasOrdenados = Array.from(diasConActividad).sort();
  let rachaActual = 0;
  let diaAnterior: string | undefined;

  for (const dia of diasOrdenados) {
    rachaActual =
      diaAnterior && desplazarDia(diaAnterior, 1) === dia
        ? rachaActual + 1
        : 1;

    if (rachaActual >= 3) return true;
    diaAnterior = dia;
  }

  return false;
}

export function calcularEstadisticas(
  intentos: Intento[],
  ahora: Date = new Date()
): EstadisticasProgreso {
  const hoy = obtenerClaveDia(ahora);
  const intentosValidos = intentos.filter(esIntento);
  const diasConActividad = new Set(
    intentosValidos.map((intento) =>
      obtenerClaveDia(new Date(intento.fecha))
    )
  );

  let diaRevisado = diasConActividad.has(hoy) ? hoy : desplazarDia(hoy, -1);
  let rachaDias = 0;
  while (diasConActividad.has(diaRevisado)) {
    rachaDias += 1;
    diaRevisado = desplazarDia(diaRevisado, -1);
  }

  const intentosPorSubarea = new Map<string, { total: number; correctas: number }>();
  for (const intento of intentosValidos) {
    const resultado = intentosPorSubarea.get(intento.subareaSlug) ?? {
      total: 0,
      correctas: 0,
    };
    resultado.total += 1;
    if (intento.correcta) resultado.correctas += 1;
    intentosPorSubarea.set(intento.subareaSlug, resultado);
  }

  const precisionPorSubarea = Array.from(
    intentosPorSubarea,
    ([subareaSlug, resultado]) => ({
      subareaSlug,
      ...resultado,
      precision: Math.round((resultado.correctas / resultado.total) * 100),
    })
  ).sort((a, b) => a.subareaSlug.localeCompare(b.subareaSlug));

  return {
    rachaDias,
    preguntasHoy: intentosValidos.filter(
      (intento) => obtenerClaveDia(new Date(intento.fecha)) === hoy
    ).length,
    precisionPorSubarea,
  };
}

export function calcularLogros(intentos: Intento[]): Logro[] {
  const intentosValidos = intentos.filter(esIntento);
  const estadisticas = calcularEstadisticas(intentosValidos);
  const diasConActividad = new Set(
    intentosValidos.map((intento) =>
      obtenerClaveDia(new Date(intento.fecha))
    )
  );

  return [
    {
      id: 'primera-pregunta',
      nombre: 'Primer paso',
      descripcion: 'Respondiste tu primera pregunta',
      icono: '🌱',
      logrado: intentosValidos.length >= 1,
    },
    {
      id: 'racha-3-dias',
      nombre: 'Constancia',
      descripcion: 'Practicaste 3 días consecutivos',
      icono: '🔥',
      logrado: tieneRachaDeTresDias(diasConActividad),
    },
    {
      id: '50-preguntas',
      nombre: 'En marcha',
      descripcion: 'Respondiste 50 preguntas',
      icono: '📚',
      logrado: intentosValidos.length >= 50,
    },
    {
      id: 'precision-70',
      nombre: 'Buen dominio',
      descripcion: 'Lograste 70% de precisión en una subárea (mínimo 10 intentos)',
      icono: '🏆',
      logrado: estadisticas.precisionPorSubarea.some(
        (subarea) =>
          subarea.total >= 10 && subarea.correctas / subarea.total >= 0.7
      ),
    },
  ];
}
