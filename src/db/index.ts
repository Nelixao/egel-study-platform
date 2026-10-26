import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('Falta DATABASE_URL en las variables de entorno');
}

const client = postgres(connectionString, {
  prepare: false,
  connect_timeout: 15, // Espera 15 segundos a que Neon despierte
  idle_timeout: 20,    // Cierra conexiones inactivas rápido
  max: 10,             // Máximo de conexiones simultáneas
});

export const db = drizzle(client, { schema });