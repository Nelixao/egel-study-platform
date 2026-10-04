import Link from 'next/link';

export const metadata = {
  title: 'Términos y condiciones — EGEL ICOMPU',
};

export default function TerminosPage() {
  return (
    <main className="bg-ios-canvas min-h-screen">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link
          href="/"
          className="text-sm text-[#007AFF] hover:underline mb-6 inline-block"
        >
          ← Volver al inicio
        </Link>

        <header className="mb-10">
          <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-2">
            Legal
          </p>
          <h1 className="text-4xl font-bold text-black tracking-tight">
            Términos y condiciones
          </h1>
          <p className="text-sm text-black/60 mt-3">
            Última actualización: {new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <div className="glass-card-strong rounded-[22px] p-6 md:p-8 prose prose-slate max-w-none
          prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-black
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
          prose-p:leading-relaxed prose-p:text-black/80
          prose-strong:text-black
          prose-ul:text-black/80 prose-li:my-1
          prose-a:text-[#007AFF] prose-a:font-medium">

          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar esta plataforma (en adelante, "el Sitio"),
            aceptas cumplir con estos Términos y Condiciones. Si no estás de
            acuerdo con alguna parte, te pedimos no utilizar el Sitio.
          </p>

          <h2>2. Descripción del servicio</h2>
          <p>
            El Sitio es una plataforma gratuita de estudio que ofrece:
          </p>
          <ul>
            <li>Lecciones educativas sobre temas de ingeniería computacional.</li>
            <li>Un banco de preguntas de práctica.</li>
            <li>Un simulador de exámenes sin valor oficial.</li>
            <li>Recursos de estudio de acceso libre.</li>
          </ul>

          <h2>3. Aviso de no afiliación</h2>
          <p>
            <strong>
              El Sitio NO está afiliado, respaldado ni patrocinado por Ceneval
              (Centro Nacional de Evaluación para la Educación Superior, A.C.)
            </strong>{' '}
            ni por ninguna institución educativa. El nombre "EGEL Plus" y
            "Ceneval" son marcas registradas por sus respectivos propietarios y
            se mencionan únicamente con fines informativos y descriptivos.
          </p>
          <p>
            Los materiales, preguntas y contenidos del Sitio son de elaboración
            propia o de fuentes públicas y <strong>no constituyen material
            oficial</strong> del examen EGEL Plus ICOMPU.
          </p>

          <h2>4. Uso educativo y sin garantías</h2>
          <p>
            El Sitio se ofrece <strong>"tal cual"</strong>, sin garantías de
            ningún tipo, expresas o implícitas. No garantizamos:
          </p>
          <ul>
            <li>Que el contenido esté libre de errores.</li>
            <li>Que el uso del Sitio garantice la aprobación del examen.</li>
            <li>La disponibilidad ininterrumpida del servicio.</li>
            <li>La exactitud total de las preguntas generadas por IA.</li>
          </ul>
          <p>
            Los resultados de cada usuario dependen exclusivamente de su propio
            estudio, preparación y desempeño.
          </p>

          <h2>5. Uso permitido</h2>
          <p>Te comprometes a:</p>
          <ul>
            <li>Usar el Sitio únicamente con fines personales de estudio.</li>
            <li>No intentar vulnerar la seguridad o integridad del Sitio.</li>
            <li>No reproducir contenido con fines comerciales.</li>
            <li>No subir contenido ilegal, ofensivo o que infrinja derechos de terceros.</li>
            <li>No usar herramientas automatizadas para extraer contenido masivamente.</li>
          </ul>

          <h2>6. Contenido subido por el usuario</h2>
          <p>
            Al subir documentos (PDFs, textos), declaras tener los derechos
            necesarios para hacerlo. El contenido permanece siendo tuyo, pero nos
            otorgas una licencia limitada para procesarlo con el único fin de
            generar preguntas de estudio para ti.
          </p>

          <h2>7. Propiedad intelectual</h2>
          <p>
            El código fuente del Sitio está disponible bajo licencia MIT. Los
            textos, lecciones y preguntas originales están protegidos por
            derechos de autor de sus respectivos autores. Las marcas de terceros
            (Ceneval, EGEL, YouTube, Groq) pertenecen a sus titulares.
          </p>

          <h2>8. Limitación de responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley, no nos hacemos
            responsables por:
          </p>
          <ul>
            <li>Daños directos o indirectos derivados del uso del Sitio.</li>
            <li>Pérdida de datos, oportunidades o calificaciones.</li>
            <li>Decisiones académicas o profesionales basadas en el contenido.</li>
            <li>Contenido de sitios externos enlazados.</li>
          </ul>

          <h2>9. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Los cambios entran en vigor al publicarse en esta página.
            Es tu responsabilidad revisarlos periódicamente.
          </p>

          <h2>10. Legislación aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de los Estados Unidos
            Mexicanos. Cualquier controversia se resolverá en los tribunales
            competentes de la Ciudad de México.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para dudas sobre estos términos, puedes abrir un issue en el
            repositorio público del proyecto.
          </p>
        </div>
      </div>
    </main>
  );
}