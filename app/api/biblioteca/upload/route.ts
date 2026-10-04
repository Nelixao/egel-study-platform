import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/db';
import { documentos } from '@/db/schema';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const titulo = formData.get('titulo') as string;
    const autor = formData.get('autor') as string | null;
    const areaId = formData.get('areaId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 });
    }
    if (!titulo) {
      return NextResponse.json({ error: 'Falta el título' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Solo se permiten PDFs' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Máximo 50 MB' }, { status: 400 });
    }

    // Guardar el archivo en public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const nombreSeguro = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const rutaFisica = path.join(uploadsDir, nombreSeguro);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(rutaFisica, buffer);

    // Extraer texto
    let textoExtraido = '';
    try {
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const resultado = await pdfParse(buffer);
      textoExtraido = resultado.text || '';
    } catch (err) {
      console.error('Error extrayendo texto:', err);
      textoExtraido = '';
    }

    // Guardar en la base de datos
    const [doc] = await db
      .insert(documentos)
      .values({
        titulo,
        autor: autor || null,
        areaId: areaId ? Number(areaId) : null,
        archivoUrl: `/uploads/${nombreSeguro}`,
        textoExtraido,
      })
      .returning();

    return NextResponse.json({ documento: doc });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error procesando el archivo' },
      { status: 500 }
    );
  }
}
