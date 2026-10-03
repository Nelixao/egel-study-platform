import { db } from './index';
import { secciones, areas, subareas } from './schema';

async function seed() {
  // Secciones
  const [disciplinar, transversal] = await db
    .insert(secciones)
    .values([
      { nombre: 'Disciplinar específica de la profesión', slug: 'disciplinar', totalReactivos: 140 },
      { nombre: 'Transversal de Lenguaje y Comunicación', slug: 'transversal', totalReactivos: 60 },
    ])
    .returning();

  // Áreas
  const [hardware, redes, software, comprension, redaccion] = await db
    .insert(areas)
    .values([
      { seccionId: disciplinar.id, nombre: 'Implementación de hardware', slug: 'hardware', orden: 1, totalReactivos: 49 },
      { seccionId: disciplinar.id, nombre: 'Implementación de redes de computadoras', slug: 'redes', orden: 2, totalReactivos: 41 },
      { seccionId: disciplinar.id, nombre: 'Desarrollo de software', slug: 'software', orden: 3, totalReactivos: 50 },
      { seccionId: transversal.id, nombre: 'Comprensión lectora', slug: 'comprension-lectora', orden: 1, totalReactivos: 30 },
      { seccionId: transversal.id, nombre: 'Redacción indirecta', slug: 'redaccion-indirecta', orden: 2, totalReactivos: 30 },
    ])
    .returning();

  // Subáreas de la Sección Disciplinar
  await db.insert(subareas).values([
    { areaId: hardware.id, nombre: 'Circuitos eléctricos y electrónica', slug: 'circuitos', totalReactivos: 11 },
    { areaId: hardware.id, nombre: 'Arquitectura de computadoras y su organización', slug: 'arquitectura', totalReactivos: 11 },
    { areaId: hardware.id, nombre: 'Sistemas embebidos', slug: 'embebidos', totalReactivos: 13 },
    { areaId: hardware.id, nombre: 'Automatización y control de procesos', slug: 'automatizacion', totalReactivos: 14 },
    { areaId: redes.id, nombre: 'Diseño de redes', slug: 'diseno-redes', totalReactivos: 11 },
    { areaId: redes.id, nombre: 'Administración de redes', slug: 'admin-redes', totalReactivos: 13 },
    { areaId: redes.id, nombre: 'Seguridad y evaluación en redes', slug: 'seguridad-redes', totalReactivos: 17 },
    { areaId: software.id, nombre: 'Ingeniería de software', slug: 'ing-software', totalReactivos: 16 },
    { areaId: software.id, nombre: 'Programación y software base', slug: 'programacion', totalReactivos: 13 },
    { areaId: software.id, nombre: 'Manejo de datos y algoritmos', slug: 'datos-algoritmos', totalReactivos: 21 },
    // Transversales
    { areaId: comprension.id, nombre: 'Ámbito de estudio', slug: 'comp-estudio', totalReactivos: 12 },
    { areaId: comprension.id, nombre: 'Ámbito literario', slug: 'comp-literario', totalReactivos: 12 },
    { areaId: comprension.id, nombre: 'Ámbito de participación social', slug: 'comp-social', totalReactivos: 6 },
    { areaId: redaccion.id, nombre: 'Ámbito de estudio', slug: 'redac-estudio', totalReactivos: 15 },
    { areaId: redaccion.id, nombre: 'Ámbito de participación social', slug: 'redac-social', totalReactivos: 15 },
  ]);

  console.log('✅ Secciones, áreas y subáreas insertadas');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});