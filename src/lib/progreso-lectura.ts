const CLAVE_PROGRESO_LECTURA = 'egel-study-platform:lecciones-leidas';
export const EVENTO_PROGRESO_LECTURA =
  'egel-study-platform:progreso-lectura-actualizado';

function obtenerClave(slug: string) {
  return `${CLAVE_PROGRESO_LECTURA}:${slug}`;
}

export function obtenerLeccionesLeidas(slug: string): number[] {
  const guardado = window.localStorage.getItem(obtenerClave(slug));
  if (!guardado) return [];

  const datos: unknown = JSON.parse(guardado);
  if (
    !Array.isArray(datos) ||
    !datos.every(
      (id): id is number => Number.isSafeInteger(id) && Number(id) > 0
    )
  ) {
    throw new Error('El progreso guardado de lectura no es válido.');
  }

  return datos;
}

export function marcarLeccionLeida(slug: string, leccionId: number) {
  const leidas = obtenerLeccionesLeidas(slug);
  if (!leidas.includes(leccionId)) leidas.push(leccionId);

  window.localStorage.setItem(obtenerClave(slug), JSON.stringify(leidas));
  window.dispatchEvent(new Event(EVENTO_PROGRESO_LECTURA));
}
