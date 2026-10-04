import Link from 'next/link';

export const metadata = {
  title: 'Aviso de privacidad — EGEL ICOMPU',
};

export default function PrivacidadPage() {
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
            Aviso de privacidad
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

          <h2>1. Responsable del tratamiento</h2>
          <p>
            Este Sitio es un proyecto personal sin fines de lucro operado por un
            desarrollador independiente. No constituye una empresa ni una
            persona moral. Para cualquier consulta relacionada con datos
            personales, puedes contactar a través del repositorio público del
            proyecto.
          </p>

          <h2>2. Datos que recopilamos</h2>
          <p>
            El Sitio ha sido diseñado bajo el principio de{' '}
            <strong>minimización de datos</strong>. Actualmente:
          </p>
          <ul>
            <li>
              <strong>No requerimos registro</strong> con correo electrónico ni
              datos personales para usar el simulador, la biblioteca o las
              lecciones.
            </li>
            <li>
              <strong>No usamos cookies de rastreo publicitario</strong> ni
              servicios de analítica de terceros como Google Analytics.
            </li>
            <li>
              Podemos usar <strong>almacenamiento local del navegador</strong>{' '}
              para guardar preferencias (por ejemplo, si aceptaste el aviso de
              cookies).
            </li>
          </ul>

          <h2>3. Contenido que subes</h2>
          <p>
            Cuando subes un PDF o texto para generar preguntas:
          </p>
          <ul>
            <li>El archivo se almacena en el servidor del proyecto.</li>
            <li>
              El texto extraído se envía a un proveedor de IA (Groq) con el
              único fin de generar las preguntas solicitadas.
            </li>
            <li>
              Las preguntas generadas quedan guardadas en el banco interno del
              Sitio para uso del administrador.
            </li>
            <li>
              <strong>No compartimos tu contenido</strong> con terceros más allá
              del procesamiento por IA.
            </li>
          </ul>

          <h2>4. Finalidad del tratamiento</h2>
          <p>Los datos se utilizan exclusivamente para:</p>
          <ul>
            <li>Proveer las funcionalidades del Sitio.</li>
            <li>Mejorar el banco de preguntas de estudio.</li>
            <li>Cumplir con obligaciones legales aplicables.</li>
          </ul>

          <h2>5. Transferencia de datos</h2>
          <p>
            No vendemos, alquilamos ni transferimos datos personales a terceros.
            El único servicio externo que procesa contenido es{' '}
            <strong>Groq</strong> para la generación de preguntas con IA. Te
            recomendamos revisar su política de privacidad.
          </p>

          <h2>6. Derechos ARCO</h2>
          <p>
            De acuerdo con la Ley Federal de Protección de Datos Personales en
            Posesión de los Particulares (LFPDPPP), tienes derecho a:
          </p>
          <ul>
            <li><strong>Acceder</strong> a los datos que tengamos sobre ti.</li>
            <li><strong>Rectificar</strong> datos inexactos.</li>
            <li><strong>Cancelar</strong> tus datos cuando ya no sean necesarios.</li>
            <li><strong>Oponerte</strong> al tratamiento para fines específicos.</li>
          </ul>
          <p>
            Para ejercer estos derechos, contacta a través del repositorio del
            proyecto.
          </p>

          <h2>7. Seguridad</h2>
          <p>
            Implementamos medidas técnicas razonables para proteger la
            información, incluyendo conexiones HTTPS y contraseñas hasheadas
            cuando aplique. Sin embargo, ningún sistema es 100% seguro, por lo
            que no podemos garantizar la seguridad absoluta.
          </p>

          <h2>8. Menores de edad</h2>
          <p>
            El Sitio está dirigido a estudiantes universitarios. No recopilamos
            intencionalmente datos de menores de edad. Si eres menor, te pedimos
            usar el Sitio bajo supervisión de un adulto.
          </p>

          <h2>9. Cambios al aviso</h2>
          <p>
            Podemos actualizar este aviso en cualquier momento. Los cambios se
            publican en esta misma página con la fecha de actualización.
          </p>
        </div>
      </div>
    </main>
  );
}