'use server';

import { v2 as cloudinary } from 'cloudinary';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { documentos, preguntas } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export type DocumentoActionState = {
  error?: string;
  success?: boolean;
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function actualizarDocumento(
  formData: FormData
): Promise<DocumentoActionState> {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const titulo = String(formData.get('titulo') ?? '').trim();
  const autor = String(formData.get('autor') ?? '').trim() || null;
  const areaIdValor = String(formData.get('areaId') ?? '');
  const areaId = areaIdValor ? Number(areaIdValor) : null;

  if (!Number.isInteger(id) || id < 1 || !titulo) {
    return { error: 'El título es obligatorio.' };
  }

  if (areaId !== null && (!Number.isInteger(areaId) || areaId < 1)) {
    return { error: 'El área seleccionada no es válida.' };
  }

  const resultado = await db
    .update(documentos)
    .set({ titulo, autor, areaId })
    .where(eq(documentos.id, id))
    .returning({ id: documentos.id });

  if (resultado.length === 0) {
    return { error: 'No se encontró el documento.' };
  }

  revalidatePath('/biblioteca');
  revalidatePath('/biblioteca/' + id);
  revalidatePath('/biblioteca/[id]', 'page');
  return { success: true };
}

function obtenerPublicIdCloudinary(archivoUrl: string): string {
  const url = new URL(archivoUrl);
  const [cloudName, resourceType, deliveryType, ...assetParts] = url.pathname
    .split('/')
    .filter(Boolean);

  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'res.cloudinary.com' ||
    cloudName !== process.env.CLOUDINARY_CLOUD_NAME ||
    resourceType !== 'raw' ||
    deliveryType !== 'upload'
  ) {
    throw new Error('La URL del documento no es un asset raw válido de Cloudinary.');
  }

  if (assetParts[0] && /^v\d+$/.test(assetParts[0])) {
    assetParts.shift();
  }

  const publicId = assetParts.join('/');
  if (!publicId.startsWith('egel-study-platform/')) {
    throw new Error('El documento no pertenece a la carpeta esperada de Cloudinary.');
  }

  return publicId;
}

export async function eliminarDocumento(
  id: number
): Promise<DocumentoActionState> {
  await requireAdmin();

  if (!Number.isInteger(id) || id < 1) {
    return { error: 'El identificador del documento no es válido.' };
  }

  const [documento] = await db
    .select({
      id: documentos.id,
      archivoUrl: documentos.archivoUrl,
    })
    .from(documentos)
    .where(eq(documentos.id, id))
    .limit(1);

  if (!documento) {
    return { error: 'No se encontró el documento.' };
  }

  if (documento.archivoUrl) {
    try {
      const publicId = obtenerPublicIdCloudinary(documento.archivoUrl);
      const resultado = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
        invalidate: true,
      });

      if (resultado.result !== 'ok' && resultado.result !== 'not found') {
        throw new Error(`Cloudinary respondió: ${resultado.result}`);
      }
    } catch (error) {
      console.error('Error eliminando el PDF de Cloudinary:', error);
      return {
        error: 'No se pudo eliminar el PDF de Cloudinary; el documento sigue intacto.',
      };
    }
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(preguntas)
        .set({ documentoId: null })
        .where(eq(preguntas.documentoId, id));

      await tx.delete(documentos).where(eq(documentos.id, id));
    });
  } catch (error) {
    console.error('Error eliminando el registro del documento:', error);
    return {
      error:
        'El PDF ya se eliminó, pero no se pudo eliminar el registro. Vuelve a intentarlo para completar la operación.',
    };
  }

  revalidatePath('/biblioteca');
  revalidatePath('/biblioteca/' + id);
  revalidatePath('/biblioteca/[id]', 'page');
  revalidatePath('/admin/preguntas');
  revalidatePath('/admin/borradores');
  return { success: true };
}
