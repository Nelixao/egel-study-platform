export type Intento = {
  subareaSlug: string;
  correcta: boolean;
  fecha: string;
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

const STORAGE_KEY = 'egel-study-platform:progreso';

function esIntento(valor: unknown): valor is Intento {
  if (!valor || typeof valor !== 'object') return false;

  const intento = valor as Record<string, unknown>;
  return (
    typeof intento.subareaSlug === 'string' &&
    intento.subareaSlug.length > 0 &&
    typeof intento.correcta === 'boolean' &&
    typeof intento.fecha === 'string' &&
    !Number.isNaN(Date.parse(intento.fecha))
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
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
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

  const fechaInicial = new Date(ahora);
  if (!diasConActividad.has(hoy)) {
    fechaInicial.setDate(fechaInicial.getDate() - 1);
  }

  let rachaDias = 0;
  const diaRevisado = new Date(fechaInicial);
  while (diasConActividad.has(obtenerClaveDia(diaRevisado))) {
    rachaDias += 1;
    diaRevisado.setDate(diaRevisado.getDate() - 1);
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
