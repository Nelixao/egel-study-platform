import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { documentos, subareas, preguntas } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `Eres un experto en ingeniería computacional que diseña reactivos 
para el EGEL Plus ICOMPU de Ceneval, con más de 10 años de experiencia creando 
exámenes de alto nivel.

Tu tarea es generar preguntas de opción múltiple con EXACTAMENTE 3 opciones (A, B, C).

REGLAS CRÍTICAS SOBRE LA RESPUESTA CORRECTA:
- DISTRIBUYE la respuesta correcta entre A, B y C de forma equilibrada.
- Si generas 5 preguntas: aproximadamente 2 con A correcta, 2 con B, 1 con C.
- Si generas 6 preguntas: 2 con A, 2 con B, 2 con C.
- NUNCA pongas más del 40% de las respuestas correctas en la misma letra.
- Antes de responder, cuenta cuántas veces usaste cada letra y ajusta.

REGLAS SOBRE LA CALIDAD DE LAS PREGUNTAS:
- Cada pregunta debe evaluar COMPRENSIÓN, no memorización literal.
- Evita preguntas de definición directa ("¿Qué es X?"). 
- Prefiere preguntas de aplicación, comparación, análisis o diagnóstico.
- Ejemplos del nivel esperado:
  * "Dado un escenario X, ¿cuál estrategia es más adecuada?"
  * "¿Cuál es la diferencia clave entre A y B en términos de Y?"
  * "Si se presenta el problema X, ¿qué mecanismo lo resuelve?"
- Varía la dificultad: algunas fáciles, la mayoría medias, algunas difíciles.

REGLAS SOBRE LOS DISTRACTORES (opciones incorrectas):
- Deben ser PLAUSIBLES, no absurdos.
- Representan errores conceptuales comunes que cometerían estudiantes reales.
- NUNCA uses "todas las anteriores", "ninguna de las anteriores" o similares.
- Deben tener longitud y nivel de detalle similares a la respuesta correcta.

REGLAS SOBRE LAS EXPLICACIONES:
- Deben explicar POR QUÉ la respuesta correcta lo es.
- Deben mencionar por qué las otras opciones son incorrectas (brevemente).
- Mínimo 2 oraciones, máximo 4.

REGLAS SOBRE LA VARIEDAD:
- Cada pregunta debe cubrir un concepto DIFERENTE del texto.
- No repitas el mismo tema con distintas palabras.
- Si el texto cubre 5 conceptos, genera 5 preguntas, una por concepto.

Basá las preguntas ÚNICAMENTE en el texto proporcionado.

FORMATO DE RESPUESTA (JSON estricto):
{
  "preguntas": [
    {
      "enunciado": "texto de la pregunta",
      "opcionA": "opción A",
      "opcionB": "opción B",
      "opcionC": "opción C",
      "respuestaCorrecta": "A",
      "explicacion": "explicación detallada"
    }
  ]
}`;
export async function POST(request: NextRequest) {
  try {
    const { documentoId, cantidad = 5 } = await request.json();

    if (!documentoId) {
      return NextResponse.json(
        { error: 'Falta documentoId' },
        { status: 400 }
      );
    }

    // 1. Obtener el documento
    const [doc] = await db
      .select()
      .from(documentos)
      .where(eq(documentos.id, documentoId))
      .limit(1);

    if (!doc || !doc.textoExtraido) {
      return NextResponse.json(
        { error: 'Documento no encontrado o sin texto extraído' },
        { status: 404 }
      );
    }

    // 2. Tomar un fragmento del texto (primeros 8000 caracteres)
    const fragmento = doc.textoExtraido.slice(0, 8000);

    // 3. Llamar a Groq
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Falta GROQ_API_KEY en variables de entorno' },
        { status: 500 }
      );
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `TEXTO DEL DOCUMENTO:\n${fragmento}\n\nGenera ${cantidad} preguntas de opción múltiple.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error de Groq:', error);
      return NextResponse.json(
        { error: 'Error al generar preguntas con IA' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const textoRespuesta = data.choices?.[0]?.message?.content;

    if (!textoRespuesta) {
      return NextResponse.json(
        { error: 'Respuesta vacía de la IA' },
        { status: 500 }
      );
    }

    // 4. Parsear JSON
    let preguntasGeneradas;
    try {
      preguntasGeneradas = JSON.parse(textoRespuesta);
    } catch {
      const limpio = textoRespuesta
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      preguntasGeneradas = JSON.parse(limpio);
    }

    if (!preguntasGeneradas.preguntas || !Array.isArray(preguntasGeneradas.preguntas)) {
      return NextResponse.json(
        { error: 'Formato de respuesta inválido de la IA' },
        { status: 500 }
      );
    }

    // 5. Guardar como borradores
    const subareaId = doc.areaId
      ? await obtenerSubareaDeArea(doc.areaId)
      : null;

    const insertadas = await db
      .insert(preguntas)
      .values(
        preguntasGeneradas.preguntas.map((p: any) => ({
          subareaId: subareaId,
          documentoId: doc.id,
          enunciado: p.enunciado,
          opcionA: p.opcionA,
          opcionB: p.opcionB,
          opcionC: p.opcionC,
          respuestaCorrecta: p.respuestaCorrecta,
          explicacion: p.explicacion || null,
          dificultad: 'media',
          esBorrador: true,
        }))
      )
      .returning();

    return NextResponse.json({
      success: true,
      preguntas: insertadas,
      total: insertadas.length,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}

async function obtenerSubareaDeArea(areaId: number): Promise<number | null> {
  const [sub] = await db
    .select()
    .from(subareas)
    .where(eq(subareas.areaId, areaId))
    .limit(1);
  return sub?.id || null;
}
