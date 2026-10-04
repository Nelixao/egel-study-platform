import Link from 'next/link';

export default function Footer() {
  const año = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-white/50 backdrop-blur-md mt-16">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-black tracking-tight">
                EGEL ICOMPU
              </span>
            </div>
            <p className="text-xs text-black/60 leading-relaxed">
              Plataforma de estudio abierta y sin fines de lucro para
              preparación del examen EGEL Plus ICOMPU.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/terminos"
                  className="text-sm text-black/70 hover:text-[#007AFF]"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacidad"
                  className="text-sm text-black/70 hover:text-[#007AFF]"
                >
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-sm text-black/70 hover:text-[#007AFF]"
                >
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3">
              Recursos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-black/70 hover:text-[#007AFF]"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/simulador"
                  className="text-sm text-black/70 hover:text-[#007AFF]"
                >
                  Simulador
                </Link>
              </li>
              <li>
                <Link
                  href="/biblioteca"
                  className="text-sm text-black/70 hover:text-[#007AFF]"
                >
                  Biblioteca
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Aviso legal importante */}
        <div className="border-t border-black/5 pt-6 space-y-4">
          <div className="bg-[#FF9500]/5 border border-[#FF9500]/20 rounded-xl p-4">
            <p className="text-xs text-black/70 leading-relaxed">
              <strong className="text-[#FF9500]">⚠️ Aviso importante:</strong>{' '}
              Este sitio es un proyecto independiente con fines exclusivamente
              educativos. <strong>No está afiliado, respaldado ni patrocinado
              por Ceneval</strong>, la Secretaría de Educación Pública, ni
              ninguna institución educativa. Las preguntas, contenidos y
              materiales aquí presentados son de elaboración propia y no
              constituyen material oficial del examen EGEL Plus ICOMPU. El
              nombre "EGEL" y "Ceneval" son marcas registradas de sus
              respectivos propietarios y se mencionan únicamente con fines
              descriptivos.
            </p>
          </div>

          <div className="bg-[#8E8E93]/5 border border-[#8E8E93]/20 rounded-xl p-4">
            <p className="text-xs text-black/70 leading-relaxed">
              <strong className="text-black/60">
                ℹ️ Sobre los resultados:
              </strong>{' '}
              El uso de esta plataforma no garantiza la aprobación del examen
              EGEL Plus ICOMPU, ni implica ningún compromiso por parte de
              Ceneval o cualquier institución. Los resultados de cada usuario
              dependen de su propio estudio, preparación y desempeño. Esta
              herramienta es un apoyo complementario, no un sustituto de la
              formación académica formal.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-black/40">
            <p>
              © {año} EGEL ICOMPU. Código liberado bajo licencia MIT.
            </p>
            <p>
              Hecho con Next.js, PostgreSQL y Groq.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}