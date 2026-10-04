import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/db';
import { documentos } from '@/db/schema';

export const runtime = 'nodejs';
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Subir a Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'egel-study-platform',
          public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const archivoUrl = uploadResult.secure_url;

    // 2. Extraer texto
    let textoExtraido = '';
    try {
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const resultado = await pdfParse(buffer);
      textoExtraido = resultado.text || '';
    } catch (err) {
      console.error('Error extrayendo texto:', err);
      textoExtraido = '';
    }

    // 3. Guardar en base de datos
    const [doc] = await db
      .insert(documentos)
      .values({
        titulo,
        autor: autor || null,
        areaId: areaId ? Number(areaId) : null,
        archivoUrl,
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