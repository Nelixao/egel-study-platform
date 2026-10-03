import { db } from './index';
import { subareas, preguntas } from './schema';
import { eq } from 'drizzle-orm';

async function seedPreguntas() {
  // Buscamos la subárea de ejemplo
  const [algoritmos] = await db
    .select()
    .from(subareas)
    .where(eq(subareas.slug, 'datos-algoritmos'))
    .limit(1);

  if (!algoritmos) {
    console.error('❌ No existe la subárea datos-algoritmos');
    process.exit(1);
  }

  await db.insert(preguntas).values([
    {
      subareaId: algoritmos.id,
      enunciado:
        '¿Cuál es la complejidad temporal promedio del algoritmo Quicksort?',
      opcionA: 'O(n)',
      opcionB: 'O(n log n)',
      opcionC: 'O(n²)',
      respuestaCorrecta: 'B',
      explicacion:
        'Quicksort tiene complejidad promedio O(n log n), aunque su peor caso es O(n²) cuando el pivote es siempre el menor o mayor elemento.',
      dificultad: 'media',
      esBorrador: false,
    },
    {
      subareaId: algoritmos.id,
      enunciado:
        '¿Qué estructura de datos utiliza el algoritmo BFS (búsqueda en anchura)?',
      opcionA: 'Pila (Stack)',
      opcionB: 'Cola (Queue)',
      opcionC: 'Árbol binario',
      respuestaCorrecta: 'B',
      explicacion:
        'BFS usa una cola para explorar los nodos nivel por nivel. DFS usa una pila.',
      dificultad: 'facil',
      esBorrador: false,
    },
    {
      subareaId: algoritmos.id,
      enunciado:
        'En una base de datos relacional, ¿qué garantiza la propiedad de "atomicidad" en las transacciones ACID?',
      opcionA: 'Que la transacción se ejecuta completa o no se ejecuta',
      opcionB: 'Que los datos no se corrompen entre transacciones',
      opcionC: 'Que las transacciones concurrentes no interfieren',
      respuestaCorrecta: 'A',
      explicacion:
        'Atomicidad significa "todo o nada": la transacción se aplica completa o se revierte por completo.',
      dificultad: 'media',
      esBorrador: false,
    },
  ]);

  console.log('✅ Preguntas de prueba insertadas');
  process.exit(0);
}

seedPreguntas().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});