import 'dotenv/config';
import { db } from '../src/db';
import { preguntas, subareas, lecciones } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';

async function importar() {
  const rutaArchivo = process.argv[2];
  if (!rutaArchivo) {
    console.error('Uso: npm run importar <archivo.json>');
    process.exit(1);
  }

  const rawData = fs.readFileSync(rutaArchivo, 'utf-8');
  const data = JSON.parse(rawData);

  let importadas = 0;

  // 1. Insertar Lecciones
  if (data.lecciones) {
    for (const lec of data.lecciones) {
      const [sub] = await db.select().from(subareas).where(eq(subareas.slug, lec.subarea_slug)).limit(1);
      if (sub) {
        await db.insert(lecciones).values({
          subareaId: sub.id,
          titulo: lec.titulo,
          contenido: lec.contenido,
          orden: lec.orden || 1,
        });
        console.log(`✅ Lección guardada: ${lec.titulo}`);
      } else {
        console.error(`❌ No existe la subárea con slug: ${lec.subarea_slug}`);
      }
    }
  }

  // 2. Insertar Preguntas
  if (data.preguntas) {
    for (const p of data.preguntas) {
      const [sub] = await db.select().from(subareas).where(eq(subareas.slug, p.subarea_slug)).limit(1);
      if (sub) {
        await db.insert(preguntas).values({
          subareaId: sub.id,
          enunciado: p.enunciado,
          opcionA: p.opcionA,
          opcionB: p.opcionB,
          opcionC: p.opcionC,
          respuestaCorrecta: p.respuestaCorrecta,
          explicacion: p.explicacion,
          dificultad: p.dificultad || 'media',
          esBorrador: false, // Se guardan como aprobadas automáticamente
        });
        importadas++;
      }
    }
    console.log(`✅ ${importadas} preguntas aprobadas e importadas.`);
  }

  console.log('🎉 Proceso terminado.');
  process.exit(0);
}

importar();

