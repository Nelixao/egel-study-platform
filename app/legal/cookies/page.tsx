import Link from 'next/link';

export const metadata = {
  title: 'Política de cookies — EGEL ICOMPU',
};

export default function CookiesPage() {
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
            Política de cookies
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

          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos que se almacenan en tu navegador
            cuando visitas un sitio web. Sirven para recordar información sobre
            tu visita.
          </p>

          <h2>2. ¿Qué usamos en este Sitio?</h2>
          <p>
            Este Sitio <strong>NO usa cookies de rastreo ni publicidad</strong>.
            Únicamente utilizamos <strong>almacenamiento local</strong> (similar
            a las cookies pero más seguro) para:
          </p>
          <ul>
            <li>
              Guardar si aceptaste o rechazaste el aviso de cookies.
            </li>
            <li>
              Recordar tus preferencias de interfaz (por ejemplo, modo oscuro en
              el futuro).
            </li>
          </ul>

          <h2>3. Detalle de almacenamiento local</h2>
          <table>
            <thead>
              <tr>
                <th>Clave</th>
                <th>Contenido</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>cookie-consent</code></td>
                <td>Indica si aceptaste el aviso</td>
                <td>Permanente</td>
              </tr>
              <tr>
                <td><code>cookie-consent-date</code></td>
                <td>Fecha de tu elección</td>
                <td>Permanente</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Cookies de terceros</h2>
          <p>
            Si embebemos videos de YouTube, Vimeo u otras plataformas, éstas
            pueden establecer sus propias cookies cuando reproduces el contenido.
            Te recomendamos revisar sus políticas:
          </p>
          <ul>
            <li>Política de cookies de YouTube (Google)</li>
            <li>Política de cookies de Vimeo</li>
          </ul>

          <h2>5. ¿Cómo controlar el almacenamiento local?</h2>
          <p>
            Puedes borrar el almacenamiento local desde la configuración de tu
            navegador en cualquier momento. Al hacerlo, se te preguntará de nuevo
            si aceptas el aviso de cookies la próxima vez que visites el Sitio.
          </p>

          <h2>6. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política cuando cambien nuestras prácticas.
            Los cambios se publican en esta misma página con la fecha de
            actualización.
          </p>
        </div>
      </div>
    </main>
  );
}