export function guardarPracticaPendiente(
  subareas: number[],
  iniciar = true
): void {
  window.localStorage.setItem(
    'practica-pendiente',
    JSON.stringify({ subareas, iniciar })
  );
}
