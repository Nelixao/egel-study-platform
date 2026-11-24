export type Secuencia = {
  titulo: string;
  elementos: string[];
};

export const secuenciasPorSubarea: Record<string, Secuencia> = {
  circuitos: {
    titulo: 'Resuelve con la Ley de Ohm',
    elementos: [
      'Identificar voltaje, corriente y resistencia conocidos',
      'Elegir la forma de la Ley de Ohm que despeja la incógnita',
      'Sustituir los valores con sus unidades',
      'Calcular el resultado',
      'Comprobar que la unidad y el valor tengan sentido',
    ],
  },
  arquitectura: {
    titulo: 'Ciclo de instrucción',
    elementos: ['Búsqueda (fetch)', 'Decodificación', 'Ejecución', 'Acceso a memoria', 'Escritura del resultado'],
  },
  embebidos: {
    titulo: 'Arranque de un sistema embebido',
    elementos: [
      'Se ejecuta el reinicio del microcontrolador',
      'Se inicializan reloj y memoria',
      'Se configuran periféricos y pines',
      'Se habilitan las interrupciones necesarias',
      'Comienza el ciclo principal del programa',
    ],
  },
  automatizacion: {
    titulo: 'Ciclo de control en lazo cerrado',
    elementos: [
      'Definir el valor deseado (consigna)',
      'Medir la variable del proceso',
      'Calcular el error entre consigna y medición',
      'El controlador calcula la acción correctiva',
      'El actuador modifica el proceso',
      'Volver a medir la variable',
    ],
  },
  'diseno-redes': {
    titulo: 'Diseño de una red',
    elementos: [
      'Levantar requisitos y necesidades',
      'Definir topología y plan de direccionamiento',
      'Seleccionar medios y dispositivos',
      'Implementar la configuración',
      'Probar conectividad y documentar',
    ],
  },
  'admin-redes': {
    titulo: 'Diagnóstico de una falla de red',
    elementos: [
      'Definir el síntoma y su alcance',
      'Reunir datos y revisar cambios recientes',
      'Aislar la capa o el componente involucrado',
      'Probar una hipótesis de causa',
      'Aplicar la corrección y verificar el servicio',
      'Documentar el resultado',
    ],
  },
  'seguridad-redes': {
    titulo: 'Respuesta a un incidente',
    elementos: [
      'Prepararse y definir responsabilidades',
      'Detectar y analizar el incidente',
      'Contener el impacto',
      'Erradicar la causa',
      'Recuperar los servicios',
      'Registrar lecciones aprendidas',
    ],
  },
  'ing-software': {
    titulo: 'Ciclo de vida del software',
    elementos: [
      'Analizar requisitos',
      'Diseñar la solución',
      'Implementar el software',
      'Probar y validar',
      'Desplegar',
      'Mantener y evolucionar',
    ],
  },
  programacion: {
    titulo: 'De código fuente a ejecutable',
    elementos: [
      'Analizar los caracteres y formar tokens',
      'Comprobar la estructura sintáctica',
      'Validar significados y tipos',
      'Generar y optimizar código intermedio',
      'Generar código máquina y enlazar',
    ],
  },
  'datos-algoritmos': {
    titulo: 'Orden lógico de una consulta SQL',
    elementos: [
      'FROM y JOIN: elegir las fuentes de datos',
      'WHERE: filtrar filas',
      'GROUP BY: formar grupos',
      'HAVING: filtrar grupos',
      'SELECT: proyectar columnas',
      'ORDER BY: ordenar el resultado',
    ],
  },
  'comp-estudio': {
    titulo: 'Comprensión de un texto académico',
    elementos: [
      'Reconocer el tema y el propósito',
      'Localizar la tesis o idea central',
      'Relacionar argumentos con evidencias',
      'Inferir información implícita',
      'Sintetizar la conclusión',
    ],
  },
  'comp-literario': {
    titulo: 'Lectura de un relato',
    elementos: [
      'Ubicar narrador, personajes y contexto',
      'Identificar el conflicto',
      'Seguir las acciones principales',
      'Reconocer el clímax',
      'Interpretar el desenlace y sus efectos',
    ],
  },
  'comp-social': {
    titulo: 'Evaluación de una nota informativa',
    elementos: [
      'Identificar el hecho principal',
      'Distinguir datos y fuentes',
      'Reconocer propósito y audiencia',
      'Valorar la relevancia y confiabilidad',
      'Formular una conclusión sustentada',
    ],
  },
  'redac-estudio': {
    titulo: 'Redacción de un texto académico',
    elementos: [
      'Definir propósito y pregunta de trabajo',
      'Investigar y seleccionar fuentes confiables',
      'Organizar ideas y argumentos',
      'Redactar y citar las fuentes',
      'Revisar coherencia, precisión y formato',
    ],
  },
  'redac-social': {
    titulo: 'Redacción para participación social',
    elementos: [
      'Definir objetivo y público destinatario',
      'Reunir la información necesaria',
      'Elegir el formato y tono adecuados',
      'Redactar el mensaje con claridad',
      'Revisar datos, ortografía y presentación',
    ],
  },
};