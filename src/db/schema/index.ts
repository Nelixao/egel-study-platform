import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  char,
  vector,
  boolean,
} from 'drizzle-orm/pg-core';

export const secciones = pgTable('secciones', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  slug: text('slug').notNull().unique(),
  totalReactivos: integer('total_reactivos').notNull(),
});

export const areas = pgTable('areas', {
  id: serial('id').primaryKey(),
  seccionId: integer('seccion_id').references(() => secciones.id),
  nombre: text('nombre').notNull(),
  slug: text('slug').notNull().unique(),
  descripcion: text('descripcion'),
  orden: integer('orden').notNull(),
  totalReactivos: integer('total_reactivos').notNull(),
});

export const subareas = pgTable('subareas', {
  id: serial('id').primaryKey(),
  areaId: integer('area_id').references(() => areas.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  slug: text('slug').notNull(),
  descripcion: text('descripcion'),
  temas: text('temas'), // temas separados por saltos de línea
  videoUrl: text('video_url'),
  totalReactivos: integer('total_reactivos').notNull(),
});
export const documentos = pgTable('documentos', {
  id: serial('id').primaryKey(),
  titulo: text('titulo').notNull(),
  autor: text('autor'),
  areaId: integer('area_id').references(() => areas.id),
  archivoUrl: text('archivo_url'),
  textoExtraido: text('texto_extraido'),
  creadoEn: timestamp('creado_en').defaultNow(),
});

export const fragmentos = pgTable('fragmentos', {
  id: serial('id').primaryKey(),
  documentoId: integer('documento_id').references(() => documentos.id, {
    onDelete: 'cascade',
  }),
  contenido: text('contenido').notNull(),
  embedding: vector('embedding', { dimensions: 384 }),
});

export const preguntas = pgTable('preguntas', {
  id: serial('id').primaryKey(),
  subareaId: integer('subarea_id').references(() => subareas.id),
  documentoId: integer('documento_id').references(() => documentos.id),
  enunciado: text('enunciado').notNull(),
  opcionA: text('opcion_a').notNull(),
  opcionB: text('opcion_b').notNull(),
  opcionC: text('opcion_c').notNull(),
  respuestaCorrecta: char('respuesta_correcta', { length: 1 }).notNull(),
  explicacion: text('explicacion'),
  dificultad: text('dificultad').default('media'),
  esBorrador: boolean('es_borrador').default(true),
  creadoEn: timestamp('creado_en').defaultNow(),
});
export const lecciones = pgTable('lecciones', {
  id: serial('id').primaryKey(),
  subareaId: integer('subarea_id').references(() => subareas.id, { onDelete: 'cascade' }),
  titulo: text('titulo').notNull(),
  contenido: text('contenido').notNull(),
  orden: integer('orden').notNull().default(0),
  creadoEn: timestamp('creado_en').defaultNow(),
});