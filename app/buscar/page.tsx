import type { Metadata } from 'next';
import BuscadorLecciones from './BuscadorLecciones';

export const metadata: Metadata = {
  title: 'Buscar lecciones | EGEL ICOMPU',
  description: 'Encuentra rápidamente temas, palabras clave y conceptos de estudio.',
};

export default function BuscarPage() {
  return <BuscadorLecciones />;
}
