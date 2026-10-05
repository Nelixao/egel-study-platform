import Link from 'next/link';

export default function Footer() {
  const año = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-white/60 backdrop-blur-xl mt-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Bloque principal */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Marca - ocupa 5 columnas */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm tracking-tight">E</span>
              </div>
              <div>
                <p className="font-semibold text-black tracking-tight leading-none">
                  EGEL ICOMPU
                </p>
                <p className="text-[11px] text-black/45 tracking-wide mt-0.5">
                  Plataforma de estudio
                </p>
              </div>
            </div>

            <p className="text-sm text-black/60 leading-relaxed max-w-sm">
              Herramienta de preparación para el examen de titulación en
              Ingeniería Computacional. Proyecto independiente, abierto y sin
              fines de lucro.
            </p>

            <div className="flex items-center gap-2 mt-6">
              <a
                href="https://github.com/Nelixao/egel-study-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 text-black/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navegación - 7 columnas divididas en 3 */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.12em] mb-4">
              Producto
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/simulador"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Simulador
                </Link>
              </li>
              <li>
                <Link
                  href="/temas"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Temas
                </Link>
              </li>
              <li>
                <Link
                  href="/banco"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Banco de preguntas
                </Link>
              </li>
              <li>
                <Link
                  href="/biblioteca"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Biblioteca
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.12em] mb-4">
              Recursos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.ceneval.edu.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Ceneval oficial
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Nelixao/egel-study-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Código fuente
                </a>
              </li>
              <li>
                <Link
                  href="/legal/terminos"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.12em] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/legal/privacidad"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-sm text-black/65 hover:text-black transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Avisos legales */}
        <div className="border-t border-black/[0.06] py-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-2 border-[#FF9500]/60 pl-4">
              <p className="text-[11px] font-semibold text-[#FF9500] uppercase tracking-[0.1em] mb-1.5">
                No afiliación
              </p>
              <p className="text-xs text-black/60 leading-relaxed">
                Este sitio es un proyecto independiente con fines
                exclusivamente educativos. No está afiliado, respaldado ni
                patrocinado por Ceneval, la Secretaría de Educación Pública,
                ni ninguna institución educativa. El nombre "EGEL" y "Ceneval"
                son marcas registradas de sus respectivos propietarios y se
                mencionan únicamente con fines descriptivos.
              </p>
            </div>

            <div className="border-l-2 border-black/20 pl-4">
              <p className="text-[11px] font-semibold text-black/50 uppercase tracking-[0.1em] mb-1.5">
                Sobre los resultados
              </p>
              <p className="text-xs text-black/60 leading-relaxed">
                El uso de esta plataforma no garantiza la aprobación del
                examen EGEL Plus ICOMPU. Los resultados dependen exclusivamente
                del estudio, preparación y desempeño de cada usuario. Esta
                herramienta es un apoyo complementario, no un sustituto de la
                formación académica formal.
              </p>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-black/[0.06] py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-black/45">
            {año} EGEL ICOMPU. Todos los derechos reservados.
          </p>
          <p className="text-xs text-black/45">
            Construido con Next.js, PostgreSQL y Groq.
          </p>
        </div>
      </div>
    </footer>
  );
}