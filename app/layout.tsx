import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simulador EGEL ICOMPU',
  description:
    'Plataforma de estudio y simulacros para el EGEL Plus de Ingeniería Computacional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}