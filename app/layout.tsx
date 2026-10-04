import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simulador EGEL ICOMPU',
  description:
    'Plataforma de estudio abierta y sin fines de lucro para el EGEL Plus de Ingeniería Computacional. Simuladores, banco de preguntas y biblioteca de recursos.',
  keywords: [
    'EGEL',
    'ICOMPU',
    'Ingeniería Computacional',
    'Ceneval',
    'simulador',
    'examen de titulación',
  ],
  authors: [{ name: 'Proyecto EGEL ICOMPU' }],
  openGraph: {
    title: 'Simulador EGEL ICOMPU',
    description:
      'Estudia para el EGEL Plus ICOMPU con simuladores y banco de preguntas.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-ios-canvas min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}